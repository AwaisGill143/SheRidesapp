"use client"

import { useState, useEffect } from "react"
import { PushNotificationService } from "@/lib/push-service"

export function usePushNotifications(userId?: string) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    // Check if push notifications are supported
    const supported = "Notification" in window && "serviceWorker" in navigator
    setIsSupported(supported)

    if (supported) {
      setPermission(Notification.permission)

      // Check if already subscribed
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      })
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported || !userId) return false

    const granted = await PushNotificationService.requestPermission()
    setPermission(Notification.permission)

    if (granted) {
      const subscription = await PushNotificationService.subscribe(userId)
      setIsSubscribed(!!subscription)
      return !!subscription
    }

    return false
  }

  const unsubscribe = async () => {
    if (!userId) return false

    const success = await PushNotificationService.unsubscribe(userId)
    if (success) {
      setIsSubscribed(false)
    }
    return success
  }

  const sendNotification = async (title: string, body: string, data?: any) => {
    if (!userId) return false
    return await PushNotificationService.sendNotification(userId, title, body, data)
  }

  return {
    isSupported,
    isSubscribed,
    permission,
    requestPermission,
    unsubscribe,
    sendNotification,
  }
}
