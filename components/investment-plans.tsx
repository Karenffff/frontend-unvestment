"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchInvestmentPlans } from "@/lib/api"
import { getBTCPriceInUSD } from "@/lib/converter"


export default function InvestmentPlans({ filter = "all" }) {
  const [plans, setPlans] = useState<{ 
    id: number; 
    name: string; 
    duration: string; 
    roi: string; 
    minInvestment: number; 
    minInvestmentUSD: number; 
    category: string; 
    roiPayment: string; 
    earlyWithdrawal: string; 
  }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true)
      const btcPrice = await getBTCPriceInUSD()
      
      const response = await fetchInvestmentPlans()
    
      if (btcPrice && response.success && response.data) {
        const mappedPlans = response.data.map((plan: any) => {
          const usd = plan.min_investment_usd
          const btcEquivalent = usd / btcPrice
          const exampleInvestmentUSD = 1000;
          const exampleInvestmentBTC = exampleInvestmentUSD / btcPrice;
          const roiFactor = 1 + Number.parseFloat(plan.roi) / 100;
          const returnUSD = exampleInvestmentUSD * roiFactor;
          const returnBTC = exampleInvestmentBTC * roiFactor;

    
          return {
            id: plan.id,
            name: plan.name,
            duration: `${plan.durations_days} days`,
            roi: plan.roi_percentage,
            minInvestment: btcEquivalent,
            minInvestmentUSD: usd,
            category: plan.category || "general",
            roiPayment: plan.roi_payment || "Monthly",
            earlyWithdrawal: plan.early_withdrawal_fee || "N/A",
          }
        })
        setPlans(mappedPlans)
      } else {
        console.error(response.error || "Error getting BTC price")
      }
      setLoading(false)
    }
    
        loadPlans();
      }, []);

  const filteredPlans = filter === "all" ? plans : plans.filter((plan) => plan.category === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {filteredPlans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-2xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 hover:border-amber-500/50 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-zinc-700/50">
                  {plan.duration}
                </Badge>
              </div>
            </div>
            <Badge className="bg-amber-500 hover:bg-amber-500 text-lg px-3 py-1.5">{plan.roi} ROI</Badge>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-zinc-400">Minimum Investment</span>
              <span>
                ${plan.minInvestmentUSD.toLocaleString()}
                <span className="text-zinc-400 text-sm ml-1">(≈ {plan.minInvestment.toFixed(3)} BTC)</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">ROI Payment</span>
              <span>{plan.roiPayment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Early Withdrawal</span>
              <span>{plan.earlyWithdrawal}</span>
            </div>
          </div>

          <div className="p-4 mb-6 rounded-lg bg-zinc-700/30">
  <div className="text-center">
    <p className="text-zinc-400 text-sm mb-1">Example Return</p>
    <div className="flex items-center justify-center gap-2">
      <span className="text-zinc-300">
        $1,000
        <span className="text-zinc-500 text-xs block">
          (≈ {(1000 / (plan.minInvestmentUSD / plan.minInvestment)).toFixed(6)} BTC)
        </span>
      </span>
      <span className="text-zinc-500">→</span>
      <span className="text-green-500 font-bold">
        ${(1000 * (1 + Number.parseFloat(plan.roi) / 100)).toFixed(2)}
        <span className="text-green-400 text-xs block">
          (≈ {((1000 / (plan.minInvestmentUSD / plan.minInvestment)) * (1 + Number.parseFloat(plan.roi) / 100)).toFixed(6)} BTC)
        </span>
      </span>
    </div>
  </div>
</div>


          <Link href="/invest">
            <Button className="w-full bg-amber-500 hover:bg-amber-600">Invest Now</Button>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
