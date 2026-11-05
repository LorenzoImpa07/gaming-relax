export default function CookiePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-bold text-white mb-8">Cookie Policy</h1>
      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-zinc-400">
        <p>
          <strong className="text-zinc-200">Ultimo aggiornamento:</strong> Novembre 2026
        </p>

        <h2 className="text-xl font-semibold text-white mt-8">1. Cosa sono i cookie</h2>
        <p>
          I cookie sono piccoli file di testo che i siti web possono salvare sul dispositivo
          dell’utente. Servono a far funzionare correttamente il sito, a raccogliere informazioni
          statistiche o a personalizzare l’esperienza di navigazione.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8">2. Cookie utilizzati da questo sito</h2>
        <p>
          Al momento questo sito utilizza principalmente cookie tecnici necessari al funzionamento
          (es. preferenze di sessione). Non vengono utilizzati cookie di profilazione di terze parti
          senza il consenso dell’utente.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8">3. Cookie tecnici</h2>
        <p>
          Sono cookie essenziali per la navigazione e non richiedono il consenso. Includono cookie
          di sessione e quelli necessari alla sicurezza del sito.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8">4. Come gestire i cookie</h2>
        <p>
          Puoi gestire o eliminare i cookie attraverso le impostazioni del tuo browser.
          La disabilitazione di alcuni cookie tecnici potrebbe compromettere il corretto
          funzionamento del sito.
        </p>

        <p className="text-sm text-zinc-500 mt-12">
          Se in futuro verranno introdotti strumenti di analytics o marketing, questa policy
          verrà aggiornata e verrà implementato un banner di consenso conforme alle linee guida
          del Garante Privacy.
        </p>
      </div>
    </div>
  );
}
