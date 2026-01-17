'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Settings,
  User,
  Zap,
  Menu,
  X,
  HelpCircle,
  Moon,
  Sun,
  LogOut,
  Shield,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    toast.success(`Switched to ${darkMode ? 'Light' : 'Dark'} mode`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.success(`Searching for: ${searchQuery}`);
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className={cn(
        'sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors',
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 border-gray-200 dark:border-gray-800'
          : 'bg-white/70 dark:bg-gray-900/70 border-transparent'
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              ArcMind
            </h1>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>

        {/* Search (desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <AnimatePresence>
            {searchOpen ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSearch}
                className="relative w-full"
              >
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-2 pl-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-blue-500" />
            )}
          </button>

          <button
            onClick={() => toast.success('Notifications cleared')}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          <button className="hidden md:inline-flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Settings className="w-5 h-5" />
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
