import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Brain, ArrowRight, Cpu, Lock, Cloud, Code, Palette
} from 'lucide-react'

const WelcomeScreen = ({ onComplete, connectionStatus }) => {
  const [step, setStep] = useState(0)

  // ✅ derived state (no duplication)
  const showButton = step === 3 && connectionStatus === 'connected'

  const features = [
    { icon: Brain, text: 'Neural AI', color: 'from-blue-500 to-cyan-400', desc: 'Advanced ML models' },
    { icon: Cpu, text: 'Real-time', color: 'from-purple-500 to-pink-500', desc: 'Instant responses' },
    { icon: Lock, text: 'Secure', color: 'from-green-500 to-emerald-400', desc: 'End-to-end encryption' },
    { icon: Cloud, text: 'Cloud', color: 'from-orange-500 to-yellow-400', desc: 'Scalable infra' },
    { icon: Code, text: 'Developer', color: 'from-red-500 to-rose-400', desc: 'API ready' },
    { icon: Palette, text: 'Creative', color: 'from-indigo-500 to-violet-400', desc: 'Multi-modal output' },
  ]

  // ✅ controlled step animation
  useEffect(() => {
    if (step >= 3) return
    const t = setTimeout(() => setStep(s => s + 1), 900)
    return () => clearTimeout(t)
  }, [step])

  // ✅ stable particles
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        x: (Math.random() - 0.5) * 60,
        y: -Math.random() * 120 - 40,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 3,
      })),
    []
  )

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <div className="glass-heavy rounded-2xl p-10 inline-block">
            <Brain className="w-32 h-32 mx-auto mb-6 text-gradient" />
            <h1 className="text-6xl md:text-7xl font-bold text-gradient-primary">
              Arcmind
            </h1>
            <p className="text-xl text-gray-300 mt-3">
              Intelligence meets <span className="text-cyan-300">innovation</span>
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: step >= Math.floor(i / 2) + 1 ? 1 : 0.2,
                scale: step >= Math.floor(i / 2) + 1 ? 1 : 0.85,
              }}
              transition={{ delay: i * 0.08 }}
              className="p-4 rounded-xl glass hover:bg-white/10"
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold">{f.text}</h3>
              <p className="text-xs text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        <div className="max-w-md mx-auto mb-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${step * 33.3}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
            />
          </div>
          <p className="mt-3 text-gray-300 text-sm">
            {['Initializing AI…', 'Loading models…', 'Connecting…', 'Ready 🚀'][step]}
          </p>
        </div>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: showButton ? 1 : 0, scale: showButton ? 1 : 0.85 }}
          disabled={!showButton}
          onClick={onComplete}
          className="relative px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600" />
          <span className="relative flex items-center gap-3">
            Start Conversation <ArrowRight />
          </span>
        </motion.button>

        {/* Warning */}
        {connectionStatus === 'disconnected' && (
          <div className="mt-6 text-sm text-red-400">
            ⚠️ Backend disconnected. Limited features.
          </div>
        )}

        {/* Particles */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-[1px] h-[1px] bg-cyan-400/30 rounded-full"
              style={{ left: `${p.left}%`, top: `${p.top}%` }}
              animate={{ x: [0, p.x], y: [0, p.y], opacity: [0, 0.5, 0] }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default WelcomeScreen
