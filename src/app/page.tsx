'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Zap, Loader2 } from 'lucide-react'

import WelcomeScreen from './components/WelcomeScreen'
import ChatContainer from './components/chat/ChatContainer'
import { cn } from './lib/utils'

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [welcomeReady, setWelcomeReady] = useState(false)
  const [showToast, setShowToast] = useState(true)

  // Initial splash delay (hydration safe)
  useEffect(() => {
    const t = setTimeout(() => setWelcomeReady(true), 800)
    return () => clearTimeout(t)
  }, [])

  // Auto hide toast
  useEffect(() => {
    if (!hasStarted) return
    const t = setTimeout(() => setShowToast(false), 5000)
    return () => clearTimeout(t)
  }, [hasStarted])

  const handleStartChat = async () => {
    setIsLoading(true)

    // 🔒 safe timeout fetch
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://arcmind-27ed.onrender.com'}/api/health`,
        { signal: controller.signal }
      )
    } catch {
      // silent fallback
    } finally {
      clearTimeout(timeout)
      setTimeout(() => {
        setHasStarted(true)
        setIsLoading(false)
      }, 600)
    }
  }

  const handleReset = () => {
    setHasStarted(false)
    setShowToast(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Splash loader
  if (!welcomeReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Bot className="h-16 w-16 text-neon-cyan" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WelcomeScreen onStartChat={handleStartChat} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Floating actions */}
            <div className="fixed right-4 top-20 z-30 space-y-2">
              <button
                onClick={handleReset}
                className="rounded-full bg-compost-900 p-3 border border-compost-700 hover:border-neon-green"
                title="New Chat"
              >
                <Zap className="h-5 w-5 text-neon-green" />
              </button>
            </div>

            <div className="container mx-auto px-4 py-6">
              <ChatContainer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <div
              className={cn(
                'rounded-xl bg-compost-900/90 border border-neon-green/30 px-4 py-3 shadow-lg'
              )}
            >
              <p className="text-sm font-medium">ArcMind ready 🚀</p>
              <p className="text-xs text-muted-foreground">
                Start asking your questions
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
