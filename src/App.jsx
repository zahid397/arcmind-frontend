import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import WelcomeScreen from './components/WelcomeScreen'
import ChatContainer from './components/ChatContainer'
import BackgroundOrbs from './effects/BackgroundOrbs'
import GradientMesh from './effects/GradientMesh'
import { Brain, Sparkles, Zap, MessageSquare, Shield, Cpu, Rocket } from 'lucide-react'

// Local AI Responses - No API needed
const localAIResponses = {
  greetings: [
    "Hello! I'm ArcMind AI. How can I assist you today? 😊",
    "Hi there! Ready for some intelligent conversation? 🚀",
    "Greetings! I'm here to help with any questions you have. 💡",
    "Welcome! I'm ArcMind AI, your intelligent assistant. ✨"
  ],
  
  questions: {
    ai: [
      "AI is transforming our world! From healthcare to entertainment, artificial intelligence is creating smarter solutions. The key developments include machine learning, natural language processing, and computer vision.",
      "Artificial Intelligence refers to machines programmed to mimic human intelligence. Current trends include generative AI, autonomous systems, and ethical AI development."
    ],
    code: [
      "Here's a helpful approach:\n```javascript\n// Clean code structure\nfunction solveProblem(input) {\n  // Break down complex problems\n  const steps = input.split(' ');\n  // Use meaningful variable names\n  const result = steps.map(step => processStep(step));\n  return result;\n}\n```\nRemember: Keep functions small, test often, and document your code!",
      "For better code:\n- Use consistent naming\n- Add comments for complex logic\n- Handle errors gracefully\n- Optimize for readability first"
    ],
    general: [
      "That's an interesting topic! Based on general knowledge, I'd suggest researching reputable sources and considering multiple perspectives.",
      "Great question! While I don't have real-time data, here are some key considerations based on established knowledge."
    ]
  },
  
  creative: [
    "Imagine a world where technology and creativity merge seamlessly. ✨\n\nIn this world, AI assists human creativity rather than replaces it. Artists use intelligent tools to explore new mediums, while writers collaborate with language models to craft compelling stories.\n\nThe future is collaborative! 🤝",
    "Let me paint a picture with words:\n\n*The digital canvas glows with possibilities*\n*Each line of code tells a story*\n*Innovation meets imagination*\n*Creating tomorrow, today* 🎨"
  ],
  
  fallbacks: [
    "I understand you're asking about that topic. While I process information differently than real-time AI services, I can offer insights based on programming logic and common knowledge.",
    "Interesting point! Let me think about this from multiple angles...",
    "That's a thoughtful question. Here's my perspective on it:",
    "Let me help you with that. Based on what I know:"
  ]
}

function App() {
  const [welcomeComplete, setWelcomeComplete] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('local')

  // Local AI response generator - NO API NEEDED
  const generateAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase()
    
    // Greeting detection
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return localAIResponses.greetings[
        Math.floor(Math.random() * localAIResponses.greetings.length)
      ]
    }
    
    // AI-related questions
    if (lowerMsg.includes('ai') || lowerMsg.includes('artificial') || lowerMsg.includes('machine learning')) {
      return localAIResponses.questions.ai[
        Math.floor(Math.random() * localAIResponses.questions.ai.length)
      ]
    }
    
    // Code/Programming questions
    if (lowerMsg.includes('code') || lowerMsg.includes('program') || 
        lowerMsg.includes('javascript') || lowerMsg.includes('react') || 
        lowerMsg.includes('bug') || lowerMsg.includes('error')) {
      return localAIResponses.questions.code[
        Math.floor(Math.random() * localAIResponses.questions.code.length)
      ]
    }
    
    // Creative prompts
    if (lowerMsg.includes('creative') || lowerMsg.includes('write') || 
        lowerMsg.includes('story') || lowerMsg.includes('poem') || 
        lowerMsg.includes('imagine')) {
      return localAIResponses.creative[
        Math.floor(Math.random() * localAIResponses.creative.length)
      ]
    }
    
    // General questions with ?
    if (lowerMsg.includes('?')) {
      return localAIResponses.questions.general[
        Math.floor(Math.random() * localAIResponses.questions.general.length)
      ]
    }
    
    // Default fallback
    return localAIResponses.fallbacks[
      Math.floor(Math.random() * localAIResponses.fallbacks.length)
    ] + `\n\nYou mentioned: "${userMessage.substring(0, 100)}${userMessage.length > 100 ? '...' : ''}"`
  }

  const handleWelcomeComplete = () => {
    setWelcomeComplete(true)
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: "🚀 **Welcome to ArcMind AI!**\n\nI'm running **100% locally** with intelligent responses powered by advanced logic.\n\n🌟 **Features:**\n• Smart conversation understanding\n• Code assistance\n• Creative writing\n• Instant responses\n• No API required!\n\nHow can I help you today? ✨",
      timestamp: new Date().toISOString(),
      reactions: null
    }])
  }

  // Handle sending messages - NO API CALL
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

    // Simulate AI thinking with delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(content.trim())
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        reactions: null
      }

      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 800 + Math.random() * 1200) // Random delay for natural feel
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-black to-purple-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] bg-cyan-400/40 rounded-full"
              animate={{
                y: [0, -Math.random() * 200],
                x: [0, (Math.random() - 0.5) * 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.3
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100 + 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          connectionStatus={connectionStatus}
          onClearChat={handleClearChat}
        />

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

        {/* Enhanced Footer */}
        <footer className="py-4 px-6 border-t border-white/10 backdrop-blur-xl bg-black/60">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                >
                  <Brain className="w-4 h-4" />
                </motion.div>
                <div>
                  <span className="text-sm text-gray-400">© 2024 ArcMind AI</span>
                  <p className="text-xs text-gray-500">100% Local • No API Required</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                {/* Connection Status */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-blue-400">
                    Local AI • Always Available
                  </span>
                </div>

                {/* Feature Indicators */}
                <div className="hidden md:flex items-center gap-6 text-xs">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>Smart Logic</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span>Instant</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Rocket className="w-3 h-3 text-purple-400" />
                    <span>Powerful</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span>Private</span>
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
