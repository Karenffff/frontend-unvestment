"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, AlertCircle, Bitcoin, Check, Info, DollarSign, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { fetchBitcoinPrice, fetchWalletStats, withdrawFunds, fetchRecentWithdrawals } from "@/lib/api"
import type { Withdrawal } from "@/lib/types"

export default function WithdrawPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [payoutMethod, setPayoutMethod] = useState("bitcoin")
  const [bitcoinAddress, setBitcoinAddress] = useState("")
  const [network, setNetwork] = useState("btc-mainnet")
  const [cashappTag, setCashappTag] = useState("")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [bitcoinPrice, setBitcoinPrice] = useState(0)
  const [walletStats, setWalletStats] = useState({
    totalBalance: 0,
    activeInvestments: 0,
    totalEarnings: 0,
    availableBalance: 0,
  })
  const [recentWithdrawals, setRecentWithdrawals] = useState<Withdrawal[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Fetch wallet stats, Bitcoin price, and recent withdrawals on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)

        // Fetch Bitcoin price
        const price = await fetchBitcoinPrice()
        setBitcoinPrice(price)

        // Fetch wallet stats
        const walletResult = await fetchWalletStats()
        if (walletResult.success) {
          setWalletStats(walletResult.data)
        } else {
          console.error("Error fetching wallet stats:", walletResult.error)
          toast({
            title: "Error",
            description: "Failed to load wallet data. Please try again.",
            variant: "destructive",
          })
        }

        // Fetch recent withdrawals
        const withdrawals = await fetchRecentWithdrawals()
        setRecentWithdrawals(withdrawals)
      } catch (err) {
        console.error("Error fetching data:", err)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [toast])

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!withdrawalAmount || Number(withdrawalAmount) <= 0) {
      setError("Please enter a valid withdrawal amount")
      return
    }

    const usdAmount = Number(withdrawalAmount)

    // Different minimum amounts for different payout methods
    const minimumAmounts = {
      bitcoin: 5000,
      cashapp: 100,
      paypal: 50,
    }

    const minAmount = minimumAmounts[payoutMethod as keyof typeof minimumAmounts]

    if (usdAmount < minAmount) {
      setError(`Minimum withdrawal amount for ${payoutMethod} is $${minAmount.toLocaleString()} USD`)
      return
    }

    if (usdAmount > walletStats.availableBalance) {
      setError("Withdrawal amount exceeds available balance")
      return
    }

    // Validate payout method specific fields
    if (payoutMethod === "bitcoin") {
      if (!bitcoinAddress || bitcoinAddress.length < 26) {
        setError("Please enter a valid Bitcoin address")
        return
      }
    } else if (payoutMethod === "cashapp") {
      if (!cashappTag || cashappTag.length < 2) {
        setError("Please enter a valid CashApp $cashtag")
        return
      }
      if (!cashappTag.startsWith("$")) {
        setCashappTag("$" + cashappTag)
      }
    } else if (payoutMethod === "paypal") {
      if (!paypalEmail || !paypalEmail.includes("@")) {
        setError("Please enter a valid PayPal email address")
        return
      }
    }

    setError("")
    setLoading(true)

    try {
      // Prepare withdrawal data based on payout method
      const withdrawalData = {
        amount: usdAmount,
        payoutMethod,
        ...(payoutMethod === "bitcoin" && {
          bitcoinAddress,
          network,
        }),
        ...(payoutMethod === "cashapp" && {
          cashappTag,
        }),
        ...(payoutMethod === "paypal" && {
          paypalEmail,
        }),
      }

      // Call the API to process the withdrawal
      const result = await withdrawFunds(withdrawalData)

      if (result.success) {
        setSuccess(true)
        setWithdrawalAmount("")
        setBitcoinAddress("")
        setCashappTag("")
        setPaypalEmail("")

        toast({
          title: "Withdrawal Submitted",
          description: "Your withdrawal request has been submitted successfully.",
          variant: "default",
        })

        // Refresh wallet stats after successful withdrawal
        const walletResult = await fetchWalletStats()
        if (walletResult.success) {
          setWalletStats(walletResult.data)
        }

        // Refresh recent withdrawals
        const withdrawals = await fetchRecentWithdrawals()
        setRecentWithdrawals(withdrawals)

        // Reset success state after 5 seconds
        setTimeout(() => {
          setSuccess(false)
          router.push("/dashboard")
        }, 3000)
      } else {
        throw new Error(result.error)
      }
    } catch (err: any) {
      console.error("Withdrawal failed:", err)
      setError(err.message || "Withdrawal failed. Please try again.")

      toast({
        title: "Withdrawal Failed",
        description: err.message || "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMaxAmount = () => {
    setWithdrawalAmount(walletStats.availableBalance.toString())
  }

  // Format date for recent withdrawals
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Get payout method icon
  const getPayoutMethodIcon = (method: string) => {
    switch (method) {
      case "bitcoin":
        return <Bitcoin className="w-5 h-5 text-amber-500" />
      case "cashapp":
        return <Smartphone className="w-5 h-5 text-green-500" />
      case "paypal":
        return <DollarSign className="w-5 h-5 text-blue-500" />
      default:
        return <DollarSign className="w-5 h-5 text-zinc-500" />
    }
  }

  // Get processing time based on payout method
  const getProcessingTime = (method: string) => {
    switch (method) {
      case "bitcoin":
        return "Up to 24 hours"
      case "cashapp":
        return "1-3 business days"
      case "paypal":
        return "1-2 business days"
      default:
        return "1-3 business days"
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <Link href="/dashboard" className="flex items-center mb-8 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold">Withdraw Funds</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
              <h2 className="text-xl font-bold mb-6">Withdrawal Details</h2>

              {error && (
                <div className="p-4 mb-6 rounded-lg bg-red-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 mb-6 rounded-lg bg-green-500/20 flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-200 font-medium">Withdrawal request submitted successfully!</p>
                    <p className="text-green-300/80 text-sm mt-1">
                      Your withdrawal is being processed and will be completed within the specified timeframe.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleWithdraw} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Payout Method</label>
                  <Select value={payoutMethod} onValueChange={setPayoutMethod} disabled={loading}>
                    <SelectTrigger className="bg-zinc-700/50 border-zinc-600 focus:border-amber-500">
                      <SelectValue placeholder="Select payout method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bitcoin">
                        <div className="flex items-center gap-2">
                          <Bitcoin className="w-4 h-4 text-amber-500" />
                          Bitcoin
                        </div>
                      </SelectItem>
                      <SelectItem value="cashapp">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-green-500" />
                          CashApp
                        </div>
                      </SelectItem>
                      <SelectItem value="paypal">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-blue-500" />
                          PayPal
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-400">Withdrawal Amount (USD)</label>
                    <button
                      type="button"
                      onClick={handleMaxAmount}
                      className="text-xs text-amber-500 hover:text-amber-400"
                    >
                      MAX
                    </button>
                  </div>

                  <div className="relative">
                    <DollarSign className="absolute top-3 left-3 w-5 h-5 text-zinc-500" />
                    <Input
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      className="pl-10 bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                      step="0.01"
                      min={
                        payoutMethod === "bitcoin"
                          ? "5000"
                          : payoutMethod === "cashapp"
                            ? "100"
                            : payoutMethod === "paypal"
                              ? "50"
                              : "50"
                      }
                      max={walletStats.availableBalance.toString()}
                      required
                      disabled={loading || isLoadingData}
                    />
                  </div>

                  {payoutMethod === "bitcoin" &&
                    withdrawalAmount &&
                    !isNaN(Number(withdrawalAmount)) &&
                    bitcoinPrice > 0 && (
                      <p className="text-xs text-zinc-500">
                        ≈ {(Number(withdrawalAmount) / bitcoinPrice).toFixed(8)} BTC
                      </p>
                    )}
                </div>

                {/* Bitcoin-specific fields */}
                {payoutMethod === "bitcoin" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Bitcoin Address</label>
                      <Input
                        type="text"
                        value={bitcoinAddress}
                        onChange={(e) => setBitcoinAddress(e.target.value)}
                        placeholder="Enter your Bitcoin address"
                        className="bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Network</label>
                      <Select value={network} onValueChange={setNetwork} disabled={loading}>
                        <SelectTrigger className="bg-zinc-700/50 border-zinc-600 focus:border-amber-500">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btc-mainnet">Bitcoin Mainnet</SelectItem>
                          <SelectItem value="lightning">Lightning Network</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* CashApp-specific fields */}
                {payoutMethod === "cashapp" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">CashApp $Cashtag</label>
                    <div className="relative">
                      <Smartphone className="absolute top-3 left-3 w-5 h-5 text-zinc-500" />
                      <Input
                        type="text"
                        value={cashappTag}
                        onChange={(e) => setCashappTag(e.target.value)}
                        placeholder="$yourcashtag"
                        className="pl-10 bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* PayPal-specific fields */}
                {payoutMethod === "paypal" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">PayPal Email</label>
                    <div className="relative">
                      <DollarSign className="absolute top-3 left-3 w-5 h-5 text-zinc-500" />
                      <Input
                        type="email"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="pl-10 bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-zinc-300">
                    {payoutMethod === "bitcoin" && (
                      <p>
                        Please double-check your Bitcoin address. Withdrawals to incorrect addresses cannot be
                        recovered.
                      </p>
                    )}
                    {payoutMethod === "cashapp" && (
                      <p>
                        Make sure your CashApp $cashtag is correct. Funds will be sent directly to your CashApp account.
                      </p>
                    )}
                    {payoutMethod === "paypal" && (
                      <p>Ensure your PayPal email is correct and your account can receive payments.</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || success || isLoadingData}
                  className="w-full bg-amber-500 hover:bg-amber-600 h-12"
                >
                  {loading
                    ? "Processing..."
                    : success
                      ? "Withdrawal Submitted"
                      : `Withdraw via ${payoutMethod === "bitcoin" ? "Bitcoin" : payoutMethod === "cashapp" ? "CashApp" : "PayPal"}`}
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
              <h2 className="text-xl font-bold mb-4">Account Balance</h2>

              {isLoadingData ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-zinc-700/30 animate-pulse h-20"></div>
                  <div className="p-4 rounded-lg bg-zinc-700/30 animate-pulse h-20"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-zinc-700/30">
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-400">Available Balance</span>
                      <span className="font-bold">
                        ${walletStats.availableBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {bitcoinPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500 text-sm">BTC Equivalent</span>
                        <span className="text-zinc-300 text-sm">
                          {(walletStats.availableBalance / bitcoinPrice).toFixed(8)} BTC
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-zinc-700/30">
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-400">Active Investments</span>
                      <span className="font-bold">
                        ${walletStats.activeInvestments.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {bitcoinPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500 text-sm">BTC Equivalent</span>
                        <span className="text-zinc-300 text-sm">
                          {(walletStats.activeInvestments / bitcoinPrice).toFixed(8)} BTC
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
              <h3 className="font-bold mb-4">Withdrawal Information</h3>

              <div className="space-y-4 text-sm">
                {/* <div className="flex justify-between">
                  <span className="text-zinc-400">Bitcoin Minimum</span>
                  <span>$5,000 USD</span>
                </div> */}
                {/* <div className="flex justify-between">
                  <span className="text-zinc-400">CashApp Minimum</span>
                  <span>$100 USD</span>
                </div> */}
                {/* <div className="flex justify-between">
                  <span className="text-zinc-400">PayPal Minimum</span>
                  <span>$50 USD</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-zinc-400">Processing Time</span>
                  <span>{getProcessingTime(payoutMethod)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Withdrawal Fee</span>
                  <span>{payoutMethod === "bitcoin" ? "Network fee only" : "No fees"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Daily Limit</span>
                  <span>$50,000 USD</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
              <h3 className="font-bold mb-4">Recent Withdrawals</h3>

              {isLoadingData ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-zinc-700/30 animate-pulse h-12"></div>
                  <div className="p-3 rounded-lg bg-zinc-700/30 animate-pulse h-12"></div>
                </div>
              ) : recentWithdrawals.length > 0 ? (
                <div className="space-y-3">
                  {recentWithdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-3 rounded-lg bg-zinc-700/30">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          {getPayoutMethodIcon(withdrawal.payoutMethod || "bitcoin")}
                          <span className="text-zinc-300 font-medium">
                            ${withdrawal.amountUsd?.toFixed(2) || withdrawal.amount?.toFixed(2)}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            withdrawal.status === "completed"
                              ? "bg-green-500/20 text-green-300"
                              : withdrawal.status === "pending"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>{formatDate(withdrawal.createdAt)}</span>
                        <span className="capitalize">{withdrawal.payoutMethod || "Bitcoin"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-zinc-400">
                  <p>No recent withdrawals found</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
