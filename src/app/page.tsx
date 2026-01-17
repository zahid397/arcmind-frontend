'use client';

export const dynamic = 'force-dynamic';

import { useState, useCallback } from 'react';
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
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

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
      const res = await gateway.chat(content, sessionId);

      if (res.success && res.data) {
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: res.data.message,
          timestamp: Date.now(),
          status: 'delivered',
        };

        setMessages(prev =>
          prev.map(m =>
            m.id === userMessage.id
              ? { ...m, status: 'delivered' }
              : m
          ).concat(assistantMessage)
        );

        if (!sessionId && res.data.sessionId) {
          setSessionId(res.data.sessionId);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Message send failed');

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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative h-full flex flex-col"
      >
        {showWelcome && messages.length === 0 ? (
          <WelcomeScreen onStartChat={() => setShowWelcome(false)} />
        ) : (
          <>
            <ChatContainer
              messages={messages}
              isLoading={isLoading}
            />

            <div className="border-t bg-background/80 backdrop-blur">
              <div className="mx-auto max-w-4xl p-4">
                <InputArea
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ================= SAFE CLIENT-ONLY BACKGROUND ================= */

function AnimatedBackground() {
  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 16 }).map((_, i) => (
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
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
}
