'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { Send, Bot, User, Sparkles, ShieldCheck } from 'lucide-react';

export default function Home() {
  // 🔴 FIX: 'isLoading' কে 'loading' হিসেবে রিনেম করা হলো যাতে তোর কোড না ভাঙ্গে
  const { messages, isLoading: loading, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // নতুন মেসেজ আসলে অটোমেটিক নিচে স্ক্রল করবে
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // সেন্ড বাটন বা এন্টার চাপলে কাজ করবে
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* 🟢 Header / Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-600 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-purple-900/20 ring-1 ring-white/10">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              ArcMind
            </h1>
            <p className="text-[10px] text-gray-400 font-mono tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-green-500" /> PRODUCTION READY
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-mono font-semibold text-green-400">ONLINE</span>
        </div>
      </header>

      {/* 💬 Chat Container */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {/* Avatar Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-lg ${
              msg.role === 'ai' || msg.role === 'assistant' 
                ? 'bg-gradient-to-br from-purple-900/40 to-black text-purple-400' 
                : 'bg-gradient-to-br from-blue-900/40 to-black text-blue-400'
            }`}>
              {msg.role === 'ai' || msg.role === 'assistant' ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-xl backdrop-blur-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-[#151515] border border-white/10 text-gray-200 rounded-tl-none'
            }`}>
              {/* Bold Text Rendering */}
              {msg.content.split('**').map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="text-white font-bold bg-white/10 px-1 rounded">{part}</strong> : part
              )}
            </div>
          </div>
        ))}

        {/* Loading Animation */}
        {loading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center border border-white/10">
              <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
            </div>
            <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}
        
        {/* Invisible div for auto-scroll */}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* ⌨️ Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/80 backdrop-blur-xl pb-6">
        <div className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Command ArcMind (e.g., 'Check Balance' or 'Buy iPhone')..."
            className="w-full bg-[#111] border border-white/10 text-white rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 shadow-inner group-hover:border-white/20"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25 transform active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Footer Info */}
        <div className="mt-3 flex justify-center gap-6 text-[10px] text-gray-600 font-mono opacity-60">
          <span className="flex items-center gap-1">● SERVER: ONLINE</span>
          <span className="flex items-center gap-1">● ENCRYPTION: 256-BIT</span>
          <span className="flex items-center gap-1">● v1.0.2 STABLE</span>
        </div>
      </div>
    </div>
  );
}
