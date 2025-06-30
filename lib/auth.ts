export interface User {
  id: string
  email: string
  phone: string
  name: string
  profilePicture?: string
  isVerified: boolean
  createdAt: string
}

export interface LoginCredentials {
  identifier: string // email or phone
  password: string
  loginMethod: "email" | "phone"
}

// Cookie configuration
const AUTH_COOKIE_NAME = "pinkride_auth"
const HISTORY_COOKIE_NAME = "pinkride_history"
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export class AuthService {
  // Set authentication cookie
  static setAuthCookie(user: User) {
    if (typeof window !== "undefined") {
      const userData = JSON.stringify(user)
      document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(userData)}; max-age=${COOKIE_MAX_AGE}; path=/; secure; samesite=strict`
    }
  }

  // Get user from cookie
  static getAuthCookie(): User | null {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";")
      const authCookie = cookies.find((cookie) => cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=`))

      if (authCookie) {
        try {
          const userData = decodeURIComponent(authCookie.split("=")[1])
          return JSON.parse(userData)
        } catch (error) {
          console.error("Error parsing auth cookie:", error)
          this.clearAuthCookie()
        }
      }
    }
    return null
  }

  // Clear authentication cookie
  static clearAuthCookie() {
    if (typeof window !== "undefined") {
      document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  }

  // Simulate login (replace with real API call)
  static async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock user data (replace with real API call)
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email: credentials.loginMethod === "email" ? credentials.identifier : "user@example.com",
        phone: credentials.loginMethod === "phone" ? credentials.identifier : "+1234567890",
        name: "Sarah Johnson",
        profilePicture: "/placeholder-user.jpg",
        isVerified: true,
        createdAt: new Date().toISOString(),
      }

      // Set auth cookie
      this.setAuthCookie(mockUser)

      return { success: true, user: mockUser }
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  // Logout
  static logout() {
    this.clearAuthCookie()
    this.clearHistory()
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getAuthCookie() !== null
  }
}

// Ride history management
export interface RideHistoryItem {
  id: string
  from: string
  to: string
  vehicleType: "bike" | "rickshaw" | "car"
  date: string
  status: "completed" | "cancelled" | "scheduled"
  fare: number
  driverName: string
  rating?: number
}

export class HistoryService {
  // Get ride history from cookies
  static getHistory(): RideHistoryItem[] {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";")
      const historyCookie = cookies.find((cookie) => cookie.trim().startsWith(`${HISTORY_COOKIE_NAME}=`))

      if (historyCookie) {
        try {
          const historyData = decodeURIComponent(historyCookie.split("=")[1])
          return JSON.parse(historyData)
        } catch (error) {
          console.error("Error parsing history cookie:", error)
          return []
        }
      }
    }
    return []
  }

  // Add ride to history
  static addToHistory(ride: RideHistoryItem) {
    const currentHistory = this.getHistory()
    const updatedHistory = [ride, ...currentHistory].slice(0, 50) // Keep last 50 rides

    if (typeof window !== "undefined") {
      const historyData = JSON.stringify(updatedHistory)
      document.cookie = `${HISTORY_COOKIE_NAME}=${encodeURIComponent(historyData)}; max-age=${COOKIE_MAX_AGE}; path=/; secure; samesite=strict`
    }
  }

  // Clear history
  static clearHistory() {
    if (typeof window !== "undefined") {
      document.cookie = `${HISTORY_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  }

  // Get recent destinations
  static getRecentDestinations(): string[] {
    const history = this.getHistory()
    const destinations = [...new Set(history.map((ride) => ride.to))]
    return destinations.slice(0, 5)
  }

  // Get favorite vehicle type
  static getFavoriteVehicleType(): "bike" | "rickshaw" | "car" {
    const history = this.getHistory()
    const vehicleCounts = history.reduce(
      (acc, ride) => {
        acc[ride.vehicleType] = (acc[ride.vehicleType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const favorite = Object.entries(vehicleCounts).sort(([, a], [, b]) => b - a)[0]
    return favorite ? (favorite[0] as "bike" | "rickshaw" | "car") : "rickshaw"
  }
}
