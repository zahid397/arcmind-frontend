'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ChatContainer from './components/chat/ChatContainer';
import InputArea from './components/chat/InputArea';
import WelcomeScreen from './components/WelcomeScreen';
import { Message } from '@/types';
import { gateway } from '@/lib';
import { toast } from 'react-hot-toast';
import { generateId } from '@/lib/utils';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleSendMessage = async (content: string) => {
    setShowWelcome(false);

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: { text: content },
      timestamp: Date.now(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await gateway.chat(content);
      if (res.success && res.data) {
        setMessages(prev => [
          ...prev.map(m =>
            m.id === userMessage.id ? { ...m, status: 'delivered' } : m
          ),
          {
            id: generateId(),
            role: 'assistant',
            content: { text: res.data.message },
            timestamp: Date.now(),
            status: 'delivered',
          },
        ]);
      }
    } catch {
      toast.error('Message failed');
    } finally {
      setIsLoading(false);
    }
  };

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
