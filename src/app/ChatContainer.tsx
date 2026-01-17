'use client';

import { motion } from 'framer-motion';
import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface ChatContainerProps {
  messages: Message[];
  isLoading?: boolean;
  onMessageDelete?: (id: string) => void;
  onMessageEdit?: (id: string, content: string) => void;
}

export default function ChatContainer({
  messages,
  isLoading,
}: ChatContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.length === 0 && !isLoading && (
        <p className="text-center text-gray-500">No messages yet</p>
      )}

      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'max-w-xl p-4 rounded-xl',
            msg.role === 'user'
              ? 'ml-auto bg-blue-600 text-white'
              : 'mr-auto bg-gray-800 text-gray-100'
          )}
        >
          {typeof msg.content === 'string'
            ? msg.content
            : msg.content?.text}
        </motion.div>
      ))}

      {isLoading && (
        <div className="text-center text-sm text-gray-400">
          AI is typing...
        </div>
      )}
    </div>
  );
}
