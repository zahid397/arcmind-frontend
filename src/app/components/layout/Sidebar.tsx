'use client'

import { useState } from 'react'
import { MessageSquare, Trash2, Clock } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { Button } from '../ui/Button'

const chatSessions = [
  { id: '1', title: 'Quantum Computing', lastMessage: 'Explain superposition...', time: '10:30 AM' },
  { id: '2', title: 'Web Development', lastMessage: 'Next.js best practices...', time: 'Yesterday' },
  { id: '3', title: 'Philosophy', lastMessage: 'What is consciousness?', time: '2 days ago' },
  { id: '4', title: 'Recipe Ideas', lastMessage: 'Vegetarian dinner recipes...', time: 'Last week' },
]

export default function Sidebar() {
  const [selected, setSelected] = useState('1')

  return (
    <div className="flex h-full w-64 flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-compost-800/50">
        <h2 className="text-lg font-semibold text-gradient">
          Conversations
        </h2>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto p-2">
        {chatSessions.map((session) => (
          <button
            key={session.id}
            onClick={() => setSelected(session.id)}
            className={cn(
              "w-full text-left p-3 rounded-lg mb-2 transition-all group",
              selected === session.id
                ? "bg-compost-900/60 border border-neon-green/20"
                : "hover:bg-compost-900/30 border border-transparent hover:border-compost-700"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  selected === session.id
                    ? "bg-neon-green/20"
                    : "bg-compost-800/50"
                )}
              >
                <MessageSquare className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{session.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.lastMessage}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {session.time}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-compost-800/50">
        <div className="rounded-lg bg-compost-900/40 p-4 border border-compost-700/50">
          <p className="text-sm font-medium mb-1">✨ Pro Tip</p>
          <p className="text-xs text-muted-foreground">
            Ask clear & specific questions for best results
          </p>
        </div>
      </div>
    </div>
  )
}
