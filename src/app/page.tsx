'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ChatContainer from './components/chat/ChatContainer';
import InputArea from './components/chat/InputArea';
import WelcomeScreen from './components/WelcomeScreen';
import { Message } from './types';
import { getGateway } from './lib/gateway';
import { toast } from 'react-hot-toast';
import { generateId } from './lib/utils';

export default function Home() {
  const gateway = getGateway();

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
      const response = await gateway.chat(content, sessionId || undefined);

      if (response.success) {
        const assistantMessage: Message = {
          ...response.data.message,
          id: generateId(),
          timestamp: Date.now(),
          status: 'delivered',
        };

        setMessages(prev => [
          ...prev.map(m =>
            m.id === userMessage.id ? { ...m, status: 'delivered' } : m
          ),
          assistantMessage,
        ]);

        if (!sessionId && response.data.sessionId) {
          setSessionId(response.data.sessionId);
        }
      }
    } catch (err) {
      toast.error('Failed to send message');
      setMessages(prev =>
        prev.map(m =>
          m.id === userMessage.id ? { ...m, status: 'error' } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [gateway, sessionId, showWelcome]);

  return (
    <div className="relative h-full">
      <AnimatedBackground />

      {showWelcome && messages.length === 0 ? (
        <WelcomeScreen onStartChat={() => setShowWelcome(false)} />
      ) : (
        <>
          <ChatContainer
            messages={messages}
            isLoading={isLoading}
          />
          <InputArea
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}

/* ================= SAFE BACKGROUND ================= */

function AnimatedBackground() {
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setSize({
      w: window.innerWidth,
      h: window.innerHeight,
    });
  }, []);

  if (!size.w) return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          initial={{
            x: Math.random() * size.w,
            y: Math.random() * size.h,
          }}
          animate={{
            x: Math.random() * size.w,
            y: Math.random() * size.h,
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
}
