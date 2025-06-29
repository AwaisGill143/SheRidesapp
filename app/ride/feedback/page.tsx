"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star, Heart, ThumbsUp, Shield } from "lucide-react"

export default function RideFeedback() {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [safetyRating, setSafetyRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const driver = {
    name: "Sarah Johnson",
    avatar: "👩‍🦱",
  }

  const handleSubmitFeedback = async () => {
    setIsSubmitting(true)

    // Simulate feedback submission
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/dashboard")
    }, 2000)
  }

  const renderStars = (currentRating: number, onRate: (rating: number) => void) => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onClick={() => onRate(star)} className="transition-all duration-200 hover:scale-110">
            <Star className={`w-8 h-8 ${star <= currentRating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-bg p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-soft to-pink-deep rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-purple-deep mb-2">Ride Complete!</h1>
          <p className="text-gray-600">How was your experience with {driver.name}?</p>
        </div>

        {/* Driver Card */}
        <Card className="rounded-3xl shadow-lg border-0 mb-6">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-light to-pink-soft rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
              {driver.avatar}
            </div>
            <h3 className="font-heading text-lg font-semibold text-purple-deep mb-2">{driver.name}</h3>
            <p className="text-gray-600 text-sm">Thank you for choosing PinkRide! 💗</p>
          </CardContent>
        </Card>

        {/* Overall Rating */}
        <Card className="rounded-3xl shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg text-purple-deep text-center">Rate Your Ride</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {renderStars(rating, setRating)}
            <p className="text-sm text-gray-600 mt-3">
              {rating === 0 && "Tap to rate your experience"}
              {rating === 1 && "We're sorry to hear that 😔"}
              {rating === 2 && "We'll work to improve 🤔"}
              {rating === 3 && "Thanks for the feedback 😊"}
              {rating === 4 && "Great to hear! 😄"}
              {rating === 5 && "Amazing! You made our day! 🌟"}
            </p>
          </CardContent>
        </Card>

        {/* Safety Rating */}
        <Card className="rounded-3xl shadow-lg border-0 mb-6 bg-pink-light">
          <CardHeader>
            <CardTitle className="font-heading text-lg text-purple-deep text-center flex items-center justify-center">
              <Shield className="w-5 h-5 mr-2" />
              How safe did you feel?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {renderStars(safetyRating, setSafetyRating)}
            <p className="text-sm text-gray-600 mt-3">Your safety is our top priority</p>
          </CardContent>
        </Card>

        {/* Written Feedback */}
        <Card className="rounded-3xl shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg text-purple-deep">Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Tell us about your ride... (optional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="rounded-2xl border-pink-light focus:border-pink-soft min-h-[100px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Quick Feedback Options */}
        <Card className="rounded-3xl shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg text-purple-deep">Quick Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="rounded-2xl border-pink-light text-pink-deep hover:bg-pink-light p-4 h-auto flex-col space-y-2 bg-transparent"
              >
                <ThumbsUp className="w-6 h-6" />
                <span className="text-sm">Great Driver</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-pink-light text-pink-deep hover:bg-pink-light p-4 h-auto flex-col space-y-2 bg-transparent"
              >
                <Heart className="w-6 h-6" />
                <span className="text-sm">Felt Safe</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-pink-light text-pink-deep hover:bg-pink-light p-4 h-auto flex-col space-y-2 bg-transparent"
              >
                <span className="text-xl">🚗</span>
                <span className="text-sm">Clean Car</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-pink-light text-pink-deep hover:bg-pink-light p-4 h-auto flex-col space-y-2 bg-transparent"
              >
                <span className="text-xl">💬</span>
                <span className="text-sm">Friendly</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmitFeedback}
          disabled={rating === 0 || isSubmitting}
          className="w-full bg-gradient-to-r from-pink-soft to-pink-deep hover:from-pink-deep hover:to-pink-soft text-white font-semibold py-4 rounded-3xl h-14 text-lg mb-6"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            "Submit Feedback 💗"
          )}
        </Button>

        {/* Skip Option */}
        <div className="text-center">
          <Button variant="link" className="text-gray-500" onClick={() => router.push("/dashboard")}>
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  )
}
