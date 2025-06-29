"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, Heart, MapPin, Clock, Star, Share } from "lucide-react"

export default function ActiveRide() {
  const [rideStatus, setRideStatus] = useState<"arriving" | "pickup" | "enroute" | "arrived">("arriving")
  const [eta, setEta] = useState("3 min")
  const [showEndRide, setShowEndRide] = useState(false)
  const router = useRouter()

  const driver = {
    name: "Sarah Johnson",
    rating: 4.9,
    car: "Honda Civic",
    color: "White",
    plate: "ABC-123",
    avatar: "👩‍🦱",
  }

  useEffect(() => {
    // Simulate ride progression
    const timer1 = setTimeout(() => setRideStatus("pickup"), 3000)
    const timer2 = setTimeout(() => setRideStatus("enroute"), 6000)
    const timer3 = setTimeout(() => {
      setRideStatus("arrived")
      setShowEndRide(true)
    }, 12000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const getStatusMessage = () => {
    switch (rideStatus) {
      case "arriving":
        return "Sarah is on her way to pick you up"
      case "pickup":
        return "Sarah has arrived at pickup location"
      case "enroute":
        return "On your way to destination"
      case "arrived":
        return "You have arrived at your destination"
      default:
        return ""
    }
  }

  const getStatusColor = () => {
    switch (rideStatus) {
      case "arriving":
        return "bg-blue-500"
      case "pickup":
        return "bg-yellow-500"
      case "enroute":
        return "bg-green-500"
      case "arrived":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleEndRide = () => {
    router.push("/ride/feedback")
  }

  const handleShareLocation = () => {
    alert("Live location shared with your emergency contacts 📍")
  }

  const handleSOS = () => {
    alert("🚨 SOS ACTIVATED! Emergency services and contacts have been notified.")
  }

  return (
    <div className="min-h-screen bg-pink-bg">
      {/* Map Area Placeholder */}
      <div className="h-1/2 bg-gradient-to-br from-pink-light to-pink-soft relative rounded-b-3xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-purple-deep">
            <MapPin className="w-16 h-16 mx-auto mb-4 animate-bounce" />
            <p className="text-lg font-medium">Live Map View</p>
            <p className="text-sm opacity-70">Tracking your ride in real-time</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-6 left-6 right-6">
          <Card className="rounded-2xl shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                <p className="font-medium text-purple-deep">{getStatusMessage()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ETA */}
        <div className="absolute top-20 right-6">
          <Badge className="bg-white text-purple-deep text-lg px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            {eta}
          </Badge>
        </div>
      </div>

      {/* Driver Info & Controls */}
      <div className="p-6 space-y-4">
        <Card className="rounded-3xl shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-light to-pink-soft rounded-2xl flex items-center justify-center text-2xl">
                  {driver.avatar}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-purple-deep">{driver.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{driver.rating}</span>
                    <span>•</span>
                    <span>{driver.car}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {driver.color} • {driver.plate}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="rounded-2xl border-pink-light text-pink-deep hover:bg-pink-light bg-transparent"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-pink-light text-pink-deep hover:bg-pink-light bg-transparent"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button
                variant="outline"
                onClick={handleShareLocation}
                className="rounded-2xl border-pink-light text-pink-deep hover:bg-pink-light bg-transparent"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Safety Features */}
        <Card className="rounded-3xl shadow-lg border-0 bg-pink-light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-purple-deep">Safety Features Active</p>
                <p className="text-sm text-gray-600">Live tracking • Emergency contacts notified</p>
              </div>
              <Badge className="bg-green-500 text-white">Protected</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Card className="rounded-3xl shadow-lg border-0">
          <CardContent className="p-6">
            <h4 className="font-heading text-lg font-semibold text-purple-deep mb-4">Trip Details</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-purple-deep">Pickup</p>
                  <p className="text-sm text-gray-600">123 Main Street</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-purple-deep">Destination</p>
                  <p className="text-sm text-gray-600">456 Oak Avenue</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-pink-light">
                <span className="text-purple-deep font-medium">Total Fare</span>
                <span className="text-lg font-bold text-purple-deep">$15.00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* End Ride Button */}
        {showEndRide && (
          <Button
            onClick={handleEndRide}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-4 rounded-3xl h-14 text-lg"
          >
            End Ride & Rate Experience ⭐
          </Button>
        )}
      </div>

      {/* SOS Button - Prominent during ride */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          onClick={handleSOS}
          className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 shadow-2xl animate-pulse"
        >
          <Heart className="w-10 h-10 text-white" />
        </Button>
      </div>
    </div>
  )
}
