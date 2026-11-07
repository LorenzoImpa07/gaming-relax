import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

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

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const purpose = body.purpose === "login" ? "login" : "register";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email non valida" }, { status: 400 });
    }

    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const id = email.replace(/[^a-z0-9@._+-]/gi, "_");

    const db = getDb();
    await setDoc(doc(db, "verification_codes", id), {
      email,
      code,
      purpose,
      expiresAt,
      createdAt: serverTimestamp(),
    });

    const from = process.env.GMAIL_USER || "gamingrelaxofficials@gmail.com";
    const appPassword = process.env.GMAIL_APP_PASSWORD;

    let sent = false;
    let devCode: string | undefined;

    if (appPassword) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: from, pass: appPassword },
        });

        await transporter.sendMail({
          from: `"Gaming Relax" <${from}>`,
          to: email,
          subject: `Codice di verifica Gaming Relax: ${code}`,
          text: `Il tuo codice di verifica e: ${code}\n\nValido per 10 minuti.\n\n— Gaming Relax`,
          html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0a0a0f;color:#f4f4f5;border-radius:12px"><h2 style="color:#a78bfa">Gaming Relax</h2><p style="color:#a1a1aa">Il tuo codice di verifica:</p><p style="font-size:32px;letter-spacing:8px;font-weight:bold;color:#fff">${code}</p><p style="color:#71717a;font-size:13px">Valido per 10 minuti.</p></div>`,
        });
        sent = true;
      } catch (mailErr) {
        console.error("Email send error:", mailErr);
        return NextResponse.json(
          {
            error:
              "Impossibile inviare l'email. Controlla GMAIL_APP_PASSWORD su Vercel.",
          },
          { status: 502 }
        );
      }
    } else {
      if (process.env.NODE_ENV !== "production") {
        devCode = code;
        sent = true;
      } else {
        return NextResponse.json(
          {
            error:
              "Invio email non configurato. Aggiungi GMAIL_USER e GMAIL_APP_PASSWORD su Vercel.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      sent,
      expiresIn: 600,
      ...(devCode ? { devCode } : {}),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
