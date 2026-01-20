'use client'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export function TransactionItem({ type, amount, asset, status, hash, index }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="glass rounded-xl p-4 border border-white/5 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${type === 'buy' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
          {type === 'buy' ? <ArrowDownRight className="h-4 w-4 text-red-400" /> : <ArrowUpRight className="h-4 w-4 text-green-400" />}
        </div>
        <div>
          <div className="font-medium text-white">{asset}</div>
          <div className="text-xs text-gray-500">#{hash.slice(0, 8)}...</div>
        </div>
      </div>
      <div className={`font-bold ${type === 'buy' ? 'text-red-400' : 'text-green-400'}`}>
        {type === 'buy' ? '-' : '+'}{amount}
      </div>
    </motion.div>
  )
}
