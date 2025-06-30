"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Navigation, DollarSign, Users, Heart, Car } from "lucide-react"
import { DatabaseService } from "@/lib/database"
import { useAuth } from "@/hooks/use-auth"
import { getOrCreateUserUUID } from "@/lib/auth-utils"

export default function RequestRide() {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [suggestedPrice, setSuggestedPrice] = useState("")
  const [mood, setMood] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const { user, isInitialized } = useAuth()
  const [vehicleType, setVehicleType] = useState<"bike" | "rickshaw" | "car">("rickshaw")

  if (isInitialized && !user) {
    router.replace("/auth/login")
    return null
  }

  const moods = [
    { emoji: "😊", label: "Happy", value: "happy" },
    { emoji: "😔", label: "Tired", value: "tired" },
    { emoji: "😬", label: "Anxious", value: "anxious" },
    { emoji: "🤗", label: "Excited", value: "excited" },
  ]

  const handleRequestRide = async () => {
    setIsSearching(true)

    try {
      // Create ride request in database
      const riderId = getOrCreateUserUUID()
      await DatabaseService.ensureUserExists(riderId) // 🔑 make sure FK is satisfied
      const rideRequest = await DatabaseService.createRideRequest({
        rider_id: riderId,
        pickup_location: pickup,
        dropoff_location: dropoff,
        vehicle_type: vehicleType,
        suggested_price: Number.parseFloat(suggestedPrice),
        rider_mood: mood,
        is_scheduled: false,
        status: "pending",
      })

      // Simulate search
      setTimeout(() => {
        router.push(`/ride/matching?requestId=${rideRequest.id}`)
      }, 3000)
    } catch (error) {
      console.error("Error creating ride request:", error)
      setIsSearching(false)
    }
  }

  if (isSearching) {
    return (
      <div className="min-h-screen bg-pink-bg flex items-center justify-center p-6">
        <Card className="rounded-3xl shadow-lg border-0 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-soft to-pink-deep rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
            </div>
            <h2 className="font-heading text-xl font-semibold text-purple-deep mb-2">Finding your perfect match...</h2>
            <p className="text-gray-600 mb-6">We're connecting you with trusted female drivers nearby</p>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-pink-soft rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-pink-soft rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-pink-soft rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-soft to-pink-deep p-6 rounded-b-3xl">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4 text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading text-2xl font-bold text-white">Request a Ride</h1>
        </div>
        <p className="text-white/80">Let's get you safely to your destination</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Location Inputs */}
        <Card className="rounded-3xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="font-heading text-lg text-purple-deep flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Where to?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <Input
                placeholder="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="pl-10 rounded-2xl border-pink-light focus:border-pink-soft h-12"
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <Input
                placeholder="Drop-off location"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="pl-10 rounded-2xl border-pink-light focus:border-pink-soft h-12"
              />
            </div>
            <Button
              variant="outline"
              className="w-full rounded-2xl border-pink-light text-pink-deep hover:bg-pink-light bg-transparent"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Use Current Location
            </Button>
          </CardContent>
        </Card>

        {/* Vehicle Type Selection */}
        <Card className="rounded-3xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="font-heading text-lg text-purple-deep flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Choose Your Ride
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={vehicleType === "bike" ? "default" : "outline"}
                className={`rounded-2xl h-20 flex-col space-y-2 ${
                  vehicleType === "bike" ? "bg-pink-soft text-white" : "border-pink-light hover:bg-pink-light"
                }`}
                onClick={() => setVehicleType("bike")}
              >
                <span className="text-2xl">🏍️</span>
                <div className="text-center">
                  <p className="text-sm font-medium">Bike</p>
                  <p className="text-xs opacity-70">Quick & Eco</p>
                </div>
              </Button>
              <Button
                variant={vehicleType === "rickshaw" ? "default" : "outline"}
                className={`rounded-2xl h-20 flex-col space-y-2 ${
                  vehicleType === "rickshaw" ? "bg-pink-soft text-white" : "border-pink-light hover:bg-pink-light"
                }`}
                onClick={() => setVehicleType("rickshaw")}
              >
                <span className="text-2xl">🛺</span>
                <div className="text-center">
                  <p className="text-sm font-medium">Rickshaw</p>
                  <p className="text-xs opacity-70">Affordable</p>
                </div>
              </Button>
              <Button
                variant={vehicleType === "car" ? "default" : "outline"}
                className={`rounded-2xl h-20 flex-col space-y-2 ${
                  vehicleType === "car" ? "bg-pink-soft text-white" : "border-pink-light hover:bg-pink-light"
                }`}
                onClick={() => setVehicleType("car")}
              >
                <span className="text-2xl">🚗</span>
                <div className="text-center">
                  <p className="text-sm font-medium">Car</p>
                  <p className="text-xs opacity-70">Comfortable</p>
                </div>
              </Button>
            </div>
            <div className="mt-4 p-3 bg-pink-light rounded-2xl">
              <p className="text-sm text-purple-deep font-medium">
                {vehicleType === "bike" && "🏍️ Perfect for solo rides, quick and eco-friendly"}
                {vehicleType === "rickshaw" && "🛺 Great value for short to medium distances"}
                {vehicleType === "car" && "🚗 Most comfortable option with AC and space"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Price Suggestion */}
        <Card className="rounded-3xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="font-heading text-lg text-purple-deep flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Suggest Your Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</div>
              <Input
                type="number"
                placeholder="0.00"
                value={suggestedPrice}
                onChange={(e) => setSuggestedPrice(e.target.value)}
                className="pl-8 rounded-2xl border-pink-light focus:border-pink-soft h-12 text-lg font-semibold"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">💡 Drivers can accept or counter your offer</p>
          </CardContent>
        </Card>

        {/* Mood Selector */}
        <Card className="rounded-3xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="font-heading text-lg text-purple-deep">How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {moods.map((moodOption) => (
                <Button
                  key={moodOption.value}
                  variant={mood === moodOption.value ? "default" : "outline"}
                  className={`rounded-2xl h-16 flex-col space-y-1 ${
                    mood === moodOption.value ? "bg-pink-soft text-white" : "border-pink-light hover:bg-pink-light"
                  }`}
                  onClick={() => setMood(moodOption.value)}
                >
                  <span className="text-2xl">{moodOption.emoji}</span>
                  <span className="text-xs">{moodOption.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Preferences */}
        <Card className="rounded-3xl shadow-lg border-0 bg-pink-light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-pink-deep" />
                </div>
                <div>
                  <p className="font-medium text-purple-deep">Women Drivers Only</p>
                  <p className="text-sm text-gray-600">Enabled by default</p>
                </div>
              </div>
              <Badge className="bg-green-500 text-white">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Request Button */}
        <Button
          onClick={handleRequestRide}
          disabled={!pickup || !dropoff || !suggestedPrice}
          className="w-full bg-gradient-to-r from-pink-soft to-pink-deep hover:from-pink-deep hover:to-pink-soft text-white font-semibold py-4 rounded-3xl h-14 text-lg"
        >
          Find My Ride 🚗💗
        </Button>
      </div>

      {/* SOS Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-2xl">
          <Heart className="w-8 h-8 text-white" />
        </Button>
      </div>
    </div>
  )
}
