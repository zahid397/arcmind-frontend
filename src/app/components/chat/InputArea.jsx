'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Paperclip, Mic, Smile } from 'lucide-react'

export default function InputArea({
  onSendMessage,
  disabled = false,
  isLoading = false,
}) {
  const [message, setMessage] = useState('')
  const isDisabled = disabled || isLoading

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim() || isDisabled) return

    onSendMessage(message.trim())
    setMessage('')
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="sticky bottom-0"
    >
      <div className="relative">
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-2xl" />

        <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
          <div className="flex items-center gap-2 p-2">
            <button
              type="button"
              disabled={isDisabled}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition disabled:opacity-40"
            >
              <Paperclip className="w-5 h-5 text-gray-400" />
            </button>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message Arcmind AI..."
              disabled={isDisabled}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-lg py-3 px-4 disabled:opacity-50"
            />

            <button
              type="button"
              disabled={isDisabled}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition disabled:opacity-40"
            >
              <Smile className="w-5 h-5 text-gray-400" />
            </button>

            <button
              type="button"
              disabled={isDisabled}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition disabled:opacity-40"
            >
              <Mic className="w-5 h-5 text-gray-400" />
            </button>

            <motion.button
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              type="submit"
              disabled={!message.trim() || isDisabled}
              className={`p-4 rounded-xl transition-all ${
                message.trim() && !isDisabled
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : 'bg-white/10 opacity-40'
              }`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Suggestions */}
          <div className="flex gap-2 px-4 pb-2 flex-wrap">
            {[
              'Explain quantum computing',
              'Write a poem about AI',
              'Help me debug this code',
              'Plan a workout routine',
            ].map((text) => (
              <button
                key={text}
                type="button"
                disabled={isDisabled}
                onClick={() => setMessage(text)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition disabled:opacity-40"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.form>
  )
}
