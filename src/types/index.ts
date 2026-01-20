export interface Product {
  id: string
  name: string
  price: number
  source: string
  profitMargin?: number
  status: 'available' | 'purchased' | 'sold'
}

export interface Transaction {
  id: string
  amount: number
  currency: 'USDC'
  type: 'purchase' | 'sale' | 'transfer'
  status: 'pending' | 'completed' | 'failed'
  timestamp: Date
  hash: string
}

export interface AgentState {
  isActive: boolean
  treasuryBalance: number
  activeTasks: number
  totalProfit: number
}

export interface Wallet {
  address: string
  balance: number
  network: 'Arc Mainnet' | 'Arc Testnet'
  isConnected: boolean
}
