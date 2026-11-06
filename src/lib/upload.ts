import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export type UploadProgress = {
  percent: number;
  state: "running" | "success" | "error";
};

async function compressImage(file: File, maxSize = 1200, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Seleziona un file immagine (JPG, PNG, WebP, GIF)");
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("L'immagine e troppo grande (max 12MB)");
  }

  if (file.type === "image/gif" || file.size < 200_000) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
  );
  if (!blob) return file;
  return blob;
}

function friendlyStorageError(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";
  const msg = err instanceof Error ? err.message : String(err);

  if (
    code.includes("unauthorized") ||
    code.includes("permission") ||
    msg.toLowerCase().includes("permission") ||
    msg.toLowerCase().includes("unauthorized")
  ) {
    return (
      "Upload bloccato dalle regole di Firebase Storage. " +
      "In Firebase Console > Storage > Rules imposta: " +
      "allow read, write: if request.auth != null; " +
      "(oppure allow read, write: if true; solo per test)."
    );
  }
  if (code.includes("retry-limit") || msg.includes("network")) {
    return "Errore di rete durante l'upload. Controlla la connessione e riprova.";
  }
  if (code.includes("canceled")) {
    return "Upload annullato o timeout. Riprova.";
  }
  return msg || "Errore durante il caricamento dell'immagine";
}

export function uploadImage(
  file: File,
  folder: string,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file.type.startsWith("image/")) {
        reject(new Error("Seleziona un file immagine (JPG, PNG, WebP)"));
        return;
      }

      onProgress?.({ percent: 5, state: "running" });
      const blob = await compressImage(file);
      onProgress?.({ percent: 15, state: "running" });

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || "image.jpg";
      const ext = blob.type === "image/jpeg" ? "jpg" : safeName.split(".").pop() || "jpg";
      const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const storageRef = ref(storage, path);

      const task = uploadBytesResumable(storageRef, blob, {
        contentType: blob.type || "image/jpeg",
        cacheControl: "public,max-age=31536000",
      });

      const timeout = setTimeout(() => {
        task.cancel();
        reject(
          new Error(
            "Upload troppo lento (timeout 90s). Controlla le regole Storage e la connessione."
          )
        );
      }, 90_000);

      task.on(
        "state_changed",
        (snap) => {
          const pct =
            15 + Math.round((snap.bytesTransferred / Math.max(snap.totalBytes, 1)) * 80);
          onProgress?.({ percent: Math.min(95, pct), state: "running" });
        },
        (error) => {
          clearTimeout(timeout);
          onProgress?.({ percent: 0, state: "error" });
          reject(new Error(friendlyStorageError(error)));
        },
        async () => {
          clearTimeout(timeout);
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            onProgress?.({ percent: 100, state: "success" });
            resolve(url);
          } catch (e) {
            onProgress?.({ percent: 0, state: "error" });
            reject(new Error(friendlyStorageError(e)));
          }
        }
      );
    } catch (e) {
      onProgress?.({ percent: 0, state: "error" });
      reject(new Error(friendlyStorageError(e)));
    }
  });
}
