import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Zap, Loader2, X, Sparkles } from 'lucide-react'
import WelcomeScreen from './components/WelcomeScreen'
import ChatContainer from './components/ChatContainer'
import { generateFakeAIResponse } from './utils/aiAlgorithm'
import { cn } from './utils/cn'

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [showToast, setShowToast] = useState(true)
  const [chatHistory, setChatHistory] = useState([])

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 800)
    return () => clearTimeout(timer)
  }, [])

  // Auto-hide toast
  useEffect(() => {
    if (!hasStarted) return
    const timer = setTimeout(() => setShowToast(false), 5000)
    return () => clearTimeout(timer)
  }, [hasStarted])

  const handleStartChat = useCallback(() => {
    setIsLoading(true)
    
    // Simulate AI initialization
    setTimeout(() => {
      // Generate initial AI greeting
      const initialGreeting = generateFakeAIResponse('greeting', '')
      
      setChatHistory([{
        id: '1',
        content: initialGreeting,
        role: 'assistant',
        timestamp: new Date(),
        type: 'greeting'
      }])
      
      setHasStarted(true)
      setIsLoading(false)
    }, 1200)
  }, [])

  const handleSendMessage = useCallback(async (message) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    }
    
    setChatHistory(prev => [...prev, userMessage])
    
    // Simulate AI thinking
    setIsLoading(true)
    
    setTimeout(() => {
      // Generate AI response using algorithm
      const aiResponse = generateFakeAIResponse('response', message)
      
      const aiMessage = {
        id: `${Date.now()}-ai`,
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      }
      
      setChatHistory(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500 + Math.random() * 1000)
  }, [])

  const handleReset = useCallback(() => {
    setHasStarted(false)
    setShowToast(true)
    setChatHistory([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 to-black">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Brain className="h-20 w-20 text-neon-cyan" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <p className="text-lg font-semibold text-neon-green">ArcMind AI</p>
            <p className="text-sm text-gray-400 mt-1">Initializing neural network...</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Animated background particles */}
      <div className="fixed inset-0 -z-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-neon-cyan/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
            }}
            animate={{
              x: [0, Math.sin(i) * 50, Math.cos(i) * 30, 0],
              y: [0, Math.cos(i) * 30, Math.sin(i) * 50, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WelcomeScreen onStartChat={handleStartChat} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen"
          >
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-gray-800/50 bg-black/30 backdrop-blur-xl">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <Brain className="h-8 w-8 text-neon-cyan" />
                    </motion.div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue bg-clip-text text-transparent">
                        ArcMind AI
                      </h1>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Advanced AI Assistant
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/50 border border-gray-700">
                      <div className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
                      <span className="text-xs font-medium">AI Online</span>
                    </div>
                    
                    <button
                      onClick={handleReset}
                      className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-neon-green transition-all"
                    >
                      <Zap className="h-4 w-4 text-neon-green group-hover:rotate-12 transition-transform" />
                      <span className="text-sm">New Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Chat */}
            <div className="container mx-auto px-4 py-6">
              <ChatContainer 
                messages={chatHistory}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-neon-cyan" />
              <div className="text-center">
                <p className="text-lg font-semibold text-neon-green">Processing...</p>
                <p className="text-sm text-gray-400 mt-1">AI is thinking about your question</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6"
          >
            <div className={cn(
              "rounded-xl bg-gray-900/90 border border-neon-green/30 px-4 py-3 shadow-xl",
              "backdrop-blur-sm max-w-xs md:max-w-sm"
            )}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
                    ArcMind AI Ready
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Start your conversation with AI
                  </p>
                </div>
                <button
                  onClick={() => setShowToast(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
