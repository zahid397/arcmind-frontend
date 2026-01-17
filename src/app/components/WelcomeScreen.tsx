'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  Brain,
  Lock,
  Sparkles,
  MessageSquare,
  Code,
  Image as ImageIcon,
  Globe,
} from 'lucide-react';
import Button from '@/components/ui/Button'; // ✅ FIXED

const FEATURES = [
  { icon: Brain, title: 'Advanced AI', description: 'Powered by Groq & Gemini' },
  { icon: Lock, title: 'Secure', description: 'End-to-end encryption' },
  { icon: Sparkles, title: 'Multi-Modal', description: 'Text, images, transactions' },
  { icon: Code, title: 'Developer API', description: 'Build on top of ArcMind' },
  { icon: ImageIcon, title: 'Image Generation', description: 'AI-powered art creation' },
  { icon: Globe, title: 'Web3 Ready', description: 'Blockchain integration' },
];

const EXAMPLE_PROMPTS = [
  'Explain quantum computing in simple terms',
  'Generate an image of a futuristic city',
  'Create a smart contract for NFT minting',
  'Help me debug this React component',
  'Plan a Web3 marketing strategy',
];

interface WelcomeScreenProps {
  onStartChat: () => void;
}

export default function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-border/50 mb-6">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium">Introducing ArcMind v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Welcome to ArcMind
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your production-grade AI assistant with blockchain integration,
            advanced reasoning, and enterprise features.
          </p>

          <Button size="lg" onClick={onStartChat} className="group">
            <MessageSquare className="w-5 h-5" />
            <span>Start Chatting</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2"
            >
              <Zap className="w-4 h-4" />
            </motion.div>
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
        >
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center p-4 rounded-xl bg-background/50 border border-border/50 hover:border-border transition-colors"
            >
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 mb-3">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Example prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-background/30 backdrop-blur-sm rounded-2xl border border-border p-6"
        >
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Try asking me...
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <motion.button
                key={prompt}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStartChat}
                className="p-3 text-left rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-border/30 transition-colors text-sm"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Powered by Advanced AI Models • End-to-End Encrypted • 99.9% Uptime
        </motion.div>
      </div>
    </div>
  );
}
