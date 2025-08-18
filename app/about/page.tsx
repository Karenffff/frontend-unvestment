import { Users, Shield, TrendingUp } from "lucide-react";
import SiteHeader from "@/components/site-header";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 to-black"></div>
          <div className="container px-4 mx-auto max-w-7xl relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                About <span className="text-amber-500">MarkInvestment</span>
              </h1>
              <p className="text-xl text-zinc-400 mb-8">
                We're on a mission to make Bitcoin investing accessible, secure, and profitable for everyone. Learn about
                our story, our team, and our vision for the future of cryptocurrency investments.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-zinc-300 mb-4">
                  MarkInvestment was founded in 2020 by a team of cryptocurrency experts and financial professionals who
                  saw the potential of Bitcoin as a long-term investment asset.
                </p>
                <p className="text-lg text-zinc-300 mb-4">
                  We recognized that while Bitcoin offers tremendous growth potential, its volatility can be a barrier
                  for many investors. Our goal was to create a platform that provides the benefits of Bitcoin investment
                  without the unpredictability.
                </p>
                <p className="text-lg text-zinc-300">
                  Today, we manage over $250 million in assets for more than 50,000 investors worldwide, with a track
                  record of delivering consistent returns regardless of market conditions.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="MarkIvestment Team"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-zinc-900/50">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                These principles guide everything we do at MarkInvestment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-500/30 mb-4">
                  <Shield className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Security First</h3>
                <p className="text-zinc-400">
                  We prioritize the security of your investments above all else, implementing industry-leading protection
                  measures and regular security audits.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-500/30 mb-4">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Transparency</h3>
                <p className="text-zinc-400">
                  We believe in complete transparency in all our operations. You'll always know exactly what returns to
                  expect and how your investment is performing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-500/30 mb-4">
                  <Users className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Customer Focus</h3>
                <p className="text-zinc-400">
                  Our investors are at the heart of everything we do. We're committed to providing exceptional service
                  and support to help you achieve your financial goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Leadership Team</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Experts in cryptocurrency, finance, and technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <img src="/placeholder.svg?height=96&width=96" alt="CEO" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-1">Alex Morgan</h3>
                <p className="text-amber-500 mb-4">CEO & Founder</p>
                <p className="text-zinc-400 mb-4">
                  Former investment banker with 15+ years of experience in cryptocurrency and financial markets.
                </p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-zinc-400 hover:text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675..."></path>
                    </svg>
                  </a>
                  <a href="#" className="text-zinc-400 hover:text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504..."></path>
                    </svg>
                  </a>
                  <a href="#" className="text-zinc-400 hover:text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2z"></path>
                    </svg>
                  </a>
                </div>
              </div>
              {/* CTO */}
  <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 text-center">
    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
      <img src="/placeholder.svg?height=96&width=96&bg=gray" alt="CTO" className="w-full h-full object-cover" />
    </div>
    <h3 className="text-xl font-bold mb-1">Taylor Brooks</h3>
    <p className="text-amber-500 mb-4">Chief Technology Officer</p>
    <p className="text-zinc-400 mb-4">
      Tech visionary with deep expertise in blockchain infrastructure and scalable architecture systems.
    </p>
    <div className="flex justify-center space-x-3">
      {/* Social Icons */}
      <a href="#" className="text-zinc-400 hover:text-amber-500">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675..."></path>
        </svg>
      </a>
      <a href="#" className="text-zinc-400 hover:text-amber-500">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504..."></path>
        </svg>
      </a>
      <a href="#" className="text-zinc-400 hover:text-amber-500">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2z"></path>
        </svg>
      </a>
    </div>
  </div>
</div>

          </div>
        </section>
      </main>
    </>
  );
}
