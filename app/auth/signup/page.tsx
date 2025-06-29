"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Car } from "lucide-react"

export default function SignupPage() {
  const [userType, setUserType] = useState<"rider" | "driver">("rider")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate signup
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-pink-bg p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4 text-purple-deep">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading text-2xl font-bold text-purple-deep">Join PinkRide</h1>
        </div>

        <Card className="rounded-3xl shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-soft to-pink-deep rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌸</span>
            </div>
            <CardTitle className="font-heading text-xl text-purple-deep">Welcome to our safe community!</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex bg-pink-light rounded-2xl p-1">
              <Button
                variant={userType === "rider" ? "default" : "ghost"}
                className={`flex-1 rounded-xl ${userType === "rider" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setUserType("rider")}
              >
                <User className="w-4 h-4 mr-2" />
                Rider
              </Button>
              <Button
                variant={userType === "driver" ? "default" : "ghost"}
                className={`flex-1 rounded-xl ${userType === "driver" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setUserType("driver")}
              >
                <Car className="w-4 h-4 mr-2" />
                Driver
              </Button>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="rounded-2xl border-pink-light focus:border-pink-soft h-12"
                  required
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="rounded-2xl border-pink-light focus:border-pink-soft h-12"
                  required
                />
              </div>

              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="rounded-2xl border-pink-light focus:border-pink-soft h-12"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Create Password"
                  className="rounded-2xl border-pink-light focus:border-pink-soft h-12"
                  required
                />
              </div>

              {userType === "driver" && (
                <div className="space-y-4 p-4 bg-pink-light rounded-2xl">
                  <p className="text-sm font-medium text-purple-deep">Driver Information</p>
                  <Input
                    type="text"
                    placeholder="Vehicle Make & Model"
                    className="rounded-2xl border-white focus:border-pink-soft h-12 bg-white"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="License Plate"
                    className="rounded-2xl border-white focus:border-pink-soft h-12 bg-white"
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-soft to-pink-deep hover:from-pink-deep hover:to-pink-soft text-white font-semibold py-3 rounded-2xl h-12"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  `Join as ${userType === "rider" ? "Rider" : "Driver"} 💗`
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button variant="link" className="text-pink-deep" onClick={() => router.push("/auth/login")}>
                Already have an account? Sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
