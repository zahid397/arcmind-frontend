// src/app/components/chat/ChatContainer.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { Message } from '@/app/types'
import InputArea from './InputArea'

// ✅ Clean and simple - NEXT_PUBLIC_ env vars are safe in client components
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://arcmind-27ed.onrender.com'

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hello! I'm ArcMind, your AI assistant. How can I help you today?",
    role: 'assistant',
    timestamp: new Date(),
  },
]

// Helper function for formatting time
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    })
  }

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
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: content,
          timestamp: new Date().toISOString()
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`API error: ${res.status} - ${errorText}`)
      }

      const data = await res.json()

      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        content: data.message || data.response || 'I received your message.',
        role: 'assistant',
        timestamp: new Date(),
      }

      setMessages((prev) =>
        prev
          .map((m) =>
            m.id === userMessage.id ? { ...m, status: 'sent' } : m
          )
          .concat(aiMessage)
      )
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      }
      
      setMessages((prev) =>
        prev
          .map((m) =>
            m.id === userMessage.id ? { ...m, status: 'error' } : m
          )
          .concat(errorMessage)
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
          <div className="relative">
            <Bot className="h-6 w-6 text-neon-cyan" />
            {isLoading && (
              <div className="absolute -top-1 -right-1">
                <Loader2 className="h-3 w-3 text-neon-cyan animate-spin" />
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold">ArcMind Assistant</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Powered by AI
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <Bot className="h-8 w-8 p-1.5 rounded-full bg-compost-800/50 text-neon-cyan flex-shrink-0" />
              )}

              <div
                className={cn(
                  'max-w-[75%] rounded-xl p-4 border',
                  msg.role === 'user'
                    ? 'bg-compost-900 border-compost-700 ml-auto'
                    : 'bg-background border-compost-800'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-2 text-xs text-muted-foreground flex justify-between items-center">
                  <span>{formatTime(msg.timestamp)}</span>
                  <div className="flex items-center gap-1">
                    {msg.status === 'sending' && (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    )}
                    {msg.status === 'error' && (
                      <span className="text-red-500 text-xs">Failed</span>
                    )}
                  </div>
                </div>
              </div>

              {msg.role === 'user' && (
                <User className="h-8 w-8 p-1.5 rounded-full bg-compost-800/50 text-neon-green flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-compost-800/50 bg-background/50 backdrop-blur-sm">
        {/* ✅ FIXED: Removed isLoading prop - Option A */}
        <InputArea 
          onSendMessage={handleSendMessage} 
          disabled={isLoading} 
        />
      </div>
    </div>
  )
}
