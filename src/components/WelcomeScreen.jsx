import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, ArrowRight, Zap, Cpu, Lock, Globe, Code, Rocket } from 'lucide-react'

const WelcomeScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [showButton, setShowButton] = useState(false)

  const fullTitle = "ArcMind AI"
  const fullSubtitle = "Intelligent conversations powered by advanced AI, wrapped in stunning visual experiences."

  const features = [
    { icon: Brain, text: 'Smart AI', color: 'from-blue-500 to-cyan-400' },
    { icon: Cpu, text: 'Local', color: 'from-purple-500 to-pink-500' },
    { icon: Lock, text: 'Private', color: 'from-green-500 to-emerald-400' },
    { icon: Zap, text: 'Fast', color: 'from-orange-500 to-yellow-400' },
    { icon: Code, text: 'Code', color: 'from-red-500 to-rose-400' },
    { icon: Globe, text: 'Global', color: 'from-indigo-500 to-violet-400' },
  ]

  // Typewriter effect for title
  useEffect(() => {
    if (step === 0) {
      let i = 0
      const typing = setInterval(() => {
        setTitle(fullTitle.slice(0, i))
        i++
        if (i > fullTitle.length) {
          clearInterval(typing)
          setStep(1)
        }
      }, 100)
      return () => clearInterval(typing)
    }
  }, [step])

  // Typewriter effect for subtitle
  useEffect(() => {
    if (step === 2) {
      let i = 0
      const typing = setInterval(() => {
        setSubtitle(fullSubtitle.slice(0, i))
        i++
        if (i > fullSubtitle.length) {
          clearInterval(typing)
          setStep(3)
        }
      }, 30)
      return () => clearInterval(typing)
    }
  }, [step])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 3) {
        setStep(step + 1)
      } else if (step === 3) {
        setTimeout(() => setShowButton(true), 500)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [step])

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-6xl"
      >
        {/* Main Content */}
        <div className="text-center mb-8">
          {/* Animated Logo */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              {/* Glow Effect */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity }
                }}
                className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-2xl opacity-30"
              />
              
              {/* Logo Container */}
              <div className="relative glass rounded-3xl p-8">
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotateY: [0, 180, 360]
                  }}
                  transition={{ 
                    y: { duration: 4, repeat: Infinity },
                    rotateY: { duration: 8, repeat: Infinity, ease: "linear" }
                  }}
                  className="w-24 h-24 mx-auto mb-6"
                >
                  <Brain className="w-full h-full text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text" />
                </motion.div>
                
                {/* Title */}
                <div className="mb-4">
                  <h1 className="text-5xl md:text-6xl font-bold">
                    <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                      {title}
                      {step >= 1 && title.length < fullTitle.length && (
                        <span className="inline-block w-[2px] h-[60px] bg-cyan-400 ml-1 animate-pulse" />
                      )}
                    </span>
                  </h1>
                </div>
                
                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: step >= 2 ? 1 : 0, height: 'auto' }}
                  className="min-h-[60px]"
                >
                  <p className="text-xl text-gray-300">
                    {subtitle}
                    {step >= 2 && subtitle.length < fullSubtitle.length && (
                      <span className="inline-block w-[2px] h-[1.2em] bg-cyan-400 ml-1 animate-pulse" />
                    )}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: step >= Math.floor(index / 2) + 1 ? 1 : 0.3,
                  scale: step >= Math.floor(index / 2) + 1 ? 1 : 0.8,
                  y: 0
                }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mx-auto mb-3 flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">{feature.text}</h3>
              </motion.div>
            ))}
          </div>

          {/* Loading Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: step === 1 ? '30%' : step === 2 ? '70%' : step === 3 ? '100%' : '0%' }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </motion.div>
            </div>
            <motion.p
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-300"
            >
              {step === 0 && '🚀 Initializing...'}
              {step === 1 && '⚡ Loading AI engine...'}
              {step === 2 && '🎨 Preparing interface...'}
              {step === 3 && '✅ Ready to go!'}
            </motion.p>
          </div>
        </div>

        {/* Enter Button */}
        <div className="flex justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: showButton ? 1 : 0,
              scale: showButton ? 1 : 0.8 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="group relative px-12 py-4 rounded-2xl text-white font-bold text-lg overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Animated Border */}
            <motion.div
              className="absolute inset-0 rounded-2xl p-[2px]"
              animate={{ 
                background: [
                  'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)',
                  'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)',
                  'linear-gradient(45deg, #8b5cf6, #06b6d4, #3b82f6)',
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundSize: '300% 300%' }}
            >
              <div className="absolute inset-[2px] bg-black rounded-2xl" />
            </motion.div>
            
            {/* Content */}
            <span className="relative flex items-center justify-center gap-3">
              Enter Experience
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </span>
            
            {/* Hover Effect */}
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </div>

        {/* Animated Particles */}
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] bg-cyan-400/40 rounded-full"
              initial={{ 
                y: 0, 
                x: 0, 
                opacity: 0,
                scale: 0 
              }}
              animate={{
                y: [0, -Math.random() * 100 - 50],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default WelcomeScreen
