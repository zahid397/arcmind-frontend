'use client';

import { motion } from 'framer-motion';
import { Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils'; // ✅ FIXED
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">
            ArcMind
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Bell className="w-4 h-4" />
          </motion.button>

          <Link
            href="/settings"
            className={cn(
              'p-2 rounded-full hover:bg-secondary transition-colors'
            )}
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
