'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, ShoppingBag, Cpu } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { TransactionItem } from '@/components/dashboard/TransactionItem'
import { AgentTerminal } from '@/components/dashboard/AgentTerminal'
import { formatCurrency } from '@/lib/utils'

export default function Home() {
  const [balance, setBalance] = useState(12850.00);
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleTx = (tx: any) => {
    if (tx.type === 'buy') setBalance(p => p - tx.amount);
    setTransactions(p => [tx, ...p]);
  }

  return (
    <div className="min-h-screen p-6">
      <header className="glass rounded-2xl p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold gradient-text">ArcMind</h1>
        <div className="flex items-center gap-2"><Wallet className="h-5 w-5" /> <span>{formatCurrency(balance)}</span></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <StatsCard icon={Wallet} title="Balance" value={formatCurrency(balance)} description="Total Treasury" gradient="blue" />
            <StatsCard icon={Cpu} title="AI Status" value="Active" description="Monitoring" gradient="purple" />
          </div>
          <div className="glass rounded-2xl overflow-hidden h-[500px]">
            <AgentTerminal onTransaction={handleTx} />
          </div>
        </div>
        <div className="glass rounded-2xl p-5 h-fit">
          <h2 className="font-bold mb-4">Transactions</h2>
          <div className="space-y-3">
            {transactions.map((tx, i) => <TransactionItem key={i} {...tx} index={i} />)}
            {transactions.length === 0 && <p className="text-gray-500 text-sm">No transactions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
