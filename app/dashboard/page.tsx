"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bitcoin, ChevronRight, Download, Upload, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { fetchUserInvestments, fetchWalletStats } from "@/lib/api"
import DashboardAnalytics from "@/components/dashboard-analytics"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WalletStats } from "@/lib/types"

// Define the Investment type if not already imported
type Investment = {
  id: string
  planName: string
  amount: number
  amountUsd?: number
  roi: string
  duration: string
  expectedReturn: number
  currentEarnings: number
  progressPercentage: number
  startDate: string
  endDate: string
  status: "active" | "completed"
}

export default function DashboardPage() {
  const [investments, setInvestments] = useState<Investment[]>([])
 

  const [stats, setStats] = useState<WalletStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const loadData = async () => {
    setLoading(true)
    setError("")

    try {
      // Fetch wallet stats
      console.log("Fetching wallet stats from dashboard...")
      const walletResponse = await fetchWalletStats()
      console.log("Wallet stats response:", walletResponse)

      if (walletResponse.success && walletResponse.data) {
        setStats(walletResponse.data)
      } else {
        console.error("Error loading wallet stats:", walletResponse)
        setError("Failed to load wallet statistics. Please try again later.")
      }

      // Fetch investments data
      const investmentsData = await fetchUserInvestments()
      setInvestments(investmentsData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setError("An error occurred while loading your dashboard. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
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

  const handleRefresh = () => {
    loadData()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <Link href="/" className="flex items-center mb-8 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link href="/deposit">
              <Button variant="outline" className="border-zinc-700">
                <Upload className="w-4 h-4 mr-2" />
                Deposit
              </Button>
            </Link>
            <Link href="/withdraw">
              <Button variant="outline" className="border-zinc-700">
                <Download className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </Link>
            <Link href="/invest">
              <Button className="bg-amber-500 hover:bg-amber-600">
                <Bitcoin className="w-4 h-4 mr-2" />
                Invest
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-8 md:grid-cols-4">
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader className="pb-2">
                  <CardDescription className="text-zinc-400">Total Balance</CardDescription>
                  <CardTitle className="text-2xl">${stats?.totalBalance.toLocaleString() || 0}</CardTitle>
                </CardHeader>
                {/* <CardContent>
                  <p className="text-sm text-zinc-400">≈ {((stats?.totalBalance || 0) * 65432.1).toLocaleString()}</p>
                </CardContent> */}
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader className="pb-2">
                  <CardDescription className="text-zinc-400">Active Investments</CardDescription>
                  <CardTitle className="text-2xl">${stats?.activeInvestments.toLocaleString() || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-400">
                    Across {investments.filter((inv) => inv.status === "active").length || 0} plans
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader className="pb-2">
                  <CardDescription className="text-zinc-400">Total Earnings</CardDescription>
                  <CardTitle className="text-2xl text-green-500">${stats?.totalEarnings.toLocaleString() || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-400">Lifetime returns</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader className="pb-2">
                  <CardDescription className="text-zinc-400">Available Balance</CardDescription>
                  <CardTitle className="text-2xl$">{stats?.availableBalance.toLocaleString() || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-400">Available for withdrawal or investment</p>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-800/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Active Investments</h2>
                    <Button variant="outline" size="sm" className="border-zinc-700" onClick={handleRefresh}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>

                  <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-zinc-800/50">
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="all">All Investments</TabsTrigger>
                    </TabsList>

                    <TabsContent value="active">
                      {investments.filter((inv) => inv.status === "active").length === 0 ? (
                        <div className="p-8 text-center rounded-xl bg-zinc-800/50 backdrop-blur-sm">
                          <h3 className="mb-2 text-xl font-medium">No Active Investments</h3>
                          <p className="text-zinc-400 mb-4">You don't have any active investments at the moment.</p>
                          <Link href="/invest">
                            <Button className="bg-amber-500 hover:bg-amber-600">Start Investing</Button>
                          </Link>
                        </div>
                      ) : (
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-4"
                        >
                          {investments
                            .filter((inv) => inv.status === "active")
                            .map((investment) => (
                              <motion.div
                                key={investment.id}
                                variants={itemVariants}
                                className="p-6 rounded-xl bg-zinc-800/50 border border-zinc-700"
                              >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-bold text-lg">{investment.planName}</h3>
                                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                                        Active
                                      </span>
                                    </div>
                                    <p className="text-zinc-400 mt-1">
                                      {investment.amount} BTC{" "}
                                      <span className="text-zinc-500">
                                        (≈ ${investment.amountUsd?.toLocaleString()})
                                      </span>{" "}
                                      • {investment.roi} ROI • {investment.duration}
                                    </p>
                                  </div>

                                  <div className="md:text-right">
                                    <p className="text-zinc-400">Expected Return</p>
                                    <p className="font-bold text-green-500">
                                      {investment.expectedReturn} BTC
                                     
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-zinc-400">Progress</span>
                                    <span className="text-zinc-400">{investment.progressPercentage}%</span>
                                  </div>
                                  <Progress value={investment.progressPercentage} className="h-2" />
                                  <div className="flex justify-between text-xs mt-1">
                                    <span className="text-zinc-500">Started: {investment.startDate}</span>
                                    <span className="text-zinc-500">Ends: {investment.endDate}</span>
                                  </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-zinc-700 flex justify-between items-center">
                                  {/* <div>
                                    <p className="text-zinc-400 text-sm">Current Earnings</p>
                                    <p className="font-medium text-green-500">
                                      {investment.currentEarnings} BTC
                                      <span className="block text-xs text-green-400">
                                        ≈ ${(investment.currentEarnings * 65432.1).toLocaleString()}
                                      </span>
                                    </p>
                                  </div> */}
                                  <Link href={`/investment/${investment.id}`}>
                                    <Button variant="outline" size="sm" className="border-zinc-700">
                                      View Details
                                      <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                  </Link>
                                </div>
                              </motion.div>
                            ))}
                        </motion.div>
                      )}
                    </TabsContent>

                    <TabsContent value="completed">
                      {investments.filter((inv) => inv.status === "completed").length === 0 ? (
                        <div className="p-8 text-center rounded-xl bg-zinc-800/50 backdrop-blur-sm">
                          <h3 className="mb-2 text-xl font-medium">No Completed Investments</h3>
                          <p className="text-zinc-400">You don't have any completed investments yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {investments
                            .filter((inv) => inv.status === "completed")
                            .map((investment) => (
                              <div key={investment.id} className="p-6 rounded-xl bg-zinc-800/50 border border-zinc-700">
                                <div className="flex flex-col md:flex-row md:items-centerr justify-between gap-4">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-bold text-lg">{investment.planName}</h3>
                                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">
                                        Completed
                                      </span>
                                    </div>
                                    <p className="text-zinc-400 mt-1">
                                      {investment.amount} BTC • {investment.roi} ROI • {investment.duration}
                                    </p>
                                  </div>

                                  <div className="md:text-right">
                                    <p className="text-zinc-400">Total Return</p>
                                    <p className="font-bold text-green-500">{investment.expectedReturn} BTC</p>
                                  </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-zinc-700 flex justify-between items-center">
                                  <div>
                                    <p className="text-zinc-400 text-sm">Profit</p>
                                    <p className="font-medium text-green-500">
                                      {(investment.expectedReturn - investment.amount).toFixed(8)} BTC
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-zinc-400 text-sm">Completed On</p>
                                    <p className="font-medium">{investment.endDate}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="all">
                      {investments.length === 0 ? (
                        <div className="p-8 text-center rounded-xl bg-zinc-800/50 backdrop-blur-sm">
                          <h3 className="mb-2 text-xl font-medium">No Investments</h3>
                          <p className="text-zinc-400 mb-4">You haven't made any investments yet.</p>
                          <Link href="/invest">
                            <Button className="bg-amber-500 hover:bg-amber-600">Start Investing</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {investments.map((investment) => (
                            <div key={investment.id} className="p-6 rounded-xl bg-zinc-800/50 border border-zinc-700">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{investment.planName}</h3>
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        investment.status === "active"
                                          ? "bg-green-500/20 text-green-400"
                                          : "bg-blue-500/20 text-blue-400"
                                      }`}
                                    >
                                      {investment.status === "active" ? "Active" : "Completed"}
                                    </span>
                                  </div>
                                  <p className="text-zinc-400 mt-1">
                                    {investment.amount} BTC • {investment.roi} ROI • {investment.duration}
                                  </p>
                                </div>

                                <div className="md:text-right">
                                  <p className="text-zinc-400">
                                    {investment.status === "active" ? "Expected Return" : "Total Return"}
                                  </p>
                                  <p className="font-bold text-green-500">{investment.expectedReturn} BTC</p>
                                </div>
                              </div>

                              {investment.status === "active" && (
                                <div className="mt-4">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-zinc-400">Progress</span>
                                    <span className="text-zinc-400">{investment.progressPercentage}%</span>
                                  </div>
                                  <Progress value={investment.progressPercentage} className="h-2" />
                                  <div className="flex justify-between text-xs mt-1">
                                    <span className="text-zinc-500">Started: {investment.startDate}</span>
                                    <span className="text-zinc-500">Ends: {investment.endDate}</span>
                                  </div>
                                </div>
                              )}

                              <div className="mt-4 pt-4 border-t border-zinc-700 flex justify-between items-center">
                                <div>
                                  <p className="text-zinc-400 text-sm">
                                    {investment.status === "active" ? "Current Earnings" : "Profit"}
                                  </p>
                                  <p className="font-medium text-green-500">
                                    {investment.status === "active"
                                      ? investment.currentEarnings
                                      : (investment.expectedReturn - investment.amount).toFixed(8)}{" "}
                                    BTC
                                  </p>
                                </div>
                                {investment.status === "active" ? (
                                  <Link href={`/investment/${investment.id}`}>
                                    <Button variant="outline" size="sm" className="border-zinc-700">
                                      View Details
                                      <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                  </Link>
                                ) : (
                                  <div className="text-right">
                                    <p className="text-zinc-400 text-sm">Completed On</p>
                                    <p className="font-medium">{investment.endDate}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <DashboardAnalytics />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </main>
  )
}
