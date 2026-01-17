'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Sparkles } from 'lucide-react';
import InputArea from './components/chat/InputArea';
import WelcomeScreen from './components/WelcomeScreen'; // Ensure this matches your file name
import { cn } from './lib/utils';

// Message Type Definition
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartChat = () => {
    setShowWelcome(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setShowWelcome(false);

    try {
      // 2. Simulate AI API Call (Replace with real fetch later)
      // const response = await fetch('/api/chat', { ... })
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I am ArcMind AI. I am currently running in simulation mode because the backend is being connected. How can I help you construct your project today?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showWelcome && messages.length === 0) {
    return <WelcomeScreen onStartChat={handleStartChat} />;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex w-full gap-4 max-w-4xl mx-auto",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {/* Avatar for AI */}
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={cn(
                "relative px-6 py-4 rounded-2xl max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-md",
                msg.role === 'user'
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-800/50 border border-white/5 text-gray-100 rounded-bl-none"
              )}
            >
              {msg.content}
              <span className="text-[10px] text-white/40 absolute bottom-1 right-3">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Avatar for User */}
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                <User className="w-5 h-5 text-purple-400" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex gap-4 max-w-4xl mx-auto"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            </div>
            <div className="flex gap-1 items-center h-10 px-4 bg-gray-800/30 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
