// src/app/components/layout/Header.tsx
'use client'

import { Brain, Zap, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

export default function Header() {
return (
<header className="sticky top-0 z-50 w-full border-b border-compost-800/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
<div className="container flex h-16 items-center justify-between px-4">
<div className="flex items-center gap-3">
<motion.div
animate={{
rotate: [0, 10, -10, 0],
scale: [1, 1.1, 1],
}}
transition={{
duration: 2,
repeat: Infinity,
repeatType: "reverse",
}}
className="relative"
>
<div className="absolute inset-0 bg-neon-green rounded-full blur-xl opacity-20 animate-pulse" />
<Brain className="h-8 w-8 text-neon-green relative" />
</motion.div>
<div className="flex flex-col">
<h1 className="text-2xl font-bold tracking-tight">
<span className="text-gradient bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue">
ArcMind
</span>
</h1>
<p className="text-xs text-muted-foreground flex items-center gap-1">
<Sparkles className="h-3 w-3" />
AI-powered conversations
</p>
</div>
</div>

<div className="flex items-center gap-4">  
      <motion.div  
        initial={{ opacity: 0, scale: 0.5 }}  
        animate={{ opacity: 1, scale: 1 }}  
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-compost-900/50 border border-compost-700"  
      >  
        <Zap className="h-3 w-3 text-neon-yellow animate-pulse" />  
        <span className="text-xs font-medium">Online</span>  
      </motion.div>  
        
      <Button variant="neon" size="sm">  
        <Sparkles className="h-4 w-4 mr-2" />  
        New Chat  
      </Button>  
    </div>  
  </div>  
</header>

)
}
