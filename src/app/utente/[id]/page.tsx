"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  collection,
  getDocs,
  getCountFromServer,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SiteRole } from "@/lib/roles";
import { rolesForEmail, DEFAULT_ROLE } from "@/lib/roles";
import { RoleBadges } from "@/components/forum/RoleBadges";
import { ArrowLeft } from "lucide-react";

export default function UtenteProfilePage() {
  const params = useParams();
  const id = decodeURIComponent(String(params.id || ""));
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [roles, setRoles] = useState<SiteRole[]>([]);
  const [msgCount, setMsgCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let foundEmail = "";
        let foundName = "";
        let foundPhoto: string | null = null;
        try {
          const u = await getDoc(doc(db, "users", id));
          if (u.exists()) {
            const d = u.data();
            foundEmail = String(d.email || "");
            foundName = String(d.displayName || d.name || "");
            foundPhoto = d.photoURL || d.avatar || null;
          }
        } catch {}

        if (!foundEmail && id.includes("@")) {
          foundEmail = id;
          foundName = id.split("@")[0];
        }

        const rolesSnap = await getDocs(collection(db, "site_roles"));
        const allRoles = rolesSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: String(data.name || ""),
            color: String(data.color || "#a78bfa"),
            emails: Array.isArray(data.emails) ? data.emails.map(String) : [],
            order: Number(data.order) || 0,
          } as SiteRole;
        });

        let count = 0;
        try {
          if (id && !id.includes("@")) {
            const c = await getCountFromServer(
              query(collection(db, "forum_posts"), where("authorId", "==", id))
            );
            count = c.data().count;
          }
        } catch {}

        if (!foundEmail && id) {
          try {
            const pSnap = await getDocs(
              query(collection(db, "forum_posts"), where("authorId", "==", id))
            );
            if (!pSnap.empty) {
              const d = pSnap.docs[0].data();
              foundName = foundName || String(d.authorName || "Utente");
              foundEmail = String(d.authorEmail || "");
            }
          } catch {}
        }

        if (cancelled) return;
        setEmail(foundEmail);
        setDisplayName(foundName || foundEmail.split("@")[0] || "Utente");
        setPhoto(foundPhoto);
        setRoles(rolesForEmail(allRoles, foundEmail));
        setMsgCount(count);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="px-4 py-24 text-center text-sm text-zinc-500">Caricamento profilo...</p>;
  }

  const showRoles =
    roles.length > 0
      ? roles
      : [{ id: "default", name: DEFAULT_ROLE.name, color: DEFAULT_ROLE.color, emails: [] }];

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <Link href="/forum" className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Forum
      </Link>

      <div className="overflow-hidden rounded-2xl border border-zinc-700/80 bg-[#1a1d24] shadow-2xl">
        <div className="flex gap-4 p-5">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-600 bg-zinc-900">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-violet-300">
                {(displayName || "?").slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold text-sky-400">{displayName}</h1>
            <RoleBadges roles={showRoles} />
            <p className="mt-2 text-sm text-zinc-500">
              {roles.length > 0 ? "Staff / ruolo assegnato" : "Membro della community"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-zinc-700/80 text-center">
          <div className="px-2 py-3">
            <p className="text-xs text-zinc-500">Messaggi</p>
            <p className="text-lg font-semibold text-zinc-200">{msgCount.toLocaleString("it-IT")}</p>
          </div>
          <div className="border-x border-zinc-700/80 px-2 py-3">
            <p className="text-xs text-zinc-500">Ruoli</p>
            <p className="text-lg font-semibold text-zinc-200">{showRoles.length}</p>
          </div>
          <div className="px-2 py-3">
            <p className="text-xs text-zinc-500">Profilo</p>
            <p className="text-lg font-semibold text-zinc-200">Pubblico</p>
          </div>
        </div>
      </div>
    </div>
  );
}
