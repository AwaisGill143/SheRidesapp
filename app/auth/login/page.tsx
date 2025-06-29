"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Phone, Mail } from "lucide-react"

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
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
          <h1 className="font-heading text-2xl font-bold text-purple-deep">Welcome Back</h1>
        </div>

        <Card className="rounded-3xl shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-soft to-pink-deep rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <CardTitle className="font-heading text-xl text-purple-deep">Hey there! Ready for a safe ride?</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex bg-pink-light rounded-2xl p-1">
              <Button
                variant={loginMethod === "phone" ? "default" : "ghost"}
                className={`flex-1 rounded-xl ${loginMethod === "phone" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setLoginMethod("phone")}
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </Button>
              <Button
                variant={loginMethod === "email" ? "default" : "ghost"}
                className={`flex-1 rounded-xl ${loginMethod === "email" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setLoginMethod("email")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type={loginMethod === "phone" ? "tel" : "email"}
                  placeholder={loginMethod === "phone" ? "+1 (555) 123-4567" : "your@email.com"}
                  className="rounded-2xl border-pink-light focus:border-pink-soft h-12"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="rounded-2xl border-pink-light focus:border-pink-soft h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-soft to-pink-deep hover:from-pink-deep hover:to-pink-soft text-white font-semibold py-3 rounded-2xl h-12"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In 💗"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button variant="link" className="text-pink-deep" onClick={() => router.push("/auth/signup")}>
                Don't have an account? Join our community
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
