"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bitcoin, DollarSign, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { buyBitcoin } from "@/lib/api"

export default function BuyPage() {
  const [amount, setAmount] = useState(500)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const bitcoinPrice = 65432.1
  const bitcoinAmount = amount / bitcoinPrice

  const handleBuy = async () => {
    setLoading(true)
    try {
      await buyBitcoin(amount)
      setLoading(false)
      setSuccess(true)

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error buying Bitcoin:", error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container px-4 py-8 mx-auto max-w-3xl">
        <Link href="/" className="flex items-center mb-8 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-2xl bg-zinc-800/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center mb-6">
            <Bitcoin className="w-12 h-12 mr-3 text-amber-500" />
            <h1 className="text-3xl font-bold">Buy Bitcoin</h1>
          </div>

          <div className="p-4 mb-6 rounded-lg bg-zinc-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400">Current Price</span>
              <span className="text-xl font-semibold">${bitcoinPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">24h Change</span>
              <span className="text-green-500">+3.2%</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-zinc-400">Amount (USD)</label>
            <div className="relative">
              <DollarSign className="absolute top-3 left-3 w-5 h-5 text-zinc-500" />
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-10 bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-sm font-medium text-zinc-400">Adjust Amount</label>
            <Slider
              value={[amount]}
              min={100}
              max={10000}
              step={100}
              onValueChange={(value) => setAmount(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-zinc-500">
              <span>$100</span>
              <span>$10,000</span>
            </div>
          </div>

          <div className="p-4 mb-8 rounded-lg bg-zinc-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center text-zinc-400">
                You will receive <Info className="w-4 h-4 ml-1 text-zinc-500" />
              </span>
              <span className="text-xl font-semibold">{bitcoinAmount.toFixed(8)} BTC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Fee</span>
              <span className="text-zinc-300">${(amount * 0.01).toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={handleBuy}
            disabled={loading || amount <= 0}
            className="w-full bg-amber-500 hover:bg-amber-600 h-14 text-lg"
          >
            {loading ? "Processing..." : success ? "Purchase Complete!" : "Buy Bitcoin"}
          </Button>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-green-500/20 text-green-400 text-center"
            >
              Transaction successful! Check your portfolio.
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
