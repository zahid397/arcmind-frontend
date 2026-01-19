import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputArea from './InputArea'
import { Bot, User, Clock, Sparkles, Copy, ThumbsUp, ThumbsDown, Download, Share2, Wifi, WifiOff } from 'lucide-react'

const ChatContainer = ({ messages, onSendMessage, isLoading, connectionStatus }) => {
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)
  const [typingText, setTypingText] = useState('Typing...')

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (isLoading) {
      const texts = [
        "Thinking...",
        "Processing your query...",
        "Analyzing context...",
        "Generating response...",
        "Almost there..."
      ]
      let index = 0
      
      const interval = setInterval(() => {
        setTypingText(texts[index])
        index = (index + 1) % texts.length
      }, 2000)

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
      // Show temporary success message
      const button = document.activeElement
      const originalHTML = button.innerHTML
      button.innerHTML = '✓ Copied!'
      setTimeout(() => {
        button.innerHTML = originalHTML
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return 'Just now'
    }
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 px-4"
      >
        <div className="p-4 rounded-2xl glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-lg">ArcMind AI Assistant</h2>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-400">Intelligent conversations</p>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                    connectionStatus === 'connected' 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {connectionStatus === 'connected' ? (
                      <Wifi className="w-3 h-3" />
                    ) : (
                      <WifiOff className="w-3 h-3" />
                    )}
                    <span>{connectionStatus === 'connected' ? 'Online' : 'Offline'}</span>
                  </div>
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
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start a Conversation</h3>
              <p className="text-gray-400 mb-6">
                Ask me anything! I can help with questions, creative tasks, coding, and more.
              </p>
              {connectionStatus !== 'connected' && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 text-sm mb-4">
                  <span>⚠️ Working in enhanced offline mode</span>
                </div>
              )}
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
                exit={{ opacity: 0, x: message.role === 'user' ? 100 : -100 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/20'
                      : 'glass'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {message.role === 'user' ? (
                          <User className="w-3 h-3 text-blue-400" />
                        ) : (
                          <Bot className="w-3 h-3 text-cyan-400" />
                        )}
                        <span className="text-sm font-medium">
                          {message.role === 'user' ? 'You' : 'ArcMind AI'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    
                    <p className="text-gray-100 whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                      {message.content}
                    </p>

                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-white/10">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="p-1.5 rounded hover:bg-white/5 transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-white/5 transition-colors"
                          title="Like"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-white/5 transition-colors"
                          title="Dislike"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
              </div>
              <div className="p-4 rounded-2xl glass max-w-[75%]">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-gray-400">{typingText}</span>
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
