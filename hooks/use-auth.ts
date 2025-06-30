"use client"

import { useState, useEffect, useRef } from "react"
import { AuthService, type User, type LoginCredentials } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    // Check for existing auth cookie on mount
    const initializeAuth = () => {
      try {
        const savedUser = AuthService.getAuthCookie()
        if (mountedRef.current) {
          setUser(savedUser)
          setIsLoading(false)
          setIsInitialized(true)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (mountedRef.current) {
          setUser(null)
          setIsLoading(false)
          setIsInitialized(true)
        }
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    if (!mountedRef.current) return { success: false, error: "Component unmounted" }

    setIsLoading(true)
    try {
      const result = await AuthService.login(credentials)
      if (result.success && result.user && mountedRef.current) {
        setUser(result.user)
      }
      return result
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }

  const logout = () => {
    AuthService.logout()
    if (mountedRef.current) {
      setUser(null)
    }
  }

  const isAuthenticated = user !== null && isInitialized

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    logout,
  }
}
