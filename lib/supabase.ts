import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  phone?: string
  full_name: string
  user_type: "rider" | "driver"
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface DriverProfile {
  id: string
  user_id: string
  vehicle_make?: string
  vehicle_model?: string
  vehicle_color?: string
  license_plate?: string
  vehicle_type: "bike" | "rickshaw" | "car"
  rating: number
  total_rides: number
  is_verified: boolean
  bio?: string
  is_online: boolean
  created_at: string
  updated_at: string
}

export interface RideRequest {
  id: string
  rider_id: string
  pickup_location: string
  pickup_latitude?: number
  pickup_longitude?: number
  dropoff_location: string
  dropoff_latitude?: number
  dropoff_longitude?: number
  vehicle_type: "bike" | "rickshaw" | "car"
  suggested_price?: number
  rider_mood?: string
  is_scheduled: boolean
  scheduled_time?: string
  status: "pending" | "matched" | "active" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

export interface Ride {
  id: string
  request_id: string
  driver_id: string
  agreed_price?: number
  status: "accepted" | "arriving" | "pickup" | "enroute" | "completed" | "cancelled"
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface RideFeedback {
  id: string
  ride_id: string
  from_user_id: string
  to_user_id: string
  rating?: number
  safety_rating?: number
  feedback_text?: string
  feedback_tags?: string[]
  created_at: string
}
