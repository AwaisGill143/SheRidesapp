"use client"

import { useState, useEffect, useCallback } from "react"
import { ChatService } from "@/lib/chat-service"
import type { ChatMessage, QuickMessage } from "@/lib/supabase"

export function useChat(rideId: string, userId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [quickMessages, setQuickMessages] = useState<QuickMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [chatRoomId, setChatRoomId] = useState<string | null>(null)

  // Initialize chat
  useEffect(() => {
    if (!rideId || !userId) return

    const initializeChat = async () => {
      try {
        setIsLoading(true)

        // Get or create chat room
        const chatRoom = await ChatService.getChatRoom(rideId)
        if (chatRoom) {
          setChatRoomId(chatRoom.id)

          // Load messages
          const messages = await ChatService.getMessages(chatRoom.id)
          setMessages(messages)

          // Get unread count
          const unreadCount = await ChatService.getUnreadCount(chatRoom.id, userId)
          setUnreadCount(unreadCount)

          // Mark messages as read
          await ChatService.markMessagesAsRead(chatRoom.id, userId)
        }

        // Load quick messages
        const quickMessages = await ChatService.getQuickMessages()
        setQuickMessages(quickMessages)
      } catch (error) {
        console.error("Failed to initialize chat:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeChat()
  }, [rideId, userId])

  // Subscribe to real-time messages
  useEffect(() => {
    if (!chatRoomId) return

    const subscription = ChatService.subscribeToMessages(chatRoomId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage])

      // Update unread count if message is from someone else
      if (newMessage.sender_id !== userId) {
        setUnreadCount((prev) => prev + 1)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [chatRoomId, userId])

  // Send message
  const sendMessage = useCallback(
    async (messageText: string, messageType: "text" | "location" | "safety_alert" | "system" = "text") => {
      if (!chatRoomId || !messageText.trim()) return

      try {
        const message = await ChatService.sendMessage(chatRoomId, userId, messageText, messageType)
        // Message will be added via real-time subscription
        return message
      } catch (error) {
        console.error("Failed to send message:", error)
        throw error
      }
    },
    [chatRoomId, userId],
  )

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!chatRoomId) return

    try {
      await ChatService.markMessagesAsRead(chatRoomId, userId)
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark messages as read:", error)
    }
  }, [chatRoomId, userId])

  // Flag message
  const flagMessage = useCallback(async (messageId: string) => {
    try {
      await ChatService.flagMessage(messageId)
    } catch (error) {
      console.error("Failed to flag message:", error)
      throw error
    }
  }, [])

  return {
    messages,
    quickMessages,
    unreadCount,
    isLoading,
    sendMessage,
    markAsRead,
    flagMessage,
  }
}
