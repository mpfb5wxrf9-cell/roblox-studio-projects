import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { ChatMessage, LessonRequest, RequestStatus } from '../types'

const requestsCol = collection(db, 'lessonRequests')

function messagesCol(requestId: string) {
  return collection(db, 'lessonRequests', requestId, 'messages')
}

// --- Lesson requests ---------------------------------------------------

export function subscribeToAllRequests(
  onChange: (requests: LessonRequest[]) => void,
) {
  const q = query(requestsCol, orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as LessonRequest))
  })
}

export function subscribeToUserRequests(
  userId: string,
  onChange: (requests: LessonRequest[]) => void,
) {
  const q = query(
    requestsCol,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as LessonRequest))
  })
}

export async function createLessonRequest(input: {
  userId: string
  username: string
  requestedDate: string
  requestedTime: string
  initialMessage: string
}) {
  const docRef = await addDoc(requestsCol, {
    ...input,
    status: 'pending' satisfies RequestStatus,
    createdAt: Date.now(),
  })

  // The request's chat thread is just its messages subcollection — creating
  // the first message is what makes the thread visible in the UI.
  if (input.initialMessage.trim()) {
    await addDoc(messagesCol(docRef.id), {
      senderId: input.userId,
      senderUsername: input.username,
      text: input.initialMessage.trim(),
      timestamp: Date.now(),
    })
  }

  return docRef.id
}

export async function setRequestStatus(requestId: string, status: RequestStatus) {
  await updateDoc(doc(db, 'lessonRequests', requestId), { status })
}

export async function cancelPendingRequest(requestId: string) {
  // Firestore doesn't cascade-delete subcollections, so the messages have
  // to be removed explicitly before the request document itself.
  const messagesSnap = await getDocs(messagesCol(requestId))
  const batch = writeBatch(db)
  messagesSnap.docs.forEach((d) => batch.delete(d.ref))
  await batch.commit()
  await deleteDoc(doc(db, 'lessonRequests', requestId))
}

// --- Chat messages -------------------------------------------------------

export function subscribeToMessages(
  requestId: string,
  onChange: (messages: ChatMessage[]) => void,
) {
  const q = query(messagesCol(requestId), orderBy('timestamp', 'asc'))
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatMessage))
  })
}

export async function sendMessage(
  requestId: string,
  sender: { id: string; username: string },
  text: string,
) {
  const trimmed = text.trim()
  if (!trimmed) return
  await addDoc(messagesCol(requestId), {
    senderId: sender.id,
    senderUsername: sender.username,
    text: trimmed,
    timestamp: Date.now(),
  })
}
