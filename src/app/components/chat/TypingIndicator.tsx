'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Cpu } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface TypingIndicatorProps {
  thinkingPhrases?: string[];
  showModelInfo?: boolean;
}

const DEFAULT_THINKING_PHRASES = [
  "ArcMind is thinking",
  "Processing your request",
  "Analyzing patterns",
  "Generating response",
  "Connecting to AI models",
  "Reasoning through solution",
];

export default function TypingIndicator({ 
  thinkingPhrases = DEFAULT_THINKING_PHRASES,
  showModelInfo = true 
}: TypingIndicatorProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  // Rotate through thinking phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % thinkingPhrases.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [thinkingPhrases.length]);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  const dots = '.'.repeat(dotCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex items-center gap-3 p-4 rounded-2xl max-w-sm",
        "bg-gradient-to-br from-gray-800/60 to-gray-900/40",
        "backdrop-blur-md border border-gray-700/50",
        "shadow-lg shadow-blue-500/5"
      )}
    >
      {/* Animated Avatar */}
      <div className="relative">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg"
        >
          <Brain className="w-5 h-5 text-white" />
        </motion.div>
        
        {/* Pulsing Ring */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full border-2 border-purple-400/50"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Thinking Text */}
        <motion.div
          key={currentPhraseIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1"
        >
          <span className="text-sm font-medium text-gray-200 truncate">
            {thinkingPhrases[currentPhraseIndex]}
          </span>
          <span className="text-gray-400">
            {dots}
          </span>
        </motion.div>

        {/* Model Info */}
        {showModelInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            className="flex items-center gap-2 mt-1"
          >
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-gray-400">Groq</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-600" />
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-gray-400">Gemini</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Animated Elements */}
      <div className="flex flex-col items-center gap-2">
        {/* Floating Sparkles */}
        <motion.div
          animate={{ 
            rotate: 360,
            y: [0, -3, 0]
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
        </motion.div>
        
        {/* Mini Dots */}
        <div className="flex gap-1">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-1 h-1 rounded-full bg-blue-400"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-1 h-1 rounded-full bg-purple-400"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-1 h-1 rounded-full bg-pink-400"
          />
        </div>
      </div>
    </motion.div>
  );
}
