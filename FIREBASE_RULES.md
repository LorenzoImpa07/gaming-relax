# Regole Firebase – Gaming Relax

File nel repo:

- `firestore.rules` → regole **Firestore**
- `storage.rules` → regole **Storage** (solo se attivi Storage a pagamento)
- `firebase.json` → collega i file alle regole

## Come aggiornare Firestore

1. Apri Firebase Console → progetto **gaming-relax-programmazione**
2. **Firestore Database** → scheda **Rules**
3. Apri su GitHub il file:
   https://github.com/LorenzoImpa07/gaming-relax/blob/main/firestore.rules
4. Copia **tutto** il contenuto
5. Incolla nella console e clicca **Publish**

## Storage

Sul piano free spesso non e disponibile. Il sito salva le foto senza Storage.
Se un giorno attivi Storage, copia anche `storage.rules` in **Storage → Rules**.

## Email (Vercel)

- `GMAIL_USER` = gamingrelaxofficials@gmail.com
- `GMAIL_APP_PASSWORD` = password per le app

Dopo le variabili: **Redeploy** su Vercel.
