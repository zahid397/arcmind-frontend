'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Sparkles, ArrowRight, Zap, Globe } from 'lucide-react'

export default function WelcomeScreen({ onComplete }) {
  const [step, setStep] = useState(0)
  const [showButton, setShowButton] = useState(false)

  const features = [
    { icon: Brain, text: 'Advanced AI Intelligence', color: 'from-blue-500 to-cyan-400' },
    { icon: Zap, text: 'Real-time Responses', color: 'from-purple-500 to-pink-500' },
    { icon: Globe, text: 'Global Knowledge Base', color: 'from-green-500 to-emerald-400' },
    { icon: Sparkles, text: 'Creative Problem Solving', color: 'from-orange-500 to-yellow-400' },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((prev) => {
        if (prev === 2) setShowButton(true)
        return Math.min(prev + 1, 3)
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [step])

  return (
    <div className="h-full flex items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        {/* Title */}
        <div className="text-center mb-10">
          <Brain className="w-24 h-24 mx-auto mb-6 text-cyan-400 animate-pulse" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Arcmind
          </h1>
          <p className="text-gray-400 mt-4 text-xl">
            Where intelligence meets innovation
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: step >= i ? 1 : 0.3, y: 0 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
            >
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center`}
              >
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">{f.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-8 text-center">
          <div className="h-2 w-64 mx-auto bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              animate={{ width: `${(step + 1) * 33}%` }}
            />
          </div>
          <p className="text-gray-400 mt-2">
            {['Initializing AI…', 'Loading neural networks…', 'Connecting knowledge…', 'Ready!'][step]}
          </p>
        </div>

        {/* Enter Button */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <button
                onClick={onComplete}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg flex items-center gap-3 mx-auto hover:scale-105 transition"
              >
                Enter Arcmind <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
