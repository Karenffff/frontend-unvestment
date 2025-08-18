"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bitcoin, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
  
    if (!agreeTerms) {
      setError("You must agree to the terms and conditions")
      return
    }
  
    setIsLoading(true)
  
    try {
      const { success, error } = await register(name, email, password);

      if (success) {
        // Redirect to registration success modal with email parameter
        router.push(`/registration-success?email=${encodeURIComponent(email)}`)
      } else {
        setError(error || "Registration failed. Please try again.")
      }
    } catch (err: any) {
      // Display the specific error message from the API if available
      setError(err.message || "An error occurred. Please try again.")
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
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="mt-2 text-zinc-400">Join MarkInvestment and start investing</p>
            </div>

            {error && <div className="p-3 mb-6 text-sm rounded-md bg-red-500/20 text-red-200">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute top-3 left-3 w-5 h-5 text-zinc-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

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
                    minLength={8}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 w-5 h-5 text-zinc-500" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-zinc-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-amber-500 hover:text-amber-400">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-amber-500 hover:text-amber-400">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-amber-500 hover:bg-amber-600 h-12">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-center text-sm text-zinc-400">
                Already have an account?{" "}
                <Link href="/login" className="text-amber-500 hover:text-amber-400">
                  Log in
                </Link>
              </div>
            </form>
            <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-200 text-center">
                📧 After registration, we'll send you a verification email. Please click the link in the email to
                activate your account.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
