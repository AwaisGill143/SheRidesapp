"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, Bell, Share } from "lucide-react"

export default function ScheduledSuccess() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-pink-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        {/* Success Animation */}
        <Card className="rounded-3xl shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="animate-bounce mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-purple-deep mb-2">Ride Scheduled! 🎉</h1>
            <p className="text-gray-600 mb-6">Your safe journey has been planned successfully</p>

            {/* Scheduled Details */}
            <div className="bg-pink-light rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-4 mb-3">
                <Calendar className="w-5 h-5 text-pink-deep" />
                <span className="font-medium text-purple-deep">Tomorrow, Dec 15</span>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Clock className="w-5 h-5 text-pink-deep" />
                <span className="font-medium text-purple-deep">2:00 PM</span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p>✨ We'll notify you 30 minutes before</p>
              <p>🚗 Drivers will be alerted 1 hour prior</p>
              <p>💗 Your safety preferences are saved</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="rounded-2xl border-pink-light text-pink-deep hover:bg-pink-light bg-transparent h-16 flex-col space-y-1"
          >
            <Bell className="w-5 h-5" />
            <span className="text-sm">Set Reminder</span>
          </Button>
          <Button
            variant="outline"
            className="rounded-2xl border-pink-light text-pink-deep hover:bg-pink-light bg-transparent h-16 flex-col space-y-1"
          >
            <Share className="w-5 h-5" />
            <span className="text-sm">Share Plans</span>
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/ride/scheduled")}
            className="w-full bg-gradient-to-r from-pink-soft to-pink-deep text-white font-semibold py-3 rounded-2xl"
          >
            View My Scheduled Rides
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="w-full border-pink-light text-pink-deep hover:bg-pink-light rounded-2xl"
          >
            Back to Home
          </Button>
        </div>

        {/* Tips */}
        <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-r from-pink-light to-pink-soft">
          <CardContent className="p-6">
            <h3 className="font-heading text-lg font-semibold text-purple-deep mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• You can modify or cancel up to 2 hours before</li>
              <li>• Add this to your calendar for easy tracking</li>
              <li>• Emergency contacts will be notified automatically</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
