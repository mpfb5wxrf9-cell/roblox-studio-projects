import { motion } from 'framer-motion'
import { StatusBadge } from '../StatusBadge'
import { formatDateLong } from '../../lib/date'
import type { LessonRequest } from '../../types'

export function RequestCard({
  request,
  onOpen,
}: {
  request: LessonRequest
  onOpen: () => void
}) {
  return (
    <motion.button
      layout
      onClick={onOpen}
      className="flex w-full items-center justify-between border border-neutral-200 px-4 py-3.5 text-left transition-colors hover:border-black"
    >
      <div>
        <p className="text-sm font-medium capitalize text-black">
          {formatDateLong(request.requestedDate)}
        </p>
        <p className="mt-0.5 text-xs text-neutral-500">
          ore {request.requestedTime}
        </p>
      </div>
      <StatusBadge status={request.status} />
    </motion.button>
  )
}
