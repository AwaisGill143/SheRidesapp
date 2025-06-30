import { type NextRequest, NextResponse } from "next/server"
import webpush from "web-push"
import { supabase } from "@/lib/supabase"

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  "mailto:support@pinkride.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    "BEl62iUYgUivxIkv69yViEuiBIa40HI2BNNfvdDUaxaF71OPs6XjSwr7BHhHBp6Ym6YAAARHQ1_-FdNoeE9mzqc",
  process.env.VAPID_PRIVATE_KEY || "your-private-key-here",
)

export async function POST(request: NextRequest) {
  try {
    const { userId, title, body, data } = await request.json()

    if (!userId || !title || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user's push subscriptions
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to get subscriptions" }, { status: 500 })
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: "No active subscriptions found" }, { status: 200 })
    }

    // Send notifications to all subscriptions
    const notificationPromises = subscriptions.map(async (subscription) => {
      try {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        }

        const payload = JSON.stringify({
          title,
          body,
          data: data || {},
          icon: "/placeholder-logo.png",
          badge: "/placeholder-logo.png",
        })

        await webpush.sendNotification(pushSubscription, payload)
        return { success: true, subscriptionId: subscription.id }
      } catch (error) {
        console.error("Failed to send notification:", error)

        // If subscription is invalid, mark as inactive
        if (error.statusCode === 410) {
          await supabase.from("push_subscriptions").update({ is_active: false }).eq("id", subscription.id)
        }

        return { success: false, subscriptionId: subscription.id, error }
      }
    })

    const results = await Promise.all(notificationPromises)
    const successCount = results.filter((r) => r.success).length

    // Store notification in database
    await supabase.from("notifications").insert({
      user_id: userId,
      title,
      body,
      type: data?.type || "general",
      data: data || {},
      is_sent: successCount > 0,
    })

    return NextResponse.json({
      message: `Sent ${successCount} notifications`,
      results,
    })
  } catch (error) {
    console.error("Notification API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
