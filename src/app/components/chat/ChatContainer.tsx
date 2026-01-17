// src/app/components/chat/ChatContainer.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { cn, formatTime } from '@/app/lib/utils'
import { Message } from '@/app/types'
import InputArea from './InputArea'

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://arcmind-27ed.onrender.com'

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hello! I'm ArcMind, your AI assistant. How can I help you today?",
    role: 'assistant',
    timestamp: new Date(),
  },
]

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      status: 'sending',
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })

      if (!res.ok) throw new Error('API error')

      const data = await res.json()

      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        content: data.message || 'Response received.',
        role: 'assistant',
        timestamp: new Date(),
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id ? { ...m, status: 'sent' } : m
        ).concat(aiMessage)
      )
    } catch (e) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id ? { ...m, status: 'error' } : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-4 border-b border-compost-800/50">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-neon-cyan" />
          <div>
            <h2 className="font-semibold">ArcMind Assistant</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Powered by AI
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && <Bot className="h-4 w-4 text-neon-cyan" />}

              <div
                className={cn(
                  'max-w-[75%] rounded-xl p-3 border',
                  msg.role === 'user'
                    ? 'bg-compost-900 border-compost-700'
                    : 'bg-background border-compost-800'
                )}
              >
                <p className="text-sm">{msg.content}</p>
                <div className="mt-1 text-xs text-muted-foreground flex justify-between">
                  <span>{formatTime(msg.timestamp)}</span>
                  {msg.status === 'sending' && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}
                  {msg.status === 'error' && (
                    <span className="text-red-500">Failed</span>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <User className="h-4 w-4 text-neon-green" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-compost-800/50">
        <InputArea onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
