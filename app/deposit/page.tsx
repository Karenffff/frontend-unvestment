"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, RefreshCw, Bitcoin, Info, Check, AlertCircle, Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { fetchWalletAddress, fetchBitcoinPrice, submitDeposit, fetchRecentDeposits } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DepositPage() {
  const router = useRouter()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for deposit form
  const [depositAddress, setDepositAddress] = useState("")
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingAddress, setIsLoadingAddress] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("bitcoin")
  const [paymentNetwork, setPaymentNetwork] = useState("btc-mainnet")
  const [depositAmount, setDepositAmount] = useState(0)
  const [networkOptions, setNetworkOptions] = useState([
    { value: "btc-mainnet", label: "Bitcoin Mainnet" },
    { value: "lightning", label: "Lightning Network" },
  ])

  // State for transaction proof
  const [transactionProof, setTransactionProof] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [bitcoinPrice, setBitcoinPrice] = useState(0)
  const [recentDeposits, setRecentDeposits] = useState<any[]>([])
  const [isLoadingDeposits, setIsLoadingDeposits] = useState(true)

  // Fetch wallet address when currency or network changes
  useEffect(() => {
    const getWalletAddress = async () => {
      setIsLoadingAddress(true)
      try {
        const address = await fetchWalletAddress(paymentMethod, paymentNetwork)
        setDepositAddress(address)
      } catch (error) {
        console.error("Error fetching wallet address:", error)
      } finally {
        setIsLoadingAddress(false)
      }
    }

    getWalletAddress()
  }, [paymentMethod, paymentNetwork])

  // Fetch Bitcoin price and recent deposits on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const price = await fetchBitcoinPrice()
        setBitcoinPrice(price)

        setIsLoadingDeposits(true)
        const deposits = await fetchRecentDeposits()
        setRecentDeposits(deposits)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoadingDeposits(false)
      }
    }

    fetchData()
  }, [])

  // Update network options based on selected payment method
  useEffect(() => {
    if (paymentMethod === "bitcoin") {
      setNetworkOptions([
        { value: "btc-mainnet", label: "Bitcoin Mainnet" },
        { value: "lightning", label: "Lightning Network" },
      ])
      setPaymentNetwork("btc-mainnet")
    } else if (paymentMethod === "ethereum") {
      setNetworkOptions([
        { value: "ethereum", label: "Ethereum Mainnet" },
        { value: "arbitrum", label: "Arbitrum" },
        { value: "optimism", label: "Optimism" },
      ])
      setPaymentNetwork("ethereum")
    } else if (paymentMethod === "usdc") {
      setNetworkOptions([
        { value: "ethereum", label: "Ethereum (ERC-20)" },
        { value: "polygon", label: "Polygon" },
        { value: "solana", label: "Solana" },
      ])
      setPaymentNetwork("ethereum")
    } else if (paymentMethod === "usdt") {
      setNetworkOptions([
        { value: "ethereum", label: "Ethereum (ERC-20)" },
        { value: "tron", label: "TRON (TRC-20)" },
        { value: "bsc", label: "Binance Smart Chain (BEP-20)" },
      ])
      setPaymentNetwork("ethereum")
    }
  }, [paymentMethod])

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 3000)
  }

  const handleRefreshAddress = async () => {
    setIsRefreshing(true)

    try {
      const newAddress = await fetchWalletAddress(paymentMethod, paymentNetwork)
      setDepositAddress(newAddress)
    } catch (error) {
      console.error("Error refreshing address:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Please upload an image file (JPEG, PNG, etc.)")
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB")
        return
      }

      setTransactionProof(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setProofPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = () => {
    setTransactionProof(null)
    setProofPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmitDeposit = async () => {
    // Validate form
    if (!depositAmount || depositAmount <= 0) {
      setSubmitError("Please enter a valid deposit amount")
      return
    }

    if (!transactionProof) {
      setSubmitError("Please upload proof of your transaction")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append("amount_usd", depositAmount.toString())
      formData.append("currency", paymentMethod)
      formData.append("network", paymentNetwork)
      formData.append("transaction_proof", transactionProof)

      const result = await submitDeposit(formData)

      if (result.success) {
        setSubmitSuccess(true)
        // Reset form
        setDepositAmount(0)
        setTransactionProof(null)
        setProofPreview(null)

        // Redirect to dashboard after delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setSubmitError(result.error)
      }
    } catch (error: any) {
      console.error("Error submitting deposit:", error)
      setSubmitError(error.message || "Failed to submit deposit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <Link href="/dashboard" className="flex items-center mb-8 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold">Deposit Funds</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs defaultValue="crypto" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-800/50">
              <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
              <TabsTrigger value="fiat">Bank Transfer</TabsTrigger>
            </TabsList>

            <TabsContent value="crypto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
                  <h2 className="text-xl font-bold mb-6">Select Deposit Method</h2>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Cryptocurrency</label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="bg-zinc-700/50 border-zinc-600 focus:border-amber-500">
                          <SelectValue placeholder="Select cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                          <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                          <SelectItem value="usdt">Tether (USDT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Network</label>
                      <Select value={paymentNetwork} onValueChange={setPaymentNetwork}>
                        <SelectTrigger className="bg-zinc-700/50 border-zinc-600 focus:border-amber-500">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                        <SelectContent>
                          {networkOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Deposit Amount (USD)</label>
                      <div className="relative">
                        <Bitcoin className="absolute top-3 left-3 w-5 h-5 text-zinc-500" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={depositAmount === 0 ? "" : depositAmount}
                          onChange={(e) => setDepositAmount(Number(e.target.value))}
                          className="pl-10 bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                        />
                      </div>
                      {bitcoinPrice > 0 && depositAmount > 0 && (
                        <p className="text-xs text-zinc-400">
                          ≈ {(depositAmount / bitcoinPrice).toFixed(8)} BTC at current price ($
                          {bitcoinPrice.toLocaleString()})
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Deposit Address</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-zinc-700"
                        onClick={handleRefreshAddress}
                        disabled={isRefreshing || isLoadingAddress}
                      >
                        {isRefreshing ? (
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4 mr-1" />
                        )}
                        New Address
                      </Button>
                    </div>

                    <div className="p-4 mb-4 rounded-lg bg-zinc-700/30 relative">
                      {isLoadingAddress ? (
                        <div className="flex items-center justify-center h-6">
                          <div className="w-5 h-5 border-2 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
                        </div>
                      ) : (
                        <>
                          <p className="font-mono text-sm break-all pr-8">{depositAddress}</p>
                          <button
                            onClick={handleCopyAddress}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-amber-500"
                            aria-label="Copy address"
                          >
                            {copiedAddress ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                        </>
                      )}
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                      <Info className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-zinc-300">
                          Only send{" "}
                          <span className="font-semibold">
                            {paymentMethod === "bitcoin"
                              ? "Bitcoin (BTC)"
                              : paymentMethod === "ethereum"
                                ? "Ethereum (ETH)"
                                : paymentMethod === "usdc"
                                  ? "USD Coin (USDC)"
                                  : "Tether (USDT)"}
                          </span>{" "}
                          to this address. Sending any other cryptocurrency may result in permanent loss.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
                    <h3 className="font-bold mb-4">Upload Transaction Proof</h3>

                    <div className="mb-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        id="transaction-proof"
                      />

                      {!proofPreview ? (
                        <label
                          htmlFor="transaction-proof"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-600 rounded-lg cursor-pointer bg-zinc-700/30 hover:bg-zinc-700/50 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-zinc-400" />
                            <p className="mb-1 text-sm text-zinc-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-zinc-500">Screenshot of transaction (PNG, JPG up to 5MB)</p>
                          </div>
                        </label>
                      ) : (
                        <div className="relative">
                          <div className="relative w-full h-48 rounded-lg overflow-hidden">
                            <ImageIcon
                              src={proofPreview || "/placeholder.svg"}
                              alt="Transaction proof"
                              className="w-full h-full object-contain bg-zinc-800"
                            />
                          </div>
                          <button
                            onClick={handleRemoveFile}
                            className="absolute top-2 right-2 bg-zinc-800/80 p-1 rounded-full hover:bg-zinc-700"
                            aria-label="Remove image"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}

                      {uploadError && <p className="mt-2 text-sm text-red-500">{uploadError}</p>}

                      <p className="mt-2 text-xs text-zinc-500">
                        Please upload a screenshot of your transaction as proof of deposit
                      </p>
                    </div>

                    <Button
                      onClick={handleSubmitDeposit}
                      disabled={isSubmitting || !transactionProof || depositAmount <= 0}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Submit Deposit"
                      )}
                    </Button>

                    {submitError && (
                      <Alert variant="destructive" className="mt-4 bg-red-900/20 border border-red-900">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{submitError}</AlertDescription>
                      </Alert>
                    )}

                    {submitSuccess && (
                      <Alert className="mt-4 bg-green-900/20 border border-green-900">
                        <Check className="h-4 w-4" />
                        <AlertDescription>Deposit submitted successfully! Redirecting to dashboard...</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
                <h3 className="font-bold mb-4">Recent Deposits</h3>

                {isLoadingDeposits ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
                  </div>
                ) : recentDeposits.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Currency</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentDeposits.map((deposit, index) => (
                          <tr key={deposit.id || index} className="border-b border-zinc-700/50">
                            <td className="py-3 px-4">{formatDate(deposit.created_at)}</td>
                            <td className="py-3 px-4">${deposit.amount_usd.toLocaleString()}</td>
                            <td className="py-3 px-4">{deposit.currency.toUpperCase()}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  deposit.status === "completed"
                                    ? "bg-green-900/20 text-green-400"
                                    : deposit.status === "pending"
                                      ? "bg-amber-900/20 text-amber-400"
                                      : "bg-red-900/20 text-red-400"
                                }`}
                              >
                                {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-zinc-400">
                    <p>No recent deposits found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="fiat">
              <div className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">Bank Transfer Coming Soon</h3>
                    <p className="text-zinc-300">
                      We're currently working on integrating bank transfer deposits. This feature will be available
                      soon. In the meantime, please use cryptocurrency deposits.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-700/20 text-center">
                <h3 className="text-xl font-bold mb-4">Need to Purchase Bitcoin?</h3>
                <p className="text-zinc-300 mb-6">
                  Don't have Bitcoin yet? You can purchase Bitcoin from these trusted exchanges:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Coinbase", "Binance", "Kraken", "Gemini"].map((exchange) => (
                    <div key={exchange} className="p-3 rounded-lg bg-zinc-800/80 text-center">
                      {exchange}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </main>
  )
}
