import { useState, type FormEvent } from 'react'
import { createLessonRequest } from '../../lib/firestore'
import { useAuth } from '../../contexts/AuthContext'

export function RequestForm({ onDone }: { onDone: () => void }) {
  const { user } = useAuth()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const todayISO = new Date().toISOString().slice(0, 10)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !date || !time) return
    setSubmitting(true)
    try {
      await createLessonRequest({
        userId: user.uid,
        username: user.username,
        requestedDate: date,
        requestedTime: time,
        initialMessage: message,
      })
      onDone()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
            Giorno
          </label>
          <input
            type="date"
            required
            min={todayISO}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
            Ora
          </label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
          Messaggio (opzionale)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Es. Vorrei una lezione introduttiva su scripting Lua…"
          className="w-full resize-none border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? 'Invio…' : 'Invia richiesta'}
      </button>
    </form>
  )
}
