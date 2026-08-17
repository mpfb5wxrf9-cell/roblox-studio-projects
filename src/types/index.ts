export type UserRole = 'user' | 'owner'

export interface AppUser {
  uid: string
  username: string
  email: string
  role: UserRole
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected'

export interface LessonRequest {
  id: string
  userId: string
  username: string
  requestedDate: string // 'YYYY-MM-DD'
  requestedTime: string // 'HH:mm'
  initialMessage: string
  status: RequestStatus
  createdAt: number // Date.now() at creation time, used for sorting
}

export interface ChatMessage {
  id: string
  senderId: string
  senderUsername: string
  text: string
  timestamp: number
}
