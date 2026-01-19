import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import WelcomeScreen from './components/WelcomeScreen'
import ChatContainer from './components/ChatContainer'
import BackgroundOrbs from './effects/BackgroundOrbs'
import GradientMesh from './effects/GradientMesh'
import { Brain, Sparkles, Zap, MessageSquare, Shield, AlertCircle } from 'lucide-react'

function App() {
  const [welcomeComplete, setWelcomeComplete] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const [apiStatus, setApiStatus] = useState(null)

  // Backend API URL
  const API_BASE_URL = 'https://arcmind-27ed.onrender.com'

  // Check API connection
  const checkApiConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        setConnectionStatus('connected')
        setApiStatus('healthy')
      } else {
        setConnectionStatus('disconnected')
        setApiStatus('unhealthy')
      }
    } catch (error) {
      console.log('API connection error:', error)
      setConnectionStatus('disconnected')
      setApiStatus('error')
    }
  }

  useEffect(() => {
    checkApiConnection()
    const interval = setInterval(checkApiConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleWelcomeComplete = () => {
    setWelcomeComplete(true)
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: 'Hello! I\'m ArcMind AI. I can help you with intelligent conversations. How can I assist you today?',
      timestamp: new Date().toISOString(),
      reactions: null
    }])
  }

  // Fix API call with proper error handling
  const handleSendMessage = async (content) => {
    if (!content.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      reactions: null
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      console.log('Sending message to API:', content)
      
      // API call with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message: content.trim() }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API response:', data)

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || data.message || data.answer || "I've processed your request.",
        timestamp: new Date().toISOString(),
        reactions: null
      }

      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Fallback responses when API is down
      const fallbackResponses = [
        "I'm experiencing some technical difficulties. Here's what I can suggest based on your query...",
        "While I'm working to restore full functionality, here are some thoughts on your question...",
        "Let me help you with that. Based on common knowledge...",
        "I'll provide a helpful response based on your input..."
      ]
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: error.name === 'AbortError' 
          ? "The request took too long. Please try again with a simpler query."
          : randomResponse,
        timestamp: new Date().toISOString(),
        reactions: null
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([])
    setWelcomeComplete(false)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <BackgroundOrbs />
      <GradientMesh />

      {/* Animated Gradient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-black to-purple-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          connectionStatus={connectionStatus}
          onClearChat={handleClearChat}
          apiStatus={apiStatus}
        />

        {/* API Status Banner */}
        {apiStatus === 'error' && (
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="bg-yellow-500/10 border-b border-yellow-500/20"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">
                Backend connection issue detected. Using fallback mode.
              </span>
            </div>
          </motion.div>
        )}

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {!welcomeComplete ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <WelcomeScreen 
                  onComplete={handleWelcomeComplete}
                  connectionStatus={connectionStatus}
                />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ChatContainer
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  connectionStatus={connectionStatus}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-white/10 backdrop-blur-sm bg-black/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-400">© 2024 ArcMind AI</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-500/10 text-green-400' 
                    : connectionStatus === 'checking'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 
                    connectionStatus === 'checking' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className="text-xs font-medium">
                    {connectionStatus === 'connected' ? 'API Connected' : 
                     connectionStatus === 'checking' ? 'Checking...' : 'API Disconnected'}
                  </span>
                </div>

                <div className="hidden md:flex items-center gap-6 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>AI Powered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span>Real-time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span>Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
