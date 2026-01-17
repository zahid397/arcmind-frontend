'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/app/types';
import { 
  User, Bot, Copy, Edit2, Trash2, Check, 
  ExternalLink, AlertCircle, Sparkles, Brain
} from 'lucide-react';
import { cn, formatTimeAgo, truncateString } from '@/app/lib/utils';
import TransactionCard from '../ui/TransactionCard';

interface MessageBubbleProps {
  message: Message;
  onDelete?: () => void;
  onEdit?: (content: string) => void;
  isVisible?: boolean;
}

export default function MessageBubble({ 
  message, 
  onDelete, 
  onEdit,
  isVisible 
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const isUser = message.role === 'user';
  const hasReasoning = message.reasoning && message.reasoning.length > 0;
  const hasTransaction = !!message.transaction;
  const hasImage = !!message.image_url;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    if (isEditing && editContent !== message.content) {
      onEdit?.(editContent);
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    }
  };

  const getAvatar = () => {
    if (isUser) {
      return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"
        >
          <User className="w-4 h-4 text-white" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        </motion.div>
      );
    }

    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
      >
        <Bot className="w-4 h-4 text-white" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-purple-400/50"
        />
      </motion.div>
    );
  };

  return (
    <motion.div
      ref={bubbleRef}
      initial={false}
      animate={isVisible ? { 
        opacity: 1,
        scale: 1,
        filter: "blur(0px)"
      } : {
        opacity: 0,
        scale: 0.95,
        filter: "blur(10px)"
      }}
      whileHover={{ 
        scale: 1.01,
        transition: { type: "spring", stiffness: 400 }
      }}
      className={cn(
        "group relative flex gap-3",
        isUser ? "flex-row-reverse" : ""
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {getAvatar()}
      </div>

      {/* Message Content */}
      <div className={cn(
        "relative max-w-[85%] md:max-w-[75%]",
        isUser ? "items-end" : ""
      )}>
        {/* Bubble */}
        <div className={cn(
          "rounded-2xl p-4 relative overflow-hidden",
          isUser
            ? "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30"
            : "glass-morphism border border-border/50"
        )}>
          {/* Background Glow */}
          {!isUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10"
            />
          )}

          {/* Status Indicator */}
          {message.status === 'sending' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          )}

          {/* Content */}
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-foreground resize-none focus:outline-none"
              rows={Math.min(editContent.split('\n').length, 10)}
              autoFocus
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {message.content}
              </pre>
            </div>
          )}

          {/* Reasoning */}
          {hasReasoning && (
            <AnimatePresence>
              {showReasoning && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Brain className="w-3 h-3" />
                      <span>AI Reasoning Process</span>
                    </div>
                    <div className="text-sm text-gray-300">{message.reasoning}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Transaction */}
          {hasTransaction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <TransactionCard transaction={message.transaction!} />
            </motion.div>
          )}

          {/* Image */}
          {hasImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3"
            >
              <img
                src={message.image_url}
                alt="Generated content"
                className="rounded-lg max-w-full h-auto shadow-lg"
                loading="lazy"
              />
            </motion.div>
          )}
        </div>

        {/* Tool Used & Timestamp */}
        <div className={cn(
          "flex items-center gap-2 mt-2 text-xs",
          isUser ? "justify-end" : "justify-start"
        )}>
          {message.tool_used && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/50 text-muted-foreground">
              <Sparkles className="w-3 h-3" />
              {message.tool_used}
            </span>
          )}
          <span className="text-muted-foreground">
            {formatTimeAgo(message.timestamp)}
          </span>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(
              "absolute top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
              isUser 
                ? "-left-2 transform -translate-x-full" 
                : "-right-2 transform translate-x-full"
            )}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              title="Copy"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </motion.button>

            {isUser && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEdit}
                className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </motion.button>
            )}

            {hasReasoning && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowReasoning(!showReasoning)}
                className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                title="Show Reasoning"
              >
                <Brain className="w-3.5 h-3.5" />
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
          }
