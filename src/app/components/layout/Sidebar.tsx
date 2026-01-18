'use client'

import { useState } from 'react'
import { MessageSquare, Trash2, Clock, Plus } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { Button } from '../ui/Button'

const chatSessions = [
{ id: '1', title: 'Quantum Computing', lastMessage: 'Explain superposition...', time: '10:30 AM', unread: 2 },
{ id: '2', title: 'Web Development', lastMessage: 'Next.js best practices...', time: 'Yesterday', unread: 0 },
{ id: '3', title: 'Philosophy', lastMessage: 'What is consciousness?', time: '2 days ago', unread: 1 },
{ id: '4', title: 'Recipe Ideas', lastMessage: 'Vegetarian dinner recipes...', time: 'Last week', unread: 0 },
]

export default function Sidebar() {
const [selected, setSelected] = useState('1')
const [hoveredId, setHoveredId] = useState<string | null>(null)

return (
<div className="flex h-full w-64 flex-col bg-background border-r border-compost-800/50">
{/* Header */}
<div className="p-4 border-b border-compost-800/50">
<div className="flex items-center justify-between">
<h2 className="text-lg font-semibold bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent">
Conversations
</h2>
<Button variant="ghost" size="icon" className="h-8 w-8">
<Plus className="h-4 w-4" />
</Button>
</div>
<p className="text-xs text-muted-foreground mt-1">Recent chats</p>
</div>

{/* Sessions */}  
  <div className="flex-1 overflow-y-auto p-2">  
    {chatSessions.map((session) => (  
      <button  
        key={session.id}  
        onClick={() => setSelected(session.id)}  
        onMouseEnter={() => setHoveredId(session.id)}  
        onMouseLeave={() => setHoveredId(null)}  
        className={cn(  
          "w-full text-left p-3 rounded-lg mb-2 transition-all group relative",  
          selected === session.id  
            ? "bg-gradient-to-r from-compost-900/80 to-compost-800/80 border border-neon-green/20 shadow-lg shadow-neon-green/5"  
            : "hover:bg-compost-900/30 border border-transparent hover:border-compost-700"  
        )}  
      >  
        {/* Unread indicator */}  
        {session.unread > 0 && (  
          <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-neon-cyan text-xs flex items-center justify-center text-black font-bold">  
            {session.unread}  
          </div>  
        )}  

        <div className="flex items-start gap-3">  
          <div  
            className={cn(  
              "p-2 rounded-lg transition-colors",  
              selected === session.id  
                ? "bg-gradient-to-br from-neon-cyan/20 to-neon-green/20"  
                : "bg-compost-800/50 group-hover:bg-compost-700/50"  
            )}  
          >  
            <MessageSquare className={cn(  
              "h-4 w-4 transition-colors",  
              selected === session.id ? "text-neon-cyan" : "text-muted-foreground"  
            )} />  
          </div>  

          <div className="flex-1 min-w-0">  
            <div className="flex items-center justify-between">  
              <p className="font-medium truncate">{session.title}</p>  
            </div>  
            <p className="text-xs text-muted-foreground truncate mt-1">  
              {session.lastMessage}  
            </p>  
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">  
              <Clock className="h-3 w-3" />  
              {session.time}  
            </div>  
          </div>  

          <Button  
            variant="ghost"  
            size="icon"  
            className={cn(  
              "h-8 w-8 transition-all",  
              hoveredId === session.id || selected === session.id   
                ? "opacity-100"   
                : "opacity-0"  
            )}  
            onClick={(e) => {  
              e.stopPropagation()  
              // Handle delete  
            }}  
          >  
            <Trash2 className="h-4 w-4" />  
          </Button>  
        </div>  
      </button>  
    ))}  
  </div>  

  {/* Footer */}  
  <div className="p-4 border-t border-compost-800/50 space-y-3">  
    <div className="rounded-lg bg-gradient-to-br from-compost-900/40 to-compost-800/40 p-4 border border-compost-700/50">  
      <p className="text-sm font-medium mb-1 flex items-center gap-2">  
        <span className="text-neon-cyan">✨</span> Pro Tip  
      </p>  
      <p className="text-xs text-muted-foreground">  
        Ask clear & specific questions for best results  
      </p>  
    </div>  
      
    {/* Stats */}  
    <div className="flex items-center justify-between text-xs text-muted-foreground">  
      <span>Total chats: {chatSessions.length}</span>  
      <span className="flex items-center gap-1">  
        <div className="h-2 w-2 rounded-full bg-neon-green"></div>  
        Online  
      </span>  
    </div>  
  </div>  
</div>

)
}
