"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Star, Upload, CheckCircle2, MessageSquareQuote } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const ratingLabels = ["", "Pessimo", "Scarso", "Nella media", "Buono", "Eccellente"];

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
};

const sampleReviews: Review[] = [
  {
    id: "1",
    name: "Marco R.",
    rating: 5,
    text: "Bot Discord realizzato in pochi giorni, stabile e con tutte le funzioni richieste. Consigliatissimi.",
  },
  {
    id: "2",
    name: "Giulia T.",
    rating: 5,
    text: "Applicazione web su misura, comunicazione chiara e supporto anche dopo la consegna.",
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Recensioni</h1>
        <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
          Cosa dicono di noi e spazio per lasciare la tua esperienza.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3 mb-14">
        {sampleReviews.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
          >
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-4 w-4 ${
                    idx < r.rating ? "fill-violet-400 text-violet-400" : "text-zinc-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">&ldquo;{r.text}&rdquo;</p>
            <p className="text-xs font-medium text-zinc-500">{r.name}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 shadow-2xl shadow-black/40"
      >
        {done ? (
          <div className="text-center py-10">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-400 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Recensione inviata!</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Verrà pubblicata dopo una rapida verifica dello staff.
            </p>
            <button onClick={() => setDone(false)} className="text-violet-400 hover:text-violet-300 text-sm">
              Invia un&apos;altra recensione
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
                <MessageSquareQuote className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Lascia la tua recensione</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Racconta la tua esperienza con Gaming Relax — la tua recensione verrà
                  pubblicata dopo una rapida verifica dello staff.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-20 w-20 rounded-full border-2 border-zinc-700 bg-zinc-900 overflow-hidden">
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
                  {photoPreview && (
                    <button type="button" onClick={removePhoto} className="text-xs text-zinc-500 hover:text-red-400">
                      Rimuovi
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Il tuo nome
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
                    placeholder="Come vuoi firmarti"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Valutazione
                </label>
                <div className="inline-flex items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 transition-transform hover:scale-110"
                      aria-label={`${star} stelle`}
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          star <= displayRating
                            ? "fill-violet-400 text-violet-400"
                            : "text-zinc-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-zinc-300 border-l border-zinc-700 pl-3">
                    {ratingLabels[displayRating] || "Seleziona"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                  La tua recensione
                </label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none resize-none"
                  placeholder="Raccontaci la tua esperienza..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Foto del tuo setup (opzionale)
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-200 hover:file:bg-zinc-700"
                />
                <p className="mt-1.5 text-xs text-zinc-600">JPG, PNG o WebP — max 5MB</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 disabled:opacity-60"
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
