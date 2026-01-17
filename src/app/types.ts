export type MessageStatus = 'sending' | 'sent' | 'error'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  status?: MessageStatus
}
