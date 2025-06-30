export function getOrCreateUserUUID(): string {
  // 1.  See if a UUID is already cached for this browser.
  if (typeof window !== "undefined") {
    const KEY = "pinkride_user_uuid"
    const cached = localStorage.getItem(KEY)

    // 2.  If it’s already a valid v4 UUID, return it.
    if (cached && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cached)) {
      return cached
    }

    // 3.  Otherwise generate a new UUID, cache it and return it.
    const newId = crypto.randomUUID() // Browser-native UUID v4 generator
    localStorage.setItem(KEY, newId)
    return newId
  }

  // 4.  Server-side: fallback to a one-shot UUID (shouldn’t normally run here)
  return crypto.randomUUID()
}
