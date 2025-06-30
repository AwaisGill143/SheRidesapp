"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, MessageCircle, Star, Navigation, Clock, AlertTriangle, Shield } from "lucide-react"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { useAuth } from "@/hooks/use-auth"

export default function ActiveRidePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { requestPermission, isSupported, permission } = usePushNotifications(user?.id)

  const [rideStatus, setRideStatus] = useState("arriving")
  const [estimatedTime, setEstimatedTime] = useState("5 minutes")
  const [driverLocation, setDriverLocation] = useState("2 blocks away")
  const [unreadMessages, setUnreadMessages] = useState(2)

  // Mock ride data - in real app, this would come from database
  const rideData = {
    id: "ride-123",
    driver: {
      name: "Sarah Ahmed",
      rating: 4.9,
      vehicle: "Pink Honda City",
      plate: "ABC-123",
      phone: "+92-300-1234567",
    },
    pickup: searchParams.get("from") || "Current Location",
    dropoff: searchParams.get("to") || "Destination",
    fare: "$12.50",
    vehicleType: searchParams.get("vehicle") || "car",
  }

  // Request notification permission on mount
  useEffect(() => {
    if (isSupported && permission === "default") {
      requestPermission()
    }
  }, [isSupported, permission, requestPermission])

  // Simulate ride progress
  useEffect(() => {
    const timer = setTimeout(() => {
      if (rideStatus === "arriving") {
        setRideStatus("pickup")
        setEstimatedTime("Driver arrived")
        setDriverLocation("At pickup location")
      } else if (rideStatus === "pickup") {
        setRideStatus("enroute")
        setEstimatedTime("15 minutes")
        setDriverLocation("En route to destination")
      }
    }, 10000) // Change status every 10 seconds for demo

    return () => clearTimeout(timer)
  }, [rideStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "arriving":
        return "bg-yellow-500"
      case "pickup":
        return "bg-blue-500"
      case "enroute":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "arriving":
        return "Driver Arriving"
      case "pickup":
        return "At Pickup Location"
      case "enroute":
        return "En Route"
      default:
        return "Unknown"
    }
  }

  const handleEmergency = () => {
    // Emergency functionality
    alert("🚨 Emergency services contacted! Your location has been shared.")
  }

  const handleCompleteRide = () => {
    router.push(`/ride/feedback?rideId=${rideData.id}`)
  }

  return (
    <div className="min-h-screen bg-pink-bg p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Status Header */}
        <Card className="rounded-3xl shadow-lg border-0">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-soft to-pink-deep rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-8 h-8 text-white" />
            </div>
            <Badge className={`${getStatusColor(rideStatus)} text-white mb-2`}>{getStatusText(rideStatus)}</Badge>
            <h1 className="font-heading text-xl font-bold text-purple-deep mb-1">{estimatedTime}</h1>
            <p className="text-purple-light">{driverLocation}</p>
          </CardContent>
        </Card>

        {/* Driver Info */}
        <Card className="rounded-3xl shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-pink-light rounded-full flex items-center justify-center">
                <span className="text-2xl">👩</span>
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold text-purple-deep">{rideData.driver.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">{rideData.driver.rating}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                </div>
                <p className="text-sm text-purple-light">
                  {rideData.driver.vehicle} • {rideData.driver.plate}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-2xl bg-transparent"
                onClick={() => window.open(`tel:${rideData.driver.phone}`)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>

              <Button
                variant="outline"
                className="border-pink-200 text-pink-600 hover:bg-pink-50 rounded-2xl relative bg-transparent"
                onClick={() => router.push(`/ride/chat/${rideData.id}`)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
                {unreadMessages > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Card className="rounded-3xl shadow-lg border-0">
          <CardContent className="p-6">
            <h3 className="font-heading text-lg font-semibold text-purple-deep mb-4">Trip Details</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-purple-light">Pickup</p>
                  <p className="font-medium text-purple-deep">{rideData.pickup}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-purple-light">Destination</p>
                  <p className="font-medium text-purple-deep">{rideData.dropoff}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-pink-light">
                <span className="text-purple-light">Fare</span>
                <span className="font-semibold text-purple-deep text-lg">{rideData.fare}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Features */}
        <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-r from-pink-light to-purple-light">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-pink-deep" />
              <div>
                <h3 className="font-heading text-lg font-semibold text-purple-deep">Safety Active</h3>
                <p className="text-sm text-purple-light">Your ride is being monitored</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-2xl bg-transparent"
                onClick={() => {
                  // Share location with emergency contact
                  alert("Location shared with emergency contacts")
                }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Share Location
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="bg-red-500 hover:bg-red-600 rounded-2xl"
                onClick={handleEmergency}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Complete Ride Button */}
        {rideStatus === "enroute" && (
          <Button
            onClick={handleCompleteRide}
            className="w-full bg-gradient-to-r from-pink-soft to-pink-deep hover:from-pink-deep hover:to-pink-soft text-white font-semibold py-4 rounded-3xl h-16 text-lg"
          >
            <Clock className="w-6 h-6 mr-3" />
            Complete Ride
          </Button>
        )}

        {/* Live Updates */}
        <Card className="rounded-3xl shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-2 text-purple-light">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Live tracking active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
