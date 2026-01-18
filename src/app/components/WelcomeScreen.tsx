'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { Button } from './ui/Button'
import { useMemo } from 'react' // ✅ useMemo import করো

interface WelcomeScreenProps {
onStartChat: () => void
}

const features = [
{
icon: Sparkles,
title: 'Smart Responses',
desc: 'Context-aware conversations powered by advanced AI',
},
{
icon: Zap,
title: 'Lightning Fast',
desc: 'Instant responses with minimal latency',
},
{
icon: Brain,
title: 'Always Learning',
desc: 'Continuously improving with each interaction',
},
]

export default function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
// ✅ TRUE pre-calculation with useMemo
const orbData = useMemo(
() =>
Array.from({ length: 15 }).map((_, i) => ({
id: i,
left: ${Math.random() * 100}%,
top: ${Math.random() * 100}%,
size: Math.random() * 80 + 40,
duration: Math.random() * 15 + 15,
xMovement: Math.random() * 60 - 30,
yMovement: Math.random() * 60 - 30,
})),
[]
)

return (
<div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
className="max-w-4xl w-full relative z-10"
>
{/* Animated background orbs - optimized with memoized data */}
<div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
{orbData.map((orb) => (
<motion.div
key={orb.id}
className="absolute rounded-full bg-neon-cyan/10"
style={{
left: orb.left,
top: orb.top,
width: orb.size,
height: orb.size,
}}
animate={{
x: [0, orb.xMovement],
y: [0, orb.yMovement],
scale: [1, 1.2, 1],
}}
transition={{
duration: orb.duration,
repeat: Infinity,
repeatType: 'reverse',
ease: 'easeInOut',
}}
/>
))}
</div>

{/* Main content */}  
    <div className="text-center mb-12">  
      <motion.div  
        animate={{ rotate: 360 }}  
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}  
        className="inline-block mb-8"  
      >  
        <div className="relative">  
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue rounded-full blur-3xl opacity-30" />  
          <Brain className="h-32 w-32 text-neon-cyan relative mx-auto" />  
        </div>  
      </motion.div>  

      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue bg-clip-text text-transparent">  
        ArcMind  
      </h1>  

      <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">  
        Your intelligent AI companion for meaningful conversations  
      </p>  
    </div>  

    {/* Features */}  
    <div className="grid md:grid-cols-3 gap-6 mb-12">  
      {features.map((feature, i) => (  
        <motion.div  
          key={feature.title}  
          initial={{ opacity: 0, y: 20 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ delay: 0.2 + i * 0.1 }}  
          className="rounded-2xl p-6 bg-compost-900/30 border border-compost-700/50 backdrop-blur-sm hover:border-neon-cyan/30 transition-colors"  
        >  
          <feature.icon className="h-8 w-8 mb-4 text-neon-cyan" />  
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>  
          <p className="text-sm text-muted-foreground">{feature.desc}</p>  
        </motion.div>  
      ))}  
    </div>  

    {/* CTA */}  
    <div className="text-center">  
      <motion.div  
        whileHover={{ scale: 1.05 }}  
        whileTap={{ scale: 0.95 }}  
      >  
        <Button  
          size="lg"  
          onClick={onStartChat}  
          className="px-8 py-6 text-lg font-bold group"  
        >  
          Start Chatting  
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />  
        </Button>  
      </motion.div>  

      <p className="text-sm text-muted-foreground mt-4">  
        No signup required • Free forever • Privacy focused  
      </p>  
    </div>  
  </motion.div>  
</div>

)
        }
