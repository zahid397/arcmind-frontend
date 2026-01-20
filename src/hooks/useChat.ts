import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// 🛠️ Types Definition
export interface Transaction {
  type: 'buy' | 'sell' | 'transfer';
  amount: number;
  asset: string;
  hash: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status?: 'pending' | 'success' | 'error';
}

interface UseChatProps {
  onTransaction?: (tx: Transaction) => void;
}

export const useChat = ({ onTransaction }: UseChatProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // 💬 Initial Welcome Message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      content: "ArcMind Core Online. I am connected to the Groq LPU™. Ready to analyze markets and execute trades on Arc Chain.",
      role: 'assistant',
      timestamp: new Date(),
      status: 'success'
    }
  ]);

  // 🚀 Send Message Function
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // ১. ইউজার মেসেজ অ্যাড করা (Optimistic UI)
    const userMsg: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      status: 'pending' // এখানে ঠিক আছে কারণ এটা টাইপ করা অবজেক্ট
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // ২. রিয়েল API কল (Backend)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();

      // ৩. AI রেসপন্স অ্যাড করা
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        status: 'success'
      };

      // ✅ FIX: 'as const' ব্যবহার করা হয়েছে টাইপ এরর ফিক্স করতে
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === userMsg.id 
            ? { ...msg, status: 'success' as const } 
            : msg
        ).concat(aiMsg)
      );

      // ৪. ট্রানজেকশন হ্যান্ডেল করা (যদি থাকে)
      if (data.transaction) {
        toast.success(`Transaction Initiated: ${data.transaction.type.toUpperCase()}`, {
          icon: '🚀',
          style: {
            borderRadius: '10px',
            background: '#1e1b4b',
            color: '#fff',
            border: '1px solid #7C3AED'
          },
        });

        // প্যারেন্ট কম্পোনেন্টকে জানানো (ব্যালেন্স আপডেট করার জন্য)
        if (onTransaction) {
          onTransaction(data.transaction);
        }
      }

    } catch (error) {
      console.error('Chat Error:', error);
      toast.error("Connection Failed. Groq API might be busy.");
      
      // ✅ FIX: এখানেও 'as const' দেওয়া হয়েছে
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === userMsg.id 
            ? { ...msg, status: 'error' as const } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [onTransaction]);

  // ক্লিয়ার চ্যাট ফাংশন (অপশনাল)
  const clearChat = () => {
    setMessages([]);
  };

  return { 
    messages, 
    isLoading, 
    sendMessage, 
    clearChat 
  };
};
