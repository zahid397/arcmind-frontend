'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, 
  Bot, 
  Wallet, 
  Sparkles, 
  Shield, 
  Zap, 
  Search,
  TrendingUp,
  Lock,
  ArrowRight,
  MessageSquare,
  DollarSign,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useChat } from '@/hooks/useChat'
import toast from 'react-hot-toast'

export default function Home() {
  const [input, setInput] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletBalance, setWalletBalance] = useState(2500.75)
  const { messages, isLoading, sendMessage } = useChat()

  const handleSend = async () => {
    if (!input.trim()) return
    
    if (!walletConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    await sendMessage(input)
    setInput('')
  }

  const connectWallet = () => {
    setWalletConnected(true)
    toast.success('Circle Wallet Connected!')
  }

  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Trustless AI Agent",
      description: "Fully autonomous with on-chain treasury logic"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Instant USDC Payments",
      description: "Powered by Circle Gateway & Arc settlement"
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Smart Commerce",
      description: "AI negotiates, purchases, and resells autonomously"
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Secure & Transparent",
      description: "All transactions verifiable on Arc blockchain"
    }
  ]

  const samplePrompts = [
    "Find me gaming laptops under $800",
    "Buy trending sneakers with 30% profit margin",
    "Monitor GPU prices and alert me for drops",
    "Sell my old iPhone and reinvest the USDC"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-arc-blue to-arc-purple flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-arc-blue via-white to-arc-green bg-clip-text text-transparent">
                  ArcMind
                </h1>
                <p className="text-sm text-gray-400">Autonomous Commerce Agent</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <Wallet className="h-4 w-4 text-arc-green" />
                <span className="text-sm font-medium">{walletBalance.toFixed(2)} USDC</span>
                <div className="h-4 w-px bg-gray-700" />
                <span className="text-xs text-gray-400">Arc Mainnet</span>
              </div>

              <Button 
                onClick={connectWallet}
                className="bg-gradient-to-r from-arc-blue to-arc-purple hover:opacity-90 transition-all"
              >
                {walletConnected ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Connected
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Circle Wallet
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Stats & Features */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-arc-green" />
                  Agent Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Profit This Month</span>
                    <span className="text-arc-green font-semibold">+$1,248.50</span>
                  </div>
                  <Progress value={65} className="h-2 bg-gray-800" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Transactions</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <Progress value={47} className="h-2 bg-gray-800" />
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h4 className="text-sm font-semibold mb-3">Active Tasks</h4>
                  <div className="space-y-2">
                    {['Monitoring GPU prices', 'Negotiating iPhone deal', 'Listing sneakers'].map((task, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-800/30">
                        <span className="text-sm">{task}</span>
                        <Badge variant="outline" className="text-xs">
                          Running
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Powered By</CardTitle>
                <CardDescription>Circle Infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-3 rounded-lg bg-gray-800/30 border border-gray-700 hover:border-arc-blue/50 transition-colors"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 rounded-md bg-arc-blue/10">
                          {feature.icon}
                        </div>
                        <span className="text-sm font-semibold">{feature.title}</span>
                      </div>
                      <p className="text-xs text-gray-400">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add Funds to Treasury
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Scan for Opportunities
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Transaction History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-gray-900/50 border-gray-800 flex flex-col">
              <CardHeader className="border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Bot className="mr-2 h-5 w-5 text-arc-blue" />
                      ArcMind AI Agent
                    </CardTitle>
                    <CardDescription>
                      Autonomous commerce assistant powered by AI & Circle
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-arc-green/10 text-arc-green border-arc-green/20">
                    <div className="h-2 w-2 rounded-full bg-arc-green animate-pulse mr-2" />
                    Live on Arc Mainnet
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden p-0">
                {/* Chat Messages */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-6">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="h-20 w-20 rounded-full bg-gradient-to-br from-arc-blue/20 to-arc-purple/20 flex items-center justify-center"
                      >
                        <Bot className="h-10 w-10 text-arc-blue" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Welcome to ArcMind</h3>
                        <p className="text-gray-400 max-w-md">
                          I'm your autonomous commerce agent. I can find deals, negotiate prices,
                          make purchases, and manage your on-chain treasury using USDC.
                        </p>
                      </div>

                      {/* Sample Prompts */}
                      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                        {samplePrompts.map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => setInput(prompt)}
                            className="p-3 rounded-lg text-left bg-gray-800/50 border border-gray-700 hover:border-arc-blue/50 hover:bg-gray-800 transition-all text-sm"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((message, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user' ? 'bg-arc-blue/20 border border-arc-blue/30' : 'bg-gray-800/50 border border-gray-700'}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              {message.role === 'assistant' && (
                                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-arc-blue to-arc-purple flex items-center justify-center">
                                  <Bot className="h-3 w-3 text-white" />
                                </div>
                              )}
                              <span className="text-sm font-medium">
                                {message.role === 'user' ? 'You' : 'ArcMind'}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            {message.transaction && (
                              <div className="mt-3 p-2 rounded-lg bg-gray-900/50 text-xs">
                                <div className="flex items-center justify-between">
                                  <span>Transaction: {message.transaction.hash.slice(0, 10)}...</span>
                                  <Badge className="bg-arc-green/20 text-arc-green">
                                    Confirmed
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {isLoading && (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Bot className="h-5 w-5 animate-pulse" />
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                            <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-100" />
                            <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-200" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-800 p-6">
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Tell me what to buy, sell, or monitor..."
                        className="bg-gray-900 border-gray-700 h-12 pr-12"
                        disabled={!walletConnected}
                      />
                      {!walletConnected && (
                        <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
                          <span className="text-sm text-gray-400">Connect wallet to chat</span>
                        </div>
                      )}
                      <Button
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-arc-blue hover:bg-arc-blue/90"
                        onClick={handleSend}
                        disabled={isLoading || !walletConnected}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-gradient-to-r from-arc-purple to-pink-600 hover:opacity-90 border-0 text-white"
                      onClick={() => {
                        setInput('Find best deals across all markets with 25% ROI target')
                        handleSend()
                      }}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Smart Hunt
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-arc-green mr-1 animate-pulse" />
                        Agent Active
                      </span>
                      <span>Powered by Circle Gateway & Arc</span>
                    </div>
                    <span className="text-arc-green">
                      Treasury: {walletBalance.toLocaleString()} USDC
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <div className="mt-6">
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
                  <TabsTrigger value="active">Active Deals</TabsTrigger>
                  <TabsTrigger value="treasury">Treasury</TabsTrigger>
                </TabsList>
                <TabsContent value="recent" className="mt-4">
                  <div className="space-y-2">
                    {[
                      { item: 'NVIDIA RTX 4080', amount: 850, type: 'Purchase', status: 'Completed' },
                      { item: 'iPhone 15 Pro', amount: 920, type: 'Sale', status: 'Completed' },
                      { item: 'Air Jordan 1', amount: 180, type: 'Purchase', status: 'Pending' },
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${tx.type === 'Purchase' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                            {tx.type === 'Purchase' ? '↓' : '↑'}
                          </div>
                          <div>
                            <p className="font-medium">{tx.item}</p>
                            <p className="text-xs text-gray-400">{tx.type} • 2 hours ago</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{tx.amount} USDC</p>
                          <Badge variant="outline" className={tx.status === 'Completed' ? 'bg-green-500/10' : 'bg-yellow-500/10'}>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-arc-blue to-arc-purple" />
              <span className="text-lg font-bold">ArcMind</span>
            </div>
            <p className="text-gray-400 text-sm text-center">
              Built for Circle x Wormhole Hackathon • Autonomous Commerce on Arc • Powered by USDC & Circle Gateway
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="sm">Docs</Button>
              <Button variant="ghost" size="sm">GitHub</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
