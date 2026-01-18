'use client'

import { Brain, Zap, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

export default function Header() {
return (
<header className="sticky top-0 z-50 w-full border-b border-compost-800/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
<div className="container flex h-16 items-center justify-between px-4">
{/* Left */}
<div className="flex items-center gap-3">
<motion.div
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.4 }}
className="relative"
>
<div className="absolute inset-0 bg-neon-green rounded-full blur-lg opacity-20" />
<Brain className="h-8 w-8 text-neon-green relative" />
</motion.div>

<div className="flex flex-col leading-tight">  
        <h1 className="text-xl font-bold">  
          <span className="bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue bg-clip-text text-transparent">  
            ArcMind  
          </span>  
        </h1>  
        <p className="text-xs text-muted-foreground flex items-center gap-1">  
          <Sparkles className="h-3 w-3" />  
          AI-powered conversations  
        </p>  
      </div>  
    </div>  

    {/* Right */}  
    <div className="flex items-center gap-3">  
      {/* Online badge */}  
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-compost-900/60 border border-compost-700">  
        <span className="relative flex h-2 w-2">  
          <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75 animate-ping" />  
          <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green" />  
        </span>  
        <span className="text-xs font-medium">Online</span>  
      </div>  

      <Button variant="neon" size="sm">  
        <Zap className="h-4 w-4 mr-2" />  
        New Chat  
      </Button>  
    </div>  
  </div>  
</header>

)
}
