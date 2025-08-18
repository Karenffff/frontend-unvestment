"use client"

import Link from "next/link"
import { Bitcoin, TrendingUp, Shield, Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import InvestmentPlans from "@/components/investment-plans"
import ActiveInvestments from "@/components/active-investments"
import BitcoinStats from "@/components/bitcoin-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 to-black"></div>
          <div className="container px-4 mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-amber-500/20 text-amber-400">
                <Bitcoin className="w-4 h-4 mr-2" />
                The Future of Bitcoin Investments
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Grow Your Bitcoin with <span className="text-amber-500">Guaranteed Returns</span>
              </h1>
              <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
                Invest your Bitcoin in our secure, transparent plans and earn fixed returns regardless of market
                volatility. Start growing your crypto assets today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-lg px-8 py-6 h-auto w-full sm:w-auto">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-lg px-8 py-6 h-auto w-full sm:w-auto">
                      Create Account
                    </Button>
                  </Link>
                )}
                <Link href="/about">
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:text-white text-lg px-8 py-6 h-auto w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-2xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-500">$250M+</div>
                  <div className="text-sm text-zinc-400 mt-1">Assets Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-500">50K+</div>
                  <div className="text-sm text-zinc-400 mt-1">Active Investors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-500">99.9%</div>
                  <div className="text-sm text-zinc-400 mt-1">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-zinc-900/50">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MarkInvestment</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Our platform offers unique advantages that make Bitcoin investing simple, secure, and profitable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-500/30 mb-4">
                    <TrendingUp className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Guaranteed Returns</h3>
                  <p className="text-zinc-300">
                    Fixed ROI on all investment plans regardless of market conditions. Know exactly what you'll earn.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-700/20 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-500/30 mb-4">
                    <Shield className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Secure Platform</h3>
                  <p className="text-zinc-300">
                    Your investments are protected with industry-leading security measures and cold storage solutions.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500/30 mb-4">
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Flexible Terms</h3>
                  <p className="text-zinc-300">
                    Choose from various investment durations to match your financial goals, from 24 hour to 1 year.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bitcoin Stats Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto max-w-7xl">
            <BitcoinStats />
          </div>
        </section>

        {/* Investment Plans Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Investment Plans</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Choose the investment plan that best suits your financial goals
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-zinc-800/50">
                <TabsTrigger value="all">All Plans</TabsTrigger>
                <TabsTrigger value="short">Short Term</TabsTrigger>
                <TabsTrigger value="medium">Medium Term</TabsTrigger>
                <TabsTrigger value="long">Long Term</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <InvestmentPlans filter="all" />
              </TabsContent>
              <TabsContent value="short">
                <InvestmentPlans filter="short" />
              </TabsContent>
              <TabsContent value="medium">
                <InvestmentPlans filter="medium" />
              </TabsContent>
              <TabsContent value="long">
                <InvestmentPlans filter="long" />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-500/20 to-amber-700/20">
          <div className="container px-4 mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Growing Your Bitcoin?</h2>
                <p className="text-xl text-zinc-300 mb-6">
                  Join thousands of investors who are already earning guaranteed returns on their Bitcoin investments.
                </p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Guaranteed returns from 3% to 300%</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Flexible investment terms from 7 days to 1 year</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Secure platform with industry-leading protection</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Start with as little as 0.01 BTC</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/3">
                <div className="p-6 rounded-2xl bg-zinc-800/80 border border-zinc-700">
                  <h3 className="text-xl font-bold mb-4 text-center">Get Started Today</h3>
                  {isAuthenticated ? (
                    <Link href="/invest">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-lg py-6 h-auto">
                        Start Investing Now
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/register">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-lg py-6 h-auto">
                        Create Account
                      </Button>
                    </Link>
                  )}
                  <p className="text-sm text-zinc-400 text-center mt-4">
                    No registration fees. Secure and transparent platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Investments Section (for logged-in users only) */}
        {isAuthenticated && (
          <section className="py-16">
            <div className="container px-4 mx-auto max-w-7xl">
              <h2 className="text-3xl font-bold mb-8">Your Active Investments</h2>
              <ActiveInvestments />
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
