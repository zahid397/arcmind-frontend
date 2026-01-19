import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles, Zap, Code, Lightbulb } from 'lucide-react'

const InputArea = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  const prompts = [
    { icon: Code, text: 'Explain AI concepts' },
    { icon: Lightbulb, text: 'Write creative story' },
    { icon: Zap, text: 'Code review tips' },
    { icon: Sparkles, text: 'Future tech trends' },
  ]

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative"
    >
      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-3">
        {prompts.map((prompt, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => setMessage(prompt.text)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 text-xs rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5"
          >
            <prompt.icon className="w-3 h-3" />
            {prompt.text}
          </motion.button>
        ))}
      </div>

      {/* Input Container */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-2xl" />
        
        <div className="relative glass rounded-2xl overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message ArcMind AI..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 resize-none min-h-[60px] max-h-[200px]"
                disabled={isLoading}
                rows={1}
              />
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={!message.trim() || isLoading}
                className={`p-3 rounded-xl flex items-center justify-center ${
                  message.trim() && !isLoading
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                    : 'bg-white/10 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          <div className="px-4 py-2 border-t border-white/10 text-xs text-gray-400">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </motion.form>
  )
}

export default InputArea
