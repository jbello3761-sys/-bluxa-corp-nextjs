import { config } from './config'

// API Error class for better error handling
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Exact types matching backend specification
export interface BookingData {
  pickup_address: string        // Corrected from pickup_location
  destination: string
  pickup_date: string          // YYYY-MM-DD format
  pickup_time: string          // HH:mm format
  vehicle_type: 'executive_sedan' | 'luxury_suv' | 'sprinter_van'
  customer_name: string
  customer_email: string
  customer_phone: string
  estimated_duration: number   // in minutes
  special_requests?: string    // Corrected from special_instructions
}

export interface BookingResponse {
  id: string                   // UUID - use for payments
  booking_code: string         // Human-readable (BLX-2025-00123) - display only
  status: string
  estimated_price: number      // In cents
  currency: string
  created_at: string
}

export interface PricingData {
  pricing: {
    executive_sedan: VehiclePricing
    luxury_suv: VehiclePricing
    sprinter_van: VehiclePricing
  }
  currency: string
}

export interface VehiclePricing {
  base_rate: number           // In cents
  per_hour_rate: number       // In cents
  airport_transfer_rate: number // In cents
  minimum_charge: number      // In cents
}

export interface PaymentIntentRequest {
  booking_id: string          // UUID (not booking_code)
}

export interface PaymentIntentResponse {
  id: string                  // pi_xxx
  client_secret: string
  amount: number              // In cents
  currency: string
  status: string
}

// Get auth token from localStorage (Supabase)
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const session = localStorage.getItem('sb-' + config.supabase.url.split('//')[1].split('.')[0] + '-auth-token')
    if (session) {
      const parsed = JSON.parse(session)
      return parsed.access_token
    }
  } catch (error) {
    console.warn('Failed to get auth token:', error)
  }
  
  return null
}

// Generic API request function with exact error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`
  const token = getAuthToken()
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }
  
  const requestOptions: RequestInit = {
    ...options,
    mode: 'cors',
    credentials: 'omit',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }
  
  try {
    const response = await fetch(url, requestOptions)
    
    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { error: 'Network error', message: `HTTP ${response.status}` }
      }
      
      throw new APIError(
        errorData.message || errorData.error || `HTTP ${response.status}`,
        response.status,
        errorData.code,
        errorData.details
      )
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    // Network or other errors
    throw new APIError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

// API functions matching exact backend specification
export const api = {
  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return apiRequest('/health')
  },

  // Get pricing data (all amounts in cents)
  async getPricing(): Promise<PricingData> {
    return apiRequest('/pricing')
  },

  // Create booking with exact field mapping
  async createBooking(data: BookingData): Promise<BookingResponse> {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get booking by UUID
  async getBooking(bookingId: string): Promise<BookingResponse> {
    return apiRequest(`/bookings/${bookingId}`)
  },

  // Create Stripe payment intent
  async createPaymentIntent(bookingId: string): Promise<PaymentIntentResponse> {
    return apiRequest('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId }),
    })
  },

  // Confirm payment (optional)
  async confirmPayment(paymentIntentId: string): Promise<{ status: string }> {
    return apiRequest('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ payment_intent_id: paymentIntentId }),
    })
  },

  // Get payment status (optional)
  async getPaymentStatus(paymentIntentId: string): Promise<{ status: string }> {
    return apiRequest(`/payments/${paymentIntentId}/status`)
  },
}

// Utility functions for amount conversion
export const amountUtils = {
  // Convert cents to dollars for display
  centsToDollars(cents: number): number {
    return cents / 100
  },

  // Convert dollars to cents for API
  dollarsToCents(dollars: number): number {
    return Math.round(dollars * 100)
  },

  // Format cents as currency string
  formatCents(cents: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100)
  },

  // Calculate estimated price based on pricing data
  calculatePrice(
    pricing: VehiclePricing,
    estimatedDuration: number,
    isAirportTransfer: boolean = false
  ): number {
    if (isAirportTransfer) {
      return Math.max(pricing.airport_transfer_rate, pricing.minimum_charge)
    }
    
    const hours = Math.ceil(estimatedDuration / 60)
    const totalPrice = pricing.base_rate + (pricing.per_hour_rate * hours)
    return Math.max(totalPrice, pricing.minimum_charge)
  }
}

// Form validation utilities
export const validation = {
  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate phone format (flexible)
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    const cleaned = phone.replace(/[\s\-\(\)]/g, '')
    return phoneRegex.test(cleaned)
  },

  // Validate date (not in past)
  isValidDate(dateString: string): boolean {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  },

  // Validate time format
  isValidTime(timeString: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(timeString)
  },

  // Validate vehicle type
  isValidVehicleType(vehicleType: string): vehicleType is BookingData['vehicle_type'] {
    return ['executive_sedan', 'luxury_suv', 'sprinter_van'].includes(vehicleType)
  }
}

// Error message mapping for user-friendly display
export const errorMessages: Record<string, string> = {
  // Validation errors (400)
  'invalid_pickup_address': 'Please enter a valid pickup address',
  'invalid_destination': 'Please enter a valid destination',
  'invalid_date': 'Please select a valid pickup date',
  'invalid_time': 'Please select a valid pickup time',
  'invalid_vehicle_type': 'Please select a valid vehicle type',
  'invalid_email': 'Please enter a valid email address',
  'invalid_phone': 'Please enter a valid phone number',
  
  // Auth errors (401)
  'unauthorized': 'Please sign in to continue',
  'invalid_token': 'Your session has expired. Please sign in again',
  
  // Not found errors (404)
  'booking_not_found': 'Booking not found',
  'payment_not_found': 'Payment not found',
  
  // Conflict errors (409)
  'booking_already_paid': 'This booking has already been paid',
  'booking_cancelled': 'This booking has been cancelled',
  
  // Server errors (500)
  'server_error': 'Something went wrong. Please try again',
  'payment_failed': 'Payment processing failed. Please try again',
  
  // Network errors
  'network_error': 'Network connection failed. Please check your internet connection',
}

// Get user-friendly error message
export function getErrorMessage(error: APIError | Error): string {
  if (error instanceof APIError && error.code && errorMessages[error.code]) {
    return errorMessages[error.code]
  }
  
  if (error.message && errorMessages[error.message]) {
    return errorMessages[error.message]
  }
  
  return error.message || 'An unexpected error occurred'
}
