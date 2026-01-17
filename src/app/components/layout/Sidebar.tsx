// src/app/components/layout/Sidebar.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Trash2, Clock, ChevronRight } from 'lucide-react'
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
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "hidden md:flex flex-col h-[calc(100vh-4rem)] border-r border-compost-800/50 bg-background/50",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      <div className="p-4 border-b border-compost-800/50">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold text-gradient"
            >
              Conversations
            </motion.h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto"
          >
            <ChevronRight className={cn("h-4 w-4 transition-transform", !isExpanded && "rotate-180")} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence>
          {chatSessions.map((session, index) => (
            <motion.button
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelected(session.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 group",
                selected === session.id
                  ? "bg-compost-900/50 border border-neon-green/20 neon-shadow"
                  : "hover:bg-compost-900/30 border border-transparent hover:border-compost-700"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  selected === session.id
                    ? "bg-neon-green/20"
                    : "bg-compost-800/50"
                )}>
                  <MessageSquare className="h-4 w-4" />
                </div>
                
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    className="flex-1 min-w-0"
                  >
                    <p className="font-medium truncate">{session.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.lastMessage}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {session.time}
                    </div>
                  </motion.div>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-compost-800/50"
        >
          <div className="rounded-lg bg-gradient-to-br from-compost-900/50 to-background p-4 border border-compost-700/50">
            <p className="text-sm font-medium mb-2">✨ Pro Tip</p>
            <p className="text-xs text-muted-foreground">
              Use specific questions for better AI responses
            </p>
          </div>
        </motion.div>
      )}
    </motion.aside>
  )
}
