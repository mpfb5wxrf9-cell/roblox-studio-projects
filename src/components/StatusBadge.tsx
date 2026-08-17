import type { RequestStatus } from '../types'

const LABEL: Record<RequestStatus, string> = {
  pending: 'In attesa',
  accepted: 'Confermata',
  rejected: 'Rifiutata',
}

// Monochrome-only status language: dashed border = pending, solid border =
// confirmed, faded + strikethrough = rejected. No filled colors, per spec.
const STYLE: Record<RequestStatus, string> = {
  pending: 'border border-dashed border-neutral-400 text-neutral-600',
  accepted: 'border border-black text-black',
  rejected: 'border border-neutral-300 text-neutral-400 line-through',
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-medium ${STYLE[status]}`}
    >
      {LABEL[status]}
    </span>
  )
}
