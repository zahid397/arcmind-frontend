// 💬 চ্যাট মেসেজের জন্য
export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date | string
  status?: 'pending' | 'success' | 'error'
}

// 💸 ট্রানজেকশনের জন্য (Dashboard & Ledger)
export interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'transfer'
  amount: number
  asset: string        // যেমন: "NVIDIA Stock", "USDC"
  status: 'completed' | 'pending' | 'failed'
  timestamp: string    // যেমন: "10:24 AM" বা "Just now"
  hash: string         // Blockchain Hash
}

// 📊 ড্যাশবোর্ড স্ট্যাটাস কার্ডের জন্য
export interface StatCardProps {
  title: string
  value: string | number
  description: string
  trend: 'up' | 'down' | 'neutral'
  trendValue: string
  gradient: 'blue' | 'purple' | 'green' | 'cyan'
  icon?: any
}

// 🤖 
export interface AgentState {
  isActive: boolean
  mode: 'autonomous' | 'manual' | 'analysis-only'
  treasuryBalance: number
  activeTasks: number
  roi: number // Return on Investment %
}

// 👛 
export interface Wallet {
  address: string | null
  balance: number
  network: 'Arc Mainnet' | 'Arc Testnet' | 'Ethereum'
  isConnected: boolean
  provider?: 'Circle' | 'Metamask' | 'Phantom'
}

// 📦
export interface Product {
  id: string
  name: string
  price: number
  category: string
  profitMargin?: number
  confidenceScore?: number // 
  status: 'available' | 'purchased' | 'sold'
}
