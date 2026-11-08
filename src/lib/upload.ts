/**
 * Upload senza Firebase Storage (piano free):
 * comprime in browser e restituisce data URL da salvare su Firestore.
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
      reject(new Error("Impossibile leggere l'immagine. Prova un altro file JPG/PNG."));
    };
    img.src = url;
  });
}

async function compressToDataUrl(file: File): Promise<string> {
  const img = await loadImage(file);
  let side = 800;
  let quality = 0.7;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Il browser non supporta la compressione immagini");

  for (let attempt = 0; attempt < 8; attempt++) {
    const scale = Math.min(1, side / Math.max(img.width, img.height));
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrl.length <= 600_000) return dataUrl;
    side = Math.max(240, Math.round(side * 0.72));
    quality = Math.max(0.4, quality - 0.08);
  }
  throw new Error("Foto troppo pesante. Usa un'immagine piu piccola (sotto 3MB).");
}

export function uploadImage(
  file: File,
  _folder: string,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  return (async () => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Seleziona un file immagine (JPG, PNG o WebP)");
    }
    if (file.size > 15 * 1024 * 1024) {
      throw new Error("File troppo grande (max 15MB)");
    }
    onProgress?.({ percent: 10, state: "running" });
    await new Promise((r) => setTimeout(r, 30));
    onProgress?.({ percent: 35, state: "running" });
    const dataUrl = await compressToDataUrl(file);
    onProgress?.({ percent: 85, state: "running" });
    await new Promise((r) => setTimeout(r, 40));
    onProgress?.({ percent: 100, state: "success" });
    return dataUrl;
  })();
}
