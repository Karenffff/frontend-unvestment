"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Download,
  ChevronRight,
  Check,
  Clock,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchUserInvestments } from "@/lib/api"

export default function InvestmentDetailsPage() {
  const params = useParams()
  const id = params.id as string

  const [investment, setInvestment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)

  useEffect(() => {
    const loadInvestment = async () => {
      try {
        const investments = await fetchUserInvestments()
        const found = investments.find((inv) => inv.id.toString() === id)

        if (found) {
          setInvestment(found)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading investment:", error)
        setLoading(false)
      }
    }

    loadInvestment()
  }, [id])

  const handleEarlyWithdrawal = async () => {
    setWithdrawLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setWithdrawSuccess(true)

      // Reset after 5 seconds
      setTimeout(() => {
        setWithdrawSuccess(false)
      }, 5000)
    } catch (error) {
      console.error("Error processing withdrawal:", error)
    } finally {
      setWithdrawLoading(false)
    }
  }

  const bitcoinPrice = 65432.1 // Current BTC price in USD

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="container px-4 py-8 mx-auto max-w-4xl">
          <Link href="/dashboard" className="flex items-center mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
          </div>
        </div>
      </main>
    )
  }

  if (!investment) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="container px-4 py-8 mx-auto max-w-4xl">
          <Link href="/dashboard" className="flex items-center mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>

          <div className="p-8 text-center rounded-xl bg-zinc-800/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">Investment Not Found</h2>
            <p className="text-zinc-400 mb-6">
              The investment you're looking for could not be found or may have been completed.
            </p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <Link href="/dashboard" className="flex items-center mb-8 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Investment Details</h1>
          <Badge className={investment.status === "active" ? "bg-green-500" : "bg-blue-500"}>
            {investment.status === "active" ? "Active" : "Completed"}
          </Badge>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Investment Overview Card */}
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-2xl">{investment.planName}</CardTitle>
              <CardDescription className="text-zinc-400">
                Invested on {investment.startDate} • {investment.duration} term
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-zinc-700/30">
                  <div className="flex gap-3 items-center mb-2">
                    <Wallet className="w-5 h-5 text-amber-500" />
                    <span className="text-zinc-400">Investment Amount</span>
                  </div>
                  <div className="pl-8">
                    <p className="text-xl font-semibold">{investment.amount} BTC</p>
                    <p className="text-sm text-zinc-500">≈ ${(investment.amount * bitcoinPrice).toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-zinc-700/30">
                  <div className="flex gap-3 items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-zinc-400">Expected Return</span>
                  </div>
                  <div className="pl-8">
                    <p className="text-xl font-semibold text-green-500">{investment.expectedReturn} BTC</p>
                    <p className="text-sm text-green-400">
                      ≈ ${(investment.expectedReturn * bitcoinPrice).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {investment.status === "active" && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-zinc-400">{investment.progressPercentage}%</span>
                  </div>
                  <Progress value={investment.progressPercentage} className="h-2" />
                  <div className="flex justify-between text-xs mt-2">
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      <span>Started: {investment.startDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      <span>Ends: {investment.endDate}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-zinc-700/30">
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400">Plan ROI</span>
                  <span className="font-medium text-amber-500">{investment.roi}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400">Current Earnings</span>
                  <span className="font-medium text-green-500">
                    {investment.currentEarnings} BTC
                    <span className="block text-xs text-green-400 text-right">
                      ≈ ${(investment.currentEarnings * bitcoinPrice).toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Profit</span>
                  <span className="font-medium text-green-500">
                    {(investment.expectedReturn - investment.amount).toFixed(8)} BTC
                    <span className="block text-xs text-green-400 text-right">
                      ≈ ${((investment.expectedReturn - investment.amount) * bitcoinPrice).toLocaleString()}
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>

            {investment.status === "active" && (
              <CardFooter>
                <Button
                  variant="outline"
                  className="border-zinc-700 w-full"
                  onClick={handleEarlyWithdrawal}
                  disabled={withdrawLoading || withdrawSuccess}
                >
                  {withdrawLoading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : withdrawSuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Withdrawal Request Submitted
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                      Request Early Withdrawal (Will incur{" "}
                      {investment.planName.includes("Starter")
                        ? "1%"
                        : investment.planName.includes("Growth")
                          ? "2%"
                          : investment.planName.includes("Builder")
                            ? "3%"
                            : investment.planName.includes("Wealth")
                              ? "4%"
                              : "5%"}{" "}
                      fee)
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Investment Details Card */}
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
              <CardDescription className="text-zinc-400">ROI payment details and schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-zinc-700/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium">ROI Payment</p>
                      <p className="text-sm text-zinc-400">
                        {investment.planName.includes("Starter") || investment.planName.includes("Growth")
                          ? "End of term"
                          : "Monthly"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-zinc-800">
                    {investment.planName.includes("Starter") || investment.planName.includes("Growth")
                      ? investment.endDate
                      : "Monthly payments"}
                  </Badge>
                </div>

                {!(investment.planName.includes("Starter") || investment.planName.includes("Growth")) && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/20">Paid</Badge>
                        <span>First Month Payment</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{(investment.amount * 0.1).toFixed(8)} BTC</p>
                        <p className="text-xs text-zinc-500">Paid on {investment.startDate}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/20">Pending</Badge>
                        <span>Second Month Payment</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{(investment.amount * 0.1).toFixed(8)} BTC</p>
                        <p className="text-xs text-zinc-500">Upcoming</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="border-zinc-700">
                <FileText className="w-4 h-4 mr-2" />
                Download Statement
              </Button>

              <Button variant="outline" className="border-zinc-700">
                <Download className="w-4 h-4 mr-2" />
                Export Transaction History
              </Button>
            </CardContent>
          </Card>

          {/* Related Investments */}
          <div>
            <h2 className="text-xl font-bold mb-4">Similar Investment Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Starter Plan", "Growth Plan", "Builder Plan"]
                .filter((name) => name !== investment.planName)
                .map((plan, index) => (
                  <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{plan}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-zinc-400">
                        {plan === "Starter Plan"
                          ? "7 days • 3% ROI"
                          : plan === "Growth Plan"
                            ? "30 days • 15% ROI"
                            : "90 days • 50% ROI"}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" size="sm" className="w-full border-zinc-700">
                        <Link href="/invest">
                          View Plan <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
