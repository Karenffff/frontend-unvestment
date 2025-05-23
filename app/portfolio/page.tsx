"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronUp, Download, Filter, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { fetchPortfolio } from "@/lib/api"

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await fetchPortfolio()
        setPortfolio(data)
        setLoading(false)
      } catch (error) {
        console.error("Error loading portfolio:", error)
        setLoading(false)
      }
    }

    loadPortfolio()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container px-4 py-8 mx-auto max-w-5xl">
        <Link href="/" className="flex items-center mb-8 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold">Your Portfolio</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute top-3 left-3 w-4 h-4 text-zinc-500" />
              <Input placeholder="Search assets" className="pl-10 bg-zinc-800/50 border-zinc-700" />
            </div>
            <Button variant="outline" className="border-zinc-700">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="p-6 mb-8 rounded-2xl bg-zinc-800/50 backdrop-blur-sm">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-zinc-700/30">
              <p className="mb-1 text-sm text-zinc-400">Total Balance</p>
              <h2 className="text-2xl font-bold">$27,543.21</h2>
              <p className="text-green-500">
                +12.4% <span className="text-zinc-400">all time</span>
              </p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-700/30">
              <p className="mb-1 text-sm text-zinc-400">Bitcoin Holdings</p>
              <h2 className="text-2xl font-bold">0.42 BTC</h2>
              <p className="text-zinc-400">≈ $23,432.10</p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-700/30">
              <p className="mb-1 text-sm text-zinc-400">Cash Balance</p>
              <h2 className="text-2xl font-bold">$4,111.11</h2>
              <div className="flex gap-2 mt-1">
                <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-600">
                  <Upload className="w-3 h-3 mr-1" /> Deposit
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-600">
                  <Download className="w-3 h-3 mr-1" /> Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-zinc-800/50">
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="assets">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="overflow-hidden rounded-xl bg-zinc-800/50 backdrop-blur-sm"
              >
                <div className="grid grid-cols-5 p-4 text-sm text-zinc-400 border-b border-zinc-700">
                  <div>Asset</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Holdings</div>
                  <div className="text-right">Value</div>
                  <div className="text-right">Change (24h)</div>
                </div>

                <motion.div variants={itemVariants} className="grid grid-cols-5 p-4 border-b border-zinc-700/50">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-amber-500/20">
                      <img src="/placeholder.svg?height=20&width=20" alt="Bitcoin" />
                    </div>
                    <div>
                      <div className="font-medium">Bitcoin</div>
                      <div className="text-xs text-zinc-500">BTC</div>
                    </div>
                  </div>
                  <div className="text-right">$65,432.10</div>
                  <div className="text-right">0.42 BTC</div>
                  <div className="text-right">$23,432.10</div>
                  <div className="flex items-center justify-end text-green-500">
                    <ChevronUp className="w-4 h-4 mr-1" />
                    3.2%
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-5 p-4 border-b border-zinc-700/50">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-blue-500/20">
                      <img src="/placeholder.svg?height=20&width=20" alt="Ethereum" />
                    </div>
                    <div>
                      <div className="font-medium">Ethereum</div>
                      <div className="text-xs text-zinc-500">ETH</div>
                    </div>
                  </div>
                  <div className="text-right">$3,211.45</div>
                  <div className="text-right">0.15 ETH</div>
                  <div className="text-right">$481.72</div>
                  <div className="flex items-center justify-end text-red-500">
                    <ChevronDown className="w-4 h-4 mr-1" />
                    1.8%
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-5 p-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-green-500/20">
                      <img src="/placeholder.svg?height=20&width=20" alt="USD Coin" />
                    </div>
                    <div>
                      <div className="font-medium">USD Coin</div>
                      <div className="text-xs text-zinc-500">USDC</div>
                    </div>
                  </div>
                  <div className="text-right">$1.00</div>
                  <div className="text-right">3,629.39 USDC</div>
                  <div className="text-right">$3,629.39</div>
                  <div className="flex items-center justify-end text-zinc-400">0.0%</div>
                </motion.div>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="transactions">
            <div className="p-6 text-center rounded-xl bg-zinc-800/50 backdrop-blur-sm">
              <h3 className="mb-2 text-xl font-medium">Transaction History</h3>
              <p className="text-zinc-400">View your complete transaction history here</p>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="p-6 text-center rounded-xl bg-zinc-800/50 backdrop-blur-sm">
              <h3 className="mb-2 text-xl font-medium">Portfolio Performance</h3>
              <p className="text-zinc-400">Track your investment performance over time</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
