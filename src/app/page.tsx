'use client'

import { useState } from 'react'
import WelcomeScreen from '@/app/components/WelcomeScreen'
import ChatContainer from '@/app/components/chat/ChatContainer'
import EffectsClient from '@/app/components/effects/EffectsClient'

export default function Page() {
  const [started, setStarted] = useState(false)

  return (
    <div className="min-h-screen">
      <EffectsClient />
      {!started ? (
        <WelcomeScreen onStartChat={() => setStarted(true)} />
      ) : (
        <ChatContainer />
      )}
    </div>
  )
}
