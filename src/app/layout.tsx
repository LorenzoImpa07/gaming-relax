import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { SiteBanner } from "@/components/SiteBanner";
import { SupportChat } from "@/components/SupportChat";

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gaming Relax | Sviluppo Software, Bot Discord & Applicazioni",
  description:
    "Gaming Relax sviluppa applicazioni custom, bot Discord professionali e soluzioni software su misura. Dal prototipo al prodotto finito.",
  keywords: [
    "sviluppo software",
    "bot discord",
    "applicazioni web",
    "programmazione",
    "gaming relax",
    "sviluppatori italiani",
  ],
  authors: [{ name: "Gaming Relax" }],
  openGraph: {
    title: "Gaming Relax | Sviluppo Software & Bot Discord",
    description: "Applicazioni, bot Discord e software custom. Professionisti italiani.",
    url: "https://gamingrelaxofficials.it",
    siteName: "Gaming Relax",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`dark ${instrument.variable}`}>
      <body className="min-h-screen bg-[#0a0a0f] text-zinc-100 antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <SiteBanner />
            <main className="pt-20">{children}</main>
            <Footer />
            <CookieConsent />
            <SupportChat />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
