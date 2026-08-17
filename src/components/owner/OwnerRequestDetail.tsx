import { useState } from 'react'
import { ChatThread } from '../chat/ChatThread'
import { StatusBadge } from '../StatusBadge'
import { formatDateLong } from '../../lib/date'
import { setRequestStatus } from '../../lib/firestore'
import type { LessonRequest } from '../../types'

export function OwnerRequestDetail({ request }: { request: LessonRequest }) {
  const [updating, setUpdating] = useState<'accepted' | 'rejected' | null>(null)

  async function handleDecision(status: 'accepted' | 'rejected') {
    setUpdating(status)
    try {
      await setRequestStatus(request.id, status)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <p className="text-sm font-medium text-black">{request.username}</p>
        <p className="mt-0.5 text-xs capitalize text-neutral-500">
          {formatDateLong(request.requestedDate)} · ore {request.requestedTime}
        </p>
        <div className="mt-2">
          <StatusBadge status={request.status} />
        </div>
      </div>

      {request.status === 'pending' && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => handleDecision('accepted')}
            disabled={updating !== null}
            className="flex-1 bg-black py-2 text-xs font-medium uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {updating === 'accepted' ? 'Conferma…' : 'Accetta'}
          </button>
          <button
            onClick={() => handleDecision('rejected')}
            disabled={updating !== null}
            className="flex-1 border border-neutral-300 py-2 text-xs font-medium uppercase tracking-wide text-neutral-600 transition-colors hover:border-black hover:text-black disabled:opacity-50"
          >
            {updating === 'rejected' ? 'Rifiuto…' : 'Rifiuta'}
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1">
        <ChatThread requestId={request.id} status={request.status} />
      </div>
    </div>
  )
}
