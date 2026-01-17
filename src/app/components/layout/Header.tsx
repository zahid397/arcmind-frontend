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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const toggleTheme = () => {
    setDarkMode(v => !v);
    toast.success(`Switched to ${darkMode ? 'Light' : 'Dark'} mode`);
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur',
        scrolled
          ? 'bg-background/90 border-border'
          : 'bg-background/70 border-transparent'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <Zap className="text-primary" />
          <span className="font-bold text-lg">ArcMind</span>
        </div>

        {/* Search (Desktop) */}
        <div className="hidden md:flex flex-1 mx-6">
          <AnimatePresence>
            {searchOpen ? (
              <motion.input
                ref={inputRef}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-md bg-muted px-3 py-2 outline-none"
                onBlur={() => !query && setSearchOpen(false)}
              />
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded hover:bg-muted">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="p-2 rounded hover:bg-muted">
            <Bell size={18} />
          </button>

          <button className="p-2 rounded hover:bg-muted">
            <Settings size={18} />
          </button>

          <div className="flex items-center gap-2">
            <User size={18} />
            <span className="text-sm">zahid397</span>
          </div>

          <button className="p-2 rounded hover:bg-muted text-red-500">
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile menu */}
        <button
          onClick={() => setMobileMenuOpen(v => !v)}
          className="md:hidden p-2"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t bg-background"
          >
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2 p-3"
            >
              {darkMode ? <Sun /> : <Moon />}
              Theme
            </button>

            <button className="w-full flex items-center gap-2 p-3">
              <Settings /> Settings
            </button>

            <button className="w-full flex items-center gap-2 p-3">
              <HelpCircle /> Help
            </button>

            <button className="w-full flex items-center gap-2 p-3 text-red-500">
              <LogOut /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
