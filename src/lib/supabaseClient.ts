import { createClient } from '@supabase/supabase-js'
import { config } from './config'

// Create Supabase client for client-side operations
// Only initialize if we're in the browser and have valid environment variables
export const supabase = (() => {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    console.log('Supabase: Not in browser environment')
    return null
  }

  // Check if we have valid configuration
  if (!config.supabase.url || !config.supabase.anonKey) {
    console.error('Supabase: Missing configuration', {
      url: config.supabase.url,
      anonKey: config.supabase.anonKey ? 'Present' : 'Missing'
    })
    return null
  }

  if (config.supabase.url.length === 0 || config.supabase.anonKey.length === 0) {
    console.error('Supabase: Empty configuration', {
      urlLength: config.supabase.url.length,
      anonKeyLength: config.supabase.anonKey.length
    })
    return null
  }

  console.log('Supabase: Initializing client with URL:', config.supabase.url)
  
  return createClient(
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
})()

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
    if (!supabase) {
      return { data: null, error: new Error('Supabase not available') }
    }
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
    if (!supabase) {
      return { data: null, error: new Error('Supabase not available') }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    if (!supabase) {
      return { error: new Error('Supabase not available') }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  async getSession() {
    if (!supabase) {
      return { session: null, error: new Error('Supabase not available') }
    }
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get current user
  async getUser() {
    if (!supabase) {
      return { user: null, error: new Error('Supabase not available') }
    }
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }
}
