'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ChatContainer from '@/components/chat/ChatContainer';
import InputArea from '@/components/chat/InputArea';
import WelcomeScreen from '@/components/WelcomeScreen';
import { Message } from '@/types';
import { gateway } from '@/lib';
import { toast } from 'react-hot-toast';
import { generateId } from '@/lib/utils';

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setShowWelcome(false);

    try {
      const res = await gateway.chat(content);
      if (res.success && res.data) {
        setMessages(prev => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: res.data.message,
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
  }, []);

  if (showWelcome && messages.length === 0) {
    return <WelcomeScreen onStartChat={() => setShowWelcome(false)} />;
  }

  return (
    <motion.div className="flex flex-col h-full">
      <ChatContainer messages={messages} isLoading={isLoading} />
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </motion.div>
  );
}
