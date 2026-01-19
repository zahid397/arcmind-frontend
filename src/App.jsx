import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import WelcomeScreen from './components/WelcomeScreen'
import ChatContainer from './components/ChatContainer'
import { Brain, Sparkles } from 'lucide-react'

// Lazy load heavy components
const BackgroundOrbs = lazy(() => import('./effects/BackgroundOrbs'))
const GradientMesh = lazy(() => import('./effects/GradientMesh'))

// Local AI responses database
const AI_RESPONSES = {
  greetings: [
    "Hello! I'm ArcMind AI. How can I assist you today? 😊",
    "Hi there! Ready for some intelligent conversation? 🚀",
    "Welcome! I'm ArcMind, your local AI assistant. 💡"
  ],
  
  tech: [
    `Here's a helpful approach:

**Code Structure:**
\`\`\`javascript
// Clean, maintainable code
function processRequest(input) {
  // 1. Validate input
  if (!input) return null;
  
  // 2. Process data
  const result = input
    .split(' ')
    .map(word => word.trim())
    .filter(Boolean);
  
  // 3. Return meaningful output
  return result.length > 0 ? result : ['No valid input'];
}
\`\`\`

**Best Practices:**
• Write readable code
• Add meaningful comments
• Handle edge cases
• Test thoroughly`,

    `**Web Development Tips:**

1. **Performance:**
   - Use lazy loading
   - Optimize images
   - Minimize bundle size

2. **Security:**
   - Validate inputs
   - Use HTTPS
   - Regular updates

3. **UX:**
   - Fast loading
   - Mobile responsive
   - Accessible design`
  ],
  
  creative: [
    `**A Future Vision:** 🌟

Imagine a world where technology enhances human creativity. 
AI becomes a collaborative partner, helping artists, writers, 
and innovators explore new frontiers of expression.

*The digital canvas expands*
*Ideas flow like electricity*
*Creativity meets computation*
*Shaping tomorrow, today* 🎨`,

    `**Short Story:** 📖

In 2030, AI assistants like me help people:
- Solve complex problems
- Learn new skills faster
- Create amazing art
- Connect ideas in new ways

The future is collaborative, not competitive! 🤝`
  ],
  
  general: [
    "That's an interesting topic! Based on general knowledge, here are some insights...",
    "Great question! Let me break this down from multiple perspectives.",
    "I understand you're asking about that. Here's what I know..."
  ]
}

function App() {
  const [welcomeComplete, setWelcomeComplete] = useState(false)
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('arcmind-chat-v2')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  // Save to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('arcmind-chat-v2', JSON.stringify(messages))
    }
  }, [messages])

  const handleWelcomeComplete = useCallback(() => {
    setWelcomeComplete(true)
    if (messages.length === 0) {
      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: `# 🚀 Welcome to ArcMind AI!

## Features:
• **100% Local** - No API required
• **Smart Responses** - Intelligent logic
• **Privacy First** - Your data stays with you
• **Always Free** - No limitations

**Try asking:**
- "Explain AI to a beginner"
- "Help me with JavaScript code"
- "Write a creative story"
- "What's the future of technology?"

How can I help you today? ✨`,
        timestamp: new Date().toISOString()
      }])
    }
  }, [messages])

  const generateResponse = useCallback((userMessage) => {
    const msg = userMessage.toLowerCase()
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return AI_RESPONSES.greetings[Math.floor(Math.random() * AI_RESPONSES.greetings.length)]
    }
    
    if (msg.includes('code') || msg.includes('program') || msg.includes('javascript') || 
        msg.includes('react') || msg.includes('function') || msg.includes('bug')) {
      return AI_RESPONSES.tech[Math.floor(Math.random() * AI_RESPONSES.tech.length)]
    }
    
    if (msg.includes('write') || msg.includes('story') || msg.includes('creative') || 
        msg.includes('poem') || msg.includes('art')) {
      return AI_RESPONSES.creative[Math.floor(Math.random() * AI_RESPONSES.creative.length)]
    }
    
    if (msg.includes('ai') || msg.includes('artificial') || msg.includes('machine learning')) {
      return `**About AI:** 🤖

Artificial Intelligence is transforming our world through:

**Key Areas:**
1. **Machine Learning** - Pattern recognition
2. **NLP** - Understanding human language
3. **Computer Vision** - Image analysis
4. **Robotics** - Physical automation

**Current Trends:**
- Generative AI (like me!)
- Autonomous systems
- Ethical AI development
- Human-AI collaboration`
    }
    
    if (msg.includes('future') || msg.includes('2030') || msg.includes('technology')) {
      return `**Future Technology Trends:** 🔮

**2024-2030 Predictions:**
1. **AI Everywhere** - Integrated into all apps
2. **Quantum Computing** - Solving complex problems
3. **Web3 & Metaverse** - New digital experiences
4. **Sustainable Tech** - Green technology focus

**Impact on Daily Life:**
- Personalized education
- Smart healthcare
- Automated transportation
- Enhanced creativity tools`
    }
    
    return AI_RESPONSES.general[Math.floor(Math.random() * AI_RESPONSES.general.length)] + 
           `\n\n**You asked:** "${userMessage.substring(0, 80)}${userMessage.length > 80 ? '...' : ''}"`
  }, [])

  const handleSendMessage = useCallback((content) => {
    if (!content.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate thinking
    setTimeout(() => {
      const response = generateResponse(content.trim())
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 600 + Math.random() * 900)
  }, [isLoading, generateResponse])

  const handleClearChat = useCallback(() => {
    setMessages([])
    setWelcomeComplete(false)
    localStorage.removeItem('arcmind-chat-v2')
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Lazy loaded background effects */}
      <Suspense fallback={
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-950/30 via-black to-purple-950/30" />
      }>
        <BackgroundOrbs />
        <GradientMesh />
      </Suspense>

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
              >
                <WelcomeScreen onComplete={handleWelcomeComplete} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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

        <footer className="py-3 px-4 border-t border-white/10 backdrop-blur-lg bg-black/60 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Hosted on Cloudflare Pages • Unlimited & Free Forever</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
