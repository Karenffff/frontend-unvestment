"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { fetchRecentTransactions } from "@/lib/api"

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchRecentTransactions()
        setTransactions(data)
        setLoading(false)
      } catch (error) {
        console.error("Error loading transactions:", error)
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="w-8 h-8 border-4 rounded-full border-amber-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-zinc-500">
        <p>No recent transactions</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 rounded-lg bg-zinc-700/30"
        >
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 mr-3 rounded-full ${
                transaction.type === "buy" ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              {transaction.type === "buy" ? (
                <ArrowDownLeft
                  className={`w-4 h-4 ${transaction.type === "buy" ? "text-green-500" : "text-red-500"}`}
                />
              ) : (
                <ArrowUpRight className={`w-4 h-4 ${transaction.type === "buy" ? "text-green-500" : "text-red-500"}`} />
              )}
            </div>
            <div>
              <div className="font-medium">
                {transaction.type === "buy" ? "Bought" : "Sold"} {transaction.asset}
              </div>
              <div className="text-xs text-zinc-500">{new Date(transaction.date).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">${transaction.amount.toLocaleString()}</div>
            <div className="text-xs text-zinc-500">
              {transaction.quantity} {transaction.symbol}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
