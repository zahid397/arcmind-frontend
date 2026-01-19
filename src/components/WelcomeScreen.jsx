
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, ArrowRight, Zap, Globe, Cpu, Lock, Cloud, Code, Palette, Rocket, Shield } from 'lucide-react'

const WelcomeScreen = ({ onComplete, connectionStatus }) => {
  const [step, setStep] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const [titleText, setTitleText] = useState('')
  const [subtitleText, setSubtitleText] = useState('')
  const fullTitle = "ArcMind AI"
  const fullSubtitle = "Intelligent conversations powered by advanced AI, wrapped in stunning visual experiences."

  const features = [
    { icon: Brain, text: 'Neural Logic', color: 'from-blue-500 to-cyan-400', desc: 'Smart responses' },
    { icon: Cpu, text: 'Local AI', color: 'from-purple-500 to-pink-500', desc: 'No API needed' },
    { icon: Lock, text: '100% Private', color: 'from-green-500 to-emerald-400', desc: 'Your data stays' },
    { icon: Zap, text: 'Instant', color: 'from-orange-500 to-yellow-400', desc: 'Fast responses' },
    { icon: Code, text: 'Code Ready', color: 'from-red-500 to-rose-400', desc: 'Developer friendly' },
    { icon: Rocket, text: 'Powerful', color: 'from-indigo-500 to-violet-400', desc: 'Advanced logic' },
  ]

  // Typewriter effect for title
  useEffect(() => {
    if (step === 0) {
      let i = 0
      const typing = setInterval(() => {
        setTitleText(fullTitle.slice(0, i))
        i++
        if (i > fullTitle.length) {
          clearInterval(typing)
          setStep(1)
        }
      }, 120)
      return () => clearInterval(typing)
    }
  }, [step])

  // Typewriter effect for subtitle
  useEffect(() => {
    if (step === 2) {
      let i = 0
      const typing = setInterval(() => {
        setSubtitleText(fullSubtitle.slice(0, i))
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
    const steps = [
      () => setStep(1),
      () => setStep(2),
      () => {
        setStep(3)
        setTimeout(() => {
          setShowButton(true)
        }, 800)
      }
    ]

    if (step > 0 && step < 4) {
      const timer = setTimeout(() => {
        if (step < steps.length) {
          steps[step]()
        }
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [step])

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-6xl"
      >
        {/* Main Content */}
        <div className="text-center mb-8 md:mb-12">
          {/* Animated Logo & Title */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 md:mb-12"
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
              <div className="relative glass-heavy rounded-3xl p-6 md:p-10 lg:p-12 overflow-hidden">
                {/* Animated border */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ backgroundPosition: '0% 0%' }}
                  animate={{ backgroundPosition: '100% 100%' }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
                    backgroundSize: '200% 200%'
                  }}
                />
                
                {/* Brain Animation */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotateY: [0, 180, 360]
                  }}
                  transition={{ 
                    y: { duration: 4, repeat: Infinity },
                    rotateY: { duration: 6, repeat: Infinity, ease: "linear" }
                  }}
                  className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-4 md:mb-6"
                >
                  <Brain className="w-full h-full text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text" />
                </motion.div>
                
                {/* Animated Title */}
                <div className="mb-4 md:mb-6">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                      {titleText}
                      <span className="inline-block w-[2px] h-[40px] md:h-[60px] bg-cyan-400 ml-1 align-middle animate-pulse" />
                    </span>
                  </h1>
                </div>
                
                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: step >= 2 ? 1 : 0, height: 'auto' }}
                  className="mb-4 md:mb-6 min-h-[60px]"
                >
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    {subtitleText}
                    {step >= 2 && subtitleText.length < fullSubtitle.length && (
                      <span className="inline-block w-[2px] h-[1.2em] bg-cyan-400 ml-1 align-middle animate-pulse" />
                    )}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8 md:mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: step >= Math.floor(index / 2) + 2 ? 1 : 0.3,
                  scale: step >= Math.floor(index / 2) + 2 ? 1 : 0.8,
                  y: 0
                }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${feature.color} mx-auto mb-2 md:mb-3 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1 group-hover:text-white transition-colors">
                  {feature.text}
                </h3>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Loading Animation */}
          <div className="max-w-md mx-auto mb-8 md:mb-12">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: step === 1 ? '25%' : step === 2 ? '65%' : step === 3 ? '100%' : '0%' }}
                transition={{ duration: 0.8, type: "spring" }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full relative"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
            <motion.p
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-300 text-sm md:text-base"
            >
              {step === 0 && '⚡ Booting ArcMind Core...'}
              {step === 1 && '🧠 Loading neural patterns...'}
              {step === 2 && '🎨 Rendering visual experience...'}
              {step === 3 && '✅ Ready for intelligent conversations!'}
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
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 40px rgba(59, 130, 246, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="group relative px-8 md:px-12 py-3 md:py-4 rounded-2xl text-white font-bold text-lg md:text-xl overflow-hidden"
          >
            {/* Background Gradient */}
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
                  'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundSize: '300% 300%' }}
            >
              <div className="absolute inset-[2px] bg-black rounded-2xl" />
            </motion.div>
            
            {/* Button Content */}
            <span className="relative flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-spin" />
              Enter Experience
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
            </span>
            
            {/* Hover Effect */}
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Button Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
          </motion.button>
        </div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            <Shield className="w-4 h-4" />
            <span>✓ Running 100% Locally • No Internet Required</span>
          </div>
        </motion.div>

        {/* Animated Particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-full"
              initial={{ 
                y: 0, 
                x: 0, 
                opacity: 0,
                scale: 0 
              }}
              animate={{
                y: [0, -Math.random() * 150 - 100],
                x: [0, (Math.random() - 0.5) * 100],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100 + 100}%`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default WelcomeScreen
