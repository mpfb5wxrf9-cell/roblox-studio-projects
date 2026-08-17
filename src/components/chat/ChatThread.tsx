import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { sendMessage, subscribeToMessages } from '../../lib/firestore'
import { formatTimestamp } from '../../lib/date'
import { useAuth } from '../../contexts/AuthContext'
import type { ChatMessage, RequestStatus } from '../../types'

export function ChatThread({
  requestId,
  status,
}: {
  requestId: string
  status: RequestStatus
}) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const isOpen = status === 'pending'

  useEffect(() => {
    return subscribeToMessages(requestId, setMessages)
  }, [requestId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !text.trim()) return
    setSending(true)
    try {
      await sendMessage(requestId, { id: user.uid, username: user.username }, text)
      setText('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-full flex-col border border-neutral-200">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Chat richiesta
        </span>
        <span className="text-xs text-neutral-400">
          {isOpen ? 'Attiva' : 'Chiusa · sola lettura'}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="text-center text-xs text-neutral-400">
            Nessun messaggio ancora.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.senderId === user?.uid
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 text-sm ${
                  mine
                    ? 'bg-black text-white'
                    : 'border border-neutral-300 bg-white text-black'
                }`}
              >
                {m.text}
              </div>
              <span className="mt-1 text-[10px] text-neutral-400">
                {mine ? 'Tu' : m.senderUsername} · {formatTimestamp(m.timestamp)}
              </span>
            </motion.div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {isOpen ? (
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-neutral-200 p-3"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Scrivi un messaggio…"
            className="flex-1 border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Invia
          </button>
        </form>
      ) : (
        <div className="border-t border-neutral-200 p-3 text-center text-xs text-neutral-400">
          La chat è archiviata: la richiesta è stata{' '}
          {status === 'accepted' ? 'confermata' : 'rifiutata'}.
        </div>
      )}
    </div>
  )
}
