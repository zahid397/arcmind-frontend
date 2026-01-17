'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import ChatContainer from './components/chat/ChatContainer';
import InputArea from './components/chat/InputArea';
import WelcomeScreen from './components/WelcomeScreen';
import {
  Message,
  MessageRole,
  MessageStatus,
} from './types';
import { gateway } from './lib/gateway';
import { toast } from 'react-hot-toast';
import { generateId } from './lib/utils';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  /* ================= SEND MESSAGE ================= */

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      if (showWelcome) setShowWelcome(false);

      const now = Date.now();

      const userMessage: Message = {
        id: generateId(),
        conversation_id: sessionId ?? '',
        role: MessageRole.USER,
        content: { text, type: 'text' },
        timestamp: now,
        created_at: now,
        updated_at: now,
        status: MessageStatus.SENDING,
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await gateway.chat(text, sessionId ?? undefined);

        if (!response.success) {
          throw new Error(response.error || 'Chat failed');
        }

        const assistantMessage = response.data.message;

        setMessages(prev =>
          prev.map(msg =>
            msg.id === userMessage.id
              ? { ...msg, status: MessageStatus.DELIVERED }
              : msg
          ).concat({
            ...assistantMessage,
            id: assistantMessage.id || generateId(),
            status: MessageStatus.DELIVERED,
          })
        );

        if (!sessionId && response.data.session?.id) {
          setSessionId(response.data.session.id);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to send message');

        setMessages(prev =>
          prev.map(msg =>
            msg.id === userMessage.id
              ? { ...msg, status: MessageStatus.ERROR }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, showWelcome]
  );

  /* ================= MESSAGE ACTIONS ================= */

  const handleMessageDelete = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    toast.success('Message deleted');
  }, []);

  const handleMessageEdit = useCallback((id: string, text: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, content: { ...m.content, text }, updated_at: Date.now() }
          : m
      )
    );
    toast.success('Message updated');
  }, []);

  /* ================= LOAD LAST SESSION ================= */

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await gateway.getSessions();
        if (res.success && res.data.length > 0) {
          const latest = res.data[0];
          setSessionId(latest.id);
          setMessages(latest.messages.slice(-10));
          setShowWelcome(false);
        }
      } catch (err) {
        console.error('Failed to load sessions', err);
      }
    };

    loadSessions();
  }, []);

  /* ================= RENDER ================= */

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
              onMessageDelete={handleMessageDelete}
              onMessageEdit={handleMessageEdit}
            />

            <div className="border-t border-border/50 bg-background/80 backdrop-blur-lg">
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

/* ================= SAFE ANIMATED BACKGROUND ================= */

function AnimatedBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />

      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          initial={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ top: [`${p.y}%`, `${(p.y + 20) % 100}%`] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
}
