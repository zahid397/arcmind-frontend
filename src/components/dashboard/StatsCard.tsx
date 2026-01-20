'use client'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon; title: string; value: string | number; description: string; gradient?: string; delay?: number;
}

export function StatsCard({ icon: Icon, title, value, description, gradient = 'blue', delay = 0 }: StatsCardProps) {
  const colors: any = { blue: 'text-arc-blue', green: 'text-arc-green', purple: 'text-arc-purple', cyan: 'text-arc-cyan' }
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay * 0.1 }} className="glass p-6 rounded-2xl border border-white/5">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-white/5"><Icon className={`h-6 w-6 ${colors[gradient] || 'text-white'}`} /></div>
      </div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </motion.div>
  )
}
