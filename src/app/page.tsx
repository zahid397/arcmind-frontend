'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ChatContainer from './components/chat/ChatContainer';
import InputArea from './components/chat/InputArea';
import WelcomeScreen from './components/WelcomeScreen';
import { Message } from './types';
import { gateway } from './lib';
import { toast } from 'react-hot-toast';
import { generateId } from './lib/utils';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (content: string) => {
    if (showWelcome) setShowWelcome(false);

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await gateway.chat(content, sessionId || undefined);

      if (res.success && res.data) {
        const aiMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: res.data.message,
          timestamp: Date.now(),
          status: 'delivered',
        };

        setMessages(prev =>
          prev.map(m =>
            m.id === userMessage.id ? { ...m, status: 'delivered' } : m
          ).concat(aiMessage)
        );

        if (!sessionId && res.data.sessionId) {
          setSessionId(res.data.sessionId);
        }
      }
    } catch {
      toast.error('Message failed');
      setMessages(prev =>
        prev.map(m =>
          m.id === userMessage.id ? { ...m, status: 'error' } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, showWelcome]);

  return (
    <div className="relative h-full">
      <AnimatedBackground />

      {showWelcome && messages.length === 0 ? (
        <WelcomeScreen onStartChat={() => setShowWelcome(false)} />
      ) : (
        <>
          <ChatContainer messages={messages} isLoading={isLoading} />
          <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
        </>
      )}
    </div>
  );
}

/* 🔥 SAFE Animated Background */
function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
}
