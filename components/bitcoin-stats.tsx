"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchBitcoinStats } from "@/lib/api"

export default function BitcoinStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchBitcoinStats()
        setStats(data)
        setLoading(false)
      } catch (error) {
        console.error("Error loading Bitcoin stats:", error)
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-8 h-8 border-4 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-zinc-800/50 backdrop-blur-sm"
    >
      <h2 className="text-xl font-bold mb-4">Bitcoin Market Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-zinc-700/30">
          <p className="text-sm text-zinc-400">Current Price</p>
          <p className="text-xl font-bold">${stats.currentPrice.toLocaleString()}</p>
          <p className={`text-sm ${stats.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}>
            {stats.priceChange24h >= 0 ? "+" : ""}
            {stats.priceChange24h}% (24h)
          </p>
        </div>

        <div className="p-4 rounded-lg bg-zinc-700/30">
          <p className="text-sm text-zinc-400">Market Cap</p>
          <p className="text-xl font-bold">${stats.marketCap.toLocaleString()}</p>
          <p className="text-sm text-zinc-500">Rank #{stats.marketCapRank}</p>
        </div>

        <div className="p-4 rounded-lg bg-zinc-700/30">
          <p className="text-sm text-zinc-400">24h Volume</p>
          <p className="text-xl font-bold">${stats.volume24h.toLocaleString()}</p>
          <p className="text-sm text-zinc-500">{stats.volumeChange24h}% change</p>
        </div>

        <div className="p-4 rounded-lg bg-zinc-700/30">
          <p className="text-sm text-zinc-400">All-Time High</p>
          <p className="text-xl font-bold">${stats.allTimeHigh.toLocaleString()}</p>
          <p className="text-sm text-zinc-500">{stats.athDate}</p>
        </div>
      </div>
    </motion.div>
  )
}
