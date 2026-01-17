'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Trash2,
  Clock,
  ChevronRight,
  Bot,
  Zap,
  Star,
  Archive,
  Settings,
  HelpCircle,
  ExternalLink,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { ChatSession } from '@/app/types';

// Mock gateway service since actual might not be available
const mockGateway = {
  createSession: async (title: string): Promise<{ success: boolean; data?: ChatSession }> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return {
      success: true,
      data: {
        id: Date.now().toString(),
        title,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isActive: true,
      },
    };
  },
  deleteSession: async (id: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },
};

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
    {
      id: '4',
      title: 'Smart Contract Audit',
      messages: [],
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 259200000,
      isActive: false,
    },
    {
      id: '5',
      title: 'NFT Marketplace Design',
      messages: [],
      createdAt: Date.now() - 345600000,
      updatedAt: Date.now() - 345600000,
      isActive: false,
    },
  ]);

  const [selectedId, setSelectedId] = useState('1');
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize from localStorage if needed
  useEffect(() => {
    const savedSessions = localStorage.getItem('arcmind_sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setSelectedId(parsed[0]?.id || '1');
        }
      } catch (e) {
        console.error('Failed to load sessions:', e);
      }
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('arcmind_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleCreateSession = async () => {
    setLoading(true);
    try {
      const res = await mockGateway.createSession(`New Chat ${sessions.length + 1}`);
      if (res?.success && res.data) {
        setSessions(prev => [res.data!, ...prev]);
        setSelectedId(res.data.id);
      }
    } catch (err) {
      console.error('Create session failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await mockGateway.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (selectedId === id) {
        setSelectedId(sessions[0]?.id || '');
      }
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Delete session failed:', err);
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

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => 
      prev.map(session => 
        session.id === id 
          ? { ...session, isFavorite: !session.isFavorite }
          : session
      )
    );
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Delete Conversation</h3>
                  <p className="text-sm text-gray-400">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => showDeleteConfirm && handleDeleteSession(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: collapsed ? -280 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "hidden md:flex flex-col h-screen border-r border-gray-800 bg-gray-900/90 backdrop-blur-sm",
          collapsed ? "w-16" : "w-72"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          {!collapsed ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateSession}
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
                "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
                "hover:from-blue-700 hover:to-purple-700",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-300 shadow-lg"
              )}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span className="font-medium">New Chat</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateSession}
              disabled={loading}
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg bg-blue-600 text-white"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </motion.button>
          )}
        </div>

        {/* Search - Only when expanded */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 py-3 border-b border-gray-800"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg 
                         text-sm text-white placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <SearchIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-0.5 rounded hover:bg-gray-700"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <AnimatePresence mode="popLayout">
              {filteredSessions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-500"
                >
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations found</p>
                </motion.div>
              ) : (
                filteredSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="mb-1"
                  >
                    <div
                      onClick={() => setSelectedId(session.id)}
                      className={cn(
                        "group relative p-3 rounded-lg cursor-pointer transition-all duration-300",
                        "hover:bg-gray-800/70",
                        selectedId === session.id
                          ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30"
                          : "border border-transparent"
                      )}
                    >
                      {/* Active indicator */}
                      {selectedId === session.id && (
                        <motion.div
                          layoutId="activeSession"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg"
                        />
                      )}

                      <div className="relative flex items-center gap-3">
                        {/* Avatar */}
                        <div className={cn(
                          "relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          selectedId === session.id
                            ? "bg-gradient-to-br from-blue-500 to-purple-600"
                            : "bg-gray-800"
                        )}>
                          <MessageSquare className={cn(
                            "w-4 h-4",
                            selectedId === session.id ? "text-white" : "text-gray-400"
                          )} />
                          {session.isActive && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-900" />
                          )}
                        </div>

                        {/* Content - Only when expanded */}
                        {!collapsed && (
                          <>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-white truncate">
                                  {session.title}
                                </p>
                                <ChevronRight className={cn(
                                  "w-4 h-4 text-gray-500 transition-transform flex-shrink-0",
                                  selectedId === session.id && "rotate-90 text-blue-400"
                                )} />
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-500">
                                  {formatDate(session.updatedAt)}
                                </span>
                                {session.isFavorite && (
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                )}
                              </div>
                            </div>

                            {/* Actions - Show on hover */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => toggleFavorite(session.id, e)}
                                className="p-1 rounded hover:bg-gray-700 transition-colors"
                              >
                                <Star className={cn(
                                  "w-3.5 h-3.5",
                                  session.isFavorite
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-500"
                                )} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDeleteConfirm(session.id);
                                }}
                                className="p-1 rounded hover:bg-red-500/10 text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 mb-4"
            >
              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{sessions.length} chats</span>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Archive className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Links */}
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-400 hover:text-white">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-400 hover:text-white">
                  <HelpCircle className="w-4 h-4" />
                  Help & Support
                </button>
                <a
                  href="https://github.com/zahid397/ArcMind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-400 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </motion.div>
          )}

          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          >
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform duration-300",
              collapsed && "rotate-180"
            )} />
            {!collapsed && (
              <span className="text-sm">Collapse sidebar</span>
            )}
          </button>

          {/* Version Info */}
          {!collapsed && (
            <div className="mt-3 text-center">
              <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                ArcMind v1.0
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}

// Search Icon Component
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
               }
