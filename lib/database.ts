import { supabase, type User, type DriverProfile, type RideRequest, type Ride } from "./supabase"

export class DatabaseService {
  // User operations
  static async createUser(userData: Omit<User, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("users").insert([userData]).select().single()

    if (error) throw error
    return data
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) throw error
    return data
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) throw error
    return data
  }

  /** Ensure a user row exists (insert if missing) */
  static async ensureUserExists(id: string) {
    const { error } = await supabase.from("users").upsert(
      {
        id, // primary key / UUID
        full_name: "Guest User",
        email: `${id}@guest.local`, // dummy but unique
      },
      { onConflict: "id" },
    )
    if (error) throw error
  }

  // Driver profile operations
  static async createDriverProfile(profileData: Omit<DriverProfile, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("driver_profiles").insert([profileData]).select().single()

    if (error) throw error
    return data
  }

  static async getDriverProfile(userId: string) {
    const { data, error } = await supabase.from("driver_profiles").select("*").eq("user_id", userId).single()

    if (error) throw error
    return data
  }

  static async getAvailableDrivers(vehicleType: "bike" | "rickshaw" | "car") {
    const { data, error } = await supabase
      .from("driver_profiles")
      .select(`
        *,
        users!driver_profiles_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("vehicle_type", vehicleType)
      .eq("is_online", true)
      .eq("is_verified", true)

    if (error) throw error
    return data
  }

  // Ride request operations
  static async createRideRequest(requestData: Omit<RideRequest, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("ride_requests").insert([requestData]).select().single()

    if (error) throw error
    return data
  }

  static async getRideRequest(id: string) {
    const { data, error } = await supabase.from("ride_requests").select("*").eq("id", id).single()

    if (error) throw error
    return data
  }

  static async getUserRideRequests(userId: string) {
    const { data, error } = await supabase
      .from("ride_requests")
      .select("*")
      .eq("rider_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  static async getScheduledRides(userId: string) {
    const { data, error } = await supabase
      .from("ride_requests")
      .select("*")
      .eq("rider_id", userId)
      .eq("is_scheduled", true)
      .gte("scheduled_time", new Date().toISOString())
      .order("scheduled_time", { ascending: true })

    if (error) throw error
    return data
  }

  static async updateRideRequestStatus(id: string, status: RideRequest["status"]) {
    const { data, error } = await supabase
      .from("ride_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Ride operations
  static async createRide(rideData: Omit<Ride, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("rides").insert([rideData]).select().single()

    if (error) throw error
    return data
  }

  static async getRideByRequestId(requestId: string) {
    const { data, error } = await supabase
      .from("rides")
      .select(`
        *,
        ride_requests!rides_request_id_fkey (*),
        users!rides_driver_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("request_id", requestId)
      .single()

    if (error) throw error
    return data
  }

  static async updateRideStatus(id: string, status: Ride["status"]) {
    const { data, error } = await supabase
      .from("rides")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
