import type React from "react"
import type { Metadata } from "next"
import { Poppins, Nunito } from "next/font/google"
import "./globals.css"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
})

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "PinkRide - Your Safe Ride, Just for You 💗",
  description: "Women-only ride hailing service focused on safety and community",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${nunito.variable} font-body bg-pink-bg min-h-screen`}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
