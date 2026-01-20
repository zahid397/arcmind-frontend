'use client';

import { useState } from 'react';
import { CreditCard, Zap, Globe, Rocket, Wallet, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  // হুবহু ছবির মতো ডাটা
  const [balance, setBalance] = useState(1.00);
  const [txCount, setTxCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 font-sans text-white">
      
      {/* 🚀 Header Badge */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-4 mb-8 px-6 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 flex items-center gap-2"
      >
        <Rocket className="w-4 h-4 text-orange-400" />
        <span className="text-sm font-medium text-blue-200">Powered by Arc + Circle + Gemini</span>
      </motion.div>

      {/* 🟢 Title */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12 space-y-2"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/20">
          <Wallet className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          API Wallet Agent
        </h1>
        <p className="text-gray-400 text-lg">Real-time USDC Micropayments for AI Services</p>
      </motion.div>

      {/* 💳 Stats Grid (Like your screenshots) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        
        {/* Balance Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center space-y-3"
        >
          <div className="p-3 bg-yellow-500/20 rounded-xl">
             <CreditCard className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold">${balance.toFixed(2)}</h2>
          <p className="text-gray-400 text-sm">Wallet Balance</p>
        </motion.div>

        {/* Transactions Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center space-y-3"
        >
          <div className="p-3 bg-orange-500/20 rounded-xl">
             <Zap className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-3xl font-bold">{txCount}</h2>
          <p className="text-gray-400 text-sm">Transactions</p>
        </motion.div>

        {/* Protocol Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center space-y-3"
        >
          <div className="p-3 bg-blue-500/20 rounded-xl">
             <Globe className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold">x402</h2>
          <p className="text-gray-400 text-sm">Protocol</p>
        </motion.div>
      </div>

      {/* ⚙️ Configuration Section */}
      <div className="w-full max-w-4xl glass-card p-6 md:p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Settings className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-xl font-bold">Provider Configuration</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Provider URL</label>
            <div className="bg-[#1a1b26] p-4 rounded-lg text-gray-300 font-mono text-sm border border-white/5 break-all">
              https://api-wallet-agent-1.onrender.com
            </div>
          </div>
          
          <div>
             <label className="block text-sm text-gray-400 mb-2">Backend URL</label>
             <div className="bg-[#1a1b26] p-4 rounded-lg text-gray-300 font-mono text-sm border border-white/5 break-all">
               https://arcmind-backend.onrender.com
             </div>
          </div>
        </div>
      </div>

      <p className="mt-12 text-gray-500 text-sm max-w-2xl text-center">
        The future of API payments is here. Pay per request with USDC on Arc blockchain, powered by x402-style web-native micropayments.
      </p>
    </div>
  );
}
