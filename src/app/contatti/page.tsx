"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHero } from "@/components/ui/PageHero";

export default function ContattiPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await addDoc(collection(db, "messages"), {
        name: formData.name,
        email: formData.email,
        subject: formData.projectType || "Contatto",
        message: formData.message,
        read: false,
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setFormData({ name: "", email: "", projectType: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20";

  return (
    <div className="pb-20">
      <PageHero
        align="center"
        eyebrow="Supporto & progetti"
        title="Parliamo del tuo progetto"
        description="Compila il form oppure scrivici direttamente. Di solito rispondiamo entro 24 ore lavorative."
      />

      <div className="page-shell grid gap-8 py-12 lg:grid-cols-5 lg:gap-10 lg:py-16">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5 lg:col-span-2">
          <div className="surface p-6 transition hover:border-violet-500/25">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Mail className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-white">Email</h3>
            </div>
            <a href="mailto:supportogamingrelax@gmail.com" className="break-all text-sm text-zinc-400 transition hover:text-violet-300">
              supportogamingrelax@gmail.com
            </a>
          </div>

          <div className="surface p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                <MessageSquare className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-white">Cosa includere</h3>
            </div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>• Descrizione del progetto o del problema</li>
              <li>• Tempistiche desiderate</li>
              <li>• Budget orientativo (se lo hai)</li>
              <li>• Eventuali riferimenti o esempi</li>
            </ul>
          </div>

          <div className="surface-glow p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200">
                <Clock className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-white">Orari di supporto</h3>
            </div>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex justify-between gap-4"><span className="text-zinc-400">Lun – Ven</span><span className="font-medium text-white">10:00 – 19:00</span></li>
              <li className="flex justify-between gap-4"><span className="text-zinc-400">Sabato</span><span className="font-medium text-white">10:00 – 14:00</span></li>
              <li className="flex justify-between gap-4"><span className="text-zinc-400">Domenica</span><span className="font-medium text-zinc-500">Chiuso</span></li>
            </ul>
          </div>

          <Link href="/preventivo" className="block rounded-2xl border border-dashed border-white/15 px-4 py-4 text-center text-sm text-zinc-400 transition hover:border-violet-400/40 hover:text-violet-200">
            Preferisci uno scope strutturato?
            <span className="mt-1 block font-medium text-violet-300">Preventivo guidato →</span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-strong p-6 sm:p-8 lg:col-span-3">
          {status === "success" ? (
            <div className="flex flex-col items-center py-12 text-center">
              <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Messaggio inviato</h2>
              <p className="mt-2 max-w-sm text-sm text-zinc-400">Ti risponderemo al più presto all&apos;email indicata.</p>
              <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm text-violet-300 hover:underline">
                Invia un altro messaggio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-500">Nome</label>
                  <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={field} placeholder="Il tuo nome" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-500">Email</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={field} placeholder="email@esempio.com" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-500">Tipo di richiesta</label>
                <select value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value })} className={field}>
                  <option value="">Seleziona…</option>
                  <option value="Sito web">Sito web</option>
                  <option value="Bot Discord">Bot Discord</option>
                  <option value="Software custom">Software custom</option>
                  <option value="Supporto">Supporto / altro</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-500">Messaggio</label>
                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={field} placeholder="Raccontaci cosa ti serve…" />
              </div>
              {status === "error" && <p className="text-sm text-red-400">Errore invio. Riprova tra poco.</p>}
              <button type="submit" disabled={status === "sending"} className="btn-press inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto sm:px-10">
                <Send className="h-4 w-4" />
                {status === "sending" ? "Invio…" : "Invia messaggio"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
