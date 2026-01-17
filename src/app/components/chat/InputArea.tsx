
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Paperclip, Mic, Smile } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { Button } from '../ui/Button'

interface InputAreaProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function InputArea({ onSendMessage, disabled }: InputAreaProps) {
  const [input, setInput] = useState('')
  const [rows, setRows] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSendMessage(input)
      setInput('')
      setRows(1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      const lines = input.split('\n').length
      setRows(Math.min(Math.max(lines, 1), 4))
    }
  }, [input])

  return (
    <form onSubmit={handleSubmit} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Background glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 via-neon-green/20 to-neon-blue/20 rounded-2xl blur-lg opacity-50" />

        <div className="relative bg-compost-950/80 border border-compost-700/50 rounded-2xl backdrop-blur-sm">
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-neon-cyan/20"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-neon-green/20"
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-neon-pink/20"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={rows}
                placeholder="Type your message here... (Shift+Enter for new line)"
                disabled={disabled}
                className="flex-1 bg-transparent resize-none outline-none placeholder:text-muted-foreground/50 text-sm md:text-base min-h-[60px] max-h-[120px] py-2"
              />

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  size="icon"
                  variant="neon"
                  disabled={!input.trim() || disabled}
                  className="h-12 w-12 self-end"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap gap-2 mt-3"
      >
        {['Explain quantum physics', 'Write a poem', 'Help me code', 'Tell me a story'].map((suggestion, i) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            type="button"
            onClick={() => setInput(suggestion)}
            className="px-3 py-1.5 text-xs rounded-full bg-compost-900/50 border border-compost-700 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-colors"
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </form>
  )
}
