// One-off admin tool: creates (or fixes) the Firestore `users/{uid}` profile
// for an account that already exists in Firebase Authentication, using the
// UID that Firebase itself reports for that email — removing the manual
// copy-paste step that's the most common cause of "account without profile"
// login errors.
//
// Setup (once):
//   1. Firebase Console -> Project settings -> Service accounts
//      -> "Generate new private key" -> save the JSON file as
//      scripts/serviceAccountKey.json (this file is gitignored, never commit it).
//   2. npm install (installs the firebase-admin dev dependency).
//
// Usage:
//   node scripts/create-user-profile.mjs --email mario@esempio.com --username "Mario Rossi" --role user
//   node scripts/create-user-profile.mjs --email agenzia@esempio.com --username "Roblox Studio Projects" --role owner

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { cert, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const keyPath = path.join(__dirname, 'serviceAccountKey.json')

function parseArgs() {
  const args = {}
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, '')
    args[key] = argv[i + 1]
  }
  return args
}

const { email, username, role } = parseArgs()

if (!email || !username || !role) {
  console.error(
    'Uso: node scripts/create-user-profile.mjs --email <email> --username "<nome>" --role <user|owner>',
  )
  process.exit(1)
}

if (role !== 'user' && role !== 'owner') {
  console.error('--role deve essere "user" oppure "owner"')
  process.exit(1)
}

let serviceAccount
try {
  serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'))
} catch {
  console.error(
    `Impossibile leggere ${keyPath}.\n` +
      'Scaricalo da Firebase Console -> Project settings -> Service accounts -> ' +
      '"Generate new private key", e salvalo esattamente in quel percorso.',
  )
  process.exit(1)
}

const app = initializeApp({ credential: cert(serviceAccount) })

const authUser = await getAuth(app).getUserByEmail(email).catch(() => null)

if (!authUser) {
  console.error(
    `Nessun utente con email "${email}" trovato in Firebase Authentication.\n` +
      'Crealo prima da Authentication -> Users -> Add user.',
  )
  process.exit(1)
}

const userDocRef = getFirestore(app).collection('users').doc(authUser.uid)
const existing = await userDocRef.get()

await userDocRef.set({ uid: authUser.uid, username, email, role })

console.log(
  existing.exists
    ? `Profilo aggiornato per ${email} (uid: ${authUser.uid}).`
    : `Profilo creato per ${email} (uid: ${authUser.uid}).`,
)
console.log(`Precedente contenuto del documento: ${existing.exists ? JSON.stringify(existing.data()) : '(nessuno)'}`)
