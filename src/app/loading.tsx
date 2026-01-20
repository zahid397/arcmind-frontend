'use client';

import { motion } from 'framer-motion';
import { Sparkles, Cpu, Zap } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f172a] overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(124,58,237,0.1),_rgba(15,23,42,1))]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-arc-blue to-transparent opacity-20 animate-scan"></div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        
        {/* 🌀 The Arc Reactor Core (Spinner) */}
        <div className="relative w-32 h-32">
          
          {/* Outer Ring (Slow Reverse Spin) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-arc-blue/20 border-t-arc-blue border-r-arc-blue/50 shadow-[0_0_15px_rgba(0,102,255,0.3)]"
          />

          {/* Middle Ring (Fast Forward Spin) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-arc-purple/20 border-b-arc-purple border-l-arc-purple/50 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
          />

          {/* Inner Pulsing Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-arc-blue to-arc-purple blur-md opacity-50"
            />
            <div className="relative z-10 bg-[#0f172a] p-3 rounded-full border border-white/10">
              <Cpu className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* 📝 Loading Text & Status */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-arc-blue via-white to-arc-purple bg-clip-text text-transparent tracking-widest uppercase">
            ArcMind
          </h2>
          
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-arc-cyan animate-bounce" />
            <p className="text-xs text-arc-cyan/80 font-mono tracking-wider">
              INITIALIZING NEURAL LINK...
            </p>
          </div>

          {/* Progress Bar Simulation */}
          <div className="w-48 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-arc-blue to-transparent"
            />
          </div>
        </div>

      </div>
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>
    </div>
  );
}
