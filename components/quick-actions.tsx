"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, Wallet, BarChart3 } from "lucide-react"

export default function QuickActions() {
  const actions = [
    {
      title: "Buy",
      description: "Purchase Bitcoin",
      icon: <ArrowDownLeft className="w-5 h-5 text-green-500" />,
      color: "bg-green-500/10",
      link: "/buy",
    },
    {
      title: "Sell",
      description: "Sell your Bitcoin",
      icon: <ArrowUpRight className="w-5 h-5 text-red-500" />,
      color: "bg-red-500/10",
      link: "/sell",
    },
    {
      title: "Deposit",
      description: "Add funds",
      icon: <Wallet className="w-5 h-5 text-blue-500" />,
      color: "bg-blue-500/10",
      link: "/deposit",
    },
    {
      title: "Analytics",
      description: "View insights",
      icon: <BarChart3 className="w-5 h-5 text-purple-500" />,
      color: "bg-purple-500/10",
      link: "/analytics",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={action.link}>
            <div className={`flex items-center p-3 rounded-lg ${action.color} hover:bg-opacity-20 transition-all`}>
              <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-zinc-800">
                {action.icon}
              </div>
              <div>
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-zinc-400">{action.description}</div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
