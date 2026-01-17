// src/app/components/chat/ChatContainer.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { cn, formatTime } from '@/app/lib/utils'
import { Message } from '@/app/types'
import InputArea from './InputArea'

const initialMessages: Message[] = [
{
id: '1',
content: 'Hello! I'm ArcMind, your AI assistant. How can I help you today?',
role: 'assistant',
timestamp: new Date(Date.now() - 3600000),
},
{
id: '2',
content: 'Can you explain quantum computing in simple terms?',
role: 'user',
timestamp: new Date(Date.now() - 1800000),
},
{
id: '3',
content: 'Quantum computing uses qubits that can be both 0 and 1 simultaneously (superposition), allowing parallel computations. It's like being in multiple places at once!',
role: 'assistant',
timestamp: new Date(Date.now() - 1200000),
},
]

export default function ChatContainer() {
const [messages, setMessages] = useState<Message[]>(initialMessages)
const [isLoading, setIsLoading] = useState(false)
const messagesEndRef = useRef<HTMLDivElement>(null)

const scrollToBottom = () => {
messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
}

useEffect(() => {
scrollToBottom()
}, [messages])

const handleSendMessage = async (content: string) => {
if (!content.trim()) return

const userMessage: Message = {  
  id: Date.now().toString(),  
  content,  
  role: 'user',  
  timestamp: new Date(),  
  status: 'sending'  
}  

setMessages(prev => [...prev, userMessage])  
setIsLoading(true)  

try {  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`, {  
    method: 'POST',  
    headers: { 'Content-Type': 'application/json' },  
    body: JSON.stringify({ message: content }),  
  })  

  if (!response.ok) throw new Error('Failed to send message')  

  const data = await response.json()  

  const aiMessage: Message = {  
    id: (Date.now() + 1).toString(),  
    content: data.message || 'I received your message!',  
    role: 'assistant',  
    timestamp: new Date(),  
  }  

  setMessages(prev =>   
    prev.map(msg =>   
      msg.id === userMessage.id   
        ? { ...msg, status: 'sent' }  
        : msg  
    ).concat(aiMessage)  
  )  
} catch (error) {  
  console.error('Error sending message:', error)  
  setMessages(prev =>   
    prev.map(msg =>   
      msg.id === userMessage.id   
        ? { ...msg, status: 'error' }  
        : msg  
    )  
  )  
} finally {  
  setIsLoading(false)  
}

}

return (
<div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
{/* Chat Header */}
<div className="p-4 border-b border-compost-800/50">
<div className="flex items-center gap-3">
<div className="relative">
<div className="absolute inset-0 bg-neon-cyan rounded-full blur-lg opacity-20 animate-pulse" />
<Bot className="h-6 w-6 text-neon-cyan relative" />
</div>
<div>
<h2 className="font-semibold">ArcMind Assistant</h2>
<p className="text-xs text-muted-foreground flex items-center gap-1">
<Sparkles className="h-3 w-3" />
Powered by advanced AI
</p>
</div>
</div>
</div>

{/* Messages Container */}  
  <div className="flex-1 overflow-y-auto p-4 space-y-6">  
    <AnimatePresence>  
      {messages.map((message, index) => (  
        <motion.div  
          key={message.id}  
          initial={{ opacity: 0, y: 20 }}  
          animate={{ opacity: 1, y: 0 }}  
          exit={{ opacity: 0, y: -20 }}  
          transition={{ delay: index * 0.1 }}  
          className={cn(  
            "flex gap-3",  
            message.role === 'user' ? 'justify-end' : 'justify-start'  
          )}  
        >  
          {message.role === 'assistant' && (  
            <motion.div  
              animate={{   
                rotate: [0, 10, -10, 0],  
                scale: [1, 1.1, 1]  
              }}  
              transition={{   
                duration: 2,  
                repeat: Infinity,  
                repeatType: "reverse"  
              }}  
              className="flex-shrink-0"  
            >  
              <div className="relative">  
                <div className="absolute inset-0 bg-neon-cyan rounded-full blur-md opacity-30" />  
                <div className="relative p-2 rounded-full bg-compost-900 border border-neon-cyan/30">  
                  <Bot className="h-4 w-4 text-neon-cyan" />  
                </div>  
              </div>  
            </motion.div>  
          )}  

          <div className={cn(  
            "max-w-[80%] md:max-w-[70%] rounded-2xl p-4 relative overflow-hidden",  
            message.role === 'user'  
              ? "bg-gradient-to-br from-compost-800 to-compost-900 border border-compost-700 rounded-br-none"  
              : "bg-gradient-to-br from-background to-compost-950 border border-compost-800/50 rounded-bl-none"  
          )}>  
            {/* Animated border effect for AI messages */}  
            {message.role === 'assistant' && (  
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-gradient-shift" />  
            )}  

            <p className="text-sm md:text-base">{message.content}</p>  
              
            <div className="flex items-center justify-between mt-2">  
              <span className="text-xs text-muted-foreground">  
                {formatTime(message.timestamp)}  
              </span>  
                
              {message.status === 'sending' && (  
                <Loader2 className="h-3 w-3 animate-spin text-neon-yellow" />  
              )}  
              {message.status === 'error' && (  
                <span className="text-xs text-red-500">Failed</span>  
              )}  
            </div>  
          </div>  

          {message.role === 'user' && (  
            <motion.div  
              whileHover={{ scale: 1.1 }}  
              className="flex-shrink-0"  
            >  
              <div className="relative">  
                <div className="absolute inset-0 bg-neon-green rounded-full blur-md opacity-30" />  
                <div className="relative p-2 rounded-full bg-compost-900 border border-neon-green/30">  
                  <User className="h-4 w-4 text-neon-green" />  
                </div>  
              </div>  
            </motion.div>  
          )}  
        </motion.div>  
      ))}  
    </AnimatePresence>  

    {isLoading && (  
      <motion.div  
        initial={{ opacity: 0, y: 10 }}  
        animate={{ opacity: 1, y: 0 }}  
        className="flex gap-3"  
      >  
        <div className="relative">  
          <div className="absolute inset-0 bg-neon-cyan rounded-full blur-md opacity-30" />  
          <div className="relative p-2 rounded-full bg-compost-900 border border-neon-cyan/30">  
            <Bot className="h-4 w-4 text-neon-cyan" />  
          </div>  
        </div>  
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-background to-compost-950 border border-compost-800/50 rounded-bl-none">  
          <div className="flex gap-1">  
            {[1, 2, 3].map((i) => (  
              <motion.div  
                key={i}  
                animate={{ y: [0, -5, 0] }}  
                transition={{  
                  duration: 0.6,  
                  repeat: Infinity,  
                  delay: i * 0.2,  
                }}  
                className="w-2 h-2 rounded-full bg-neon-cyan"  
              />  
            ))}  
          </div>  
        </div>  
      </motion.div>  
    )}  

    <div ref={messagesEndRef} />  
  </div>  

  {/* Input Area */}  
  <div className="p-4 border-t border-compost-800/50">  
    <InputArea onSendMessage={handleSendMessage} disabled={isLoading} />  
  </div>  
</div>

)
  }
