import { createClient } from '@supabase/supabase-js'
import { config } from './config'

// Create Supabase client for client-side operations
// Only initialize if we're in the browser and have valid environment variables
export const supabase = typeof window !== 'undefined' && 
  config.supabase.url && 
  config.supabase.anonKey &&
  config.supabase.url.length > 0 &&
  config.supabase.anonKey.length > 0
  ? createClient(
      config.supabase.url,
      config.supabase.anonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    )
  : null as any

// Types for authentication
export interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    role?: string
  }
}

export interface Session {
  access_token: string
  refresh_token: string
  user: User
}

// Auth helper functions
export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, metadata?: { full_name?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }
}
