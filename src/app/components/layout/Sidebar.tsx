'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Trash2,
  Clock,
  ChevronRight,
  Star,
  Archive,
  Settings,
  HelpCircle,
  ExternalLink,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ----------------------------------
   TYPES (LOCAL – SAFE)
----------------------------------- */
interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  isActive?: boolean;
  isFavorite?: boolean;
}

/* ----------------------------------
   MOCK SERVICE (BUILD SAFE)
----------------------------------- */
const mockGateway = {
  createSession: async (title: string): Promise<ChatSession> => {
    await new Promise(r => setTimeout(r, 400));
    return {
      id: Date.now().toString(),
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true,
    };
  },
};

export default function Sidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* ----------------------------------
     LOAD / SAVE
  ----------------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem('arcmind_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ChatSession[];
        setSessions(parsed);
        setSelectedId(parsed[0]?.id ?? null);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('arcmind_sessions', JSON.stringify(sessions));
  }, [sessions]);

  /* ----------------------------------
     ACTIONS
  ----------------------------------- */
  const createSession = async () => {
    setLoading(true);
    const newSession = await mockGateway.createSession(
      `New Chat ${sessions.length + 1}`
    );
    setSessions(prev => [newSession, ...prev]);
    setSelectedId(newSession.id);
    setLoading(false);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
    setDeleteId(null);
  };

  const toggleFavorite = (id: string) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );
  };

  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  /* ----------------------------------
     RENDER
  ----------------------------------- */
  return (
    <>
      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-sm"
            >
              <h3 className="text-white font-semibold mb-4">
                Delete conversation?
              </h3>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-2 rounded-lg bg-gray-800 text-white"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2 rounded-lg bg-red-600 text-white"
                  onClick={() => deleteId && deleteSession(deleteId)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 288 }}
        className="hidden md:flex flex-col h-screen bg-gray-900 border-r border-gray-800"
      >
        {/* HEADER */}
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={createSession}
            disabled={loading}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-lg py-2 text-white',
              'bg-gradient-to-r from-blue-600 to-purple-600',
              loading && 'opacity-60'
            )}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Plus />}
            {!collapsed && 'New Chat'}
          </button>
        </div>

        {/* SEARCH */}
        {!collapsed && (
          <div className="p-3">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-sm text-white outline-none"
            />
          </div>
        )}

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.map(s => (
            <div
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={cn(
                'group p-3 rounded-lg cursor-pointer mb-1 border',
                selectedId === s.id
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'border-transparent hover:bg-gray-800'
              )}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-gray-400" />

                {!collapsed && (
                  <>
                    <div className="flex-1">
                      <p className="text-sm text-white truncate">{s.title}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(s.updatedAt)}
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <button onClick={e => { e.stopPropagation(); toggleFavorite(s.id); }}>
                        <Star
                          className={cn(
                            'w-4 h-4',
                            s.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'
                          )}
                        />
                      </button>
                      <button onClick={e => { e.stopPropagation(); setDeleteId(s.id); }}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white"
          >
            <ChevronRight className={cn('w-4 h-4', collapsed && 'rotate-180')} />
            {!collapsed && 'Collapse'}
          </button>

          {!collapsed && (
            <div className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              ArcMind v1.0
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
