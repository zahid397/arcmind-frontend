import { generateFakeAIResponse } from '@/utils/aiAlgorithm'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || null

export async function sendMessageToAI(message) {
  // ✅ If backend exists → use it
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      if (!res.ok) throw new Error('Backend error')

      const data = await res.json()
      return data.response
    } catch (err) {
      console.warn('Backend offline, fallback to local AI')
    }
  }

  // ✅ Fallback: Local AI (Demo mode)
  return generateFakeAIResponse('response', message)
}
