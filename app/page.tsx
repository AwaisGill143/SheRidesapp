"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SplashScreen() {
  const [showContent, setShowContent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!showContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-soft to-pink-deep flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-float mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🌸</span>
            </div>
          </div>
          <h1 className="font-heading text-3xl font-bold mb-2">PinkRide</h1>
          <p className="text-lg opacity-90">Your Safe Ride, Just for You 💗</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-soft to-pink-deep flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-soft to-pink-deep rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌸</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-purple-deep mb-2">Welcome to PinkRide</h1>
          <p className="text-gray-600">Safe rides designed by women, for women</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-gradient-to-r from-pink-soft to-pink-deep hover:from-pink-deep hover:to-pink-soft text-white font-semibold py-3 rounded-2xl transition-all duration-300"
          >
            Get Started 🚗
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/auth/signup")}
            className="w-full border-2 border-pink-soft text-pink-deep hover:bg-pink-light rounded-2xl py-3"
          >
            Create Account
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>✨ 100% women drivers</p>
          <p>🛡️ Safety first approach</p>
          <p>💬 Community driven</p>
        </div>
      </div>
    </div>
  )
}
