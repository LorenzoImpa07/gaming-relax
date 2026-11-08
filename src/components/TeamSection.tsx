"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Member = {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
};

const fallback: Member[] = [
  {
    id: "1",
    name: "Lorenzo",
    role: "Full-Stack Developer",
    description:
      "Appassionato di sviluppo software e bot Discord. Si occupa di architettura, backend e integrazioni.",
  },
  {
    id: "2",
    name: "Team",
    role: "Developer",
    description: "Aggiungi i membri del team dalla dashboard admin.",
  },
];

export function TeamSection() {
  const [team, setTeam] = useState<Member[]>(fallback);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "site_team"),
      (snap) => {
        if (snap.empty) return;
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: String(data.name || "Membro"),
            role: String(data.role || ""),
            description: String(data.description || ""),
            image: data.image ? String(data.image) : undefined,
          };
        });
        if (list.length) setTeam(list);
      },
      (err) => console.error(err)
    );
    return () => unsub();
  }, []);

  return (
    <section id="team" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl text-glow">Il Team</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Le persone dietro Gaming Relax. Aggiornato in tempo reale dalla dashboard.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-shine box-glow-hover flex gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950">
                {member.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-violet-400">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-violet-400">{member.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
