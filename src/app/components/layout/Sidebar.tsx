'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Clock, 
  Star, 
  ChevronRight,
  Bot,
  Database,
  Zap
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { ChatSession } from '@/app/types';
import { gateway } from '@/app/lib/gateway';

export default function Sidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: '1', title: 'Blockchain Integration', messages: [], createdAt: Date.now(), updatedAt: Date.now(), isActive: true },
    { id: '2', title: 'AI Research Assistant', messages: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000, isActive: false },
    { id: '3', title: 'Web3 Development', messages: [], createdAt: Date.now() - 172800000, updatedAt: Date.now() - 172800000, isActive: false },
  ]);
  const [selectedId, setSelectedId] = useState('1');
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCreateSession = async () => {
    setLoading(true);
    try {
      const response = await gateway.createSession(`New Chat ${sessions.length + 1}`);
      if (response.success) {
        setSessions(prev => [response.data, ...prev]);
        setSelectedId(response.data.id);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await gateway.deleteSession(id);
      setSessions(prev => prev.filter(session => session.id !== id));
      if (selectedId === id) {
        setSelectedId(sessions[0]?.id || '');
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;
    
    if (diff < 86400000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: collapsed ? -280 : 0 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn(
        "hidden md:flex flex-col h-screen border-r border-border bg-background/50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        {!collapsed ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateSession}
            disabled={loading}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
              "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
              "hover:from-blue-600 hover:to-purple-700",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-300"
            )}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ rotate: 90 }}
            onClick={handleCreateSession}
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg bg-primary text-white"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <AnimatePresence>
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  onClick={() => setSelectedId(session.id)}
                  className={cn(
                    "group relative p-3 rounded-lg cursor-pointer transition-all duration-300",
                    selectedId === session.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-secondary/50"
                  )}
                >
                  {selectedId === session.id && (
                    <motion.div
                      layoutId="activeSession"
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-lg"
                    />
                  )}

                  <div className="relative flex items-center gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                      selectedId === session.id
                        ? "bg-primary text-white"
                        : "bg-secondary text-foreground"
                    )}>
                      <MessageSquare className="w-4 h-4" />
                    </div>

                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {session.title}
                          </p>
                          <ChevronRight className={cn(
                            "w-4 h-4 transition-transform",
                            selectedId === session.id && "rotate-90"
                          )} />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(session.updatedAt)}</span>
                          {session.isActive && (
                            <span className="flex items-center gap-1 text-green-500">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              Live
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-destructive/10 text-destructive transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-medium">Pro Plan</p>
                <p className="text-xs text-muted-foreground">Unlimited access</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-secondary transition-colors"
          >
            <div className={cn(
              "transition-transform duration-300",
              collapsed ? "rotate-180" : ""
            )}>
              <ChevronRight className="w-4 h-4" />
            </div>
            {!collapsed && <span className="text-sm">Collapse sidebar</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
