export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-zinc-400">
        <p>
          <strong className="text-zinc-200">Ultimo aggiornamento:</strong> Novembre 2026
        </p>

        <h2 className="text-xl font-semibold text-white mt-8">1. Titolare del trattamento</h2>
        <p>
          Il titolare del trattamento dei dati è Gaming Relax, raggiungibile all’indirizzo email{" "}
          <a href="mailto:info@gamingrelaxofficials.it" className="text-violet-400 hover:underline">
            info@gamingrelaxofficials.it
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-white mt-8">2. Dati raccolti</h2>
        <p>
          Attraverso il form di contatto raccogliamo: nome, indirizzo email e contenuto del messaggio.
          Questi dati vengono utilizzati esclusivamente per rispondere alle richieste e gestire
          eventuali rapporti commerciali.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8">3. Finalità e base giuridica</h2>
        <p>
          I dati sono trattati per l’esecuzione di misure precontrattuali e contrattuali (art. 6.1.b GDPR)
          e, ove necessario, per il legittimo interesse a rispondere alle richieste degli utenti.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8">4. Conservazione</h2>
        <p>
          I dati dei form di contatto vengono conservati per il tempo necessario a gestire la richiesta
          e, in caso di rapporto commerciale, per gli obblighi di legge.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8">5. Diritti dell’interessato</h2>
        <p>
          Hai il diritto di accedere, rettificare, cancellare i tuoi dati, limitarne il trattamento,
          opporti e richiedere la portabilità. Per esercitare i diritti puoi scrivere a{" "}
          <a href="mailto:info@gamingrelaxofficials.it" className="text-violet-400 hover:underline">
            info@gamingrelaxofficials.it
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-white mt-8">6. Cookie</h2>
        <p>
          Per informazioni sui cookie utilizzati da questo sito consulta la{" "}
          <a href="/cookie" className="text-violet-400 hover:underline">
            Cookie Policy
          </a>
          .
        </p>

        <p className="text-sm text-zinc-500 mt-12">
          Questa informativa è un modello di base. Si consiglia di personalizzarla con un professionista
          o un generatore conforme al GDPR in base agli strumenti effettivamente utilizzati (analytics, ecc.).
        </p>
      </div>
    </div>
  );
}
