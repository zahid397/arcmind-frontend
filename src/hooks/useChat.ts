import { useState } from 'react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  transaction?: {
    hash: string
    amount: number
    status: 'pending' | 'confirmed' | 'failed'
  }
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m ArcMind, your autonomous commerce agent. I can help you find deals, make purchases, and manage your on-chain treasury. What would you like me to do?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `I've found 3 deals matching "${content}". Best option: RTX 4080 for $799 (22% below market). Should I proceed with purchase using 799 USDC from treasury?`,
      role: 'assistant',
      timestamp: new Date(),
      transaction: {
        hash: '0x' + Math.random().toString(16).slice(2, 42),
        amount: 799,
        status: 'confirmed'
      }
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)
  }

  return {
    messages,
    isLoading,
    sendMessage,
  }
}
