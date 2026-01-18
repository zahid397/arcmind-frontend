// src/app/types.ts

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string // ✅ MUST be string for Next.js build
  status?: 'sending' | 'sent' | 'error'
}
