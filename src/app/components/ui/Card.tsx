'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // ✅ FIXED

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  borderGradient?: boolean;
}

export default function Card({
  children,
  className,
  hoverEffect = true,
  borderGradient = false,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverEffect ? { scale: 1.02 } : {}}
      className={cn(
        'rounded-xl border bg-card text-card-foreground shadow-sm',
        borderGradient && 'gradient-border',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
