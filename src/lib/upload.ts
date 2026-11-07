import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth, storage } from "@/lib/firebase";

export type UploadProgress = {
  percent: number;
  state: "running" | "success" | "error";
};

async function compressImage(file: File, maxSize = 1280, quality = 0.8): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Seleziona un file immagine (JPG, PNG, WebP)");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Immagine troppo grande (max 10MB)");
  }

  if (file.type === "image/gif" || file.size < 150_000) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
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
    return blob || file;
  } catch {
    return file;
  }
}

function friendlyStorageError(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";
  const msg = err instanceof Error ? err.message : String(err || "");

  if (
    code.includes("unauthorized") ||
    code.includes("permission-denied") ||
    msg.toLowerCase().includes("permission") ||
    msg.toLowerCase().includes("unauthorized")
  ) {
    return (
      "Upload bloccato: regole Firebase Storage o utente non loggato. " +
      "1) Accedi al sito. " +
      "2) Firebase Console → Storage → Rules → pubblica: " +
      "allow read: if true; allow write: if request.auth != null;"
    );
  }
  if (code.includes("unauthenticated") || msg.includes("unauthenticated")) {
    return "Devi effettuare l'accesso prima di caricare una foto.";
  }
  if (code.includes("canceled") || msg.toLowerCase().includes("timeout")) {
    return (
      "Upload interrotto (timeout). Controlla: Storage attivo in Firebase, " +
      "regole pubblicate, connessione stabile. Poi riprova."
    );
  }
  if (
    code.includes("retry-limit") ||
    msg.includes("network") ||
    msg.includes("Failed to fetch")
  ) {
    return "Errore di rete durante l'upload. Riprova tra poco.";
  }
  if (code.includes("object-not-found")) {
    return "File non trovato dopo l'upload. Riprova.";
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

      if (!auth.currentUser) {
        reject(new Error("Devi effettuare l'accesso prima di caricare una foto."));
        return;
      }

      onProgress?.({ percent: 5, state: "running" });
      const blob = await compressImage(file);
      onProgress?.({ percent: 20, state: "running" });

      const ext =
        blob.type === "image/jpeg"
          ? "jpg"
          : (file.name.split(".").pop() || "jpg");
      const safeExt = ext.replace(/[^a-z0-9]/gi, "") || "jpg";
      const path = `${folder}/${auth.currentUser.uid}_${Date.now()}.${safeExt}`;
      const storageRef = ref(storage, path);
      const metadata = {
        contentType: blob.type || "image/jpeg",
        cacheControl: "public,max-age=31536000",
      };

      try {
        onProgress?.({ percent: 40, state: "running" });
        const result = await Promise.race([
          uploadBytes(storageRef, blob, metadata),
          new Promise<never>((_, rej) =>
            setTimeout(() => rej(new Error("timeout")), 45000)
          ),
        ]);
        onProgress?.({ percent: 85, state: "running" });
        const url = await getDownloadURL(result.ref);
        onProgress?.({ percent: 100, state: "success" });
        resolve(url);
        return;
      } catch (firstErr) {
        const msg = firstErr instanceof Error ? firstErr.message : "";
        if (
          msg.includes("permission") ||
          msg.includes("unauthorized") ||
          msg.includes("unauthenticated")
        ) {
          reject(new Error(friendlyStorageError(firstErr)));
          return;
        }
      }

      onProgress?.({ percent: 30, state: "running" });
      const task = uploadBytesResumable(storageRef, blob, metadata);
      const timeout = setTimeout(() => {
        try {
          task.cancel();
        } catch {
          /* ignore */
        }
        reject(
          new Error(
            "Upload troppo lento (timeout 60s). Verifica Storage Rules e che Storage sia attivo nel progetto Firebase."
          )
        );
      }, 60000);

      task.on(
        "state_changed",
        (snap) => {
          const pct =
            30 +
            Math.round((snap.bytesTransferred / Math.max(snap.totalBytes, 1)) * 65);
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
