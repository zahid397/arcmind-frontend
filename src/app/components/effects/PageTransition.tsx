'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
children: ReactNode
mode?: 'wait' | 'sync'
}

export default function PageTransition({
children,
mode = 'wait'
}: PageTransitionProps) {
const pathname = usePathname()

return (
<AnimatePresence mode={mode}>
<motion.div
key={pathname}
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -12 }}
transition={{
duration: 0.25,
ease: 'easeOut',
}}
className="h-full" // ✅ Important for full height
>
{children}
</motion.div>
</AnimatePresence>
)
}
