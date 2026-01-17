'use client';

export const dynamic = 'force-dynamic'; // ✅ VERY IMPORTANT

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
        setMessages(prev => [
          ...prev.map(m =>
            m.id === userMessage.id ? { ...m, status: 'sent' } : m
          ),
          {
            id: generateId(),
            role: 'assistant',
            content: res.data.message,
            timestamp: Date.now(),
            status: 'delivered',
          },
        ]);

        if (!sessionId) setSessionId(res.data.sessionId || null);
      }
    } catch {
      toast.error('Message failed');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, showWelcome]);

  return (
    <div className="h-full flex flex-col">
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
