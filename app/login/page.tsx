"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bitcoin, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Login failed. Please try again.")
      }
    } catch (err) {
      console.error("Caught error:", err)

      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="container px-4 py-16 mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700"
          >
            <div className="flex flex-col items-center mb-8">
              <Bitcoin className="w-12 h-12 mb-4 text-amber-500" />
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="mt-2 text-zinc-400">Log in to your MarkInvestment account</p>
            </div>

            {error && <div className="p-3 mb-6 text-sm rounded-md bg-red-500/20 text-red-200">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 w-5 h-5 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 w-5 h-5 text-zinc-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm text-zinc-400">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-amber-500 hover:text-amber-400">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-amber-500 hover:bg-amber-600 h-12">
                {isLoading ? "Logging in..." : "Log In"}
              </Button>

              <div className="text-center text-sm text-zinc-400">
                Don't have an account?{" "}
                <Link href="/register" className="text-amber-500 hover:text-amber-400">
                  Sign up
                </Link>
              </div>
            </form>
{/* 
            <div className="mt-8 pt-6 border-t border-zinc-700">
              <p className="mb-4 text-sm text-center text-zinc-400">Demo credentials:</p>
              <div className="p-3 rounded-md bg-zinc-700/50 text-sm">
                <p>
                  <strong>Email:</strong> demo@example.com
                </p>
                <p>
                  <strong>Password:</strong> password
                </p>
              </div>
            </div> */}
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
