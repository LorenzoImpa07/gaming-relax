"use client";

export function TrustBar() {
  return (
    <section className="relative border-b border-white/5 bg-gradient-to-b from-[#0c0820] to-[#100a24] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "50+", l: "Progetti consegnati" },
            { n: "24/7", l: "Assistente automatico" },
            { n: "<24h", l: "Risposta preventivo" },
            { n: "100%", l: "Deploy in produzione" },
          ].map((x) => (
            <div
              key={x.l}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 text-center"
            >
              <p className="font-serif text-3xl font-light text-white sm:text-4xl">{x.n}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{x.l}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              q: "Processo chiaro e consegna in produzione, non solo demo.",
              a: "Cliente web app",
            },
            {
              q: "Bot stabile e staff autonomo grazie al pannello.",
              a: "Community Discord",
            },
            {
              q: "Preventivo senza giri di parole: scope, tempi, prezzo.",
              a: "Progetto custom",
            },
          ].map((r) => (
            <blockquote
              key={r.a}
              className="rounded-2xl border border-violet-500/20 bg-violet-500/5 px-5 py-4"
            >
              <p className="text-sm leading-relaxed text-zinc-300">&ldquo;{r.q}&rdquo;</p>
              <footer className="mt-3 text-[11px] font-medium text-violet-300/80">{r.a}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
