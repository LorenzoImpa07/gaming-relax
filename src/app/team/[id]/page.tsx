"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft } from "lucide-react";

type Member = {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
};

export default function TeamMemberPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "site_team", id));
        if (!cancelled && snap.exists()) {
          const data = snap.data();
          setMember({
            id: snap.id,
            name: String(data.name || "Membro"),
            role: String(data.role || ""),
            description: String(data.description || ""),
            image: data.image ? String(data.image) : undefined,
          });
          setLoading(false);
          return;
        }
        const all = await getDocs(collection(db, "site_team"));
        const found = all.docs.find((d) => d.id === id);
        if (!cancelled && found) {
          const data = found.data();
          setMember({
            id: found.id,
            name: String(data.name || "Membro"),
            role: String(data.role || ""),
            description: String(data.description || ""),
            image: data.image ? String(data.image) : undefined,
          });
        } else if (!cancelled) setMember(null);
      } catch {
        if (!cancelled) setMember(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="px-4 py-24 text-center text-sm text-zinc-500">Caricamento...</p>;
  }

  if (!member) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-zinc-400">Membro non trovato.</p>
        <Link href="/#team" className="mt-4 inline-block text-violet-400 hover:underline">
          Torna al team
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link href="/#team" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Team
      </Link>

      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 shadow-xl shadow-violet-950/20">
        <div className="h-40 bg-gradient-to-r from-violet-600/40 via-fuchsia-500/30 to-cyan-500/20" />
        <div className="-mt-16 px-6 pb-8 sm:px-10">
          <div className="mb-6 flex flex-col items-start gap-5 sm:flex-row sm:items-end">
            <div className="h-28 w-28 overflow-hidden rounded-2xl border-4 border-zinc-950 bg-zinc-900 shadow-lg">
              {member.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-violet-300">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-3xl font-bold text-white">{member.name}</h1>
              <p className="mt-1 text-violet-300">{member.role}</p>
            </div>
          </div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Presentazione</h2>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-zinc-300">
            {member.description || "Nessuna descrizione disponibile."}
          </p>
        </div>
      </div>
    </div>
  );
}
