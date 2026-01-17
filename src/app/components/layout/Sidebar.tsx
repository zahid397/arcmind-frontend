'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Trash2,
  Clock,
  ChevronRight,
} from 'lucide-react';

// ✅ CORRECT ALIASES (VERY IMPORTANT)
import { cn } from '@/app/lib/utils';
import { ChatSession } from '@/app/types';
import { gateway } from '@/app/lib/gateway';

export default function Sidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Blockchain Integration',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true,
    },
    {
      id: '2',
      title: 'AI Research Assistant',
      messages: [],
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
      isActive: false,
    },
    {
      id: '3',
      title: 'Web3 Development',
      messages: [],
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 172800000,
      isActive: false,
    },
  ]);

  const [selectedId, setSelectedId] = useState('1');
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCreateSession = async () => {
    setLoading(true);
    try {
      const res = await gateway.createSession(
        `New Chat ${sessions.length + 1}`
      );
      if (res?.success) {
        setSessions(prev => [res.data, ...prev]);
        setSelectedId(res.data.id);
      }
    } catch (err) {
      console.error('Create session failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (
    id: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      await gateway.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (selectedId === id) {
        setSelectedId(prev => prev === id ? sessions[0]?.id ?? '' : prev);
      }
    } catch (err) {
      console.error('Delete session failed', err);
    }
  };

  const formatDate = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const date = new Date(timestamp);

    if (diff < 86400000) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    if (diff < 604800000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }

    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: collapsed ? -280 : 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={cn(
        'hidden md:flex flex-col h-screen border-r border-border bg-background/50',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        {!collapsed ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateSession}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleCreateSession}
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg bg-primary text-white"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence>
          {sessions.map(session => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div
                onClick={() => setSelectedId(session.id)}
                className={cn(
                  'group p-3 rounded-lg cursor-pointer transition-all',
                  selectedId === session.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-secondary/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary">
                    <MessageSquare className="w-4 h-4" />
                  </div>

                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(session.updatedAt)}
                      </div>
                    </div>
                  )}

                  {!collapsed && (
                    <button
                      onClick={e =>
                        handleDeleteSession(session.id, e)
                      }
                      className="opacity-0 group-hover:opacity-100 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-secondary"
        >
          <ChevronRight
            className={cn(
              'transition-transform',
              collapsed && 'rotate-180'
            )}
          />
          {!collapsed && 'Collapse sidebar'}
        </button>
      </div>
    </motion.aside>
  );
}
