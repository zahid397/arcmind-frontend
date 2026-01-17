'use client';

import { motion } from 'framer-motion';

interface SendIconProps {
  className?: string;
  isActive?: boolean;
}

export default function SendIcon({ 
  className = 'w-5 h-5', 
  isActive = false 
}: SendIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ rotate: 0 }}
      animate={isActive ? { 
        rotate: 360,
        scale: [1, 1.2, 1]
      } : {}}
      transition={{ 
        rotate: { duration: 0.5, ease: "easeInOut" },
        scale: { duration: 0.3 }
      }}
    >
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </motion.svg>
  );
}
