import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, ArrowRight, Zap, Globe, Cpu, Lock, Cloud, MessageSquare, Rocket } from 'lucide-react'

const WelcomeScreen = ({ onComplete, connectionStatus }) => {
  const [step, setStep] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const [titleText, setTitleText] = useState('')
  const fullTitle = "ArcMind AI"

  const features = [
    { icon: Brain, text: 'Neural AI', color: 'from-blue-500 to-cyan-400', desc: 'Advanced learning' },
    { icon: MessageSquare, text: 'Conversations', color: 'from-purple-500 to-pink-500', desc: 'Natural dialogue' },
    { icon: Cpu, text: 'Real-time', color: 'from-green-500 to-emerald-400', desc: 'Instant responses' },
    { icon: Lock, text: 'Secure', color: 'from-orange-500 to-yellow-400', desc: 'Private chats' },
    { icon: Globe, text: 'Knowledge', color: 'from-red-500 to-rose-400', desc: 'Vast database' },
    { icon: Rocket, text: 'Fast', color: 'from-indigo-500 to-violet-400', desc: 'Lightning speed' },
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
      }, 100)
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
          if (connectionStatus === 'connected' || connectionStatus === 'checking') {
            setShowButton(true)
          }
        }, 500)
      }
    ]

    if (step > 0 && step < 4) {
      const timer = setTimeout(() => {
        if (step < steps.length) {
          steps[step]()
        }
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [step, connectionStatus])

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-6xl"
      >
        {/* Main Content */}
        <div className="text-center mb-12">
          {/* Animated Logo & Title */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10 md:mb-16"
          >
            <div className="relative inline-block">
              {/* Glow Effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-2xl opacity-20"
              />
              
              {/* Logo Container */}
              <div className="relative glass-heavy rounded-3xl p-8 md:p-12">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8"
                >
                  <Brain className="w-full h-full text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text" />
                </motion.div>
                
                {/* Animated Title */}
                <div className="mb-4 md:mb-6">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                      {titleText}
                      <span className="inline-block w-[2px] h-[60px] md:h-[80px] bg-cyan-400 ml-1 align-middle animate-pulse" />
                    </span>
                  </h1>
                </div>
                
                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: step >= 2 ? 1 : 0 }}
                  className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto mb-6"
                >
                  Intelligent conversations powered by advanced AI
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: step >= 3 ? 1 : 0 }}
                  className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto"
                >
                  Wrapped in stunning visual experiences
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: step >= Math.floor(index / 2) + 2 ? 1 : 0.2,
                  scale: step >= Math.floor(index / 2) + 2 ? 1 : 0.8,
                  y: 0
                }}
                transition={{ delay: index * 0.1 }}
                className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${feature.color} mx-auto mb-2 md:mb-3 flex items-center justify-center relative`}>
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1">{feature.text}</h3>
                <p className="text-xs text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Loading Animation */}
          <div className="max-w-md mx-auto mb-8 md:mb-12">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: step === 1 ? '25%' : step === 2 ? '65%' : step === 3 ? '100%' : '0%' }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full relative"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </motion.div>
            </div>
            <motion.p
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-300 text-sm md:text-base"
            >
              {step === 0 && '🔄 Initializing ArcMind...'}
              {step === 1 && '⚡ Loading AI capabilities...'}
              {step === 2 && '🌐 Preparing conversation engine...'}
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            disabled={!showButton}
            className={`group relative px-8 md:px-12 py-3 md:py-4 rounded-2xl text-white font-semibold text-lg md:text-xl overflow-hidden ${
              !showButton ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Button Content */}
            <span className="relative flex items-center justify-center gap-3">
              Enter Experience
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Hover Effect */}
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Button Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          </motion.button>
        </div>

        {/* Connection Status */}
        {connectionStatus === 'disconnected' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 text-sm">
              <Zap className="w-4 h-4" />
              <span>Working in offline mode - Basic functionality available</span>
            </div>
          </motion.div>
        )}

        {/* Animated Particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[1px] h-[1px] bg-cyan-400/30 rounded-full"
              initial={{ 
                y: 0, 
                x: 0, 
                opacity: 0,
                scale: 0 
              }}
              animate={{
                y: [0, -Math.random() * 100 - 50],
                x: [0, (Math.random() - 0.5) * 80],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                delay: i * 0.1,
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
