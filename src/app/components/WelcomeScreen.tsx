'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { Button } from './ui/Button' // পাথ ঠিক আছে যদি ফাইলটা components ফোল্ডারে থাকে

interface WelcomeScreenProps {
onStartChat: () => void
}

export default function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
return (
<div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
className="max-w-4xl w-full relative z-10"
>
{/* Animated background elements */}
<div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
{[...Array(20)].map((_, i) => (
<motion.div
key={i}
className="absolute rounded-full bg-neon-cyan/10"
style={{
left: ${Math.random() * 100}%,
top: ${Math.random() * 100}%,
width: Math.random() * 100 + 50,
height: Math.random() * 100 + 50,
}}
animate={{
x: [0, Math.random() * 100 - 50],
y: [0, Math.random() * 100 - 50],
scale: [1, 1.2, 1],
}}
transition={{
duration: Math.random() * 10 + 10,
repeat: Infinity,
repeatType: 'reverse',
}}
/>
))}
</div>

{/* Main content */}  
    <div className="text-center mb-12">  
      <motion.div  
        animate={{  
          rotate: [0, 360],  
          scale: [1, 1.1, 1],  
        }}  
        transition={{  
          duration: 20,  
          repeat: Infinity,  
          repeatType: 'loop',  
        }}  
        className="inline-block mb-8"  
      >  
        <div className="relative">  
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue rounded-full blur-3xl opacity-30" />  
          <Brain className="h-32 w-32 text-neon-cyan relative mx-auto" />  
        </div>  
      </motion.div>  

      <motion.h1  
        initial={{ opacity: 0 }}  
        animate={{ opacity: 1 }}  
        transition={{ delay: 0.2 }}  
        className="text-5xl md:text-7xl font-bold mb-6"  
      >  
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue animate-pulse">  
          ArcMind  
        </span>  
      </motion.h1>  

      <motion.p  
        initial={{ opacity: 0 }}  
        animate={{ opacity: 1 }}  
        transition={{ delay: 0.4 }}  
        className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"  
      >  
        Your intelligent AI companion for meaningful conversations  
      </motion.p>  
    </div>  

    {/* Features grid */}  
    <div className="grid md:grid-cols-3 gap-6 mb-12">  
      {[  
        {  
          icon: Sparkles,  
          title: 'Smart Responses',  
          description: 'Context-aware conversations powered by advanced AI',  
          color: 'from-neon-cyan to-neon-blue',  
        },  
        {  
          icon: Zap,  
          title: 'Lightning Fast',  
          description: 'Instant responses with minimal latency',  
          color: 'from-neon-green to-neon-cyan',  
        },  
        {  
          icon: Brain,  
          title: 'Always Learning',  
          description: 'Continuously improving with each interaction',  
          color: 'from-neon-pink to-neon-yellow',  
        },  
      ].map((feature, index) => (  
        <motion.div  
          key={feature.title}  
          initial={{ opacity: 0, y: 20 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ delay: 0.2 + index * 0.1 }}  
          className="group relative p-6 rounded-2xl bg-compost-900/30 border border-compost-700/50 backdrop-blur-sm hover:border-neon-green/50 transition-all duration-300 overflow-hidden"  
        >  
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />  
            
          <div className="relative z-10">  
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-10 mb-4`}>  
              <feature.icon className="h-6 w-6 text-white" />  
            </div>  
            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>  
            <p className="text-muted-foreground">{feature.description}</p>  
          </div>  
        </motion.div>  
      ))}  
    </div>  

    {/* CTA */}  
    <motion.div  
      initial={{ opacity: 0, y: 20 }}  
      animate={{ opacity: 1, y: 0 }}  
      transition={{ delay: 0.8 }}  
      className="text-center"  
    >  
      <Button  
        onClick={onStartChat}  
        size="lg"  
        className="group relative overflow-hidden bg-white text-black hover:bg-white/90 px-8 py-6 text-lg"  
      >  
        <span className="relative z-10 flex items-center gap-2 font-bold">  
          Start Chatting  
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />  
        </span>  
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />  
      </Button>  

      <p className="text-sm text-muted-foreground mt-6 animate-pulse">  
        No signup required • Free forever • Privacy focused  
      </p>  
    </motion.div>  
  </motion.div>  
</div>

)
}
