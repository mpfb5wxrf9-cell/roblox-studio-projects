// Every lesson request is assumed to occupy this many minutes on the
// owner's calendar. There's no per-lesson duration field in the data model,
// so a fixed slot keeps the calendar view readable and consistent.
export const LESSON_DURATION_MINUTES = 60

export function toStartDate(requestedDate: string, requestedTime: string): Date {
  return new Date(`${requestedDate}T${requestedTime}:00`)
}

export function toEndDate(requestedDate: string, requestedTime: string): Date {
  const start = toStartDate(requestedDate, requestedTime)
  return new Date(start.getTime() + LESSON_DURATION_MINUTES * 60_000)
}

export function formatDateLong(requestedDate: string): string {
  return toStartDate(requestedDate, '00:00').toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
