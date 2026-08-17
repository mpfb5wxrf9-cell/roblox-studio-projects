import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { PageTransition } from '../components/layout/PageTransition'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const { user, loading, login, authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to={user.role === 'owner' ? '/owner' : '/dashboard'} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
    } catch {
      setError('Email o password non corrette.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <Logo className="text-2xl" />
            <p className="mt-3 text-sm text-neutral-500">
              Accedi per prenotare o gestire le tue lezioni.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-neutral-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition-colors focus:border-black"
                placeholder="nome@esempio.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-neutral-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition-colors focus:border-black"
                placeholder="••••••••"
              />
            </div>

            {(error || authError) && (
              <p className="text-sm text-neutral-700">{error ?? authError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Accesso in corso…' : 'Accedi'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-neutral-400">
            Non hai un account? Gli account vengono creati dall&apos;agenzia —
            contattaci per ricevere le tue credenziali.
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
