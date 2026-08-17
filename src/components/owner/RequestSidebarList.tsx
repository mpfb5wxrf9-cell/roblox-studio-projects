import { useMemo, useState } from 'react'
import { StatusBadge } from '../StatusBadge'
import { formatDateLong } from '../../lib/date'
import type { LessonRequest, RequestStatus } from '../../types'

const FILTERS: { value: RequestStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tutte' },
  { value: 'pending', label: 'In attesa' },
  { value: 'accepted', label: 'Confermate' },
  { value: 'rejected', label: 'Rifiutate' },
]

export function RequestSidebarList({
  requests,
  selectedId,
  onSelect,
}: {
  requests: LessonRequest[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all')

  const filtered = useMemo(() => {
    const list = filter === 'all' ? requests : requests.filter((r) => r.status === filter)
    return [...list].sort((a, b) => {
      if (a.status !== b.status) {
        const order: RequestStatus[] = ['pending', 'accepted', 'rejected']
        return order.indexOf(a.status) - order.indexOf(b.status)
      }
      return `${b.requestedDate}T${b.requestedTime}`.localeCompare(
        `${a.requestedDate}T${a.requestedTime}`,
      )
    })
  }, [requests, filter])

  return (
    <aside className="flex h-full flex-col border-r border-neutral-200">
      <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 p-3">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`whitespace-nowrap px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === f.value
                ? 'bg-black text-white'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="p-4 text-center text-xs text-neutral-400">
            Nessuna richiesta.
          </p>
        )}
        {filtered.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className={`block w-full border-b border-neutral-100 px-4 py-3 text-left transition-colors hover:bg-neutral-50 ${
              selectedId === r.id ? 'bg-neutral-50' : ''
            }`}
          >
            <p className="text-sm font-medium text-black">{r.username}</p>
            <p className="mt-0.5 text-xs capitalize text-neutral-500">
              {formatDateLong(r.requestedDate)} · {r.requestedTime}
            </p>
            <div className="mt-1.5">
              <StatusBadge status={r.status} />
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
