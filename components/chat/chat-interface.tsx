"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MapPin, AlertTriangle, Flag, Shield, MessageSquare } from "lucide-react"
import { useChat } from "@/hooks/use-chat"
import type { QuickMessage } from "@/lib/supabase"

interface ChatInterfaceProps {
  rideId: string
  userId: string
  otherUserName: string
  otherUserAvatar?: string
}

export function ChatInterface({ rideId, userId, otherUserName, otherUserAvatar }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("")
  const [showQuickMessages, setShowQuickMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, quickMessages, unreadCount, isLoading, sendMessage, markAsRead, flagMessage } = useChat(
    rideId,
    userId,
  )

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mark as read when component mounts
  useEffect(() => {
    markAsRead()
  }, [markAsRead])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      await sendMessage(newMessage)
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleQuickMessage = async (message: QuickMessage) => {
    try {
      await sendMessage(message.message_text)
      setShowQuickMessages(false)
    } catch (error) {
      console.error("Failed to send quick message:", error)
    }
  }

  const handleShareLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const locationMessage = `📍 My location: https://maps.google.com/?q=${latitude},${longitude}`
          await sendMessage(locationMessage, "location")
        },
        (error) => {
          console.error("Failed to get location:", error)
        },
      )
    }
  }

  const handleSafetyAlert = async () => {
    await sendMessage("🚨 I need help! Please check on me immediately.", "safety_alert")
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const groupMessagesByCategory = (messages: QuickMessage[]) => {
    return messages.reduce(
      (acc, message) => {
        if (!acc[message.category]) {
          acc[message.category] = []
        }
        acc[message.category].push(message)
        return acc
      },
      {} as Record<string, QuickMessage[]>,
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-deep"></div>
      </div>
    )
  }

  const groupedQuickMessages = groupMessagesByCategory(quickMessages)

  return (
    <div className="flex flex-col h-full bg-pink-bg">
      {/* Header */}
      <Card className="rounded-t-3xl border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-light rounded-full flex items-center justify-center">
                {otherUserAvatar ? (
                  <img
                    src={otherUserAvatar || "/placeholder.svg"}
                    alt={otherUserName}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-pink-deep font-semibold">{otherUserName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <CardTitle className="text-lg text-purple-deep">{otherUserName}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800 text-xs">Verified Driver</Badge>
                  <div className="flex items-center text-xs text-purple-light">
                    <Shield className="w-3 h-3 mr-1" />
                    Chat monitored for safety
                  </div>
                </div>
              </div>
            </div>
            {unreadCount > 0 && <Badge className="bg-pink-deep text-white">{unreadCount}</Badge>}
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender_id === userId ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender_id === userId ? "bg-pink-deep text-white" : "bg-white text-purple-deep shadow-sm"
                }`}
              >
                {message.message_type === "safety_alert" && (
                  <div className="flex items-center mb-1">
                    <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
                    <span className="text-xs font-semibold text-red-500">SAFETY ALERT</span>
                  </div>
                )}

                <p className="text-sm">{message.message_text}</p>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-70">{formatTime(message.created_at)}</span>

                  {message.sender_id !== userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                      onClick={() => flagMessage(message.id)}
                    >
                      <Flag className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Messages */}
      {showQuickMessages && (
        <Card className="m-4 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-3">
              {Object.entries(groupedQuickMessages).map(([category, messages]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-purple-deep capitalize mb-2">
                    {category === "arrival" && "🚗 Arrival"}
                    {category === "location" && "📍 Location"}
                    {category === "safety" && "🛡️ Safety"}
                    {category === "general" && "💬 General"}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {messages.map((message) => (
                      <Button
                        key={message.id}
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto py-2 px-3 rounded-xl border-pink-light hover:bg-pink-light bg-transparent"
                        onClick={() => handleQuickMessage(message)}
                      >
                        {message.message_text}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Area */}
      <Card className="rounded-b-3xl border-0 shadow-lg">
        <CardContent className="p-4">
          {/* Action Buttons */}
          <div className="flex space-x-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-pink-light text-pink-deep hover:bg-pink-light bg-transparent"
              onClick={() => setShowQuickMessages(!showQuickMessages)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Quick
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              onClick={handleShareLocation}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              onClick={handleSafetyAlert}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              SOS
            </Button>
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-2xl border-pink-light focus:border-pink-deep"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-pink-deep hover:bg-pink-soft text-white rounded-2xl px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
