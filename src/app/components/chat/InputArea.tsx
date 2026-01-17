'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Smile,
  Zap,
  Paperclip,
  Mic,
  StopCircle,
  Brain,
  X,
} from 'lucide-react';

// ✅ CORRECT PATH (MOST IMPORTANT FIX)
import { cn, debounce } from '@/app/lib/utils';

import { toast } from 'react-hot-toast';

interface InputAreaProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onAttachment?: (file: File) => void;
}

const QUICK_ACTIONS = [
  { icon: Zap, label: 'Generate Image', prompt: 'Generate an image of ' },
  { icon: Brain, label: 'Explain Code', prompt: 'Explain this code: ' },
  { icon: Zap, label: 'Blockchain', prompt: 'Create a blockchain transaction for ' },
];

export default function InputArea({
  onSendMessage,
  isLoading,
  onAttachment,
}: InputAreaProps) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input);
    setInput('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleRecording = () => {
    setIsRecording((prev) => !prev);
    toast.success(isRecording ? 'Recording stopped' : 'Recording started');
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setAttachments((prev) => [...prev, ...files]);
    onAttachment?.(files[0]);
    toast.success(`${files.length} file(s) attached`);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuickAction = (prompt: string) => {
    setInput((prev) => prev + prompt);
    setShowQuickActions(false);
    textareaRef.current?.focus();
  };

  const debouncedInputChange = debounce(() => {}, 1000);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    debouncedInputChange();
  };

  return (
    <div className="relative">
      {/* Quick Actions */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full left-0 right-0 mb-2"
          >
            <div className="bg-background/95 backdrop-blur-lg rounded-xl border border-border p-3 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Quick Actions</p>
                <button
                  onClick={() => setShowQuickActions(false)}
                  className="p-1 rounded-lg hover:bg-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg bg-secondary/50 hover:bg-secondary"
                  >
                    <action.icon className="w-4 h-4" />
                    <span className="text-xs">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border"
            >
              <Paperclip className="w-4 h-4" />
              <span className="text-sm truncate max-w-[100px]">{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask ArcMind anything..."
            disabled={isLoading}
            className="w-full p-4 pl-14 pr-36 rounded-2xl bg-background/80 border resize-none"
          />

          {/* Left */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              type="button"
              onClick={() => setShowQuickActions(!showQuickActions)}
              className={cn(
                'p-2 rounded-full',
                showQuickActions ? 'bg-primary text-white' : 'hover:bg-secondary'
              )}
            >
              <Zap className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleFileUpload}
              className="p-2 rounded-full hover:bg-secondary"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          {/* Right */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <button type="button" onClick={handleRecording} className="p-2 rounded-full">
              {isRecording ? <StopCircle /> : <Mic />}
            </button>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-primary text-white"
            >
              {isLoading ? '...' : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
