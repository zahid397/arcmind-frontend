'use client';

import { motion } from 'framer-motion';
import { Transaction } from '@/app/types';
import {
ExternalLink,
CheckCircle,
Clock,
XCircle,
TrendingUp,
} from 'lucide-react';
import { cn, formatCurrency } from '@/app/lib/utils';

interface TransactionCardProps {
transaction: Transaction;
}

const STATUS_CONFIG = {
pending: {
icon: Clock,
color: 'text-yellow-500',
bg: 'bg-yellow-500/10',
border: 'border-yellow-500/20',
},
confirmed: {
icon: CheckCircle,
color: 'text-green-500',
bg: 'bg-green-500/10',
border: 'border-green-500/20',
},
failed: {
icon: XCircle,
color: 'text-red-500',
bg: 'bg-red-500/10',
border: 'border-red-500/20',
},
} as const;

export default function TransactionCard({ transaction }: TransactionCardProps) {
const StatusIcon = STATUS_CONFIG[transaction.status].icon;
const statusColor = STATUS_CONFIG[transaction.status].color;
const statusBg = STATUS_CONFIG[transaction.status].bg;
const statusBorder = STATUS_CONFIG[transaction.status].border;

return (
<motion.div
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
whileHover={{ scale: 1.02 }}
className={cn(
'rounded-xl border p-4',
statusBorder,
'bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm'
)}
>
{/* Header */}
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-2">
<div className={cn('p-2 rounded-lg', statusBg)}>
<TrendingUp className="w-5 h-5" />
</div>
<div>
<h4 className="font-medium text-gray-900 dark:text-gray-100">
Blockchain Transaction
</h4>
<p className="text-sm text-gray-600 dark:text-gray-400">
{transaction.status.charAt(0).toUpperCase() +
transaction.status.slice(1)}
</p>
</div>
</div>
<StatusIcon className={cn('w-5 h-5', statusColor)} />
</div>

{/* Amount */}  
  <div className="mb-4">  
    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">  
      {formatCurrency(transaction.amount, transaction.currency)}  
    </div>  
    <div className="text-sm text-gray-600 dark:text-gray-400">Amount</div>  
  </div>  

  {/* Transaction Hash */}  
  <div className="mb-4">  
    <div className="flex items-center justify-between">  
      <div>  
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">  
          Transaction Hash  
        </div>  
        <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">  
          {transaction.tx_hash.slice(0, 16)}...  
        </div>  
      </div>  
      <a  
        href={transaction.explorer_url}  
        target="_blank"  
        rel="noopener noreferrer"  
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"  
      >  
        <ExternalLink className="w-4 h-4 text-gray-700 dark:text-gray-300" />  
      </a>  
    </div>  
  </div>  

  {/* Progress Bar */}  
  {transaction.status === 'pending' && (  
    <div className="mt-4">  
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">  
        <span>Confirming...</span>  
        <span>~30s</span>  
      </div>  
      <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">  
        <motion.div  
          initial={{ width: '0%' }}  
          animate={{ width: '60%' }}  
          transition={{ duration: 30, ease: 'linear' }}  
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"  
        />  
      </div>  
    </div>  
  )}  

  {/* View on Explorer Button */}  
  <motion.a  
    href={transaction.explorer_url}  
    target="_blank"  
    rel="noopener noreferrer"  
    whileHover={{ scale: 1.02 }}  
    whileTap={{ scale: 0.98 }}  
    className={cn(  
      'mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg',  
      'bg-blue-500/10 dark:bg-blue-500/20',  
      'text-blue-600 dark:text-blue-400',  
      'hover:bg-blue-500/20 dark:hover:bg-blue-500/30',  
      'transition-colors'  
    )}  
  >  
    <ExternalLink className="w-4 h-4" />  
    <span className="text-sm font-medium">View on Explorer</span>  
  </motion.a>  
</motion.div>

);
  }
