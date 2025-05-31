"use client"

import type React from "react"

import { useState } from "react"
import { Bitcoin, Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("General Inquiry")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset form and show success
      setName("")
      setEmail("")
      setSubject("General Inquiry")
      setMessage("")
      setIsSubmitted(true)

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (err) {
      setError("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
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
          <div className="container px-4 mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-amber-500/20 text-amber-400">
                <Bitcoin className="w-4 h-4 mr-2" />
                Get in Touch
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Contact Us</h1>
              <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
                Have questions or need assistance? Our team is here to help you with any inquiries.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-8 rounded-2xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700"
              >
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                {error && <div className="p-4 mb-6 rounded-lg bg-red-500/20 text-red-200">{error}</div>}

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-zinc-400 mb-6">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} className="bg-amber-500 hover:bg-amber-600">
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <RadioGroup
                        value={subject}
                        onValueChange={setSubject}
                        className="grid grid-cols-1 md:grid-cols-2 gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="General Inquiry" id="general" />
                          <Label htmlFor="general">General Inquiry</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Technical Support" id="technical" />
                          <Label htmlFor="technical">Technical Support</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Investment Question" id="investment" />
                          <Label htmlFor="investment">Investment Question</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Partnership" id="partnership" />
                          <Label htmlFor="partnership">Partnership</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[150px] bg-zinc-700/50 border-zinc-600 focus:border-amber-500"
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full bg-amber-500 hover:bg-amber-600 h-12">
                      {isLoading ? "Sending..." : "Send Message"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </motion.div>

              {/* Contact Information */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-amber-500/20">
                      <Mail className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                      <p className="text-zinc-400 mb-2">For general inquiries and support</p>
                      <a href="mailto:support@newbethelfcreditunion.com" className="text-amber-500 hover:text-amber-400">
                        support@newbethelfcreditunion.com
                      </a>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-amber-500/20">
                      <Phone className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                      <p className="text-zinc-400 mb-2">Monday to Friday, 9am to 6pm</p>
                      <a href="tel:+18005551234" className="text-amber-500 hover:text-amber-400">
                        +1 (800) 555-1234
                      </a>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-amber-500/20">
                      <MapPin className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Visit Us</h3>
                      <p className="text-zinc-400 mb-2">Our headquarters</p>
                      <address className="not-italic text-zinc-300">
                        123 Blockchain Avenue
                        <br />
                        San Francisco, CA 94105
                        <br />
                        United States
                      </address>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-amber-500/20">
                      <Clock className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Support Hours</h3>
                      <p className="text-zinc-400 mb-2">We're here to help</p>
                      <ul className="space-y-1 text-zinc-300">
                        <li>Monday - Friday: 9:00 AM - 8:00 PM EST</li>
                        <li>Saturday: 10:00 AM - 6:00 PM EST</li>
                        <li>Sunday: Closed</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="p-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-amber-500/20">
                      <MessageSquare className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Live Chat</h3>
                      <p className="text-zinc-400 mb-2">Get instant support</p>
                      <p className="text-zinc-300">
                        Our live chat support is available during business hours. Click the chat icon in the bottom
                        right corner of any page.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-16">
              <div className="rounded-xl overflow-hidden h-[400px] bg-zinc-800/50 border border-zinc-700 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Interactive Map</h3>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    In a real implementation, an interactive map would be displayed here showing our office location.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Teaser */}
            <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-700/20 text-center">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
                Find answers to common questions about our platform, investment process, and more in our comprehensive
                FAQ section.
              </p>
              <Button asChild className="bg-amber-500 hover:bg-amber-600">
                <a href="/faq">View FAQ</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
