'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Sparkles, Zap, Loader2 } from 'lucide-react'
import WelcomeScreen from './components/WelcomeScreen'
import ChatContainer from './components/chat/ChatContainer'
import { cn } from './lib/utils'

export default function HomePage() {
const [hasStarted, setHasStarted] = useState(false)
const [isLoading, setIsLoading] = useState(false)
const [welcomeComplete, setWelcomeComplete] = useState(false)
const [showToast, setShowToast] = useState(true)

// Handle initial loading state
useEffect(() => {
const timer = setTimeout(() => {
setWelcomeComplete(true)
}, 1000)
return () => clearTimeout(timer)
}, [])

// ✅ FIX 2: Auto-hide Toast after 5 seconds
useEffect(() => {
if (!hasStarted || !showToast) return
const t = setTimeout(() => setShowToast(false), 5000)
return () => clearTimeout(t)
}, [hasStarted, showToast])

const handleStartChat = async () => {
setIsLoading(true)

// ✅ FIX 1: Safe Fetch with Timeout & Finally block  
const controller = new AbortController()  
const timeoutId = setTimeout(() => controller.abort(), 3000) // 3s Timeout  

try {  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://arcmind-27ed.onrender.com'}/api/health`, {  
    method: 'GET',  
    headers: {  
      'Content-Type': 'application/json',  
    },  
    signal: controller.signal,  
  })  
    
  if (response.ok) {  
    // Success  
    setTimeout(() => {  
      setHasStarted(true)  
      setIsLoading(false)  
    }, 800)  
  } else {  
    throw new Error('API not available')  
  }  
} catch (error) {  
  console.warn('API health check failed/timed out:', error)  
  // Fallback - still allow starting  
  setTimeout(() => {  
    setHasStarted(true)  
    setIsLoading(false)  
  }, 800)  
} finally {  
  // ✅ Vital: Always clear timeout to prevent memory leaks  
  clearTimeout(timeoutId)  
}

}

const handleReset = () => {
setHasStarted(false)
setIsLoading(false)
setShowToast(true) // Reset toast for next session
}

// Safe Scroll to Top
const scrollToTop = () => {
if (typeof window !== 'undefined') {
window.scrollTo({ top: 0, behavior: 'smooth' })
}
}

// Loading state
if (!welcomeComplete) {
return (
<div className="flex items-center justify-center min-h-screen bg-background">
<motion.div
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
className="text-center"
>
<motion.div
animate={{
rotate: 360,
scale: [1, 1.1, 1],
}}
transition={{
rotate: {
duration: 2,
repeat: Infinity,
ease: "linear"
},
scale: {
duration: 1.5,
repeat: Infinity,
repeatType: "reverse"
}
}}
className="relative mx-auto mb-8"
>
<div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue rounded-full blur-2xl opacity-30" />
<Bot className="h-24 w-24 text-neon-cyan relative" />
</motion.div>
<motion.h1
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
className="text-4xl font-bold mb-4"
>
<span className="text-gradient">ArcMind</span>
</motion.h1>
<motion.p
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 0.2 }}
className="text-muted-foreground"
>
Loading your AI experience...
</motion.p>
</motion.div>
</div>
)
}

