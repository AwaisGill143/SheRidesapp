const CACHE_NAME = "pinkride-v1"
const urlsToCache = ["/", "/dashboard", "/ride/request", "/ride/schedule", "/placeholder-logo.png"]

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})

// Push event
self.addEventListener("push", (event) => {
  const options = {
    body: "You have a new message!",
    icon: "/placeholder-logo.png",
    badge: "/placeholder-logo.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Open App",
        icon: "/placeholder-logo.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/placeholder-logo.png",
      },
    ],
  }

  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.data = { ...options.data, ...data.data }
  }

  event.waitUntil(self.registration.showNotification("PinkRide 💗", options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    // Open the app
    event.waitUntil(clients.openWindow("/"))
  } else if (event.action === "close") {
    // Just close the notification
    return
  } else {
    // Default action - open app
    event.waitUntil(clients.openWindow("/"))
  }
})
