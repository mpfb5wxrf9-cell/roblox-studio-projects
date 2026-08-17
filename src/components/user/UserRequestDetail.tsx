import { useState } from 'react'
import { ChatThread } from '../chat/ChatThread'
import { StatusBadge } from '../StatusBadge'
import { formatDateLong } from '../../lib/date'
import { cancelPendingRequest } from '../../lib/firestore'
import type { LessonRequest } from '../../types'

export function UserRequestDetail({
  request,
  onCancelled,
}: {
  request: LessonRequest
  onCancelled: () => void
}) {
  const [cancelling, setCancelling] = useState(false)

  async function handleCancel() {
    setCancelling(true)
    try {
      await cancelPendingRequest(request.id)
      onCancelled()
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <p className="text-sm font-medium capitalize text-black">
          {formatDateLong(request.requestedDate)}
        </p>
        <p className="mt-0.5 text-xs text-neutral-500">
          ore {request.requestedTime}
        </p>
        <div className="mt-2">
          <StatusBadge status={request.status} />
        </div>
      </div>

      {request.status === 'pending' && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="mb-4 border border-neutral-300 py-2 text-xs font-medium uppercase tracking-wide text-neutral-600 transition-colors hover:border-black hover:text-black disabled:opacity-50"
        >
          {cancelling ? 'Annullamento…' : 'Annulla richiesta'}
        </button>
      )}

      <div className="min-h-0 flex-1">
        <ChatThread requestId={request.id} status={request.status} />
      </div>
    </div>
  )
}
