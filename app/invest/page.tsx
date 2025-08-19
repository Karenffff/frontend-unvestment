"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bitcoin, Check, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { investBitcoin, fetchInvestmentPlans, fetchBitcoinPrice } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import type { InvestmentPlan } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function InvestPage() {
  const router = useRouter()
  const [amount, setAmount] = useState(0.001) // Will be updated when Bitcoin price loads
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [bitcoinPrice, setBitcoinPrice] = useState<number>(0)
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const usdAmount = amount * bitcoinPrice

  // Check if current amount meets minimum investment requirement
  const isAmountBelowMinimum = selectedPlan && selectedPlan.minInvestmentUSD > 0 && usdAmount < selectedPlan.minInvestmentUSD

  // Fetch investment plans and Bitcoin price on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingPlans(true)
        setError(null)

        // Fetch current Bitcoin price
        const price = await fetchBitcoinPrice()
        if (!price || price <= 0) {
          throw new Error("Failed to fetch current Bitcoin price")
        }
        setBitcoinPrice(price)

        // Set default amount to $100 worth of BTC
        const defaultAmountInBTC = 100 / price
        setAmount(defaultAmountInBTC)

        // Fetch plans
        const plansResponse = await fetchInvestmentPlans()
        if (plansResponse.success && plansResponse.data) {
          setPlans(
            plansResponse.data.map(plan => ({
              id: plan.id,
              name: plan.name,
              duration: `${plan.duration_days} days`,
              roi: plan.roi_percentage.toString(),
              minInvestmentUSD: plan.min_investment_usd || 0,
              minInvestment: (plan.min_investment_usd || 0) / price,
              category: plan.category,
              earlyWithdrawal: plan.early_withdrawal_fee,
              roiPayment: plan.roi_payment,
            }))
          )
        } else {
          throw new Error(plansResponse.error || "Failed to fetch plans")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        const errorMessage = err instanceof Error ? err.message : String(err)
        
        if (errorMessage.includes("Bitcoin price")) {
          setError("Failed to load current Bitcoin price. Please try again later.")
        } else {
          setError("Failed to load investment plans. Please try again later.")
        }
      } finally {
        setIsLoadingPlans(false)
      }
    }

    fetchData()
  }, [])

  const handleInvest = async () => {
    if (!selectedPlan) {
      toast({
        title: "No plan selected",
        description: "Please select an investment plan before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (bitcoinPrice <= 0) {
      toast({
        title: "Price Error",
        description: "Bitcoin price is not available. Please refresh the page.",
        variant: "destructive",
      })
      return
    }

    // Check minimum investment requirement
    if (isAmountBelowMinimum) {
      toast({
        title: "Minimum Investment Required",
        description: `Your investment amount ($${usdAmount.toLocaleString()}) is below the minimum required for this plan ($${selectedPlan.minInvestmentUSD.toLocaleString()}). Please increase your investment amount.`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const amountUsd = amount * bitcoinPrice

      const result = await investBitcoin(amountUsd, selectedPlan.id)

      if (result.success) {
        setLoading(false)
        setSuccess(true)

        toast({
          title: "Investment Successful",
          description: "Your Bitcoin investment has been processed successfully.",
          variant: "default",
        })

        // Show success message briefly before redirecting
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        throw new Error(result.error)
      }
    } catch (error: unknown) {
      console.error("Error investing Bitcoin:", error)
      setLoading(false)

      // Extract error message from the error object
      let errorMessage = "There was an error processing your investment. Please try again."
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null) {
        // Handle API error responses
        const apiError = error as any
        errorMessage = apiError.response?.data?.message || 
                     apiError.response?.data?.error || 
                     apiError.message || 
                     errorMessage
      }

      console.error("Error message:", errorMessage)
      setError(errorMessage)

      toast({
        title: "Investment Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const expectedReturn = (plan: InvestmentPlan | null) => {
    if (!plan) return 0
    const roiPercentage = parseFloat(plan.roi) / 100
    return amount * (1 + roiPercentage)
  }

  const handlePlanSelection = (value: string) => {
    setSelectedPlanId(value)
    const plan = plans.find((p) => p.id.toString() === value)
    setSelectedPlan(plan || null)
  }

  // Helper function to handle amount changes with validation
  const handleAmountChange = (newAmount: number) => {
    const minBtcAmount = 10 / bitcoinPrice // $10 minimum in BTC
    if (newAmount < minBtcAmount) {
      setAmount(minBtcAmount)
    } else {
      setAmount(newAmount)
    }
  }

  // Render loading state
  if (isLoadingPlans) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="container px-4 py-8 mx-auto max-w-5xl">
          <Link href="/" className="flex items-center mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
            <h2 className="text-xl font-medium">Loading investment plans...</h2>
          </div>
        </div>
      </main>
    )
  }

  // Render error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="container px-4 py-8 mx-auto max-w-5xl">
          <Link href="/" className="flex items-center mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="bg-red-500/20 p-6 rounded-lg text-center max-w-md">
              <h2 className="text-xl font-medium mb-2">Error Loading Plans</h2>
              <p className="text-zinc-300 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-amber-500 hover:bg-amber-600">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container px-4 py-8 mx-auto max-w-5xl">
        <Link href="/" className="flex items-center mb-8 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-center mb-8">
            <Bitcoin className="w-12 h-12 mr-3 text-amber-500" />
            <h1 className="text-3xl font-bold">Invest Your Bitcoin</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle>Investment Amount</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Choose how much Bitcoin you want to invest
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="amount" className="text-zinc-400">
                        Amount (BTC)
                      </Label>
                      <span className="text-zinc-400">≈ ${usdAmount.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                      <Bitcoin className="absolute top-3 left-3 w-5 h-5 text-zinc-500" />
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => handleAmountChange(parseFloat(e.target.value) || (10 / bitcoinPrice))}
                        className={`pl-10 bg-zinc-700/50 border-zinc-600 focus:border-amber-500 ${
                          isAmountBelowMinimum ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        step={0.001}
                        min={10 / bitcoinPrice}
                      />
                    </div>
                    {/* Show minimum investment error */}
                    {isAmountBelowMinimum && (
                      <div className="mt-2 p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                        <p className="text-red-400 text-sm font-medium">
                          ⚠️ Minimum investment required: ${selectedPlan.minInvestmentUSD.toLocaleString()} 
                          (≈ {selectedPlan.minInvestment.toFixed(8)} BTC)
                        </p>
                        <p className="text-red-300 text-xs mt-1">
                          Your current amount: ${usdAmount.toLocaleString()} is below the minimum for this plan.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-zinc-400 mb-2 block">Adjust Amount</Label>
                    <Slider
                      value={[amount]}
                      min={10 / bitcoinPrice} // $10 minimum
                      max={10000 / bitcoinPrice} // $10,000 maximum
                      step={0.001}
                      onValueChange={(value) => handleAmountChange(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-sm text-zinc-500">
                      <span>$10</span>
                      <span>$10,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedPlan && (
                <Card className="bg-zinc-800/50 border-zinc-700 mt-6">
                  <CardHeader>
                    <CardTitle>Investment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Plan</span>
                      <span className="font-medium">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Duration</span>
                      <span className="font-medium">{selectedPlan.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">ROI</span>
                      <span className="font-medium text-amber-500">{selectedPlan.roi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Investment Amount</span>
                      <div className="text-right">
                        <span className="font-medium">{amount.toFixed(8)} BTC</span>
                        <div className="text-sm text-zinc-400">≈ ${(amount * bitcoinPrice).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Expected Return</span>
                      <div className="text-right">
                        <span className="font-medium text-green-500">
                          {expectedReturn(selectedPlan).toFixed(8)} BTC
                        </span>
                        <div className="text-sm text-green-400">
                          ≈ ${(expectedReturn(selectedPlan) * bitcoinPrice).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Profit</span>
                      <div className="text-right">
                        <span className="font-medium text-green-500">
                          {(expectedReturn(selectedPlan) - amount).toFixed(8)} BTC
                        </span>
                        <div className="text-sm text-green-400">
                          ≈ ${((expectedReturn(selectedPlan) - amount) * bitcoinPrice).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Required Minimum</span>
                      <div className="text-right">
                        <span className="font-medium">${selectedPlan.minInvestmentUSD.toLocaleString()}</span>
                        <div className="text-sm text-zinc-400">≈ {selectedPlan.minInvestment.toFixed(8)} BTC</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-stretch">
                    <Button
                      onClick={handleInvest}
                      disabled={loading || !!isAmountBelowMinimum}
                      className={`w-full h-12 ${
                        isAmountBelowMinimum 
                          ? 'bg-red-500/50 hover:bg-red-500/50 cursor-not-allowed' 
                          : 'bg-amber-500 hover:bg-amber-600'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : success ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Investment Complete!
                        </>
                      ) : isAmountBelowMinimum ? (
                        "Minimum Investment Required"
                      ) : (
                        "Confirm Investment"
                      )}
                    </Button>

                    {isAmountBelowMinimum && (
                      <div className="mt-3 p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                        <p className="text-red-400 text-sm font-medium text-center">
                          ❌ Cannot proceed: Investment amount is below minimum requirement
                        </p>
                        <p className="text-red-300 text-xs mt-1 text-center">
                          Increase your investment to at least ${selectedPlan.minInvestmentUSD.toLocaleString()} to continue
                        </p>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-lg bg-green-500/20 text-green-400 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Investment successful! Check your dashboard for updates.</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Select an Investment Plan</h2>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4 bg-zinc-800/50">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="short">Short</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="long">Long</TabsTrigger>
                </TabsList>

                {/* Plan selection components */}
                {["all", "short", "medium", "long"].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue}>
                    <RadioGroup value={selectedPlanId} onValueChange={handlePlanSelection} className="space-y-4">
                      {plans
                        .filter((p) => tabValue === "all" || p.category === tabValue)
                        .map((plan) => (
                          <div
                            key={plan.id}
                            className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                              selectedPlan?.id === plan.id
                                ? "border-amber-500 bg-amber-500/10"
                                : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                            }`}
                            onClick={() => handlePlanSelection(plan.id.toString())}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg">{plan.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="bg-zinc-700/50">
                                    {plan.duration}
                                  </Badge>
                                  <Badge className="bg-amber-500/80 hover:bg-amber-500">{plan.roi}% ROI</Badge>
                                </div>
                                <div className="mt-3 text-sm text-zinc-400">
                                  {plan.minInvestmentUSD > 0 ? (
                                    <>
                                      <span className="font-medium text-red-400">Required Min:</span> ${plan.minInvestmentUSD.toLocaleString()}
                                      <span className="block">≈ {plan.minInvestment.toFixed(8)} BTC</span>
                                    </>
                                  ) : (
                                    <span className="text-green-400">No minimum investment required</span>
                                  )}
                                </div>
                                <ul className="mt-3 space-y-1">
                                  <li className="flex items-center text-sm text-zinc-300">
                                    <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                                    <span>{plan.roiPayment} payout</span>
                                  </li>
                                  <li className="flex items-center text-sm text-zinc-300">
                                    <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                                    <span>{plan.earlyWithdrawal}</span>
                                  </li>
                                  <li className="flex items-center text-sm text-zinc-300">
                                    <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                                    <span>Automatic reinvestment option</span>
                                  </li>
                                </ul>
                              </div>
                              <RadioGroupItem value={plan.id.toString()} id={`plan-${plan.id}`} className="sr-only" />
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-4 ${
                                  selectedPlan?.id === plan.id ? "border-amber-500 bg-amber-500" : "border-zinc-600"
                                }`}
                              >
                                {selectedPlan?.id === plan.id && <Check className="w-3 h-3 text-zinc-900" />}
                              </div>
                            </div>
                          </div>
                        ))}
                    </RadioGroup>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-6 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Important Information</h3>
                    <p className="text-sm text-zinc-400">
                      All investments come with a guaranteed ROI as specified in the plan details. Early withdrawals are
                      subject to fees. Please review our terms and conditions before investing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}