import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputArea from './InputArea'
import { Bot, User, Clock, Sparkles, Copy, ThumbsUp, ThumbsDown, Download, Cpu, Zap, Brain } from 'lucide-react'

const ChatContainer = ({ messages, onSendMessage, isLoading, connectionStatus }) => {
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)
  const [typingText, setTypingText] = useState('Processing...')

  // Typing indicators
  const typingIndicators = [
    "Analyzing your query...",
    "Processing with local AI...",
    "Generating smart response...",
    "Crafting detailed answer...",
    "Applying neural logic...",
    "Finalizing response..."
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (isLoading) {
      let index = 0
      const interval = setInterval(() => {
        setTypingText(typingIndicators[index])
        index = (index + 1) % typingIndicators.length
      }, 1800)

      return () => clearInterval(interval)
    } else {
      setTypingText('')
    }
  }, [isLoading])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // Show temporary success
      const button = event?.target
      if (button) {
        const original = button.innerHTML
        button.innerHTML = '<svg class="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>'
        setTimeout(() => {
          button.innerHTML = original
        }, 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return 'Now'
    }
  }

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'ArcMind AI'} (${formatTime(msg.timestamp)}):\n${msg.content}\n${'-'.repeat(50)}`
    ).join('\n\n')
    
    const blob = new Blob([`ArcMind AI Conversation\n${'='.repeat(30)}\n\n${chatText}`], { 
      type: 'text/plain;charset=utf-8' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `arcmind-chat-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      {/* Enhanced Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 px-4"
      >
        <div className="p-4 rounded-2xl glass border border-white/20 relative overflow-hidden">
          {/* Animated background */}
          <motion.div
            className="absolute inset-0"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))',
              backgroundSize: '300% 300%'
            }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-1 border-2 border-transparent border-t-cyan-400 border-r-blue-400 rounded-xl"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-xl bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    ArcMind AI Assistant
                  </h2>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400">Powered by Local Intelligence</p>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">
                      <Zap className="w-3 h-3" />
                      <span>Local</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={exportChat}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors group"
                  title="Export conversation"
                >
                  <Download className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                </button>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm">
                  <Cpu className="w-3 h-3" />
                  <span>No API Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto mb-4 px-4 custom-scrollbar"
      >
        {messages.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-cyan-400" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Start an Intelligent Conversation</h3>
              <p className="text-gray-400 mb-6">
                Ask anything! I can help with questions, creative tasks, coding problems, and more.
                All responses are generated locally using advanced logic.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm mb-4">
                <Zap className="w-4 h-4" />
                <span>✓ 100% Local • Private & Secure</span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-4 pb-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center relative">
                      <Bot className="w-5 h-5" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Cpu className="w-2 h-2" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className={`max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'order-first' : ''}`}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 rounded-2xl relative overflow-hidden ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                        : 'glass border border-white/20'
                    }`}
                  >
                    {/* Message background glow */}
                    {message.role === 'assistant' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />
                    )}
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {message.role === 'user' ? (
                            <>
                              <User className="w-4 h-4 text-blue-400" />
                              <span className="font-semibold text-blue-300">You</span>
                            </>
                          ) : (
                            <>
                              <Bot className="w-4 h-4 text-cyan-400" />
                              <span className="font-semibold text-cyan-300">ArcMind AI</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                      
                      <pre className="text-gray-100 whitespace-pre-wrap text-sm md:text-base leading-relaxed font-sans">
                        {message.content}
                      </pre>

                      {/* Message Actions */}
                      <div className="flex items-center gap-1 mt-4 pt-3 border-t border-white/10">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                          title="Like response"
                        >
                          <ThumbsUp className="w-4 h-4 group-hover:text-green-400 transition-colors" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                          title="Improve response"
                        >
                          <ThumbsDown className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {message.role === 'user' && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <div className="p-4 rounded-2xl glass border border-white/20 max-w-[75%]">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-gray-400">{typingText}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Using local AI intelligence • No internet required
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4">
        <InputArea 
          onSendMessage={onSendMessage} 
          isLoading={isLoading}
          connectionStatus={connectionStatus}
        />
      </div>
    </div>
  )
}

export default ChatContainer
