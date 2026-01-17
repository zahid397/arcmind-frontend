'use client';

import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  borderGradient?: boolean;
  glassEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  delay?: number;
}

export default function Card({
  children,
  className,
  hoverEffect = true,
  borderGradient = false,
  glassEffect = false,
  padding = 'md',
  delay = 0,
}: CardProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={hoverEffect ? { 
        y: -4,
        transition: { duration: 0.2 }
      } : undefined}
      className={cn(
        'relative overflow-hidden rounded-xl',
        'border border-gray-200/50 dark:border-gray-800/50',
        glassEffect 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
          : 'bg-white dark:bg-gray-900',
        'shadow-sm hover:shadow-lg transition-all duration-300',
        borderGradient && 'p-[1px]',
        className
      )}
    >
      {/* Gradient Border */}
      {borderGradient && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30" />
      )}

      {/* Content Container */}
      <div className={cn(
        'relative h-full',
        borderGradient && 'bg-white dark:bg-gray-900 rounded-xl',
        paddingClasses[padding]
      )}>
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-gray-400 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