return (
<div className="relative min-h-[calc(100vh-4rem)]">
{/* Background Elements */}
<div className="fixed inset-0 -z-10 overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-background via-compost-950 to-background" />

{/* Animated gradient orbs */}  
    {[...Array(5)].map((_, i) => (  
      <motion.div  
        key={i}  
        className="absolute rounded-full"  
        style={{  
          left: `${20 + i * 15}%`,  
          top: `${10 + i * 20}%`,  
          width: 100 + i * 50,  
          height: 100 + i * 50,  
          background: `radial-gradient(circle, ${  
            i % 3 === 0 ? 'rgba(0, 255, 247, 0.1)' :  
            i % 3 === 1 ? 'rgba(0, 255, 0, 0.1)' :  
            'rgba(0, 0, 255, 0.1)'  
          } 0%, transparent 70%)`,  
        }}  
        animate={{  
          x: [0, Math.sin(i) * 100, 0],  
          y: [0, Math.cos(i) * 100, 0],  
          scale: [1, 1.2, 1],  
        }}  
        transition={{  
          duration: 10 + i * 2,  
          repeat: Infinity,  
          repeatType: "reverse",  
        }}  
      />  
    ))}  
      
    {/* Grid Pattern */}  
    <div   
      className="absolute inset-0 opacity-[0.02]"  
      style={{  
        backgroundImage: `  
          linear-gradient(to right, #00ff00 1px, transparent 1px),  
          linear-gradient(to bottom, #00ff00 1px, transparent 1px)  
        `,  
        backgroundSize: '50px 50px',  
      }}  
    />  
  </div>  

  <AnimatePresence mode="wait">  
    {!hasStarted ? (  
      <motion.div  
        key="welcome"  
        initial={{ opacity: 0 }}  
        animate={{ opacity: 1 }}  
        exit={{ opacity: 0, scale: 0.9 }}  
        transition={{ duration: 0.5 }}  
      >  
        <WelcomeScreen onStartChat={handleStartChat} />  
      </motion.div>  
    ) : (  
      <motion.div  
        key="chat"  
        initial={{ opacity: 0, y: 20 }}  
        animate={{ opacity: 1, y: 0 }}  
        exit={{ opacity: 0, y: -20 }}  
        transition={{ duration: 0.5 }}  
        className="relative"  
      >  
        {/* Floating Action Buttons */}  
        <div className="fixed right-4 top-20 md:right-8 md:top-24 z-30 space-y-2">  
          <motion.button  
            whileHover={{ scale: 1.1 }}  
            whileTap={{ scale: 0.95 }}  
            onClick={handleReset}  
            className={cn(  
              "p-3 rounded-full bg-compost-900/80 backdrop-blur-sm border border-compost-700/50",  
              "hover:bg-compost-800 hover:border-neon-green/50 transition-all",  
              "flex items-center justify-center shadow-lg"  
            )}  
            title="New Chat"  
          >  
            <Sparkles className="h-5 w-5 text-neon-green" />  
          </motion.button>  

          <motion.button  
            whileHover={{ scale: 1.1 }}  
            whileTap={{ scale: 0.95 }}  
            onClick={scrollToTop}  
            className={cn(  
              "p-3 rounded-full bg-compost-900/80 backdrop-blur-sm border border-compost-700/50",  
              "hover:bg-compost-800 hover:border-neon-cyan/50 transition-all",  
              "flex items-center justify-center shadow-lg"  
            )}  
            title="Scroll to Top"  
          >  
            <Zap className="h-5 w-5 text-neon-cyan" />  
          </motion.button>  
        </div>  

        {/* Status Indicator */}  
        <motion.div  
          initial={{ opacity: 0, y: -10 }}  
          animate={{ opacity: 1, y: 0 }}  
          className="fixed left-1/2 top-4 -translate-x-1/2 z-30"  
        >  
          <div className={cn(  
            "px-4 py-2 rounded-full backdrop-blur-sm border",  
            "flex items-center gap-2 shadow-lg",  
            "bg-compost-900/80 border-compost-700/50"  
          )}>  
            <motion.div  
              animate={{ scale: [1, 1.2, 1] }}  
              transition={{ duration: 2, repeat: Infinity }}  
              className="h-2 w-2 rounded-full bg-neon-green"  
            />  
            <span className="text-xs font-medium">ArcMind is ready</span>  
          </div>  
        </motion.div>  

        {/* Main Chat Container */}  
        <div className="container mx-auto px-4 py-6">  
          <ChatContainer />  
        </div>  

        {/* Footer Note */}  
        <motion.div  
          initial={{ opacity: 0 }}  
          animate={{ opacity: 1 }}  
          transition={{ delay: 1 }}  
          className="text-center py-4 mt-8 border-t border-compost-800/30"  
        >  
          <p className="text-sm text-muted-foreground">  
            Powered by advanced AI • Conversations are private and secure  
          </p>  
          <p className="text-xs text-muted-foreground/70 mt-1">  
            ArcMind v1.0 • Free forever  
          </p>  
        </motion.div>  
      </motion.div>  
    )}  
  </AnimatePresence>  

  {/* Loading Overlay */}  
  <AnimatePresence>  
    {isLoading && (  
      <motion.div  
        initial={{ opacity: 0 }}  
        animate={{ opacity: 1 }}  
        exit={{ opacity: 0 }}  
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"  
      >  
        <div className="text-center">  
          <motion.div  
            animate={{  
              rotate: 360,  
            }}  
            transition={{  
              duration: 1.5,  
              repeat: Infinity,  
              ease: "linear"  
            }}  
            className="relative mx-auto mb-6"  
          >  
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue rounded-full blur-xl" />  
            <div className="relative h-20 w-20 rounded-full border-4 border-transparent bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue bg-origin-border p-0.5">  
              <div className="h-full w-full rounded-full bg-background flex items-center justify-center">  
                <Bot className="h-8 w-8 text-neon-cyan" />  
              </div>  
            </div>  
          </motion.div>  
            
          <motion.div  
            initial={{ opacity: 0, y: 10 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ delay: 0.2 }}  
          >  
            <h3 className="text-xl font-semibold mb-2 text-gradient">  
              Initializing ArcMind  
            </h3>  
            <p className="text-muted-foreground mb-4">  
              Connecting to AI assistant...  
            </p>  
            <div className="flex items-center justify-center gap-2">  
              <Loader2 className="h-4 w-4 animate-spin text-neon-green" />  
              <span className="text-sm">Preparing your chat environment</span>  
            </div>  
          </motion.div>  

          {/* Progress dots */}  
          <div className="flex justify-center gap-1 mt-6">  
            {[1, 2, 3].map((dot) => (  
              <motion.div  
                key={dot}  
                className="h-2 w-2 rounded-full bg-neon-cyan"  
                animate={{  
                  scale: [1, 1.5, 1],  
                  opacity: [0.5, 1, 0.5],  
                }}  
                transition={{  
                  duration: 1,  
                  repeat: Infinity,  
                  delay: dot * 0.2,  
                }}  
              />  
            ))}  
          </div>  
        </div>  
      </motion.div>  
    )}  
  </AnimatePresence>  

  {/* Connection Status Toast */}  
  <AnimatePresence>  
    {showToast && hasStarted && (  
      <motion.div  
        initial={{ opacity: 0, y: 20 }}  
        animate={{ opacity: 1, y: 0 }}  
        exit={{ opacity: 0, y: 20 }}  
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40"  
      >  
        <div className={cn(  
          "p-4 rounded-xl backdrop-blur-sm border shadow-xl",  
          "bg-compost-900/90 border-neon-green/20",  
          "flex items-start gap-3"  
        )}>  
          <div className="relative">  
            <div className="absolute inset-0 bg-neon-green rounded-full blur-sm" />  
            <div className="relative p-2 rounded-full bg-black">  
              <Zap className="h-4 w-4 text-neon-green" />  
            </div>  
          </div>  
          <div className="flex-1">  
            <p className="text-sm font-medium">Ready to chat!</p>  
            <p className="text-xs text-muted-foreground mt-1">  
              ArcMind is connected and ready for your questions  
            </p>  
          </div>  
          <button  
            onClick={() => setShowToast(false)}  
            className="text-xs text-muted-foreground hover:text-foreground"  
          >  
            Dismiss  
          </button>  
        </div>  
      </motion.div>  
    )}  
  </AnimatePresence>  
</div>

)
                        }
