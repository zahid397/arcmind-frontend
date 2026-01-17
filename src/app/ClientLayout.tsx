'use client'

import { ReactNode, Suspense, useEffect, useState } from 'react'
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
  const [mounted, setMounted] = useState(false)

  // hydration-safe mount
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  // prevent hydration mismatch
  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 md:hidden flex items-center justify-between p-4 border-b border-compost-800/50 bg-background/95 backdrop-blur">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="text-lg font-bold text-gradient">ArcMind</h1>

        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-compost-800/50 md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-compost-800/50">
                <h2 className="font-semibold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Suspense fallback={<div className="p-4">Loading...</div>}>
                <Sidebar />
              </Suspense>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-compost-800/50">
        <Suspense
          fallback={
            <div className="p-4 space-y-4 animate-pulse">
              <div className="h-4 bg-compost-800 rounded w-3/4" />
              <div className="h-20 bg-compost-800 rounded" />
            </div>
          }
        >
          <Sidebar />
        </Suspense>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading ArcMind…</p>
            </div>
          }
        >
          {children}
        </Suspense>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-compost-800/50 bg-background/95 backdrop-blur">
        <div className="flex justify-around p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className={cn(sidebarOpen && 'text-neon-green')}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </div>
  )
}
