// src/app/components/chat/InputArea.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '../ui/Button'

interface InputAreaProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function InputArea({ onSendMessage, disabled }: InputAreaProps) {
  const [input, setInput] = useState('')
  const [rows, setRows] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const sendMessage = () => {
    if (!input.trim() || disabled) return
    onSendMessage(input)
    setInput('')
    setRows(1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    const lines = input.split('\n').length
    setRows(Math.min(Math.max(lines, 1), 4))
  }, [input])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        sendMessage()
      }}
      className="relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative bg-compost-950/80 border border-compost-700/50 rounded-xl backdrop-blur-sm p-3">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={rows}
              disabled={disabled}
              placeholder="Type your message… (Enter to send)"
              className="flex-1 resize-none bg-transparent outline-none text-sm md:text-base min-h-[48px] max-h-[120px] placeholder:text-muted-foreground/60"
            />

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                variant="neon"
                size="icon"
                disabled={!input.trim() || disabled}
                className="h-11 w-11"
              >
                <Send className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2 mt-3">
        {[
          'Explain quantum physics',
          'Write a poem',
          'Help me code',
          'Tell me a story',
        ].map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => setInput(text)}
            className="px-3 py-1.5 text-xs rounded-full bg-compost-900/50 border border-compost-700 hover:border-neon-cyan/50 transition"
          >
            {text}
          </button>
        ))}
      </div>
    </form>
  )
}
