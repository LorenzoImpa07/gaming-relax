"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, CheckCircle2, Clock } from "lucide-react";

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

    await new Promise((resolve) => setTimeout(resolve, 1200));

    console.log("Form data:", formData);
    setStatus("success");
    setFormData({ name: "", email: "", projectType: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Parliamo del tuo progetto
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          Compila il form oppure scrivici direttamente.
          Rispondiamo di solito entro 24 ore.
        </p>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6 lg:col-span-2"
        >
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="mb-3 flex items-center gap-3">
              <Mail className="h-5 w-5 text-violet-400" />
              <h3 className="font-semibold text-white">Email</h3>
            </div>
            <a
              href="mailto:supportogamingrelax@gmail.com"
              className="break-all text-sm text-zinc-400 transition-colors hover:text-violet-400"
            >
              supportogamingrelax@gmail.com
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="mb-3 flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-cyan-400" />
              <h3 className="font-semibold text-white">Cosa includere</h3>
            </div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>• Descrizione del progetto o del problema</li>
              <li>• Tempistiche desiderate</li>
              <li>• Budget orientativo (se lo hai)</li>
              <li>• Eventuali riferimenti o esempi</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 to-zinc-900/40 p-6">
            <div className="mb-3 flex items-center gap-3">
              <Clock className="h-5 w-5 text-violet-300" />
              <h3 className="font-semibold text-white">Orari di supporto</h3>
            </div>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex justify-between gap-4">
                <span className="text-zinc-400">Lun – Ven</span>
                <span className="font-medium text-white">10:00 – 19:00</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-zinc-400">Sabato</span>
                <span className="font-medium text-white">10:00 – 14:00</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-zinc-400">Domenica</span>
                <span className="font-medium text-white">chiuso</span>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              Rispondiamo di solito entro 24 ore nei giorni lavorativi. Fuori orario: form o email.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          {status === "success" ? (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-10 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-400" />
              <h3 className="mb-2 text-xl font-semibold text-white">
                Messaggio inviato!
              </h3>
              <p className="text-zinc-400">Ti risponderemo il prima possibile.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm text-violet-400 hover:text-violet-300"
              >
                Invia un altro messaggio
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8"
            >
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Nome *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Il tuo nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="email@esempio.com"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Tipo di progetto
                </label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="">Seleziona...</option>
                  <option value="bot-discord">Bot Discord</option>
                  <option value="web-app">Applicazione Web</option>
                  <option value="software">Software / Tool custom</option>
                  <option value="automazione">Automazione / Integrazioni</option>
                  <option value="altro">Altro</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Messaggio *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Raccontaci del tuo progetto..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? (
                  "Invio in corso..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Invia messaggio
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
