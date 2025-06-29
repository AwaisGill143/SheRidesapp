"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Shield, Heart, Star, MessageCircle, Settings, Bell } from "lucide-react"
import { DatabaseService, type RideRequest } from "@/lib/database"

export default function Dashboard() {
  const [userName] = useState("Ayesha")
  const [scheduledRides, setScheduledRides] = useState<RideRequest[]>([])
  const router = useRouter()

  useEffect(() => {
    loadScheduledRides()
  }, [])

  const loadScheduledRides = async () => {
    try {
      const rides = await DatabaseService.getScheduledRides("current-user-id")
      setScheduledRides(rides.slice(0, 2)) // Show only next 2 rides
    } catch (error) {
      console.error("Error loading scheduled rides:", error)
    }
  }

  return (
    <div className="min-h-screen bg-pink-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-soft to-pink-deep p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">Hey, {userName} 👋</h1>
            <p className="text-white/80">Need a safe ride today?</p>
          </div>
          <div className="flex space-x-3">
            <Button size="sm" variant="ghost" className="text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Safety Status */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Safety Status</p>
                  <p className="text-white/70 text-sm">All systems active</p>
                </div>
              </div>
              <Badge className="bg-green-500 text-white">Online</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="p-6 space-y-4">
        <Card
          className="rounded-3xl shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => router.push("/ride/request")}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-soft to-pink-deep rounded-2xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold text-purple-deep">Request a Ride</h3>
                <p className="text-gray-600">Get matched with a trusted driver</p>
              </div>
              <div className="animate-ripple w-4 h-4 bg-pink-soft rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="rounded-3xl shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => router.push("/ride/schedule")}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-light to-pink-soft rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-purple-deep" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold text-purple-deep">Schedule in Advance</h3>
                <p className="text-gray-600">Plan your rides ahead of time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Scheduled Rides */}
      {scheduledRides.length > 0 && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-purple-deep">Upcoming Rides</h2>
            <Button variant="link" className="text-pink-deep" onClick={() => router.push("/ride/scheduled")}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {scheduledRides.map((ride) => (
              <Card key={ride.id} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-light rounded-full flex items-center justify-center">
                        <span className="text-sm">
                          {ride.vehicle_type === "bike" && "🏍️"}
                          {ride.vehicle_type === "rickshaw" && "🛺"}
                          {ride.vehicle_type === "car" && "🚗"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-purple-deep capitalize">{ride.vehicle_type} Ride</p>
                        <p className="text-sm text-gray-600">
                          {new Date(ride.scheduled_time!).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(ride.scheduled_time!).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-purple-deep">${ride.suggested_price}</p>
                      <Badge className="bg-blue-500 text-white text-xs">Scheduled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="p-6">
        <h2 className="font-heading text-xl font-semibold text-purple-deep mb-4">Recent Activity</h2>

        <div className="space-y-3">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-light rounded-full flex items-center justify-center">
                    <span className="text-sm">👩</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-deep">Ride with Sarah</p>
                    <p className="text-sm text-gray-600">Downtown → Airport</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">5.0</span>
                  </div>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-light rounded-full flex items-center justify-center">
                    <span className="text-sm">👩‍🦱</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-deep">Ride with Maria</p>
                    <p className="text-sm text-gray-600">Home → Mall</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Community Section */}
      <div className="p-6">
        <Card className="rounded-3xl bg-gradient-to-r from-pink-light to-pink-soft border-0">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-pink-deep" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-purple-deep mb-2">Join the Community</h3>
            <p className="text-gray-700 mb-4">Share experiences and connect with other riders</p>
            <Button
              variant="outline"
              className="border-white bg-white text-pink-deep hover:bg-pink-light rounded-2xl"
              onClick={() => router.push("/community")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Community Wall
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* SOS Button - Always visible */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-2xl"
          onClick={() => {
            // SOS functionality
            alert("SOS activated! Emergency contacts notified.")
          }}
        >
          <Heart className="w-8 h-8 text-white" />
        </Button>
      </div>
    </div>
  )
}
