import { useEffect, useState } from 'react'
import { Header } from '../components/layout/Header'
import { PageTransition } from '../components/layout/PageTransition'
import { SlideOver } from '../components/layout/SlideOver'
import { RequestForm } from '../components/user/RequestForm'
import { RequestCard } from '../components/user/RequestCard'
import { UserRequestDetail } from '../components/user/UserRequestDetail'
import { subscribeToUserRequests } from '../lib/firestore'
import { useAuth } from '../contexts/AuthContext'
import type { LessonRequest } from '../types'

export function UserDashboardPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<LessonRequest[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    return subscribeToUserRequests(user.uid, setRequests)
  }, [user])

  const selected = requests.find((r) => r.id === selectedId) ?? null

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header />

        <main className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-black">Le mie richieste</h1>
            <button
              onClick={() => setFormOpen(true)}
              className="bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Richiedi una lezione
            </button>
          </div>

          {requests.length === 0 ? (
            <p className="border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-400">
              Non hai ancora richiesto nessuna lezione.
            </p>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <RequestCard key={r.id} request={r} onOpen={() => setSelectedId(r.id)} />
              ))}
            </div>
          )}
        </main>

        <SlideOver open={formOpen} onClose={() => setFormOpen(false)} title="Richiedi una lezione">
          <RequestForm onDone={() => setFormOpen(false)} />
        </SlideOver>

        <SlideOver
          open={!!selected}
          onClose={() => setSelectedId(null)}
          title="Dettaglio richiesta"
        >
          {selected && (
            <UserRequestDetail request={selected} onCancelled={() => setSelectedId(null)} />
          )}
        </SlideOver>
      </div>
    </PageTransition>
  )
}
