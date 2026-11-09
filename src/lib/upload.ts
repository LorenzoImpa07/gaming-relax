/**
 * Upload senza Firebase Storage (piano free):
 * comprime in browser e restituisce data URL da salvare su Firestore.
 * Target ~350KB stringa per restare sotto il limite 1MB del documento Firestore.
 */

export type UploadProgress = {
  percent: number;
  state: "running" | "success" | "error";
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          "Impossibile leggere l'immagine. Usa JPG, PNG o WebP (non HEIC/HEIF da iPhone: convertilo in JPG prima)."
        )
      );
    };
    img.src = url;
  });
}

async function compressToDataUrl(file: File): Promise<string> {
  const img = await loadImage(file);
  let side = 640;
  let quality = 0.62;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Il browser non supporta la compressione immagini");

  const MAX_DATA_URL = 350_000;

  for (let attempt = 0; attempt < 10; attempt++) {
    const scale = Math.min(1, side / Math.max(img.width, img.height));
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrl.length <= MAX_DATA_URL) return dataUrl;
    side = Math.max(160, Math.round(side * 0.7));
    quality = Math.max(0.35, quality - 0.07);
  }
  throw new Error(
    "Foto troppo pesante anche dopo compressione. Usa un'immagine più piccola (sotto 2MB) o riduci la risoluzione."
  );
}

export function uploadImage(
  file: File,
  _folder: string,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  return (async () => {
    const type = (file.type || "").toLowerCase();
    const name = (file.name || "").toLowerCase();

    if (
      type.includes("heic") ||
      type.includes("heif") ||
      name.endsWith(".heic") ||
      name.endsWith(".heif")
    ) {
      throw new Error(
        "Formato HEIC/HEIF non supportato. Su iPhone: Impostazioni → Fotocamera → Formati → «Più compatibile», oppure esporta in JPG."
      );
    }

    if (!type.startsWith("image/") && !/\.(jpe?g|png|webp|gif)$/i.test(name)) {
      throw new Error("Seleziona un file immagine (JPG, PNG o WebP)");
    }

    if (file.size > 12 * 1024 * 1024) {
      throw new Error("File troppo grande (max 12MB). Comprimi o riduci la foto prima.");
    }

    onProgress?.({ percent: 10, state: "running" });
    await new Promise((r) => setTimeout(r, 20));
    onProgress?.({ percent: 40, state: "running" });

    const dataUrl = await compressToDataUrl(file);

    onProgress?.({ percent: 90, state: "running" });
    await new Promise((r) => setTimeout(r, 30));
    onProgress?.({ percent: 100, state: "success" });
    return dataUrl;
  })();
}

/** True se la stringa è un URL immagine visualizzabile (http, relative o data URL) */
export function isDisplayableImage(src?: string | null): boolean {
  if (!src || typeof src !== "string") return false;
  const s = src.trim();
  return (
    s.startsWith("http://") ||
    s.startsWith("https://") ||
    s.startsWith("/") ||
    s.startsWith("data:image/")
  );
}
