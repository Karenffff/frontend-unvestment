"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fetchPortfolioValue } from "@/lib/api"

export default function PortfolioValue() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const data = await fetchPortfolioValue()
        setPortfolioData(data)
        setLoading(false)
      } catch (error) {
        console.error("Error loading portfolio data:", error)
        setLoading(false)
      }
    }

    loadPortfolioData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="w-8 h-8 border-4 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-3xl font-bold">${portfolioData?.totalValue.toLocaleString()}</h3>
          <div
            className={`flex items-center ${portfolioData?.changePercentage >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            <span>
              {portfolioData?.changePercentage >= 0 ? "+" : ""}
              {portfolioData?.changePercentage.toFixed(2)}%
            </span>
            <span className="ml-2 text-zinc-400">All time</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {portfolioData?.assets.map((asset, index) => (
          <motion.div
            key={asset.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-zinc-700/30"
          >
            <div className="flex items-center">
              <div
                className="flex items-center justify-center w-8 h-8 mr-3 rounded-full"
                style={{
                  backgroundColor: asset.color + "20",
                }}
              >
                <img src={asset.icon || "/placeholder.svg?height=20&width=20"} alt={asset.name} className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">{asset.name}</div>
                <div className="text-xs text-zinc-500">
                  {asset.amount} {asset.symbol}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">${asset.value.toLocaleString()}</div>
              <div className={`text-xs ${asset.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {asset.change >= 0 ? "+" : ""}
                {asset.change.toFixed(2)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
