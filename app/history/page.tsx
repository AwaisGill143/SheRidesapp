"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Calendar, Star, Bike, Car, Trash2 } from "lucide-react"
import { useHistory } from "@/hooks/use-history"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"

export default function HistoryPage() {
  const router = useRouter()
  const { history, clearHistory } = useHistory()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "bike":
        return <Bike className="w-4 h-4" />
      case "car":
        return <Car className="w-4 h-4" />
      case "rickshaw":
        return <span className="text-sm">🛺</span>
      default:
        return <Car className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-pink-bg p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4 text-purple-deep">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-heading text-2xl font-bold text-purple-deep">Ride History</h1>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Are you sure you want to clear all history?")) {
                  clearHistory()
                }
              }}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* History list */}
        {history.length === 0 ? (
          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-pink-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-pink-deep" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-purple-deep mb-2">No rides yet</h3>
              <p className="text-purple-light mb-6">Your ride history will appear here once you start booking rides.</p>
              <Button
                onClick={() => router.push("/ride/request")}
                className="bg-gradient-to-r from-pink-soft to-pink-deep hover:from-pink-deep hover:to-pink-soft text-white font-semibold py-2 px-6 rounded-2xl"
              >
                Book Your First Ride
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((ride) => (
              <Card key={ride.id} className="rounded-3xl shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getVehicleIcon(ride.vehicleType)}
                      <span className="font-semibold text-purple-deep capitalize">{ride.vehicleType}</span>
                    </div>
                    <Badge className={getStatusColor(ride.status)}>{ride.status}</Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-purple-deep truncate">{ride.from}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-purple-deep truncate">{ride.to}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-purple-light">
                    <span>{formatDate(ride.date)}</span>
                    <div className="flex items-center space-x-4">
                      {ride.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{ride.rating}</span>
                        </div>
                      )}
                      <span className="font-semibold text-purple-deep">${ride.fare}</span>
                    </div>
                  </div>

                  {ride.driverName && (
                    <div className="mt-2 pt-2 border-t border-pink-light">
                      <span className="text-sm text-purple-light">Driver: {ride.driverName}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
