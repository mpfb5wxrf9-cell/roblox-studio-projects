# Roblox Studio Projects — Prenotazioni Lezioni

Sito di prenotazione lezioni per un'agenzia che insegna Roblox Studio / game
development. Ogni prenotazione parte come una richiesta, si accorda via chat
1-a-1 con l'owner, e viene infine accettata o rifiutata.

**Stack**: Vite + React + TypeScript, Tailwind CSS, React Router (`HashRouter`),
Firebase (Authentication + Firestore, realtime con `onSnapshot`), FullCalendar,
Framer Motion. Pensato per hosting statico (GitHub Pages).

## 1. Setup del progetto Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/) e crea un
   nuovo progetto (puoi disattivare Google Analytics, non serve).
2. **Authentication** → tab "Sign-in method" → abilita il provider
   **Email/Password**.
3. **Firestore Database** → crea un database (modalità produzione va bene,
   le regole sono in `firestore.rules`).
4. **Project settings** (icona ingranaggio) → in fondo, sezione "Your apps"
   → aggiungi una web app (`</>`) → copia i valori di configurazione mostrati
   (`apiKey`, `authDomain`, `projectId`, ecc.).
5. Copia `.env.example` in `.env` e incolla i valori:

   ```bash
   cp .env.example .env
   ```

   > Questi valori sono pensati per essere pubblici: identificano il
   > progetto Firebase, non sono segreti. La sicurezza reale è garantita
   > dalle regole Firestore (`firestore.rules`), non dal nascondere questa
   > configurazione lato client.

## 2. Creare gli account (nessuna registrazione pubblica)

Non esiste un form di registrazione: ogni account viene creato manualmente
dall'owner.

1. **Authentication** → tab "Users" → "Add user" → inserisci email e
   password per ogni persona (sia lo staff/owner sia gli utenti).
2. **Firestore Database** → crea manualmente, per ogni utente appena creato,
   un documento nella collection `users` con **ID documento uguale allo
   `uid`** generato da Authentication (visibile nella lista utenti), e
   questi campi:

   ```
   uid:      "<lo stesso uid del documento>"
   username: "Mario Rossi"
   email:    "mario@esempio.com"
   role:     "user"   // oppure "owner" per l'account dell'agenzia
   ```

   Deve esistere **un solo** account con `role: "owner"` (o più, se più
   persone gestiscono il calendario): sono loro a vedere la dashboard con il
   calendario di tutte le richieste.

### Creare il profilo Firestore in automatico (consigliato)

Copiare a mano lo UID da Authentication a Firestore è la causa più comune
dell'errore di login "Account senza profilo associato" (basta un carattere
sbagliato). In alternativa, uno script recupera lo UID direttamente da
Firebase e crea il documento corretto:

1. **Firebase Console → Project settings → Service accounts** → "Generate
   new private key" → salva il file JSON scaricato esattamente come
   `scripts/serviceAccountKey.json` (è già escluso da git, non verrà mai
   committato).
2. Esegui, per ogni account già creato in Authentication:

   ```bash
   npm run create-user -- --email mario@esempio.com --username "Mario Rossi" --role user
   npm run create-user -- --email agenzia@esempio.com --username "Roblox Studio Projects" --role owner
   ```

Lo script cerca l'utente per email in Authentication, prende il suo UID
reale e crea/aggiorna il documento `users/{uid}` — se lo esegui di nuovo
sullo stesso account, sovrascrive il profilo esistente (utile anche per
correggere un profilo creato male a mano).

## 3. Pubblicare le regole di sicurezza Firestore

Con la [Firebase CLI](https://firebase.google.com/docs/cli):

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # collega il progetto, riusa firestore.rules esistente
firebase deploy --only firestore:rules
```

In alternativa, incolla il contenuto di `firestore.rules` direttamente in
**Firestore Database → Regole** nella console e pubblica da lì.

## 4. Sviluppo locale

```bash
npm install
npm run dev
```

## 5. Deploy su GitHub Pages

Il progetto usa `gh-pages` per pubblicare la cartella `dist/` sul branch
`gh-pages` del repository.

1. In `vite.config.ts`, la costante `REPO_NAME` deve corrispondere
   esattamente al nome del repository GitHub (es. se il repo è
   `github.com/tuo-utente/roblox-studio-projects`, `REPO_NAME` resta
   `roblox-studio-projects`).
2. Assicurati che il repository remoto sia configurato (`git remote add
   origin ...`).
3. Esegui:

   ```bash
   npm run deploy
   ```

   Questo comando builda il progetto (`predeploy`) e pubblica `dist/` sul
   branch `gh-pages` (`deploy`).
4. Su GitHub, vai in **Settings → Pages** e imposta la sorgente su branch
   `gh-pages`, cartella `/ (root)`. Il sito sarà disponibile su
   `https://<tuo-utente>.github.io/roblox-studio-projects/`.

Le variabili in `.env` non vengono mai committate (`.env` è in
`.gitignore`) ma **vengono inglobate nel bundle JS al momento della
build**, quindi devono essere presenti nell'ambiente in cui esegui `npm run
build` / `npm run deploy` — non servono "secrets" su GitHub Actions a meno
che tu non voglia automatizzare il deploy da CI.

## Struttura dati Firestore

```
users/{uid}
  uid, username, email, role: "user" | "owner"

lessonRequests/{requestId}
  userId, username, requestedDate ("YYYY-MM-DD"), requestedTime ("HH:mm"),
  initialMessage, status: "pending" | "accepted" | "rejected", createdAt

lessonRequests/{requestId}/messages/{messageId}
  senderId, senderUsername, text, timestamp
```

## Logo

Il logo è un placeholder testuale in `src/components/Logo.tsx`. Sostituisci
il markup interno con un `<img src="..." />` quando il logo definitivo è
pronto: è l'unico punto da modificare, dato che ogni schermata usa
`<Logo />`.
