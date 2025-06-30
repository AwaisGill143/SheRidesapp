"use client"

import { useState, useEffect } from "react"
import { HistoryService, type RideHistoryItem } from "@/lib/auth"

export function useHistory() {
  const [history, setHistory] = useState<RideHistoryItem[]>([])

  useEffect(() => {
    // Load history from cookies on mount
    const savedHistory = HistoryService.getHistory()
    setHistory(savedHistory)
  }, [])

  const addRide = (ride: RideHistoryItem) => {
    HistoryService.addToHistory(ride)
    setHistory(HistoryService.getHistory())
  }

  const clearHistory = () => {
    HistoryService.clearHistory()
    setHistory([])
  }

  const getRecentDestinations = () => {
    return HistoryService.getRecentDestinations()
  }

  const getFavoriteVehicleType = () => {
    return HistoryService.getFavoriteVehicleType()
  }

  return {
    history,
    addRide,
    clearHistory,
    getRecentDestinations,
    getFavoriteVehicleType,
  }
}
