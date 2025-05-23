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
  const [amount, setAmount] = useState(0.1)
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null)
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const usdAmount = amount * (bitcoinPrice || 0)

  // Fetch investment plans and Bitcoin price on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingPlans(true)
        setError(null)

        // Fetch plans
        const plansResponse = await fetchInvestmentPlans()
        if (plansResponse.success && plansResponse.data) {
          setPlans(
            plansResponse.data.map(plan => ({
              id: plan.id,
              name: plan.name,
              duration: `${plan.durations_days} days`,
              roi: plan.roi_percentage,
              minInvestmentUSD: plan.min_investment_usd,
              minInvestment: plan.min_investment_usd / bitcoinPrice,
              category: plan.category,
              earlyWithdrawal: plan.early_withdrawal_fee,
              roiPayment: plan.roi_payment,
            }))
          )
        } else {
          throw new Error(plansResponse.error || "Failed to fetch plans")
        }

     
        // Fetch current Bitcoin price
        const price = await fetchBitcoinPrice()
        if (!price) {
          throw new Error("Failed to fetch current Bitcoin price")
        }
        setBitcoinPrice(price)
      } catch (err) {
        console.error("Error fetching data:", err)
        if (String(err).includes("Bitcoin price")) {
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

    setLoading(true)
    setError(null)

    try {
      // Use the plan ID for the investment
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
    } catch (error: any) {
      console.error("Error investing Bitcoin:", error)
      setLoading(false)

      // Extract error message from the error object
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "There was an error processing your investment. Please try again."
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
    const roiPercentage = Number.parseFloat(plan.roi) / 100
    return amount * (1 + roiPercentage)
  }

  const handlePlanSelection = (value: string) => {
    setSelectedPlanId(value)
    const plan = plans.find((p) => p.id.toString() === value)
    setSelectedPlan(plan || null)
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
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="pl-10 bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                        step={0.01}
                        min={0.01}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-zinc-400 mb-2 block">Adjust Amount</Label>
                    <Slider
                      value={[amount]}
                      min={0.01}
                      max={1}
                      step={0.01}
                      onValueChange={(value) => setAmount(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-sm text-zinc-500">
                      <span>0.01 BTC</span>
                      <span>1 BTC</span>
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
                      <span className="font-medium text-amber-500">{selectedPlan.roi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Investment Amount</span>
                      <div className="text-right">
                        <span className="font-medium">{amount} BTC</span>
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
                      <span className="text-zinc-400">Minimum Investment</span>
                      <div className="text-right">
                        <span className="font-medium">${selectedPlan.minInvestmentUSD.toLocaleString()}</span>
                        <div className="text-sm text-zinc-400">≈ {selectedPlan.minInvestment.toFixed(8)} BTC</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleInvest}
                      disabled={loading || amount < selectedPlan.minInvestment}
                      className="w-full bg-amber-500 hover:bg-amber-600 h-12"
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
                      ) : (
                        "Confirm Investment"
                      )}
                    </Button>

                    {selectedPlan && amount < selectedPlan.minInvestment && (
                      <p className="text-red-500 text-sm mt-2">
                        Minimum investment for this plan is ${selectedPlan.minInvestmentUSD.toLocaleString()} (≈{" "}
                        {selectedPlan.minInvestment.toFixed(8)} BTC)
                      </p>
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

                <TabsContent value="all">
                  <RadioGroup value={selectedPlanId} onValueChange={handlePlanSelection} className="space-y-4">
                    {plans.map((plan) => (
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
                          <div>
                            <h3 className="font-bold text-lg">{plan.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="bg-zinc-700/50">
                                {plan.duration}
                              </Badge>
                              <Badge className="bg-amber-500/80 hover:bg-amber-500">{plan.roi} ROI</Badge>
                            </div>
                            <div className="mt-3 text-sm text-zinc-400">
                              Min. Investment: ${plan.minInvestmentUSD.toLocaleString()}
                              <span className="block">≈ {plan.minInvestment.toFixed(8)} BTC</span>
                            </div>
                            <ul className="mt-3 space-y-1">
                              <li className="flex items-center text-sm text-zinc-300">
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                {plan.roiPayment} payout
                              </li>
                              <li className="flex items-center text-sm text-zinc-300">
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                {plan.earlyWithdrawal}
                              </li>
                              <li className="flex items-center text-sm text-zinc-300">
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                Automatic reinvestment option
                              </li>
                            </ul>
                          </div>
                          <RadioGroupItem value={plan.id.toString()} id={`plan-${plan.id}`} className="sr-only" />
                          <div
                            className={`w-5 h-5 rounded-full border ${
                              selectedPlan?.id === plan.id ? "border-amber-500 bg-amber-500" : "border-zinc-600"
                            }`}
                          >
                            {selectedPlan?.id === plan.id && <Check className="w-4 h-4 text-zinc-900" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </TabsContent>

                <TabsContent value="short">
                  <RadioGroup value={selectedPlanId} onValueChange={handlePlanSelection} className="space-y-4">
                    {plans
                      .filter((p) => p.category === "short")
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
                            <div>
                              <h3 className="font-bold text-lg">{plan.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="bg-zinc-700/50">
                                  {plan.duration}
                                </Badge>
                                <Badge className="bg-amber-500/80 hover:bg-amber-500">{plan.roi} ROI</Badge>
                              </div>
                              <div className="mt-3 text-sm text-zinc-400">
                                Min. Investment: ${plan.minInvestmentUSD.toLocaleString()}
                                <span className="block">≈ {plan.minInvestment.toFixed(8)} BTC</span>
                              </div>
                              <ul className="mt-3 space-y-1">
                                <li className="flex items-center text-sm text-zinc-300">
                                  <Check className="w-4 h-4 mr-2 text-green-500" />
                                  {plan.roiPayment} payout
                                </li>
                                <li className="flex items-center text-sm text-zinc-300">
                                  <Check className="w-4 h-4 mr-2 text-green-500" />
                                  {plan.earlyWithdrawal}
                                </li>
                                <li className="flex items-center text-sm text-zinc-300">
                                  <Check className="w-4 h-4 mr-2 text-green-500" />
                                  Automatic reinvestment option
                                </li>
                              </ul>
                            </div>
                            <RadioGroupItem value={plan.id.toString()} id={`plan-${plan.id}`} className="sr-only" />
                            <div
                              className={`w-5 h-5 rounded-full border ${
                                selectedPlan?.id === plan.id ? "border-amber-500 bg-amber-500" : "border-zinc-600"
                              }`}
                            >
                              {selectedPlan?.id === plan.id && <Check className="w-4 h-4 text-zinc-900" />}
                            </div>
                          </div>
                        </div>
                      ))}
                  </RadioGroup>
                </TabsContent>

                <TabsContent value="medium">
                  <RadioGroup value={selectedPlanId} onValueChange={handlePlanSelection} className="space-y-4">
                    {plans
                      .filter((p) => p.category === "medium")
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
                            <div>
                              <h3 className="font-bold text-lg">{plan.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="bg-zinc-700/50">
                                  {plan.duration}
                                </Badge>
                                <Badge className="bg-amber-500/80 hover:bg-amber-500">{plan.roi} ROI</Badge>
                              </div>
                              <div className="mt-3 text-sm text-zinc-400">
                                Min. Investment: ${plan.minInvestmentUSD.toLocaleString()}
                                <span className="block">≈ {plan.minInvestment.toFixed(8)} BTC</span>
                              </div>
                              <ul className="mt-3 space-y-1">
                                <li className="flex items-center text-sm text-zinc-300">
                                  <Check className="w-4 h-4 mr-2 text-green-500" />
                                  {plan.roiPayment} payout
                                </li>
                                <li className="flex items-center text-sm text-zinc-300">
                                  <Check className="w-4 h-4 mr-2 text-green-500" />
                                  {plan.earlyWithdrawal}
                                </li>
                                <li className="flex items-center text-sm text-zinc-300">
                                  <Check className="w-4 h-4 mr-2 text-green-500" />
                                  Automatic reinvestment option
                                </li>
                              </ul>
                            </div>
                            <RadioGroupItem value={plan.id.toString()} id={`plan-${plan.id}`} className="sr-only" />
                            <div
                              className={`w-5 h-5 rounded-full border ${
                                selectedPlan?.id === plan.id ? "border-amber-500 bg-amber-500" : "border-zinc-600"
                              }`}
                            >
                              {selectedPlan?.id === plan.id && <Check className="w-4 h-4 text-zinc-900" />}
                            </div>
                          </div>
                        </div>
                      ))}
                  </RadioGroup>
                </TabsContent>

                <TabsContent value="long">
                  <RadioGroup value={selectedPlanId} onValueChange={handlePlanSelection} className="space-y-4">
                    {plans
                      .filter((p) => p.category === "long")
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
                            <div>
                              <h3 className="font-bold text-lg">{plan.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="bg-zinc-700/50">
                                  {plan.duration}
                                </Badge>
                                <Badge className="bg-amber-500/80 hover:bg-amber-500">{plan.roi} ROI</Badge>
                              </div>
                              <div className="mt-3 text-sm text-zinc-400">
                                Min. Investment: ${plan.minInvestmentUSD.toLocaleString()}
                                <span className="block">≈ {plan.minInvestment.toFixed(8)} BTC</span>
                              </div>
                              <ul className="mt-3 space-y-1">
                                <li className="flex items-center text-sm text-zinc-300">
                                  <Check className="w-4 h-4 mr-2 text-green-500" />
                                  {plan.roiPayment} payout
                                </li>
                                <li className="flex items-center text-sm text-zinc-300">
                                  <Check className="w-4 h-4 mr-2 text-green-500" />
                                  {plan.earlyWithdrawal}
                                </li>
                                <li className="flex items-center text-sm text-zinc-300">
                                  <Check className="w-4 h-4 mr-2 text-green-500" />
                                  Automatic reinvestment option
                                </li>
                              </ul>
                            </div>
                            <RadioGroupItem value={plan.id.toString()} id={`plan-${plan.id}`} className="sr-only" />
                            <div
                              className={`w-5 h-5 rounded-full border ${
                                selectedPlan?.id === plan.id ? "border-amber-500 bg-amber-500" : "border-zinc-600"
                              }`}
                            >
                              {selectedPlan?.id === plan.id && <Check className="w-4 h-4 text-zinc-900" />}
                            </div>
                          </div>
                        </div>
                      ))}
                  </RadioGroup>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-500 mt-0.5" />
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
