export class PushNotificationService {
  private static readonly VAPID_PUBLIC_KEY =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    "BEl62iUYgUivxIkv69yViEuiBIa40HI2BNNfvdDUaxaF71OPs6XjSwr7BHhHBp6Ym6YAAARHQ1_-FdNoeE9mzqc"

  static async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications")
      return false
    }

    if (!("serviceWorker" in navigator)) {
      console.warn("This browser does not support service workers")
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  static async subscribe(userId: string): Promise<PushSubscription | null> {
    try {
      const registration = await navigator.serviceWorker.ready

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY),
      })

      // Save subscription to database
      await this.saveSubscription(userId, subscription)

      return subscription
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error)
      return null
    }
  }

  static async saveSubscription(userId: string, subscription: PushSubscription) {
    const { supabase } = await import("./supabase")

    const subscriptionData = {
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.toJSON().keys?.p256dh || "",
      auth: subscription.toJSON().keys?.auth || "",
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(subscriptionData, { onConflict: "user_id,endpoint" })

    if (error) {
      console.error("Failed to save push subscription:", error)
    }
  }

  static async unsubscribe(userId: string): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()

        // Remove from database
        const { supabase } = await import("./supabase")
        await supabase.from("push_subscriptions").delete().eq("user_id", userId)
      }

      return true
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error)
      return false
    }
  }

  static async sendNotification(userId: string, title: string, body: string, data?: any) {
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title,
          body,
          data,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send notification")
      }

      return true
    } catch (error) {
      console.error("Failed to send notification:", error)
      return false
    }
  }

  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  static showLocalNotification(title: string, body: string, data?: any) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/placeholder-logo.png",
        badge: "/placeholder-logo.png",
        data,
        tag: "pinkride-notification",
      })
    }
  }
}
