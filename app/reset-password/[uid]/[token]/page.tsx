"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Bitcoin, Eye, EyeOff, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { resetPasswordWithUidToken } from "@/lib/api"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useParams()

  const uid = params.uid as string
  const token = params.token as string

  // Validate that we have both uid and token
  const isValidLink = uid && token && uid.length > 0 && token.length > 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPasswordWithUidToken(uid, token, password)

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || "Failed to reset password. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidLink) {
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
                <h1 className="text-3xl font-bold">Invalid Reset Link</h1>
                <p className="mt-2 text-zinc-400 text-center">The password reset link is invalid or has expired.</p>
              </div>

              <div className="text-center">
                <Link href="/forgot-password">
                  <Button className="bg-amber-500 hover:bg-amber-600">Request New Reset Link</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <SiteFooter />
      </>
    )
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
              <p className="mt-2 text-zinc-400 text-center">Create a new password for your account</p>
            </div>

            {error && <div className="p-3 mb-6 text-sm rounded-md bg-red-500/20 text-red-200">{error}</div>}

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Password Reset Successful</h2>
                <p className="text-zinc-400 mb-6">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
                <Link href="/login">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600">Go to Login</Button>
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
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
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
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

                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Password requirements:</p>
                  <ul className="text-xs text-zinc-500 space-y-1 ml-4">
                    <li className={password.length >= 8 ? "text-green-400" : ""}>• At least 8 characters long</li>
                    <li className={/[A-Z]/.test(password) ? "text-green-400" : ""}>
                      • Include at least one uppercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? "text-green-400" : ""}>• Include at least one number</li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-400" : ""}>
                      • Include at least one special character
                    </li>
                  </ul>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-amber-500 hover:bg-amber-600 h-12">
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
