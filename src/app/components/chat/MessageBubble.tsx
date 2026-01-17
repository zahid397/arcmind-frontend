'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/app/types';
import { 
  User, Bot, Copy, Edit2, Trash2, Check, 
  ExternalLink, AlertCircle, Sparkles, Brain
} from 'lucide-react';
import { cn, formatTimeAgo } from '@/app/lib/utils';
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
  isVisible = true 
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const isUser = message.role === 'user';
  const hasReasoning = message.reasoning && message.reasoning.trim().length > 0;
  const hasTransaction = !!message.transaction;
  const hasImage = !!message.image_url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleEdit = () => {
    if (isEditing && editContent.trim() && editContent !== message.content) {
      onEdit?.(editContent.trim());
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleEdit();
    }
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const getAvatar = () => {
    if (isUser) {
      return (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md"
        >
          <User className="w-4 h-4 text-white" />
          <motion.div 
            initial={false}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
          />
        </motion.div>
      );
    }

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md"
      >
        <Bot className="w-4 h-4 text-white" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-purple-400/30"
        />
      </motion.div>
    );
  };

  return (
    <motion.div
      ref={bubbleRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={isVisible ? { 
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)"
      } : {
        opacity: 0,
        y: 10,
        scale: 0.95,
        filter: "blur(10px)"
      }}
      whileHover={{ 
        scale: 1.005,
        transition: { type: "spring", stiffness: 300 }
      }}
      className={cn(
        "group relative flex gap-3 px-4",
        isUser ? "flex-row-reverse" : ""
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {getAvatar()}
      </div>

      {/* Message Content */}
      <div className={cn(
        "relative max-w-[85%] md:max-w-[75%] flex flex-col",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Bubble */}
        <div className={cn(
          "rounded-2xl p-4 relative overflow-hidden shadow-sm",
          isUser
            ? "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20"
            : "bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700/30 backdrop-blur-sm"
        )}>
          {/* Status Indicator */}
          {message.status === 'sending' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 -right-1 w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          )}

          {/* Error Indicator */}
          {message.status === 'error' && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-2 h-2 text-white" />
            </div>
          )}

          {/* Content */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-foreground resize-none focus:outline-none rounded p-2 border border-gray-600"
                rows={Math.min(editContent.split('\n').length, 8)}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {message.content}
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
                  transition={{ duration: 0.2 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Brain className="w-3 h-3" />
                      <span className="font-medium">AI Reasoning Process</span>
                    </div>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                      {message.reasoning}
                    </div>
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
              transition={{ duration: 0.3 }}
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
              transition={{ duration: 0.3 }}
              className="mt-3"
            >
              <img
                src={message.image_url}
                alt="Generated by AI"
                className="rounded-lg max-w-full h-auto shadow-lg"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.insertAdjacentHTML(
                    'beforeend',
                    '<div class="p-4 bg-gray-800/50 rounded-lg text-sm text-gray-400">Image failed to load</div>'
                  );
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Tool Used & Timestamp */}
        <div className={cn(
          "flex items-center gap-2 mt-1.5 text-xs",
          isUser ? "justify-end" : "justify-start"
        )}>
          {message.tool_used && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/30 text-muted-foreground border border-border">
              <Sparkles className="w-3 h-3" />
              {message.tool_used}
            </span>
          )}
          <span className="text-muted-foreground/70">
            {formatTimeAgo(message.timestamp)}
          </span>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "absolute top-2 flex gap-1 transition-opacity duration-200",
              isUser 
                ? "-left-1 transform -translate-x-full" 
                : "-right-1 transform translate-x-full"
            )}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-colors"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </motion.button>

            {isUser && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEdit}
                className="p-1.5 rounded-lg bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-colors"
                title="Edit message"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </motion.button>
            )}

            {hasReasoning && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowReasoning(!showReasoning)}
                className={cn(
                  "p-1.5 rounded-lg backdrop-blur-sm transition-colors",
                  showReasoning
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-gray-800/80 hover:bg-gray-700/80"
                )}
                title={showReasoning ? "Hide reasoning" : "Show reasoning"}
              >
                <Brain className="w-3.5 h-3.5" />
              </motion.button>
            )}

            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDelete}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="Delete message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            )}

            {hasTransaction && (
              <a
                href={message.transaction!.explorer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-colors"
                title="View transaction"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
        }
