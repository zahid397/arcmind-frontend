'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { Button } from './ui/Button'

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
        {/* Animated background orbs */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-neon-cyan/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
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
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue rounded-full blur-3xl opacity-30" />
              <Brain className="h-32 w-32 text-neon-cyan relative mx-auto" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            ArcMind
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your intelligent AI companion for meaningful conversations
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
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
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-2xl p-6 bg-compost-900/30 border border-compost-700/50 backdrop-blur-sm"
            >
              <f.icon className="h-8 w-8 mb-4 text-neon-cyan" />
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={onStartChat}
            className="px-8 py-6 text-lg font-bold"
          >
            Start Chatting
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
            No signup required • Free forever • Privacy focused
          </p>
        </div>
      </motion.div>
    </div>
  )
}
