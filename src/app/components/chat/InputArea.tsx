'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Smile,
  Image as ImageIcon,
  Zap,
  Paperclip,
  Mic,
  StopCircle,
  Brain,
  X,
} from 'lucide-react';
import { cn, debounce } from '@/lib/utils'; // ✅ FIXED PATH
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success('Recording started');
    } else {
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachments((prev) => [...prev, ...files]);
      toast.success(`${files.length} file(s) attached`);
      onAttachment?.(files[0]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuickAction = (prompt: string) => {
    setInput((prev) => prev + prompt);
    setShowQuickActions(false);
    textareaRef.current?.focus();
  };

  // Debounced input handler
  const debouncedInputChange = debounce((value: string) => {
    // future autosave / hints
  }, 1000);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    debouncedInputChange(value);
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
                  className="p-1 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_ACTIONS.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <action.icon className="w-4 h-4" />
                    <span className="text-xs">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex gap-2 mb-2 overflow-x-auto pb-2"
          >
            {attachments.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border"
              >
                <Paperclip className="w-4 h-4" />
                <span className="text-sm truncate max-w-[100px]">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="p-0.5 rounded hover:bg-destructive/10 text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Area */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask ArcMind anything..."
            className="relative w-full p-4 pl-14 pr-36 bg-background/80 backdrop-blur-lg
              border-2 border-border rounded-2xl focus:outline-none
              focus:border-primary/50 focus:ring-2 focus:ring-primary/20
              resize-none min-h-[60px] max-h-48 text-sm leading-relaxed
              placeholder:text-muted-foreground/50"
            rows={1}
            disabled={isLoading}
          />

          {/* Left Icons */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowQuickActions(!showQuickActions)}
              className={cn(
                'p-2 rounded-full transition-colors',
                showQuickActions ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              )}
            >
              <Zap className="w-4 h-4" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFileUpload}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Right Icons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Smile className="w-4 h-4" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRecording}
              className={cn(
                'p-2 rounded-full transition-colors',
                isRecording
                  ? 'bg-destructive text-destructive-foreground animate-pulse'
                  : 'hover:bg-secondary'
              )}
            >
              {isRecording ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </motion.button>

            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'p-2.5 rounded-xl transition-all duration-300',
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-secondary text-muted-foreground cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 px-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button type="button" className="hover:text-foreground" onClick={() => setInput((p) => p + '```code```')}>
              Code block
            </button>
            <button type="button" className="hover:text-foreground" onClick={() => setInput((p) => p + '**bold**')}>
              Markdown
            </button>
            <span className={cn(input.length > 4000 ? 'text-destructive' : '')}>
              {input.length}/4000
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
}
