"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { fetchBitcoinPriceHistory } from "@/lib/api"

export default function PriceChart() {
  const [priceData, setPriceData] = useState([])
  const [timeframe, setTimeframe] = useState("1D")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPriceData = async () => {
      setLoading(true)
      try {
        const data = await fetchBitcoinPriceHistory(timeframe)
        setPriceData(data)
        setLoading(false)
      } catch (error) {
        console.error("Error loading price data:", error)
        setLoading(false)
      }
    }

    loadPriceData()
  }, [timeframe])

  // Calculate chart dimensions
  const chartHeight = 200
  const chartWidth = 100 // percentage width

  // Generate SVG path for the chart line
  const generatePath = (data) => {
    if (!data || data.length === 0) return ""

    const maxPrice = Math.max(...data.map((d) => d.price))
    const minPrice = Math.min(...data.map((d) => d.price))
    const range = maxPrice - minPrice

    // Scale points to fit the chart
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100 // percentage across width
      const y = chartHeight - ((d.price - minPrice) / range) * chartHeight
      return `${x},${y}`
    })

    return `M ${points.join(" L ")}`
  }

  // Generate area under the chart
  const generateArea = (data) => {
    if (!data || data.length === 0) return ""

    const maxPrice = Math.max(...data.map((d) => d.price))
    const minPrice = Math.min(...data.map((d) => d.price))
    const range = maxPrice - minPrice

    // Scale points to fit the chart
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100 // percentage across width
      const y = chartHeight - ((d.price - minPrice) / range) * chartHeight
      return `${x},${y}`
    })

    // Add points to create a closed path for the area
    return `M 0,${chartHeight} L ${points.join(" L ")} L 100,${chartHeight} Z`
  }

  const path = generatePath(priceData)
  const area = generateArea(priceData)
  const currentPrice = priceData.length > 0 ? priceData[priceData.length - 1].price : 0
  const priceChange =
    priceData.length > 0 ? ((priceData[priceData.length - 1].price - priceData[0].price) / priceData[0].price) * 100 : 0
  const isPositive = priceChange >= 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-3xl font-bold">${currentPrice.toLocaleString()}</h3>
          <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
            <span>
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
            <span className="ml-2 text-zinc-400">{timeframe}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {["1D", "1W", "1M", "1Y", "ALL"].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={
                timeframe === tf
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "border-zinc-700 text-zinc-400 hover:text-white"
              }
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative h-[200px] w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <>
            <svg width="100%" height="100%" viewBox={`0 0 100 ${chartHeight}`} preserveAspectRatio="none">
              {/* Gradient for area under the curve */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isPositive ? "rgb(167, 139, 250)" : "rgb(248, 113, 113)"}
                    stopOpacity="0.3"
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? "rgb(167, 139, 250)" : "rgb(248, 113, 113)"}
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {/* Area under the curve */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                d={area}
                fill="url(#areaGradient)"
              />

              {/* Chart line */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={path}
                fill="none"
                stroke={isPositive ? "#8B5CF6" : "#EF4444"}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Price markers */}
            {priceData.length > 0 && (
              <>
                <div className="absolute top-0 right-0 text-xs text-zinc-500">
                  ${Math.max(...priceData.map((d) => d.price)).toLocaleString()}
                </div>
                <div className="absolute bottom-0 right-0 text-xs text-zinc-500">
                  ${Math.min(...priceData.map((d) => d.price)).toLocaleString()}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
