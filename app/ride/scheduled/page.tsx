"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Edit, Trash2, Plus } from "lucide-react"
import { DatabaseService, type RideRequest } from "@/lib/database"

export default function ScheduledRides() {
  const [scheduledRides, setScheduledRides] = useState<RideRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadScheduledRides()
  }, [])

  const loadScheduledRides = async () => {
    try {
      // In a real app, get user ID from auth context
      const rides = await DatabaseService.getScheduledRides("current-user-id")
      setScheduledRides(rides)
    } catch (error) {
      console.error("Error loading scheduled rides:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getVehicleEmoji = (type: string) => {
    switch (type) {
      case "bike":
        return "🏍️"
      case "rickshaw":
        return "🛺"
      case "car":
        return "🚗"
      default:
        return "🚗"
    }
  }

  const getStatusColor = (scheduledTime: string) => {
    const now = new Date()
    const rideTime = new Date(scheduledTime)
    const hoursUntil = (rideTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntil < 2) return "bg-orange-500"
    if (hoursUntil < 24) return "bg-blue-500"
    return "bg-green-500"
  }

  const getStatusText = (scheduledTime: string) => {
    const now = new Date()
    const rideTime = new Date(scheduledTime)
    const hoursUntil = (rideTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntil < 1) return "Starting Soon"
    if (hoursUntil < 2) return "Very Soon"
    if (hoursUntil < 24) return "Today"
    return "Upcoming"
  }

  const handleCancelRide = async (rideId: string) => {
    if (confirm("Are you sure you want to cancel this scheduled ride?")) {
      try {
        await DatabaseService.updateRideRequestStatus(rideId, "cancelled")
        loadScheduledRides() // Refresh the list
      } catch (error) {
        console.error("Error cancelling ride:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-soft"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-soft to-pink-deep p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4 text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-heading text-2xl font-bold text-white">Scheduled Rides</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/ride/schedule")} className="text-white">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-white/80">Manage your upcoming journeys</p>
      </div>

      <div className="p-6">
        {scheduledRides.length === 0 ? (
          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-pink-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-pink-deep" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-purple-deep mb-2">No Scheduled Rides</h3>
              <p className="text-gray-600 mb-6">Plan your future journeys for a stress-free experience</p>
              <Button
                onClick={() => router.push("/ride/schedule")}
                className="bg-gradient-to-r from-pink-soft to-pink-deep text-white font-semibold py-3 px-6 rounded-2xl"
              >
                Schedule Your First Ride
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {scheduledRides.map((ride) => (
              <Card key={ride.id} className="rounded-3xl shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-pink-light rounded-2xl flex items-center justify-center text-2xl">
                        {getVehicleEmoji(ride.vehicle_type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-heading text-lg font-semibold text-purple-deep capitalize">
                            {ride.vehicle_type} Ride
                          </h3>
                          <Badge className={`${getStatusColor(ride.scheduled_time!)} text-white text-xs`}>
                            {getStatusText(ride.scheduled_time!)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(ride.scheduled_time!).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(ride.scheduled_time!).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-deep">${ride.suggested_price}</p>
                      <p className="text-sm text-gray-500">Suggested</p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-purple-deep">Pickup</p>
                        <p className="text-sm text-gray-600">{ride.pickup_location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-purple-deep">Destination</p>
                        <p className="text-sm text-gray-600">{ride.dropoff_location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mood & Status */}
                  {ride.rider_mood && (
                    <div className="mb-4 p-3 bg-pink-light rounded-2xl">
                      <p className="text-sm text-purple-deep">
                        Mood: <span className="capitalize">{ride.rider_mood}</span>
                        {ride.rider_mood === "happy" && " 😊"}
                        {ride.rider_mood === "tired" && " 😔"}
                        {ride.rider_mood === "anxious" && " 😬"}
                        {ride.rider_mood === "excited" && " 🤗"}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-2xl border-pink-light text-pink-deep hover:bg-pink-light bg-transparent"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelRide(ride.id)}
                      className="flex-1 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
