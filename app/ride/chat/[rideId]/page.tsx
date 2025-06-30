"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { useAuth } from "@/hooks/use-auth"
import { DatabaseService } from "@/lib/database"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [rideData, setRideData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const rideId = params.rideId as string

  useEffect(() => {
    if (!user || !rideId) return

    const loadRideData = async () => {
      try {
        const ride = await DatabaseService.getRideByRequestId(rideId)
        setRideData(ride)
      } catch (error) {
        console.error("Failed to load ride data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRideData()
  }, [user, rideId])

  if (!user) {
    return (
      <div className="min-h-screen bg-pink-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-purple-deep">Please log in to access chat</p>
          <Button onClick={() => router.push("/auth/login")} className="mt-4">
            Login
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-deep"></div>
      </div>
    )
  }

  if (!rideData) {
    return (
      <div className="min-h-screen bg-pink-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-purple-deep">Ride not found</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const otherUser =
    user.id === rideData.ride_requests.rider_id
      ? rideData.users // Driver info
      : { full_name: "Rider", avatar_url: null } // Rider info (simplified for demo)

  return (
    <div className="min-h-screen bg-pink-bg">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-3">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-heading text-lg font-semibold text-purple-deep">Chat</h1>
      </div>

      {/* Chat Interface */}
      <div className="h-[calc(100vh-80px)]">
        <ChatInterface
          rideId={rideId}
          userId={user.id}
          otherUserName={otherUser.full_name}
          otherUserAvatar={otherUser.avatar_url}
        />
      </div>
    </div>
  )
}
