import { useState, useEffect, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import WelcomeScreen from './components/WelcomeScreen'
import ChatContainer from './components/ChatContainer'
import { Brain, Sparkles } from 'lucide-react'

// Lazy load heavy components
const BackgroundOrbs = lazy(() => import('./effects/BackgroundOrbs'))
const GradientMesh = lazy(() => import('./effects/GradientMesh'))

// Local AI responses
const AI_RESPONSES = {
  greetings: [
    "Hello! I'm ArcMind AI. How can I assist you today? 😊",
    "Hi there! Ready for some intelligent conversation? 🚀",
    "Welcome! I'm ArcMind, your AI assistant. Let's create something amazing! ✨"
  ],
  code: [
    `\`\`\`javascript
// Clean React component example
function Button({ children, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
    >
      {children}
    </button>
  );
}
\`\`\``,
    `**Code Best Practices:**
1. Meaningful variable names
2. Small, focused functions
3. Proper error handling
4. Consistent formatting
5. Regular testing`
  ],
  ai: [
    "Artificial Intelligence is transforming our world through machine learning, natural language processing, and computer vision.",
    "AI helps automate tasks, analyze data, and create intelligent systems that can learn and adapt."
  ],
  creative: [
    `**The Future of Technology** 🌟

In the coming years, we'll see:
• AI-human collaboration
• Quantum computing breakthroughs
• Sustainable tech solutions
• Enhanced virtual experiences

The possibilities are endless! 🚀`,
    `**Creative Writing Prompt:**

Write a story about an AI that discovers human emotions. 
Explore themes of consciousness, friendship, and what it means to be alive. 📖`
  ]
}

function App() {
  const [welcomeComplete, setWelcomeComplete] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Generate AI response
  const getAIResponse = (message) => {
    const msg = message.toLowerCase()
    
    if (msg.includes('hello') || msg.includes('hi')) {
      return AI_RESPONSES.greetings[Math.floor(Math.random() * AI_RESPONSES.greetings.length)]
    }
    
    if (msg.includes('code') || msg.includes('program') || msg.includes('javascript')) {
      return AI_RESPONSES.code[Math.floor(Math.random() * AI_RESPONSES.code.length)]
    }
    
    if (msg.includes('ai') || msg.includes('artificial')) {
      return AI_RESPONSES.ai[Math.floor(Math.random() * AI_RESPONSES.ai.length)]
    }
    
    if (msg.includes('write') || msg.includes('story') || msg.includes('creative')) {
      return AI_RESPONSES.creative[Math.floor(Math.random() * AI_RESPONSES.creative.length)]
    }
    
    return "That's an interesting question! Based on my knowledge, I'd say this is worth exploring further. Could you tell me more about what you're looking for?"
  }

  const handleWelcomeComplete = () => {
    setWelcomeComplete(true)
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: `# 🎉 Welcome to ArcMind AI!

## ✨ **Features:**
• 100% Local & Private
• Smart AI Responses
• Beautiful Animations
• No API Required

**Try asking me:**
- "Explain AI to a beginner"
- "Help me with JavaScript code"
- "Write a creative story"
- "What's machine learning?"

I'm here to help! 😊`,
      timestamp: new Date().toISOString()
    }])
  }

  const handleSendMessage = (message) => {
    if (!message.trim() || isLoading) return

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = getAIResponse(message)
      
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, aiMsg])
      setIsLoading(false)
    }, 800)
  }

  const handleClearChat = () => {
    setMessages([])
    setWelcomeComplete(false)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <Suspense fallback={null}>
        <BackgroundOrbs />
        <GradientMesh />
      </Suspense>

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-black to-purple-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 via-transparent to-transparent" />
        
        {/* Floating Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onClearChat={handleClearChat} />
        
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
                <WelcomeScreen onComplete={handleWelcomeComplete} />
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
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="py-3 px-4 border-t border-white/10 backdrop-blur-lg bg-black/40">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-400">ArcMind AI • Local & Private</span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Online</span>
                </div>
                <div className="hidden md:flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Animated UI</span>
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
