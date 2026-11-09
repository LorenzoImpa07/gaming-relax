"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { Plus, Trash2, Save, MessageCircle } from "lucide-react";
import { db } from "@/lib/firebase";

type QARow = {
  id: string;
  keywords: string;
  answer: string;
  order: number;
  enabled: boolean;
};

export default function AdminSupportoPage() {
  const [rows, setRows] = useState<QARow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsOk, setSettingsOk] = useState(false);

  const [enabled, setEnabled] = useState(true);
  const [welcome, setWelcome] = useState("");
  const [fallback, setFallback] = useState("");

  const [form, setForm] = useState({
    keywords: "",
    answer: "",
    order: 0,
    enabled: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [settingsSnap, qaSnap] = await Promise.all([
        getDoc(doc(db, "site_settings", "support_bot")),
        getDocs(query(collection(db, "support_qa"), orderBy("order", "asc"))),
      ]);

      if (settingsSnap.exists()) {
        const d = settingsSnap.data();
        setEnabled(d.enabled !== false);
        setWelcome(String(d.welcome || ""));
        setFallback(String(d.fallback || ""));
      }

      setRows(
        qaSnap.docs.map((s) => {
          const d = s.data();
          const keywords = Array.isArray(d.keywords)
            ? d.keywords.join(", ")
            : String(d.keywords || "");
          return {
            id: s.id,
            keywords,
            answer: String(d.answer || ""),
            order: Number(d.order ?? 0),
            enabled: d.enabled !== false,
          };
        })
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsOk(false);
    try {
      await setDoc(doc(db, "site_settings", "support_bot"), {
        enabled,
        welcome: welcome.trim(),
        fallback: fallback.trim(),
        updatedAt: new Date().toISOString(),
      });
      setSettingsOk(true);
    } catch (err) {
      console.error(err);
      alert("Errore salvataggio impostazioni");
    } finally {
      setSavingSettings(false);
    }
  };

  const resetForm = () => {
    setForm({ keywords: "", answer: "", order: rows.length, enabled: true });
    setEditingId(null);
  };

  const startEdit = (row: QARow) => {
    setEditingId(row.id);
    setForm({
      keywords: row.keywords,
      answer: row.answer,
      order: row.order,
      enabled: row.enabled,
    });
  };

  const saveQA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.keywords.trim() || !form.answer.trim()) {
      alert("Inserisci parole chiave e risposta");
      return;
    }
    setSaving(true);
    try {
      const keywords = form.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      const payload = {
        keywords,
        answer: form.answer.trim(),
        order: Number(form.order) || 0,
        enabled: form.enabled,
        updatedAt: new Date().toISOString(),
      };
      if (editingId) {
        await updateDoc(doc(db, "support_qa", editingId), payload);
      } else {
        await addDoc(collection(db, "support_qa"), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
      }
      resetForm();
      await load();
    } catch (err) {
      console.error(err);
      alert("Errore salvataggio risposta");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questa risposta?")) return;
    await deleteDoc(doc(db, "support_qa", id));
    await load();
  };

  if (loading) {
    return <p className="text-sm text-zinc-500">Caricamento...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-white">
          <MessageCircle className="h-5 w-5 text-violet-400" />
          Assistente chat
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Risposte automatiche 24/7. L’utente scrive, il bot cerca le parole chiave e
          risponde. Niente email, niente ticket.
        </p>
      </div>

      <form
        onSubmit={saveSettings}
        className="space-y-4 rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5"
      >
        <h2 className="text-sm font-semibold text-white">Impostazioni</h2>
        <label className="flex items-center gap-3 text-sm text-zinc-200">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="accent-violet-500"
          />
          Chat attiva sul sito
        </label>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Messaggio di benvenuto</label>
          <textarea
            value={welcome}
            onChange={(e) => setWelcome(e.target.value)}
            rows={2}
            placeholder="Ciao! Sono l’assistente automatico…"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">
            Risposta se non trova nulla (fallback)
          </label>
          <textarea
            value={fallback}
            onChange={(e) => setFallback(e.target.value)}
            rows={2}
            placeholder="Non ho trovato una risposta…"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <button
          type="submit"
          disabled={savingSettings}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {savingSettings ? "Salvataggio..." : "Salva impostazioni"}
        </button>
        {settingsOk && <p className="text-sm text-emerald-400">Impostazioni salvate.</p>}
      </form>

      <form
        onSubmit={saveQA}
        className="space-y-4 rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5"
      >
        <h2 className="text-sm font-semibold text-white">
          {editingId ? "Modifica risposta" : "Nuova risposta"}
        </h2>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">
            Parole chiave (separate da virgola)
          </label>
          <input
            value={form.keywords}
            onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
            placeholder="es. prezzo, costi, quanto costa, tariffa"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
          <p className="mt-1 text-[11px] text-zinc-600">
            Se il messaggio dell’utente contiene una di queste parole, viene usata questa
            risposta.
          </p>
        </div>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Risposta</label>
          <textarea
            value={form.answer}
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            rows={4}
            placeholder="I prezzi partono da …"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Ordine</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))
              }
              className="w-24 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <label className="mt-5 flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
              className="accent-violet-500"
            />
            Attiva
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {saving ? "Salvataggio..." : editingId ? "Aggiorna" : "Aggiungi"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-zinc-300 hover:bg-white/5"
            >
              Annulla
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white">Risposte ({rows.length})</h2>
        {rows.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-700 px-4 py-8 text-center text-sm text-zinc-500">
            Nessuna risposta ancora. Aggiungi la prima sopra (es. prezzi, tempi di consegna,
            bot Discord…).
          </p>
        )}
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-xl border border-white/10 bg-zinc-900/40 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      row.enabled
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {row.enabled ? "Attiva" : "Off"}
                  </span>
                  <span className="text-[10px] text-zinc-600">ordine {row.order}</span>
                </div>
                <p className="text-xs text-violet-300/90">
                  {row.keywords || "(nessuna keyword)"}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">{row.answer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(row)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5"
                >
                  Modifica
                </button>
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  className="rounded-lg border border-red-500/30 px-2 py-1.5 text-red-400 hover:bg-red-500/10"
                  aria-label="Elimina"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
