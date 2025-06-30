"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Shield, ArrowLeft } from "lucide-react"
import { useHistory } from "@/hooks/use-history"
import { toast } from "sonner"

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [safetyRating, setSafetyRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addRide } = useHistory()

  // Get ride details from URL params
  const rideId = searchParams.get("rideId") || "ride_" + Date.now()
  const from = searchParams.get("from") || "Your Location"
  const to = searchParams.get("to") || "Destination"
  const vehicleType = (searchParams.get("vehicleType") as "bike" | "rickshaw" | "car") || "rickshaw"
  const fare = Number.parseFloat(searchParams.get("fare") || "15")
  const driverName = searchParams.get("driverName") || "Sarah K."

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Add ride to history
      addRide({
        id: rideId,
        from,
        to,
        vehicleType,
        date: new Date().toISOString(),
        status: "completed",
        fare,
        driverName,
        rating,
      })

      toast.success("Thank you for your feedback! 💗")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-bg p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4 text-purple-deep">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading text-2xl font-bold text-purple-deep">Rate Your Ride</h1>
        </div>

        <div className="space-y-6">
          {/* Ride completed card */}
          <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-r from-green-50 to-pink-50">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="font-heading text-xl font-bold text-purple-deep mb-2">Ride Completed!</h2>
              <p className="text-purple-light">Hope you had a safe and comfortable journey</p>
            </CardContent>
          </Card>

          {/* Driver info */}
          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-soft to-pink-deep rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{driverName.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-purple-deep">{driverName}</h3>
                    <Badge className="bg-pink-100 text-pink-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-light capitalize">
                    {vehicleType} • ${fare}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card className="rounded-3xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-purple-deep text-center">How was your ride?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </Button>
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-purple-light">
                  {rating === 0 && "Tap to rate"}
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Safety rating */}
          <Card className="rounded-3xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-purple-deep text-center">
                How safe did you feel?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button key={level} variant="ghost" size="sm" className="p-2" onClick={() => setSafetyRating(level)}>
                    <Shield
                      className={`w-6 h-6 ${level <= safetyRating ? "fill-green-400 text-green-400" : "text-gray-300"}`}
                    />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-4">
              <Textarea
                placeholder="Share your experience (optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="rounded-2xl border-pink-light focus:border-pink-soft min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>

          {/* Submit button */}
          <Button
            onClick={handleSubmitFeedback}
            disabled={isSubmitting || rating === 0}
            className="w-full bg-gradient-to-r from-pink-soft to-pink-deep hover:from-pink-deep hover:to-pink-soft text-white font-semibold py-4 rounded-3xl h-16 text-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
