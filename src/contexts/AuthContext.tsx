import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import type { AppUser } from '../types'

interface AuthContextValue {
  user: AppUser | null
  loading: boolean
  authError: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (!userDoc.exists()) {
          // Account exists in Firebase Auth but has no matching Firestore
          // profile — the owner needs to create the "users" document manually.
          await signOut(auth)
          setUser(null)
          setAuthError(
            'Account senza profilo associato. Contatta l\'agenzia per completare la configurazione.',
          )
          return
        }

        const data = userDoc.data()
        setUser({
          uid: firebaseUser.uid,
          username: data.username,
          email: data.email,
          role: data.role,
        })
        setAuthError(null)
      } catch {
        // Most commonly a Firestore permission-denied (rules not published
        // yet) — surfaced instead of leaving the app stuck loading forever.
        await signOut(auth).catch(() => {})
        setUser(null)
        setAuthError(
          'Impossibile verificare il profilo (controlla che le regole Firestore siano pubblicate).',
        )
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  async function login(email: string, password: string) {
    setAuthError(null)
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
