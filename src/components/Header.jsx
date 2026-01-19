import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Sparkles,
  Settings,
  Sun,
  Moon,
  Trash2,
  Wifi,
  WifiOff
} from 'lucide-react'

const Header = ({ connectionStatus, onClearChat }) => {
  const [darkMode, setDarkMode] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  // ✅ REAL dark mode toggle
  useEffect(() => {
    const root = document.documentElement
    darkMode ? root.classList.add('dark') : root.classList.remove('dark')
  }, [darkMode])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
            </motion.div>

            <div>
              <h1 className="text-xl font-bold text-gradient-primary">
                Arcmind AI
              </h1>
              <p className="text-xs text-gray-400">
                Intelligent Conversations
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">

            {/* Connection Status */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                connectionStatus === 'connected'
                  ? 'bg-green-500/10 text-green-400'
                  : connectionStatus === 'checking'
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {connectionStatus === 'connected'
                ? <Wifi className="w-4 h-4" />
                : <WifiOff className="w-4 h-4" />
              }
              <span className="hidden sm:inline">
                {connectionStatus === 'connected'
                  ? 'Connected'
                  : connectionStatus === 'checking'
                  ? 'Checking…'
                  : 'Disconnected'}
              </span>
            </div>

            {/* AI Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-sm text-cyan-400">AI Online</span>
            </div>

            {/* Clear Chat */}
            <button
              onClick={onClearChat}
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 group"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
              title="Toggle theme"
            >
              {darkMode
                ? <Sun className="w-5 h-5 text-yellow-400" />
                : <Moon className="w-5 h-5 text-gray-400" />
              }
            </button>

            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(v => !v)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-xl z-[60]">
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 text-xs text-gray-400">
                      Settings
                    </div>
                    {[
                      'Notifications',
                      'Privacy',
                      'Language'
                    ].map(item => (
                      <button
                        key={item}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/5"
                      >
                        {item}
                      </button>
                    ))}
                    <div className="h-px bg-white/10 my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10">
                      Reset All Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside */}
      {showSettings && (
        <div
          className="fixed inset-0 z-[55]"
          onClick={() => setShowSettings(false)}
        />
      )}
    </motion.header>
  )
}

export default Header
