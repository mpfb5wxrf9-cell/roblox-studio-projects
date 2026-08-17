import { useEffect, useState } from 'react'
import { Header } from '../components/layout/Header'
import { PageTransition } from '../components/layout/PageTransition'
import { SlideOver } from '../components/layout/SlideOver'
import { OwnerCalendar } from '../components/owner/OwnerCalendar'
import { RequestSidebarList } from '../components/owner/RequestSidebarList'
import { OwnerRequestDetail } from '../components/owner/OwnerRequestDetail'
import { subscribeToAllRequests } from '../lib/firestore'
import type { LessonRequest } from '../types'

export function OwnerDashboardPage() {
  const [requests, setRequests] = useState<LessonRequest[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => subscribeToAllRequests(setRequests), [])

  const selected = requests.find((r) => r.id === selectedId) ?? null

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-white">
        <Header />

        <main className="grid flex-1 grid-cols-1 md:grid-cols-[280px_1fr]">
          <RequestSidebarList
            requests={requests}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div className="p-6">
            <OwnerCalendar requests={requests} onSelect={setSelectedId} />
          </div>
        </main>

        <SlideOver
          open={!!selected}
          onClose={() => setSelectedId(null)}
          title="Richiesta lezione"
        >
          {selected && <OwnerRequestDetail request={selected} />}
        </SlideOver>
      </div>
    </PageTransition>
  )
}
