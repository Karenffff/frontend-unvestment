"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { fetchUserInvestments } from "@/lib/api"

export default function ActiveInvestments() {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInvestments = async () => {
      try {
        const data = await fetchUserInvestments()
        setInvestments(data.filter((inv) => inv.status === "active"))
        setLoading(false)
      } catch (error) {
        console.error("Error loading investments:", error)
        setLoading(false)
      }
    }

    loadInvestments()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (investments.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl bg-zinc-800/50 backdrop-blur-sm">
        <h3 className="mb-2 text-xl font-medium">No Active Investments</h3>
        <p className="text-zinc-400 mb-4">You don't have any active investments at the moment.</p>
        <Link href="/invest">
          <Button className="bg-amber-500 hover:bg-amber-600">Start Investing</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {investments.slice(0, 2).map((investment, index) => (
        <motion.div
          key={investment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-xl bg-zinc-800/50 border border-zinc-700"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">{investment.planName}</h3>
              <p className="text-zinc-400 mt-1">
                {investment.amount} BTC{" "}
                <span className="text-zinc-500">(≈ ${(investment.amount * 65432.1).toLocaleString()})</span> •{" "}
                {investment.roi} ROI
              </p>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">Active</span>
          </div>

          <div>
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
            <div>
              <p className="text-zinc-400 text-sm">Current Earnings</p>
              <p className="font-medium text-green-500">
                {investment.currentEarnings} BTC
                <span className="block text-xs text-green-400">
                  ≈ ${(investment.currentEarnings * 65432.1).toLocaleString()}
                </span>
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-zinc-700">
                View Details
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      ))}

      {investments.length > 2 && (
        <div className="md:col-span-2 text-center">
          <Link href="/dashboard">
            <Button variant="outline" className="border-zinc-700">
              View All Investments
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
