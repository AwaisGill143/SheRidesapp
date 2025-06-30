"use client"

import { useState, useEffect } from "react"
import { AuthService, type User, type LoginCredentials } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth cookie on mount
    const savedUser = AuthService.getAuthCookie()
    setUser(savedUser)
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const result = await AuthService.login(credentials)
      if (result.success && result.user) {
        setUser(result.user)
      }
      return result
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  const isAuthenticated = user !== null

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}
