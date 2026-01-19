'use client'

import { useState } from 'react'
import WelcomeScreen from '@/app/components/WelcomeScreen'
import ChatContainer from '@/app/components/chat/ChatContainer'
import EffectsClient from '@/app/components/effects/EffectsClient'
import { MessageCircle, Sparkles } from 'lucide-react'

export default function Home() {
  const [welcomeComplete, setWelcomeComplete] = useState(false)

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <EffectsClient />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-black to-purple-950/20" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <header className="p-6 border-b border-white/10 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Arcmind
                </h1>
                <p className="text-sm text-gray-400">
                  AI-Powered Conversations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-sm">AI Online</span>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          {!welcomeComplete ? (
            <WelcomeScreen onStartChat={() => setWelcomeComplete(true)} />
          ) : (
            <ChatContainer />
          )}
        </div>
      </div>
    </main>
  )
}
