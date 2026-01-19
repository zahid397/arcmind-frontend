import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles, Zap, Code, Lightbulb, Book, MessageSquare, Cpu } from 'lucide-react'

const InputArea = ({ onSendMessage, isLoading, connectionStatus }) => {
  const [message, setMessage] = useState('')
  const [rows, setRows] = useState(1)
  const textareaRef = useRef(null)

  // Smart prompts based on context
  const smartPrompts = [
    { icon: Code, text: 'Explain AI to a beginner', category: 'tech' },
    { icon: Lightbulb, text: 'Write a creative story about space', category: 'creative' },
    { icon: Book, text: 'What is machine learning?', category: 'education' },
    { icon: Zap, text: 'How to write clean code?', category: 'tech' },
    { icon: MessageSquare, text: 'Tell me a programming joke', category: 'fun' },
    { icon: Sparkles, text: 'Future of technology in 2030', category: 'future' },
    { icon: Cpu, text: 'Build a simple JavaScript function', category: 'code' },
    { icon: Book, text: 'Explain blockchain simply', category: 'tech' },
  ]

  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 150)
      textarea.style.height = `${newHeight}px`
      setRows(newHeight > 40 ? 2 : 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
      setRows(1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handlePromptClick = (promptText) => {
    setMessage(promptText)
    textareaRef.current?.focus()
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative"
    >
      {/* Local AI Indicator */}
      <div className="mb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm">
          <Cpu className="w-3 h-3" />
          <span>💡 Powered by Local Intelligence • No API Required</span>
        </div>
      </div>

      {/* Smart Prompts */}
      <div className="flex flex-wrap gap-2 mb-3">
        {smartPrompts.map((prompt, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => handlePromptClick(prompt.text)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 text-xs rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 flex items-center gap-1.5 group"
          >
            <prompt.icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
            <span>{prompt.text.split(' ').slice(0, 3).join(' ')}...</span>
          </motion.button>
        ))}
      </div>

      {/* Input Container */}
      <div className="relative">
        {/* Glow Effect */}
        <motion.div
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-2xl"
        />
        
        <div className="relative glass border border-white/20 rounded-2xl overflow-hidden backdrop-blur-xl">
          {/* Top Bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-black/30">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Local AI Assistant</span>
            </div>
            <div className="flex-1" />
            <span className="text-xs text-gray-400 hidden sm:block">
              Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Shift+Enter</kbd> for new line
            </span>
          </div>

          {/* Main Input */}
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Textarea */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask ArcMind AI anything... (Powered by local intelligence)"
                  className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm md:text-base resize-none min-h-[40px] max-h-[150px] pr-10"
                  disabled={isLoading}
                  rows={rows}
                />
                
                {/* Character counter */}
                {message.length > 0 && (
                  <div className="absolute bottom-0 right-0 text-xs text-gray-500">
                    {message.length}/2000
                  </div>
                )}
              </div>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: message.trim() && !isLoading ? 1.1 : 1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={!message.trim() || isLoading}
                className={`self-end p-3 rounded-xl flex items-center justify-center transition-all duration-200 relative overflow-hidden ${
                  message.trim() && !isLoading
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 cursor-pointer shadow-lg'
                    : 'bg-white/10 cursor-not-allowed'
                }`}
              >
                {message.trim() && !isLoading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400"
                    animate={{ 
                      x: ['-100%', '100%']
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                )}
                <Send className={`w-4 h-4 relative z-10 ${message.trim() && !isLoading ? 'text-white' : 'text-gray-400'}`} />
              </motion.button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="px-4 py-2.5 border-t border-white/10 bg-black/30 flex items-center justify-between">
            <div className="text-xs text-gray-400">
              💡 All responses generated locally • Your data stays private
            </div>
            <div className="text-xs text-gray-400 hidden md:block">
              Powered by advanced logic • No internet required
            </div>
          </div>
        </div>
      </div>
    </motion.form>
  )
}

export default InputArea
