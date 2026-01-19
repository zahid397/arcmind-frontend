'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputArea from './InputArea'
import { Bot, User, Clock, Sparkles } from 'lucide-react'

export default function ChatContainer({ messages, onSendMessage, isLoading }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 backdrop-blur-sm"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">Arcmind AI Assistant</h2>
          <p className="text-sm text-gray-400">Ready to help</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-cyan-400">
          <Sparkles className="w-4 h-4 animate-pulse" />
          Online
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 p-2">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div className="max-w-2xl">
                <div
                  className={`p-4 rounded-2xl backdrop-blur-sm border ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/20'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                    {message.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    <span>{message.role === 'user' ? 'You' : 'Arcmind AI'}</span>
                    <span className="flex items-center gap-1 ml-auto">
                      <Clock size={12} />
                      {formatTime(message.timestamp)}
                    </span>
                  </div>

                  <p className="text-gray-100 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing */}
        {isLoading && (
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
              <span
                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ✅ FIXED: correct prop */}
      <InputArea onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  )
}
