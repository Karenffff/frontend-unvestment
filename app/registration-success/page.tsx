"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Mail, CheckCircle, RefreshCw, ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Get email from query params
  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    } else {
      // If no email, redirect to register
      router.push("/register")
    }
  }, [searchParams, router])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Handle resend verification email
  

  const getEmailProvider = (email: string) => {
    const domain = email.split("@")[1]?.toLowerCase()

    const providers = {
      "gmail.com": { name: "Gmail", url: "https://mail.google.com" },
      "yahoo.com": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
      "outlook.com": { name: "Outlook", url: "https://outlook.live.com" },
      "hotmail.com": { name: "Outlook", url: "https://outlook.live.com" },
      "icloud.com": { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
    }

    return providers[domain as keyof typeof providers]
  }

  const emailProvider = getEmailProvider(email)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full mx-4 relative"
        >
          {/* Close button */}
          <button
            onClick={() => router.push("/login")}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Success animation */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-400" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h1 className="text-2xl font-bold text-white mb-2">Account Created!</h1>
              <p className="text-zinc-400">Please verify your email to continue</p>
            </motion.div>
          </div>

          {/* Email info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start space-x-3">
              <Mail className="w-6 h-6 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-amber-300 mb-1">Check Your Email</h3>
                <p className="text-sm text-amber-200/80 mb-2">We've sent a verification link to:</p>
                <p className="font-medium text-white bg-zinc-800 px-3 py-2 rounded text-sm break-all">{email}</p>
              </div>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3 mb-6"
          >
            <div className="flex items-center space-x-3 text-sm text-zinc-300">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center text-xs font-bold">
                1
              </div>
              <span>Open your email inbox</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-zinc-300">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center text-xs font-bold">
                2
              </div>
              <span>Look for an email from BitcoinYield</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-zinc-300">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span>Click the verification link</span>
            </div>
          </motion.div>

          {/* Quick access to email provider */}
          {emailProvider && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-6"
            >
              <a
                href={emailProvider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <span>Open {emailProvider.name}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          )}

          {/* Resend email section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="space-y-3"
          >
            {resendStatus === "success" && (
              <div className="p-3 rounded-lg bg-green-500/20 text-green-200 text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Verification email sent successfully!</span>
              </div>
            )}

            {resendStatus === "error" && (
              <div className="p-3 rounded-lg bg-red-500/20 text-red-200 text-sm">
                Failed to resend email. Please try again.
              </div>
            )}

         
          </motion.div>

          {/* Footer actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-6 pt-6 border-t border-zinc-700 text-center space-y-2"
          >
            <p className="text-xs text-zinc-500">
              Didn't receive the email? Check your spam folder or contact support.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <Link href="/contact" className="text-amber-500 hover:text-amber-400">
                Contact Support
              </Link>
              <span className="text-zinc-600">•</span>
              <Link href="/login" className="text-amber-500 hover:text-amber-400">
                Back to Login
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
