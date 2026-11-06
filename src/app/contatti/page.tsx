"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, CheckCircle2 } from "lucide-react";

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
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Parliamo del tuo progetto
        </h1>
        <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
          Compila il form oppure scrivici direttamente.  
          Rispondiamo di solito entro 24 ore.
        </p>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="h-5 w-5 text-violet-400" />
              <h3 className="font-semibold text-white">Email</h3>
            </div>
            <a
              href="mailto:supporto@gamingrelaxofficials.it"
              className="text-sm text-zinc-400 hover:text-violet-400 transition-colors"
            >
              supporto@gamingrelaxofficials.it
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="flex items-center gap-3 mb-3">
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          {status === "success" ? (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-10 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Messaggio inviato!
              </h3>
              <p className="text-zinc-400">
                Ti risponderemo il prima possibile.
              </p>
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
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-5"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Nome *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
                  placeholder="Il tuo nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
                  placeholder="email@esempio.com"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Tipo di progetto
                </label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
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
                <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Messaggio *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
                  placeholder="Raccontaci del tuo progetto..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
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
