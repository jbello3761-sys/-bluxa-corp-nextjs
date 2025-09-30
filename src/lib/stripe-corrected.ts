import { loadStripe, Stripe } from '@stripe/stripe-js'
import { config } from './config'

// Stripe instance - singleton pattern
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(config.stripe.publishableKey)
  }
  return stripePromise
}

// Payment-related types matching backend specification
export interface PaymentIntent {
  id: string                  // pi_xxx format
  client_secret: string
  amount: number              // In cents
  currency: string            // "usd"
  status: string
}

export interface PaymentResult {
  success: boolean
  paymentIntent?: PaymentIntent
  error?: string
}

// Stripe API functions that call your backend (exact specification)
export const stripeAPI = {
  // Create payment intent via your backend
  async createPaymentIntent(bookingId: string): Promise<PaymentIntent> {
    const token = getAuthToken()
    
    const response = await fetch(`${config.apiUrl}/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ booking_id: bookingId }), // Uses UUID, not booking_code
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || error.error || 'Failed to create payment intent')
    }

    return response.json()
  },

  // Confirm payment completion via your backend (optional)
  async confirmPayment(paymentIntentId: string): Promise<{ status: string }> {
    const token = getAuthToken()
    
    const response = await fetch(`${config.apiUrl}/payments/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ payment_intent_id: paymentIntentId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || error.error || 'Failed to confirm payment')
    }

    return response.json()
  },

  // Get payment status (optional)
  async getPaymentStatus(paymentIntentId: string): Promise<{ status: string }> {
    const token = getAuthToken()
    
    const response = await fetch(`${config.apiUrl}/payments/${paymentIntentId}/status`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || error.error || 'Failed to get payment status')
    }

    return response.json()
  }
}

// Get auth token from Supabase localStorage
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

// Utility functions for payment formatting (amounts in cents)
export const paymentUtils = {
  // Format amount for display (backend sends cents)
  formatAmount(amountInCents: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountInCents / 100)
  },

  // Convert dollars to cents for backend
  dollarsToCents(dollars: number): number {
    return Math.round(dollars * 100)
  },

  // Convert cents to dollars for display
  centsToDollars(cents: number): number {
    return cents / 100
  },

  // Validate card number format (basic)
  isValidCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '')
    return /^\d{13,19}$/.test(cleaned)
  },

  // Format card number with spaces
  formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '')
    const groups = cleaned.match(/.{1,4}/g) || []
    return groups.join(' ')
  }
}

// Error handling for Stripe
export class StripeError extends Error {
  constructor(
    message: string,
    public code?: string,
    public type?: string
  ) {
    super(message)
    this.name = 'StripeError'
  }
}

// Common Stripe error messages with user-friendly translations
export const stripeErrorMessages: Record<string, string> = {
  'card_declined': 'Your card was declined. Please try a different payment method.',
  'expired_card': 'Your card has expired. Please use a different card.',
  'incorrect_cvc': 'Your card\'s security code is incorrect. Please check and try again.',
  'processing_error': 'An error occurred while processing your card. Please try again.',
  'incorrect_number': 'Your card number is incorrect. Please check and try again.',
  'invalid_expiry_month': 'Your card\'s expiration month is invalid.',
  'invalid_expiry_year': 'Your card\'s expiration year is invalid.',
  'invalid_cvc': 'Your card\'s security code is invalid.',
  'insufficient_funds': 'Your card has insufficient funds.',
  'withdrawal_count_limit_exceeded': 'You have exceeded the balance or credit limit on your card.',
  'charge_exceeds_source_limit': 'The payment exceeds the maximum amount for your card.',
  'instant_payouts_unsupported': 'Your debit card does not support instant payouts.',
  'duplicate_transaction': 'A payment with identical amount and details was recently submitted.',
  'fraudulent': 'The payment has been declined as it appears to be fraudulent.',
  'generic_decline': 'Your card was declined. Please contact your bank for more information.',
  'invalid_account': 'The account number provided is invalid.',
  'lost_card': 'The payment has been declined because the card is reported lost.',
  'merchant_blacklist': 'The payment has been declined by your bank.',
  'new_account_information_available': 'Your card was declined. Please contact your bank to update your account information.',
  'no_action_taken': 'The payment could not be processed. Please try again.',
  'not_permitted': 'The payment is not permitted by your bank.',
  'pickup_card': 'Your card cannot be used to make this payment. Please contact your bank.',
  'restricted_card': 'Your card cannot be used to make this payment.',
  'revocation_of_all_authorizations': 'Your card was declined. Please contact your bank for more information.',
  'revocation_of_authorization': 'Your card was declined. Please contact your bank for more information.',
  'security_violation': 'Your card was declined due to a security issue.',
  'service_not_allowed': 'Your card does not support this type of purchase.',
  'stolen_card': 'The payment has been declined because the card is reported stolen.',
  'stop_payment_order': 'The payment has been declined by your bank.',
  'testmode_decline': 'Your card was declined (test mode).',
  'transaction_not_allowed': 'Your card does not support this type of purchase.',
  'try_again_later': 'The payment could not be processed. Please try again later.',
  'withdrawal_count_limit_exceeded': 'You have made too many transactions. Please try again later.'
}

// Get user-friendly error message
export function getStripeErrorMessage(error: any): string {
  if (error?.code && stripeErrorMessages[error.code]) {
    return stripeErrorMessages[error.code]
  }
  
  if (error?.message) {
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}

// Test card numbers for development
export const testCards = {
  success: '4242424242424242',
  declined: '4000000000000002',
  insufficientFunds: '4000000000009995',
  requiresAuth: '4000002500003155',
  
  // Get formatted test card info
  getTestCardInfo() {
    return {
      success: {
        number: '4242 4242 4242 4242',
        description: 'Successful payment',
        expiry: 'Any future date',
        cvc: 'Any 3 digits'
      },
      declined: {
        number: '4000 0000 0000 0002',
        description: 'Generic decline',
        expiry: 'Any future date',
        cvc: 'Any 3 digits'
      },
      insufficientFunds: {
        number: '4000 0000 0000 9995',
        description: 'Insufficient funds',
        expiry: 'Any future date',
        cvc: 'Any 3 digits'
      },
      requiresAuth: {
        number: '4000 0025 0000 3155',
        description: 'Requires 3D Secure',
        expiry: 'Any future date',
        cvc: 'Any 3 digits'
      }
    }
  }
}
