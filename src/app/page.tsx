'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Zap, Loader2, X } from 'lucide-react'
import WelcomeScreen from '@/app/components/WelcomeScreen'
import ChatContainer from '@/app/components/chat/ChatContainer'
import EffectsClient from '@/app/components/effects/EffectsClient'
import { cn } from '@/app/lib/utils'

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [showToast, setShowToast] = useState(true)
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline'>('offline')

  // Hydration-safe splash delay
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 600)
    return () => clearTimeout(timer)
  }, [])

  // Auto hide toast after 5 seconds
  useEffect(() => {
    if (!hasStarted) return
    
    const timer = setTimeout(() => {
      setShowToast(false)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [hasStarted])

  // Check backend status on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://arcmind-27ed.onrender.com'
      
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 3000)
        
        const res = await fetch(`${backendUrl}/api/health`, {
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache' }
        })
        
        clearTimeout(timeout)
        
        if (res.ok) {
          setBackendStatus('online')
        } else {
          setBackendStatus('offline')
        }
      } catch (error) {
        console.warn('Backend health check failed:', error)
        setBackendStatus('offline')
      }
    }
    
    checkBackendHealth()
  }, [])

  const handleStartChat = useCallback(async () => {
    setIsLoading(true)
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://arcmind-27ed.onrender.com'
    
    // ✅ FIX 1: Move timeout outside try block for cleanup
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    
    try {
      const res = await fetch(`${backendUrl}/api/health`, {
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' }
      })
      
      // ✅ FIX 2: Update backend status based on health check
      if (res?.ok) {
        setBackendStatus('online')
      } else {
        setBackendStatus('offline')
      }
    } catch (error) {
      console.warn('Health check failed:', error)
      setBackendStatus('offline')
    } finally {
      // ✅ MUST: Clear timeout to prevent memory leaks
      clearTimeout(timeout)
      
      // Add a small delay for better UX
      setTimeout(() => {
        setHasStarted(true)
        setIsLoading(false)
      }, 300)
    }
  }, [])

  const handleReset = useCallback(() => {
    setHasStarted(false)
    setShowToast(true)
    
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    
    // Reset URL if there's any hash
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  // Splash loader
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
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
            <Bot className="h-16 w-16 text-neon-cyan" />
          </motion.div>
          <p className="text-sm text-muted-foreground">Initializing ArcMind...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* 🔥 Background Effects (SSR OFF) */}
      <EffectsClient 
        enabled={{
          backgroundOrbs: true,
          neonGrid: false,
          gradientMesh: true,
          scanLines: false,
          particleCursor: false,
        }}
        intensity={hasStarted ? 'low' : 'medium'}
      />

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen onStartChat={handleStartChat} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            {/* Floating action button */}
            <motion.div 
              className="fixed right-4 top-20 z-30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleReset}
                className="group rounded-full bg-compost-900/80 p-3 border border-compost-700 hover:border-neon-green transition-all backdrop-blur-sm"
                title="New Chat"
                aria-label="Start new chat"
              >
                <Zap className="h-5 w-5 text-neon-green group-hover:rotate-12 transition-transform" />
              </button>
            </motion.div>

            {/* Backend status indicator - only show when offline */}
            {backendStatus === 'offline' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40"
              >
                <div className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span>Backend is offline. Some features may be limited.</span>
                </div>
              </motion.div>
            )}

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-neon-cyan" />
              <p className="text-sm text-muted-foreground">Connecting to AI...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ FIX 3: Toast logic - already perfect, no change needed */}
      <AnimatePresence>
        {showToast && hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6"
          >
            <div
              className={cn(
                'rounded-xl bg-compost-900/90 border border-neon-green/30 px-4 py-3 shadow-lg',
                'backdrop-blur-sm max-w-xs md:max-w-sm'
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
                    ArcMind ready
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start asking your questions
                  </p>
                </div>
                <button
                  onClick={() => setShowToast(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Dismiss notification"
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
