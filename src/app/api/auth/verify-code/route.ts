import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyBa2zLaeU_DD6pKO62guRUD4Ijd8RkYOJc",
  authDomain: "gaming-relax-programmazione.firebaseapp.com",
  projectId: "gaming-relax-programmazione",
  storageBucket: "gaming-relax-programmazione.firebasestorage.app",
  messagingSenderId: "959071907341",
  appId: "1:959071907341:web:86a4fdbb36ab596e63ef44",
};

function getDb() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return getFirestore(app);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const code = String(body.code || "").trim();

    if (!email || !code) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const id = email.replace(/[^a-z0-9@._+-]/gi, "_");
    const db = getDb();
    const snap = await getDoc(doc(db, "verification_codes", id));

    if (!snap.exists()) {
      return NextResponse.json(
        { error: "Nessun codice trovato. Richiedine uno nuovo." },
        { status: 400 }
      );
    }

    const data = snap.data();
    if (Date.now() > Number(data.expiresAt || 0)) {
      await deleteDoc(doc(db, "verification_codes", id));
      return NextResponse.json(
        { error: "Codice scaduto. Richiedine uno nuovo." },
        { status: 400 }
      );
    }

    if (String(data.code) !== code) {
      return NextResponse.json({ error: "Codice non corretto" }, { status: 400 });
    }

    await deleteDoc(doc(db, "verification_codes", id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
