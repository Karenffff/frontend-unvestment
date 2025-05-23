"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Bitcoin, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchAnalyticsData } from "@/lib/api"

type AnalyticsData = {
  totalInvested: number
  totalEarnings: number
  activeInvestments: number
  completedInvestments: number
  portfolioGrowth: number
  averageROI: number
  investmentDistribution: {
    name: string
    percentage: number
    color: string
  }[]
  recentActivity: {
    type: string
    amount: number
    date: string
    status: string
  }[]
  performanceHistory: {
    month: string
    earnings: number
    investments: number
  }[]
}

export default function DashboardAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("30d")

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      try {
        const data = await fetchAnalyticsData(timeframe)
        setAnalyticsData(data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [timeframe])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="p-6 text-center rounded-xl bg-zinc-800/50 backdrop-blur-sm">
        <h3 className="mb-2 text-xl font-medium">Analytics Unavailable</h3>
        <p className="text-zinc-400">Unable to load analytics data at this time.</p>
      </div>
    )
  }

  const bitcoinPrice = 65432.1 // Current BTC price in USD

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <div className="flex gap-1">
          <TabsList className="bg-zinc-800/50">
            <TabsTrigger
              value="7d"
              className={timeframe === "7d" ? "bg-amber-500 text-white" : ""}
              onClick={() => setTimeframe("7d")}
            >
              7D
            </TabsTrigger>
            <TabsTrigger
              value="30d"
              className={timeframe === "30d" ? "bg-amber-500 text-white" : ""}
              onClick={() => setTimeframe("30d")}
            >
              30D
            </TabsTrigger>
            <TabsTrigger
              value="90d"
              className={timeframe === "90d" ? "bg-amber-500 text-white" : ""}
              onClick={() => setTimeframe("90d")}
            >
              90D
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className={timeframe === "all" ? "bg-amber-500 text-white" : ""}
              onClick={() => setTimeframe("all")}
            >
              All
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Total Invested</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Bitcoin className="w-5 h-5 mr-2 text-amber-500" />
                {analyticsData.totalInvested} BTC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                ≈ ${(analyticsData.totalInvested * bitcoinPrice).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Total Earnings</CardDescription>
              <CardTitle className="text-2xl flex items-center text-green-500">
                <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                {analyticsData.totalEarnings} BTC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-400">
                ≈ ${(analyticsData.totalEarnings * bitcoinPrice).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Portfolio Growth</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                {analyticsData.portfolioGrowth}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
                <p className="text-sm text-green-400">+{analyticsData.portfolioGrowth}% from initial investment</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">Average ROI</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Clock className="w-5 h-5 mr-2 text-amber-500" />
                {analyticsData.averageROI}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">Across all investments</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle>Investment Distribution</CardTitle>
              <CardDescription>Breakdown of your active investments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <div className="relative w-40 h-40">
                  {/* Pie chart visualization */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {analyticsData.investmentDistribution.map((item, index) => {
                      // Calculate the start and end angles for each segment
                      const previousPercentages = analyticsData.investmentDistribution
                        .slice(0, index)
                        .reduce((sum, curr) => sum + curr.percentage, 0)

                      const startAngle = (previousPercentages / 100) * 360
                      const endAngle = ((previousPercentages + item.percentage) / 100) * 360

                      // Convert angles to radians and calculate coordinates
                      const startRad = (startAngle - 90) * (Math.PI / 180)
                      const endRad = (endAngle - 90) * (Math.PI / 180)

                      const x1 = 50 + 40 * Math.cos(startRad)
                      const y1 = 50 + 40 * Math.sin(startRad)
                      const x2 = 50 + 40 * Math.cos(endRad)
                      const y2 = 50 + 40 * Math.sin(endRad)

                      // Determine if the arc should be drawn as a large arc
                      const largeArcFlag = item.percentage > 50 ? 1 : 0

                      return (
                        <path
                          key={item.name}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={item.color}
                        />
                      )
                    })}
                    <circle cx="50" cy="50" r="25" fill="#1F2937" />
                  </svg>
                </div>
                <div className="ml-4 space-y-2">
                  {analyticsData.investmentDistribution.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">
                        {item.name} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
              <CardDescription>Earnings vs Investments over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] relative">
                {/* Bar chart visualization */}
                <div className="flex h-full items-end justify-between">
                  {analyticsData.performanceHistory.map((item, index) => {
                    const maxInvestment = Math.max(...analyticsData.performanceHistory.map((i) => i.investments))
                    const maxEarnings = Math.max(...analyticsData.performanceHistory.map((i) => i.earnings))

                    const investmentHeight = (item.investments / maxInvestment) * 150
                    const earningsHeight = (item.earnings / maxEarnings) * 150

                    return (
                      <div key={item.month} className="flex flex-col items-center">
                        <div className="flex gap-1">
                          <div
                            className="w-6 bg-amber-500/80 rounded-t-sm"
                            style={{ height: `${investmentHeight}px` }}
                          />
                          <div className="w-6 bg-green-500/80 rounded-t-sm" style={{ height: `${earningsHeight}px` }} />
                        </div>
                        <div className="mt-2 text-xs text-zinc-400">{item.month}</div>
                      </div>
                    )
                  })}
                </div>
                <div className="absolute top-0 left-0 flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-amber-500/80 rounded-sm" />
                  <span>Investments</span>
                  <div className="w-3 h-3 bg-green-500/80 rounded-sm ml-2" />
                  <span>Earnings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-zinc-700/30">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "investment"
                          ? "bg-amber-500/20"
                          : activity.type === "earnings"
                            ? "bg-green-500/20"
                            : "bg-red-500/20"
                      }`}
                    >
                      {activity.type === "investment" ? (
                        <ArrowDownRight className={`w-4 h-4 text-amber-500`} />
                      ) : activity.type === "earnings" ? (
                        <TrendingUp className={`w-4 h-4 text-green-500`} />
                      ) : (
                        <ArrowUpRight className={`w-4 h-4 text-red-500`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{activity.type}</p>
                      <p className="text-xs text-zinc-400">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${activity.type === "earnings" ? "text-green-500" : ""}`}>
                      {activity.type === "withdrawal" ? "-" : "+"}
                      {activity.amount} BTC
                    </p>
                    <p className="text-xs text-zinc-400">≈ ${(activity.amount * bitcoinPrice).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
