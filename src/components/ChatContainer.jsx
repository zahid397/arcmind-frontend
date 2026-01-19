import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputArea from './InputArea'
import {
  Bot, User, Clock, Sparkles,
  Copy, ThumbsUp, ThumbsDown,
  Download, Share2
} from 'lucide-react'

const ChatContainer = ({ messages, onSendMessage, isLoading, connectionStatus }) => {
  const messagesEndRef = useRef(null)
  const typingIntervalRef = useRef(null)
  const [typingText, setTypingText] = useState('')

  /* ---------- Auto scroll (only on message add) ---------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  /* ---------- Typing indicator ---------- */
  useEffect(() => {
    if (!isLoading) {
      setTypingText('')
      clearInterval(typingIntervalRef.current)
      return
    }

    const texts = [
      'Processing your query…',
      'Analyzing context…',
      'Generating response…',
      'Finalizing thoughts…',
    ]

    let index = 0
    setTypingText(texts[0])

    typingIntervalRef.current = setInterval(() => {
      index = (index + 1) % texts.length
      setTypingText(texts[index])
    }, 1800)

    return () => clearInterval(typingIntervalRef.current)
  }, [isLoading])

  /* ---------- Helpers ---------- */
  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const exportChat = () => {
    if (!messages.length) return
    const chat = messages
      .map(m => `${m.role === 'user' ? 'You' : 'Arcmind AI'}: ${m.content}`)
      .join('\n\n')

    const blob = new Blob([chat], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `arcmind-chat-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* ---------- UI ---------- */
  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 px-4">
        <div className="p-4 rounded-2xl glass flex justify-between">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold">Arcmind AI Assistant</h2>
              <p className="text-sm text-gray-400">Intelligent conversations</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={exportChat} className="p-2 hover:bg-white/5 rounded-lg">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => window.print()} className="p-2 hover:bg-white/5 rounded-lg">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 custom-scrollbar">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={`${m.id}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: m.role === 'user' ? 80 : -80 }}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="max-w-[75%]">
                <div className={`p-4 rounded-2xl ${m.role === 'user' ? 'bg-blue-500/20' : 'glass'}`}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{m.role === 'user' ? 'You' : 'Arcmind AI'}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatTime(m.timestamp)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>

                  {m.role === 'assistant' && (
                    <div className="flex gap-1 mt-2 pt-2 border-t border-white/10">
                      <button onClick={() => copyToClipboard(m.content)} className="p-1 hover:bg-white/5 rounded">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 hover:bg-white/5 rounded">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 hover:bg-white/5 rounded">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass p-4 rounded-2xl text-sm text-gray-400">
              {typingText}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <InputArea onSendMessage={onSendMessage} isLoading={isLoading} connectionStatus={connectionStatus} />
      </div>
    </div>
  )
}

export default ChatContainer
