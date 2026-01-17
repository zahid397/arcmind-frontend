'use client';

import { motion } from 'framer-motion';
import { Transaction } from '@/app/types'; // ✅ CORRECT
import {
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { cn, formatCurrency } from '@/app/lib/utils'; // ✅ CORRECT

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
};

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const StatusIcon = STATUS_CONFIG[transaction.status].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'rounded-xl border p-4',
        STATUS_CONFIG[transaction.status].border
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'p-2 rounded-lg',
              STATUS_CONFIG[transaction.status].bg
            )}
          >
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium">Blockchain Transaction</h4>
            <p className="text-sm text-muted-foreground">
              {transaction.status.charAt(0).toUpperCase() +
                transaction.status.slice(1)}
            </p>
          </div>
        </div>
        <StatusIcon
          className={cn(
            'w-5 h-5',
            STATUS_CONFIG[transaction.status].color
          )}
        />
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="text-2xl font-bold">
          {formatCurrency(transaction.amount, transaction.currency)}
        </div>
        <div className="text-sm text-muted-foreground">Amount</div>
      </div>

      {/* Transaction Hash */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Transaction Hash</div>
            <div className="text-xs text-muted-foreground font-mono">
              {transaction.tx_hash.slice(0, 16)}...
            </div>
          </div>
          <a
            href={transaction.explorer_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Progress Bar */}
      {transaction.status === 'pending' && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Confirming...</span>
            <span>~30s</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '60%' }}
              transition={{ duration: 30, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
        </div>
      )}

      {/* Explorer Button */}
      <motion.a
        href={transaction.explorer_url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        <span className="text-sm font-medium">View on Explorer</span>
      </motion.a>
    </motion.div>
  );
}
