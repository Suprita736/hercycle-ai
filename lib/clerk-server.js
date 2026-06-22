import { auth } from '@clerk/nextjs/server'

/** Returns the authenticated user's Clerk ID, or null if not logged in */
export async function getAuthUserId() {
  const { userId } = await auth({ clockSkewInMs: 30000 })
  return userId ?? null
}
