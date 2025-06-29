"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Shield, MessageCircle, Phone, Heart, Car, Clock } from "lucide-react"

const mockDrivers = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 4.9,
    rides: 234,
    car: "Honda Civic",
    color: "White",
    plate: "ABC-123",
    distance: "2 min away",
    price: 15,
    counterPrice: null,
    verified: true,
    bio: "Friendly driver who loves helping other women feel safe on the road! 💗",
    avatar: "👩‍🦱",
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    rating: 5.0,
    rides: 156,
    car: "Toyota Prius",
    color: "Silver",
    plate: "XYZ-789",
    distance: "4 min away",
    price: 12,
    counterPrice: 18,
    verified: true,
    bio: "Safe rides with great music and good vibes! Always happy to chat or give you quiet time.",
    avatar: "👩",
  },
]

export default function DriverMatching() {
  const [drivers, setDrivers] = useState(mockDrivers)
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null)
  const router = useRouter()

  const handleAcceptPrice = (driverId: number, price: number) => {
    // Simulate accepting price and starting ride
    setTimeout(() => {
      router.push("/ride/active")
    }, 1000)
  }

  const handleCounterOffer = (driverId: number) => {
    // In a real app, this would open a negotiation interface
    alert("Counter offer sent! Driver will respond shortly.")
  }

  return (
    <div className="min-h-screen bg-pink-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-soft to-pink-deep p-6 rounded-b-3xl">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4 text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading text-2xl font-bold text-white">Available Drivers</h1>
        </div>
        <p className="text-white/80">Choose your trusted driver</p>
      </div>

      <div className="p-6 space-y-4">
        {drivers.map((driver) => (
          <Card key={driver.id} className="rounded-3xl shadow-lg border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* Driver Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-light to-pink-soft rounded-2xl flex items-center justify-center text-2xl">
                      {driver.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-heading text-lg font-semibold text-purple-deep">{driver.name}</h3>
                        {driver.verified && (
                          <Badge className="bg-green-500 text-white text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{driver.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{driver.rides} rides</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1 text-green-600">
                          <Clock className="w-4 h-4" />
                          <span>{driver.distance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-700 text-sm mb-4 bg-pink-light p-3 rounded-2xl">{driver.bio}</p>

                {/* Car Info */}
                <div className="flex items-center space-x-4 mb-4 p-3 bg-gray-50 rounded-2xl">
                  <Car className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-purple-deep">
                      {driver.car} • {driver.color}
                    </p>
                    <p className="text-sm text-gray-600">Plate: {driver.plate}</p>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-pink-light p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Your offer: $15</p>
                    {driver.counterPrice ? (
                      <div>
                        <p className="text-lg font-bold text-purple-deep">Counter offer: ${driver.counterPrice}</p>
                        <p className="text-sm text-pink-deep">Driver suggests higher price</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-bold text-green-600">Accepts: ${driver.price}</p>
                        <p className="text-sm text-green-600">Great match! 🎉</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  {driver.counterPrice ? (
                    <>
                      <Button
                        onClick={() => handleAcceptPrice(driver.id, driver.counterPrice)}
                        className="flex-1 bg-gradient-to-r from-pink-soft to-pink-deep text-white rounded-2xl"
                      >
                        Accept ${driver.counterPrice}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCounterOffer(driver.id)}
                        className="flex-1 border-pink-soft text-pink-deep rounded-2xl"
                      >
                        Counter Offer
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleAcceptPrice(driver.id, driver.price)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl"
                    >
                      Book Ride with {driver.name} 🚗
                    </Button>
                  )}
                </div>

                {/* Contact Options */}
                <div className="flex space-x-3 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-pink-light text-pink-deep rounded-2xl bg-transparent"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-pink-light text-pink-deep rounded-2xl bg-transparent"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
