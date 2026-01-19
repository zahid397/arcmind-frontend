'use client'

import { useState } from 'react'
import InputArea from './InputArea'

export default function ChatContainer() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Arcmind AI.' }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const onSendMessage = async (text) => {
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsLoading(true)

    try {
      const res = await fetch('https://arcmind-27ed.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.response || 'OK' }
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Error occurred.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <p className="inline-block px-4 py-2 rounded bg-white/10">
              {m.content}
            </p>
          </div>
        ))}
      </div>

      <InputArea onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  )
}
