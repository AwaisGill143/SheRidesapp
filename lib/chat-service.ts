import { supabase, type ChatRoom, type ChatMessage, type QuickMessage } from "./supabase"
import { PushNotificationService } from "./push-service"

export class ChatService {
  // Chat room operations
  static async createChatRoom(rideId: string, riderId: string, driverId: string): Promise<ChatRoom> {
    const { data, error } = await supabase
      .from("chat_rooms")
      .insert([
        {
          ride_id: rideId,
          rider_id: riderId,
          driver_id: driverId,
          is_active: true,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getChatRoom(rideId: string): Promise<ChatRoom | null> {
    const { data, error } = await supabase.from("chat_rooms").select("*").eq("ride_id", rideId).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  }

  static async deactivateChatRoom(rideId: string): Promise<void> {
    const { error } = await supabase.from("chat_rooms").update({ is_active: false }).eq("ride_id", rideId)

    if (error) throw error
  }

  // Message operations
  static async sendMessage(
    chatRoomId: string,
    senderId: string,
    messageText: string,
    messageType: "text" | "location" | "safety_alert" | "system" = "text",
  ): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([
        {
          chat_room_id: chatRoomId,
          sender_id: senderId,
          message_text: messageText,
          message_type: messageType,
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Send push notification to other participant
    await this.notifyOtherParticipant(chatRoomId, senderId, messageText, messageType)

    return data
  }

  static async getMessages(chatRoomId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from("chat_messages")
      .select(`
        *,
        users!chat_messages_sender_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("chat_room_id", chatRoomId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data || []
  }

  static async markMessagesAsRead(chatRoomId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("chat_messages")
      .update({ is_read: true })
      .eq("chat_room_id", chatRoomId)
      .neq("sender_id", userId)

    if (error) throw error
  }

  static async getUnreadCount(chatRoomId: string, userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .eq("chat_room_id", chatRoomId)
      .eq("is_read", false)
      .neq("sender_id", userId)

    if (error) throw error
    return count || 0
  }

  static async flagMessage(messageId: string): Promise<void> {
    const { error } = await supabase.from("chat_messages").update({ is_flagged: true }).eq("id", messageId)

    if (error) throw error
  }

  // Quick messages
  static async getQuickMessages(): Promise<QuickMessage[]> {
    const { data, error } = await supabase
      .from("quick_messages")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true })

    if (error) throw error
    return data || []
  }

  // Real-time subscriptions
  static subscribeToMessages(chatRoomId: string, callback: (message: ChatMessage) => void) {
    return supabase
      .channel(`chat_room_${chatRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          callback(payload.new as ChatMessage)
        },
      )
      .subscribe()
  }

  // Private helper methods
  private static async notifyOtherParticipant(
    chatRoomId: string,
    senderId: string,
    messageText: string,
    messageType: string,
  ): Promise<void> {
    try {
      // Get chat room details
      const { data: chatRoom } = await supabase
        .from("chat_rooms")
        .select("rider_id, driver_id")
        .eq("id", chatRoomId)
        .single()

      if (!chatRoom) return

      // Determine recipient
      const recipientId = chatRoom.rider_id === senderId ? chatRoom.driver_id : chatRoom.rider_id

      // Get sender name
      const { data: sender } = await supabase.from("users").select("full_name").eq("id", senderId).single()

      const senderName = sender?.full_name?.split(" ")[0] || "Someone"

      // Create notification title and body
      let title = `New message from ${senderName}`
      let body = messageText

      if (messageType === "safety_alert") {
        title = "🚨 Safety Alert"
        body = `${senderName}: ${messageText}`
      } else if (messageType === "location") {
        title = "📍 Location Shared"
        body = `${senderName} shared their location`
      }

      // Send push notification
      await PushNotificationService.sendNotification(recipientId, title, body, {
        type: "chat_message",
        chatRoomId,
        messageType,
      })
    } catch (error) {
      console.error("Failed to send notification:", error)
    }
  }
}
