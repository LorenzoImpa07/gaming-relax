/**
 * Upload immagini SENZA Firebase Storage (piano Spark / free).
 * Comprime lato client e restituisce un data URL (base64) da salvare su Firestore.
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
      reject(new Error("Impossibile leggere l'immagine"));
    };
    img.src = url;
  });
}

async function compressToDataUrl(
  file: File,
  maxSide: number,
  quality: number
): Promise<string> {
  const img = await loadImage(file);
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non supportato dal browser");
  ctx.drawImage(img, 0, 0, w, h);

  let dataUrl = canvas.toDataURL("image/jpeg", quality);

  let q = quality;
  let side = maxSide;
  let guard = 0;
  while (dataUrl.length > 700_000 && guard < 6) {
    guard++;
    q = Math.max(0.45, q - 0.1);
    side = Math.max(320, Math.round(side * 0.75));
    const s = Math.min(1, side / Math.max(img.width, img.height));
    canvas.width = Math.max(1, Math.round(img.width * s));
    canvas.height = Math.max(1, Math.round(img.height * s));
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    dataUrl = canvas.toDataURL("image/jpeg", q);
  }

  if (dataUrl.length > 900_000) {
    throw new Error(
      "Immagine troppo pesante anche dopo la compressione. Prova una foto piu piccola."
    );
  }
  return dataUrl;
}

export function uploadImage(
  file: File,
  _folder: string,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file.type.startsWith("image/")) {
        reject(new Error("Seleziona un file immagine (JPG, PNG, WebP)"));
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        reject(
          new Error("File troppo grande (max 12MB). Scegli una foto piu leggera.")
        );
        return;
      }

      onProgress?.({ percent: 15, state: "running" });
      await new Promise((r) => setTimeout(r, 50));
      onProgress?.({ percent: 40, state: "running" });

      const dataUrl = await compressToDataUrl(file, 900, 0.72);

      onProgress?.({ percent: 90, state: "running" });
      await new Promise((r) => setTimeout(r, 80));
      onProgress?.({ percent: 100, state: "success" });
      resolve(dataUrl);
    } catch (e) {
      onProgress?.({ percent: 0, state: "error" });
      reject(e instanceof Error ? e : new Error("Errore compressione immagine"));
    }
  });
}
