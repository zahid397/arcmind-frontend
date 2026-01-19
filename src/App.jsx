import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Header from './components/Header'
import WelcomeScreen from './components/WelcomeScreen'
import ChatContainer from './components/ChatContainer'
import BackgroundOrbs from './effects/BackgroundOrbs'
import GradientMesh from './effects/GradientMesh'
import { Brain, Sparkles, Zap, MessageSquare, Shield } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const uid = () => crypto.randomUUID()

function App() {
  const [welcomeComplete, setWelcomeComplete] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('checking')

  useEffect(() => {
    let mounted = true

    const checkConnection = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/health`)
        if (mounted) setConnectionStatus(res.status === 200 ? 'connected' : 'disconnected')
      } catch {
        if (mounted) setConnectionStatus('disconnected')
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const handleWelcomeComplete = () => {
    setWelcomeComplete(true)
    setMessages([{
      id: uid(),
      role: 'assistant',
      content: 'Hello! I’m Arcmind AI. How can I help you today?',
      timestamp: new Date().toISOString()
    }])
  }

  const handleSendMessage = async (content) => {
    if (!content.trim() || isLoading) return

    const userMessage = {
      id: uid(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, { message: content.trim() })

      setMessages(prev => [...prev, {
        id: uid(),
        role: 'assistant',
        content: res.data?.response || res.data?.message || 'Response received.',
        timestamp: new Date().toISOString()
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: uid(),
        role: 'assistant',
        content: 'Server error. Please try again.',
        timestamp: new Date().toISOString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <BackgroundOrbs />
      <GradientMesh />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header connectionStatus={connectionStatus} />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {!welcomeComplete ? (
              <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <WelcomeScreen onComplete={handleWelcomeComplete} />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <ChatContainer
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="py-4 px-6 border-t border-white/10 bg-black/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-400">
            <span>© 2024 Arcmind AI</span>
            <span className={connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>
              {connectionStatus}
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
