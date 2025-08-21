"use client"

import { useState } from "react"
import { Bitcoin, Search, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

// FAQ item type
type FAQItem = {
  question: string
  answer: string
  category: string
}

// FAQ categories
const categories = ["General", "Investments", "Security", "Payments", "Account"]

// FAQ data
const faqData: FAQItem[] = [
  {
    question: "What is MarkInvestment?",
    answer:
      "MarkInvestment is a platform that allows you to invest your Bitcoin and earn guaranteed returns. We offer various investment plans with different durations and ROI rates, providing a secure and transparent way to grow your cryptocurrency assets.",
    category: "General",
  },
  {
    question: "How does MarkInvestment guarantee returns?",
    answer:
      "We use a combination of strategic Bitcoin trading, lending, and staking to generate consistent returns. Our diversified approach and risk management strategies allow us to guarantee fixed ROIs regardless of market conditions. We maintain substantial reserves to ensure all returns are paid as promised.",
    category: "General",
  },
  {
    question: "Is MarkInvestment regulated?",
    answer:
      "MarkInvestment operates in compliance with applicable regulations in the jurisdictions where we offer our services. We implement strict KYC (Know Your Customer) and AML (Anti-Money Laundering) procedures to ensure a secure and compliant platform.",
    category: "General",
  },
  {
    question: "What investment plans do you offer?",
    answer:
      "We offer a range of investment plans to suit different goals, from short-term plans (7-30 days) to long-term plans (90-365 days). Each plan has a different minimum investment amount and guaranteed ROI, ranging from 3% for our 7-day Starter Plan to 300% for our 365-day Freedom Plan.",
    category: "Investments",
  },
  {
    question: "What is the minimum investment amount?",
    answer:
      "The minimum investment amount varies by plan. Our Newbie Plan has the lowest minimum at 0.01 BTC, while our Freedom Plan requires a minimum of 0.5 BTC. You can view the specific minimum for each plan on our Investment Plans page.",
    category: "Investments",
  },
  {
    question: "How and when are returns paid?",
    answer:
      "Returns are paid according to the schedule specified in your chosen plan. Some plans offer end-of-term payments, while others provide monthly updates. All returns are automatically credited to your account and can be withdrawn or reinvested at your discretion.",
    category: "Investments",
  },
  {
    question: "Can I withdraw my investment early?",
    answer:
      "Yes, you can withdraw your investment before the plan matures, but early withdrawals are subject to fees ranging from 1% to 5% depending on the plan. The specific fee is mentioned in each plan's details.",
    category: "Investments",
  },
  {
    question: "How secure is my investment?",
    answer:
      "Security is our top priority. We use industry-leading security measures, including cold storage for the majority of funds, multi-signature wallets, and regular security audits to ensure your investments are protected. We also maintain substantial reserves to guarantee all returns.",
    category: "Security",
  },
  {
    question: "How do you protect my account?",
    answer:
      "We implement multiple layers of security to protect your account, email confirmations for withdrawals, IP address monitoring, and advanced encryption for all sensitive data. We recommend enabling all security features for maximum protection.",
    category: "Security",
  },
  {
    question: "What happens if there's a security breach?",
    answer:
      "In the unlikely event of a security breach, we have comprehensive protocols in place. Our insurance policy covers all user funds, and we would immediately notify all users, secure the platform, and work with cybersecurity experts to resolve the issue. To date, we have never experienced a security breach.",
    category: "Security",
  },
  {
    question: "How do I deposit Bitcoin?",
    answer:
      "To deposit Bitcoin, log in to your account and navigate to the Deposit page. You'll be provided with a unique Bitcoin address to send your funds to. Once the transaction is confirmed on the blockchain (usually within 1 hour), the Bitcoin will be credited to your account.",
    category: "Payments",
  },
  {
    question: "How do I withdraw my Bitcoin?",
    answer:
      "To withdraw Bitcoin, go to the Withdraw page in your dashboard. Enter the amount you wish to withdraw and the Bitcoin address, or cashapp or paypal you want to send it to. Depending on your security settings, you may need to confirm the withdrawal via email or 2FA. Withdrawals are typically processed within 24 hours.",
    category: "Payments",
  },
  {
    question: "Are there any fees for deposits or withdrawals?",
    answer:
      "We do not charge any fees for deposits. For withdrawals, we only charge the standard Bitcoin network fee to ensure timely processing of your transaction. This fee varies depending on network congestion but is typically minimal.",
    category: "Payments",
  },
  {
    question: "How do I create an account?",
    answer:
      "To create an account, click the 'Sign Up' button on our homepage. You'll need to provide your name, email address, and create a password. After submitting the registration form, you'll receive a verification email to confirm your account. Once verified, you can log in and start investing.",
    category: "Account",
  },
  {
    question: "How do I reset my password?",
    answer:
      "If you've forgotten your password, click the 'Forgot password?' link on the login page. Enter your email address, and we'll send you a password reset link. Click the link in the email and follow the instructions to create a new password.",
    category: "Account",
  },
  {
    question: "Can I have multiple accounts?",
    answer:
      "No, each user is allowed only one account. Creating multiple accounts is against our terms of service and may result in account suspension. If you need to manage investments for different purposes, we recommend using our portfolio management features within a single account.",
    category: "Account",
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([])

  // Filter FAQs based on search query and active category
  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory === "All" || faq.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // Toggle question expansion
  const toggleQuestion = (index: number) => {
    if (expandedQuestions.includes(index)) {
      setExpandedQuestions(expandedQuestions.filter((i) => i !== index))
    } else {
      setExpandedQuestions([...expandedQuestions, index])
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 to-black"></div>
          <div className="container px-4 mx-auto max-w-4xl relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-amber-500/20 text-amber-400">
                <Bitcoin className="w-4 h-4 mr-2" />
                Support Center
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Frequently Asked Questions</h1>
              <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
                Find answers to common questions about our platform and investment process
              </p>

              {/* Search Bar */}
              <div className="w-full max-w-2xl relative">
                <div className="relative">
                  <Search className="absolute top-3 left-3 w-5 h-5 text-zinc-500" />
                  <Input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-6 bg-zinc-800/50 border-zinc-700 focus:border-amber-500 text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 mx-auto max-w-4xl">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <Button
                variant={activeCategory === "All" ? "default" : "outline"}
                onClick={() => setActiveCategory("All")}
                className={activeCategory === "All" ? "bg-amber-500 hover:bg-amber-600" : "border-zinc-700"}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? "bg-amber-500 hover:bg-amber-600" : "border-zinc-700"}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-zinc-800/50 backdrop-blur-sm">
                  <h3 className="mb-2 text-xl font-medium">No Results Found</h3>
                  <p className="text-zinc-400">
                    We couldn't find any FAQs matching your search. Please try different keywords or browse by category.
                  </p>
                </div>
              ) : (
                filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="flex items-center justify-between w-full p-6 text-left"
                    >
                      <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                      {expandedQuestions.includes(index) ? (
                        <ChevronUp className="w-5 h-5 flex-shrink-0 text-amber-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 flex-shrink-0 text-amber-500" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedQuestions.includes(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 text-zinc-300 border-t border-zinc-700 pt-4">{faq.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </div>

            {/* Still Have Questions */}
            <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-700/20 text-center">
              <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-zinc-300 mb-6">
                Our support team is here to help. Contact us and we'll get back to you as soon as possible.
              </p>
              <Button asChild className="bg-amber-500 hover:bg-amber-600">
                <a href="/contact">Contact Support</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
