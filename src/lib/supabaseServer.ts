import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { config } from './config'

// Create Supabase client for server-side operations
export async function createClient() {
  // Return null if environment variables are not available or empty
  if (!config.supabase.url || !config.supabase.anonKey || 
      config.supabase.url.length === 0 || config.supabase.anonKey.length === 0) {
    return null as any
  }

  const cookieStore = await cookies()

  return createServerClient(
    config.supabase.url,
    config.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Helper function to get session in server components
export async function getSession() {
  try {
    const supabase = await createClient()
    
    // Return null if Supabase client is not available
    if (!supabase) {
      return null
    }
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    return null
  }
}

// Helper function to get user in server components
export async function getUser() {
  try {
    const supabase = await createClient()
    
    // Return null if Supabase client is not available
    if (!supabase) {
      return null
    }
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    return null
  }
}
