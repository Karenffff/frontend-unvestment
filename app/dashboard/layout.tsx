import type React from "react"
import ProtectedRoute from "@/components/protected-route"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <SiteHeader />
      {children}
      <SiteFooter />
    </ProtectedRoute>
  )
}
