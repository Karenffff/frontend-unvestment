"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bitcoin, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { requestPasswordReset } from "@/lib/api"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"



export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Use the API function to request password reset
      const result = await requestPasswordReset(email)
     
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || "Failed to send reset link. Please try again.")
      }
    } catch (err) {
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
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p className="mt-2 text-zinc-400">Enter your email to receive a password reset link</p>
            </div>

            {error && <div className="p-3 mb-6 text-sm rounded-md bg-red-500/20 text-red-200">{error}</div>}

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                <p className="text-zinc-400 mb-6">
                  We've sent a password reset link to <span className="text-white font-medium">{email}</span>. Please
                  check your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-sm text-zinc-500 mb-6">
                  If you don't see the email, check your spam folder or request another link.
                </p>
                <div className="flex flex-col space-y-3">
                  <Button onClick={() => setSuccess(false)} variant="outline" className="border-zinc-700">
                    Request Another Link
                  </Button>
                  <Link href="/login">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600">Return to Login</Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
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

                <Button type="submit" disabled={isLoading} className="w-full bg-amber-500 hover:bg-amber-600 h-12">
                  {isLoading ? "Sending..." : "Send Reset Link"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-center text-sm text-zinc-400">
                  Remember your password?{" "}
                  <Link href="/login" className="text-amber-500 hover:text-amber-400">
                    Log in
                  </Link>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
