import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Send, Paperclip, Mic, Smile,
  Image, Code, Zap, WifiOff
} from 'lucide-react'

const MAX_CHARS = 2000

const InputArea = ({ onSendMessage, isLoading, connectionStatus }) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  const quickPrompts = [
    'Explain quantum computing',
    'Write a poem about AI',
    'Help me debug this code',
    'Plan a workout routine',
    'Translate this to Spanish',
    'Create a business plan',
    'Explain machine learning',
    'Write a short story'
  ]

  /* ---------- Auto resize ---------- */
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [message])

  /* ---------- Submit ---------- */
  const send = () => {
    if (!message.trim() || isLoading || connectionStatus !== 'connected') return
    onSendMessage(message.trim())
    setMessage('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const handlePrompt = (prompt) => {
    setMessage(prev =>
      prev ? `${prev}\n${prompt}` : prompt
    )
  }

  /* ---------- UI ---------- */
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Offline Warning */}
      {connectionStatus !== 'connected' && (
        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400 text-sm">
          <WifiOff className="w-3 h-3" />
          Offline mode – responses may be limited
        </div>
      )}

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-3">
        {quickPrompts.map((prompt, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => handlePrompt(prompt)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 text-xs rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5"
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            {prompt.split(' ').slice(0, 3).join(' ')}…
          </motion.button>
        ))}
      </div>

      {/* Input Box */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-2xl" />

        <div className="relative glass rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
            <button type="button" className="p-1.5 hover:bg-white/5 rounded">
              <Code className="w-4 h-4" />
            </button>
            <button type="button" className="p-1.5 hover:bg-white/5 rounded">
              <Image className="w-4 h-4" />
            </button>
            <div className="flex-1" />
            <span className="text-xs text-gray-400">
              Enter to send • Shift+Enter new line
            </span>
          </div>

          {/* Main Input */}
          <div className="p-4 flex gap-3">
            <div className="flex flex-col gap-2">
              <Paperclip className="w-4 h-4 text-gray-400" />
              <Smile className="w-4 h-4 text-gray-400" />
              <Mic className="w-4 h-4 text-gray-400" />
            </div>

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Message Arcmind AI…"
              className="flex-1 bg-transparent resize-none outline-none text-sm md:text-base min-h-[40px] max-h-[120px]"
            />

            <motion.button
              whileHover={{ scale: message.trim() ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!message.trim() || isLoading || connectionStatus !== 'connected'}
              className={`p-3 rounded-xl ${
                message.trim() && connectionStatus === 'connected'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : 'bg-white/10 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/10 flex justify-between text-xs text-gray-400">
            <span>AI may make mistakes. Verify critical info.</span>
            <span>{message.length}/{MAX_CHARS}</span>
          </div>
        </div>
      </div>
    </motion.form>
  )
}

export default InputArea
