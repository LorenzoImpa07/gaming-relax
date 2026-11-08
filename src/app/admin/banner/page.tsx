"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminBannerPage() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "site_settings", "banner"));
        if (snap.exists()) {
          const d = snap.data();
          setEnabled(!!d.enabled);
          setMessage(String(d.message || ""));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setOk(false);
    try {
      await setDoc(doc(db, "site_settings", "banner"), {
        enabled,
        message: message.trim(),
        updatedAt: new Date().toISOString(),
      });
      setOk(true);
    } catch (err) {
      console.error(err);
      alert("Errore salvataggio banner");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-zinc-500">Caricamento...</p>;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <p className="text-sm text-zinc-400">
        Banner fisso sotto la navbar con messaggio scorrevole. Puoi attivarlo o disattivarlo in qualsiasi momento.
      </p>
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5">
        <label className="flex items-center gap-3 text-sm text-zinc-200">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="accent-violet-500" />
          Banner attivo
        </label>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Messaggio</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Es. Sconto 15% su tutti i bot Discord fino a fine mese!"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <button type="submit" disabled={saving} className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-50">
          {saving ? "Salvataggio..." : "Salva banner"}
        </button>
        {ok && <p className="text-sm text-emerald-400">Banner aggiornato.</p>}
      </form>
    </div>
  );
}
