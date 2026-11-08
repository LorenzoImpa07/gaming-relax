"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Upload, CheckCircle2, MessageSquareQuote } from "lucide-react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const ratingLabels = ["", "Pessimo", "Scarso", "Nella media", "Buono", "Eccellente"];

type Review = { id: string; name: string; rating: number; text: string };

const sampleReviews: Review[] = [
  {
    id: "1",
    name: "Marco R.",
    rating: 5,
    text: "Bot Discord realizzato in pochi giorni, stabile e con tutte le funzioni richieste.",
  },
  {
    id: "2",
    name: "Giulia T.",
    rating: 5,
    text: "Applicazione web su misura, comunicazione chiara e supporto dopo la consegna.",
  },
  {
    id: "3",
    name: "Andrea P.",
    rating: 4,
    text: "Ottimo lavoro sulle automazioni. Qualche ritocco richiesto ma risolto in fretta.",
  },
];

export default function RecensioniPage() {
  const { user } = useAuth();
  const [liveReviews, setLiveReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const displayRating = hoverRating || rating;

  useEffect(() => {
    const q = query(collection(db, "reviews"), where("status", "==", "approved"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: String(data.name || "Utente"),
            rating: Number(data.rating) || 0,
            text: String(data.text || ""),
          };
        });
        list.sort((a, b) => b.rating - a.rating);
        setLiveReviews(list);
      },
      (err) => console.error(err)
    );
    return () => unsub();
  }, []);

  const shown = liveReviews.length ? liveReviews : sampleReviews;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Seleziona un file immagine");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("L'immagine deve essere sotto i 5MB");
      return;
    }
    setError("");
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      setError("Seleziona una valutazione");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await addDoc(collection(db, "reviews"), {
        name: name.trim(),
        rating,
        text: text.trim(),
        hasPhoto: !!photo,
        photoName: photo?.name || null,
        userId: user?.uid || null,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setDone(true);
      setName("");
      setText("");
      setRating(5);
      removePhoto();
    } catch (err) {
      console.error(err);
      setError("Errore nell'invio. Controlla le regole Firestore e riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl text-glow">Recensioni</h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          Cosa dicono di noi e spazio per lasciare la tua esperienza.
        </p>
      </motion.div>

      <div className="mb-14 grid gap-4 sm:grid-cols-3">
        {shown.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-shine box-glow-hover rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
          >
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-4 w-4 ${
                    idx < r.rating
                      ? "fill-violet-400 text-violet-300 star-glow"
                      : "text-zinc-700"
                  }`}
                />
              ))}
            </div>
            <p className="mb-3 text-sm leading-relaxed text-zinc-300">&ldquo;{r.text}&rdquo;</p>
            <p className="text-xs font-medium text-zinc-500">{r.name}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl shadow-violet-500/10 box-glow sm:p-8"
      >
        {done ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-400" />
            <h2 className="mb-2 text-xl font-semibold text-white">Recensione inviata!</h2>
            <p className="mb-6 text-sm text-zinc-400">
              Sara pubblicata dopo una rapida verifica dello staff.
            </p>
            <button onClick={() => setDone(false)} className="text-sm text-violet-400 hover:text-violet-300">
              Invia un'altra recensione
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
                <MessageSquareQuote className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Lascia la tua recensione</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  La tua esperienza verra moderata prima di essere pubblica.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-900">
                    {photoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoPreview} alt="Anteprima" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        <Upload className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-violet-400 hover:text-violet-300">
                    {photoPreview ? "Cambia foto" : "Foto profilo"}
                  </button>
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Il tuo nome
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
                    placeholder="Come vuoi firmarti"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Valutazione
                </label>
                <div className="inline-flex items-center gap-1 rounded-xl border border-violet-500/30 bg-zinc-900/50 px-3 py-2 shadow-[0_0_24px_rgba(139,92,246,0.2)]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 transition-transform hover:scale-125"
                      aria-label={`${star} stelle`}
                    >
                      <Star
                        className={`h-7 w-7 transition-all duration-200 ${
                          star <= displayRating
                            ? "fill-violet-400 text-violet-300 star-glow scale-105"
                            : "text-zinc-600 hover:text-zinc-400"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 border-l border-zinc-700 pl-3 text-sm font-medium text-violet-100/90">
                    {ratingLabels[displayRating] || "Seleziona"}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  La tua recensione
                </label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
                  placeholder="Raccontaci la tua esperienza..."
                />
              </div>

              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-3 text-sm font-semibold text-white btn-glow disabled:opacity-60"
              >
                {loading ? "Invio in corso..." : "Invia recensione"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
