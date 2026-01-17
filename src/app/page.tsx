'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ChatContainer from './components/chat/ChatContainer';
import InputArea from './components/chat/InputArea';
import WelcomeScreen from './components/WelcomeScreen';
import { Message } from './types';
import { gateway } from './lib/gateway';
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
      const response = await gateway.chat(content, sessionId || undefined);
      if (response.success) {
        const assistantMessage: Message = {
          ...response.data.message,
          id: generateId(),
          timestamp: Date.now(),
          status: 'delivered',
        };
        
        setMessages(prev => {
          const updated = prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: 'delivered' as const }
              : msg
          );
          return [...updated, assistantMessage];
        });

        if (!sessionId) {
          setSessionId(response.data.sessionId);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'error' as const }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, showWelcome]);

  const handleMessageDelete = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
    toast.success('Message deleted');
  }, []);

  const handleMessageEdit = useCallback((id: string, content: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, content } : msg
    ));
    toast.success('Message updated');
  }, []);

  // Load initial messages
  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        const response = await gateway.getSessions();
        if (response.success && response.data.length > 0) {
          const latestSession = response.data[0];
          setSessionId(latestSession.id);
          setMessages(latestSession.messages.slice(-10)); // Load last 10 messages
          setShowWelcome(false);
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };

    loadInitialMessages();
  }, []);

  return (
    <div className="relative h-full">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
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
              <div className="container mx-auto max-w-4xl p-4">
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

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
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
