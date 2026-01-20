'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, Terminal, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function AgentTerminal({ onTransaction }: { onTransaction: (tx: any) => void }) {
  const [messages, setMessages] = useState<any[]>([{ id: '1', role: 'assistant', content: "ArcMind Online. Ready for commands." }])
  const [input, setInput] = useState(''); const [isTyping, setIsTyping] = useState(false); const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSubmit = async (e: any) => {
    e.preventDefault(); if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]); setInput(''); setIsTyping(true);

    try {
      const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ content: userMsg.content }) });
      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: data.response }]);
      if (data.transaction) { onTransaction(data.transaction); toast.success(`Tx Executed: ${data.transaction.type}`); }
    } catch { toast.error("Connection Failed"); } finally { setIsTyping(false); }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex items-center gap-2"><Terminal className="h-4 w-4 text-arc-cyan" /><span className="text-sm font-bold text-white">Agent Terminal</span></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl ${m.role === 'user' ? 'bg-arc-blue/20 border border-arc-blue/30' : 'bg-white/5 border border-white/10'}`}>
              <p className="text-sm text-gray-200">{m.content}</p>
            </div>
          </div>
        ))}
        {isTyping && <div className="flex gap-2 text-xs text-gray-500"><Loader2 className="h-3 w-3 animate-spin" /> Thinking...</div>}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 relative">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type command..." className="w-full bg-white/5 rounded-lg pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-arc-blue" disabled={isTyping} />
        <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2"><Send className="h-4 w-4 text-gray-400" /></button>
      </form>
    </div>
  )
}
