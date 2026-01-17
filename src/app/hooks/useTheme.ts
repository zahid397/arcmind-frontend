'use client'

import { useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // 🔥 Initial theme sync
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const initialTheme: Theme =
      saved ?? (prefersDark ? 'dark' : 'light')

    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')

    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }

  return { theme, toggleTheme, mounted }
}
