// src/app/components/layout/ClientLayout.tsx
'use client'

import { ReactNode, Suspense, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Settings, Moon, Sun } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import Sidebar from './Sidebar'
import { Button } from '../ui/Button'

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 md:hidden flex items-center justify-between p-4 border-b border-compost-800/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-gradient">
            ArcMind
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 md:hidden"
            >
              <div className="h-full bg-background border-r border-compost-800/50">
                <div className="flex items-center justify-between p-4 border-b border-compost-800/50">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <Suspense fallback={<div className="p-4">Loading...</div>}>
                  <Sidebar />
                </Suspense>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex">
          <Suspense fallback={
            <div className="w-64 border-r border-compost-800/50 p-4">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-compost-800 rounded w-3/4" />
                <div className="h-20 bg-compost-800 rounded" />
                <div className="h-20 bg-compost-800 rounded" />
              </div>
            </div>
          }>
            <Sidebar />
          </Suspense>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-neon-cyan rounded-full blur-xl animate-pulse" />
                  <div className="relative h-16 w-16 rounded-full bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue animate-spin" />
                </div>
                <p className="text-muted-foreground">Loading ArcMind...</p>
              </div>
            </div>
          }>
            {children}
          </Suspense>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-compost-800/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-around p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className={cn(
              "flex-1 flex flex-col items-center p-2",
              sidebarOpen && "text-neon-green"
            )}
          >
            <Menu className="h-5 w-5 mb-1" />
            <span className="text-xs">Menu</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="flex-1 flex flex-col items-center p-2"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-5 w-5 mb-1" />
                <span className="text-xs">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5 mb-1" />
                <span className="text-xs">Dark</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="flex-1 flex flex-col items-center p-2"
          >
            <Settings className="h-5 w-5 mb-1" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </nav>

      {/* Error Boundary Fallback (would be better with actual ErrorBoundary component) */}
      <div className="hidden">
        {/* Placeholder for error boundary content */}
        <div className="p-4 text-center">
          <p className="text-red-500">Something went wrong. Please refresh the page.</p>
        </div>
      </div>
    </div>
  )
    }
