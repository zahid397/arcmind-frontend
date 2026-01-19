// src/hooks/useChat.ts
import { useState } from 'react';
import { Message } from '@/types';
import { sendMessageToAgent } from '@/services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: '👋 Welcome to ArcMind! Connected to Live Server. How can I help you?',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // ১. ইউজারের মেসেজ অ্যাড করা
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // ২. সার্ভারে কল করা
      const data = await sendMessageToAgent(content);

      // ৩. AI-এর উত্তর অ্যাড করা
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: '⚠️ Error: Could not reach ArcMind server. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
};
