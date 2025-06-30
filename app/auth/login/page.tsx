"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Phone, Mail, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [hasRedirected, setHasRedirected] = useState(false)
  const router = useRouter()
  const { login, isLoading, isAuthenticated, isInitialized } = useAuth()

  // Only redirect if authenticated and initialized, and haven't redirected yet
  useEffect(() => {
    if (isInitialized && isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      router.replace("/dashboard")
    }
  }, [isAuthenticated, isInitialized, hasRedirected, router])

  // Pre-fill with saved credentials if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedIdentifier = localStorage.getItem("pinkride_saved_identifier")
      const savedMethod = localStorage.getItem("pinkride_saved_method") as "phone" | "email"

      if (savedIdentifier) {
        setIdentifier(savedIdentifier)
      }
      if (savedMethod) {
        setLoginMethod(savedMethod)
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier || !password) {
      toast.error("Please fill in all fields")
      return
    }

    const result = await login({
      identifier,
      password,
      loginMethod,
    })

    if (result.success) {
      // Save credentials if remember me is checked
      if (rememberMe && typeof window !== "undefined") {
        localStorage.setItem("pinkride_saved_identifier", identifier)
        localStorage.setItem("pinkride_saved_method", loginMethod)
      } else if (typeof window !== "undefined") {
        localStorage.removeItem("pinkride_saved_identifier")
        localStorage.removeItem("pinkride_saved_method")
      }

      toast.success("Welcome back! 💗")
      setHasRedirected(true)
      router.replace("/dashboard")
    } else {
      toast.error(result.error || "Login failed. Please try again.")
    }
  }

  // Show loading while checking authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-pink-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-deep mx-auto mb-4"></div>
          <p className="text-purple-deep">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-pink-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-deep mx-auto mb-4"></div>
          <p className="text-purple-deep">Redirecting to dashboard...</p>
        </div>
      </div>
    )
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
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="rounded-2xl border-pink-light focus:border-pink-soft h-12 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-pink-light focus:ring-pink-soft"
                />
                <label htmlFor="remember" className="text-sm text-purple-deep">
                  Remember my login details
                </label>
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
