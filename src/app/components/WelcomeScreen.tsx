'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Brain,
  Lock,
  Sparkles,
  MessageSquare,
  Code,
  Image as ImageIcon,
  Globe,
  Cpu,
  Shield,
  Rocket,
  Terminal,
  Database,
  Cloud,
} from 'lucide-react';
import Button from '@/app/components/ui/Button';

const FEATURES = [
  { icon: Brain, title: 'Advanced AI', description: 'Groq & Gemini Models' },
  { icon: Shield, title: 'Secure', description: 'Military-Grade Encryption' },
  { icon: Sparkles, title: 'Multi-Modal', description: 'Text, Images, Audio' },
  { icon: Terminal, title: 'Developer API', description: 'REST & WebSocket' },
  { icon: ImageIcon, title: 'AI Art', description: 'DALL-E & Stable Diffusion' },
  { icon: Database, title: 'Web3 Ready', description: 'Blockchain & Smart Contracts' },
  { icon: Cpu, title: 'Fast', description: 'Real-time Responses' },
  { icon: Cloud, title: 'Cloud Native', description: 'Global Edge Network' },
  { icon: Lock, title: 'Private', description: 'No Data Training' },
];

const EXAMPLE_PROMPTS = [
  'Explain quantum computing to a beginner',
  'Generate a cyberpunk cityscape image',
  'Write a Solidity smart contract for NFTs',
  'Debug this Next.js API route code',
  'Create a Web3 marketing plan for 2024',
  'Design a React component with Tailwind',
  'Explain blockchain consensus algorithms',
  'Generate a business plan for a startup',
  'Translate Python code to JavaScript',
  'Create a content strategy for AI tools',
];

interface WelcomeScreenProps {
  onStartChat: () => void;
}

export default function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [floatingIcons, setFloatingIcons] = useState<Array<{ x: number; y: number; icon: keyof typeof icons }>>([]);

  const icons = {
    Brain, Sparkles, Zap, Cpu, Cloud, Terminal
  };

  // Rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Create floating icons
  useEffect(() => {
    const newIcons = Array.from({ length: 8 }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      icon: Object.keys(icons)[Math.floor(Math.random() * Object.keys(icons).length)] as keyof typeof icons,
    }));
    setFloatingIcons(newIcons);
  }, []);

  const handlePromptClick = (prompt: string) => {
    // Store prompt in localStorage or context for auto-fill
    localStorage.setItem('suggested_prompt', prompt);
    onStartChat();
  };

  return (
    <div className="relative h-full flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Icons */}
        {floatingIcons.map((icon, idx) => {
          const IconComponent = icons[icon.icon];
          return (
            <motion.div
              key={idx}
              className="absolute"
              style={{ left: `${icon.x}%`, top: `${icon.y}%` }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: idx * 0.5,
              }}
            >
              <IconComponent className="w-6 h-6 text-blue-400/30" />
            </motion.div>
          );
        })}
      </div>

      <div className="relative max-w-6xl w-full z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-blue-500/30 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Introducing ArcMind AI v1.0
            </span>
            <Rocket className="w-4 h-4 text-blue-400" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome to ArcMind
            </span>
          </h1>

          <motion.div
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          >
            <span className="font-medium">Production-grade AI assistant</span> with{' '}
            <span className="text-blue-300">blockchain integration</span>,{' '}
            <span className="text-purple-300">advanced reasoning</span>, and{' '}
            <span className="text-pink-300">enterprise features</span>.
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={onStartChat}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Start Chatting</span>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="ml-2"
              >
                <Zap className="w-4 h-4" />
              </motion.div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open('https://docs.arcmind.ai', '_blank')}
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <Code className="w-5 h-5" />
              <span>View Documentation</span>
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-12"
        >
          <AnimatePresence mode="wait">
            {FEATURES.slice(currentFeature, currentFeature + 3).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Feature Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {FEATURES.slice(0, 5).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentFeature(idx * 3)}
              className={`w-2 h-2 rounded-full transition-all ${
                Math.floor(currentFeature / 3) === idx
                  ? 'bg-blue-500 w-6'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Example Prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 md:p-8 shadow-2xl"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Try asking me...
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXAMPLE_PROMPTS.slice(0, 6).map((prompt, index) => (
              <motion.button
                key={prompt}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePromptClick(prompt)}
                className="group p-4 text-left rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-200 group-hover:text-white flex-1">
                    {prompt}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">99.9%</div>
                <div className="text-xs text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">50ms</div>
                <div className="text-xs text-gray-400">Response Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">256-bit</div>
                <div className="text-xs text-gray-400">Encryption</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">24/7</div>
                <div className="text-xs text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Status: <span className="text-green-400">All Systems Operational</span>
            </span>
            <span>•</span>
            <span>Powered by Multi-Modal AI</span>
            <span>•</span>
            <span>Enterprise-Grade Security</span>
          </div>
          
          <div className="text-xs text-gray-600">
            © {new Date().getFullYear()} ArcMind AI. All rights reserved.
            <button 
              onClick={() => window.open('https://github.com/zahid397/ArcMind', '_blank')}
              className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              View on GitHub
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
          }
