"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Bitcoin, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { verifyEmail } from "@/lib/api"
import Link from "next/link"

export default function VerifyEmailWithTokenPage() {
  const params = useParams()
  const router = useRouter()

  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMessage, setErrorMessage] = useState("")

  const uid = params?.uid as string
  const token = params?.token as string

  useEffect(() => {
    if (uid && token) {
      handleVerification()
    } else {
      setVerificationStatus("error")
      setErrorMessage("Invalid verification link. Missing UID or token.")
      setIsVerifying(false)
    }
  }, [uid, token])

  const handleVerification = async () => {
    setIsVerifying(true)
    setErrorMessage("")

    try {
      console.log("Verifying email with UID:", uid, "and token:", token)

      const result = await verifyEmail(uid, token)

      if (result.success) {
        setVerificationStatus("success")

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login?verified=true")
        }, 3000)
      } else {
        setVerificationStatus("error")
        setErrorMessage(result.error || "Email verification failed. The link may be invalid or expired.")
      }
    } catch (error: any) {
      console.error("Verification error:", error)
      setVerificationStatus("error")
      setErrorMessage(error.message || "An error occurred during verification. Please try again.")
    } finally {
      setIsVerifying(false)
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
              <h1 className="text-3xl font-bold">Email Verification</h1>
            </div>

            {verificationStatus === "verifying" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
                <h2 className="text-xl font-bold mb-2">Verifying Your Email...</h2>
                <p className="text-zinc-400">Please wait while we verify your email address.</p>
              </motion.div>
            )}

            {verificationStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-green-400">Email Verified Successfully!</h2>
                <p className="text-zinc-400 mb-6">
                  Your email has been verified. You can now log in to your BitcoinYield account and start investing.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/login?verified=true")}
                    className="w-full bg-amber-500 hover:bg-amber-600"
                  >
                    Continue to Login
                  </Button>
                  <p className="text-sm text-zinc-500">You will be automatically redirected in a few seconds...</p>
                </div>
              </motion.div>
            )}

            {verificationStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-red-400">Verification Failed</h2>
                <div className="p-4 mb-6 text-sm rounded-md bg-red-500/20 text-red-200">{errorMessage}</div>
                <div className="space-y-3">
                  <Link href="/verify-email">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600">Request New Verification Email</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" className="w-full border-zinc-700">
                      Back to Registration
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
