"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Shield, Calendar, History, Settings, LogOut, AlertTriangle, Bike, Car } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useHistory } from "@/hooks/use-history"

const moodEmojis = ["😊", "😌", "🌸", "✨", "💕", "🦋", "🌺", "🌙"]

export default function DashboardPage() {
  const [currentMood, setCurrentMood] = useState("😊")
  const [greeting, setGreeting] = useState("")
  const [hasRedirected, setHasRedirected] = useState(false)
  const router = useRouter()
  const { user, logout, isAuthenticated, isInitialized } = useAuth()
  const { history, getRecentDestinations, getFavoriteVehicleType } = useHistory()

  // Only redirect if not authenticated and initialized, and haven't redirected yet
  useEffect(() => {
    if (isInitialized && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      router.replace("/auth/login")
    }
  }, [isAuthenticated, isInitialized, hasRedirected, router])

  // Set personalized greeting
  useEffect(() => {
    const hour = new Date().getHours()
    let timeGreeting = ""

    if (hour < 12) timeGreeting = "Good morning"
    else if (hour < 17) timeGreeting = "Good afternoon"
    else timeGreeting = "Good evening"

    setGreeting(timeGreeting)
  }, [])

  // Get user stats from history
  const recentDestinations = getRecentDestinations()
  const favoriteVehicle = getFavoriteVehicleType()
  const totalRides = history.length
  const completedRides = history.filter((ride) => ride.status === "completed").length

  const handleLogout = () => {
    logout()
    setHasRedirected(true)
    router.replace("/")
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

  // Don't render dashboard if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-pink-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-deep mx-auto mb-4"></div>
          <p className="text-purple-deep">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-bg p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with user info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-soft to-pink-deep rounded-full flex items-center justify-center">
              <span className="text-xl">{currentMood}</span>
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-purple-deep">
                {greeting}, {user.name?.split(" ")[0] || "Beautiful"}!
              </h1>
              <p className="text-sm text-purple-light">How are you feeling today?</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-5 h-5 text-purple-light" />
          </Button>
        </div>

        {/* Mood selector */}
        <Card className="rounded-3xl shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              {moodEmojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className={`text-2xl p-2 rounded-full ${currentMood === emoji ? "bg-pink-light" : ""}`}
                  onClick={() => setCurrentMood(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-2xl shadow-lg border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-deep">{totalRides}</div>
              <div className="text-sm text-purple-light">Total Rides</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-lg border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-deep">{completedRides}</div>
              <div className="text-sm text-purple-light">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Favorite vehicle type */}
        {totalRides > 0 && (
          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-light rounded-full flex items-center justify-center">
                  {favoriteVehicle === "bike" && <Bike className="w-5 h-5 text-pink-deep" />}
                  {favoriteVehicle === "car" && <Car className="w-5 h-5 text-pink-deep" />}
                  {favoriteVehicle === "rickshaw" && <span className="text-pink-deep">🛺</span>}
                </div>
                <div>
                  <p className="font-semibold text-purple-deep">Your favorite ride</p>
                  <p className="text-sm text-purple-light capitalize">{favoriteVehicle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent destinations */}
        {recentDestinations.length > 0 && (
          <Card className="rounded-3xl shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg text-purple-deep flex items-center">
                <History className="w-5 h-5 mr-2" />
                Recent Destinations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentDestinations.slice(0, 3).map((destination, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left p-3 rounded-2xl hover:bg-pink-light"
                  onClick={() => router.push(`/ride/request?to=${encodeURIComponent(destination)}`)}
                >
                  <MapPin className="w-4 h-4 mr-3 text-pink-deep" />
                  <span className="truncate">{destination}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main action buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => router.push("/ride/request")}
            className="w-full bg-gradient-to-r from-pink-soft to-pink-deep hover:from-pink-deep hover:to-pink-soft text-white font-semibold py-4 rounded-3xl h-16 text-lg"
          >
            <MapPin className="w-6 h-6 mr-3" />
            Book a Ride Now
          </Button>

          <Button
            onClick={() => router.push("/ride/schedule")}
            variant="outline"
            className="w-full border-pink-soft text-pink-deep hover:bg-pink-light py-4 rounded-3xl h-16 text-lg"
          >
            <Calendar className="w-6 h-6 mr-3" />
            Schedule in Advance
          </Button>
        </div>

        {/* Safety features */}
        <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-r from-pink-light to-purple-light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-pink-deep" />
                <div>
                  <p className="font-semibold text-purple-deep">Safety First</p>
                  <p className="text-sm text-purple-light">Women-only verified drivers</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Emergency SOS */}
        <Button
          variant="destructive"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-3xl h-16 text-lg"
          onClick={() => {
            // Emergency action
            alert("Emergency services contacted! 🚨")
          }}
        >
          <AlertTriangle className="w-6 h-6 mr-3" />
          Emergency SOS
        </Button>

        {/* Bottom navigation */}
        <div className="flex justify-around py-4">
          <Button variant="ghost" onClick={() => router.push("/ride/scheduled")}>
            <Calendar className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={() => router.push("/history")}>
            <History className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={() => router.push("/profile")}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
