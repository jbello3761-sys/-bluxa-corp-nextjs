'use client'

import React, { useState, useEffect } from 'react'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { getStripe, stripeAPI, paymentUtils, getStripeErrorMessage, type PaymentIntent } from '@/lib/stripe'
import { useSession } from '@/components/auth/AuthProvider'
import { type BookingResponse } from '@/lib/api'
import { SkeletonPaymentForm, LoadingButton } from '@/components/LoadingStates'

// Stripe Elements styling to match your design
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#374151', // text-gray-700
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': {
        color: '#9CA3AF', // text-gray-400
      },
      padding: '12px',
    },
    invalid: {
      color: '#EF4444', // text-red-500
      iconColor: '#EF4444',
    },
  },
  hidePostalCode: false,
}

interface PaymentFormProps {
  booking: BookingResponse
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void
  onPaymentError: (error: string) => void
  onCancel: () => void
}

// Inner component that uses Stripe hooks
function PaymentFormInner({ booking, onPaymentSuccess, onPaymentError, onCancel }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useSession()
  
  const [loading, setLoading] = useState(false)
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null)
  const [error, setError] = useState<string>('')
  const [cardComplete, setCardComplete] = useState(false)
  const [stripeLoading, setStripeLoading] = useState(true)
  const [billingDetails, setBillingDetails] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  })

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setStripeLoading(true)
        const intent = await stripeAPI.createPaymentIntent(booking.id)
        setPaymentIntent(intent)
      } catch (error) {
        console.error('Failed to create payment intent:', error)
        setError(error instanceof Error ? error.message : 'Failed to create payment intent')
        onPaymentError(error instanceof Error ? error.message : 'Failed to create payment intent')
      } finally {
        setStripeLoading(false)
      }
    }

    createPaymentIntent()
  }, [booking.id, onPaymentError])

  // Handle card element changes
  const handleCardChange = (event: any) => {
    setCardComplete(event.complete)
    if (event.error) {
      setError(getStripeErrorMessage(event.error))
    } else {
      setError('')
    }
  }

  // Handle billing details changes
  const handleBillingChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setBillingDetails(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }))
    } else {
      setBillingDetails(prev => ({ ...prev, [field]: value }))
    }
  }

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !paymentIntent) {
      setError('Payment system not ready. Please try again.')
      return
    }

    if (!cardComplete) {
      setError('Please complete your card information.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              phone: billingDetails.phone,
              address: billingDetails.address,
            },
          },
        }
      )

      if (stripeError) {
        setError(getStripeErrorMessage(stripeError))
        return
      }

      if (confirmedIntent && confirmedIntent.status === 'succeeded') {
        // Notify backend of successful payment
        try {
          await stripeAPI.confirmPayment(confirmedIntent.id)
        } catch (backendError) {
          console.warn('Backend confirmation failed:', backendError)
          // Continue anyway since Stripe payment succeeded
        }

        // Call success callback
        onPaymentSuccess({
          id: confirmedIntent.id,
          client_secret: confirmedIntent.client_secret,
          amount: confirmedIntent.amount,
          currency: confirmedIntent.currency,
          status: confirmedIntent.status,
        })
      } else {
        setError('Payment was not completed. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!paymentIntent && loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing secure payment...</p>
        </div>
      </div>
    )
  }

  // Show skeleton loader while Stripe is initializing
  if (stripeLoading) {
    return <SkeletonPaymentForm />
  }

  if (!paymentIntent) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Initialization Failed</h3>
          <p className="text-gray-600 mb-4">We couldn't set up your payment. Please try again.</p>
          <button onClick={onCancel} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
        <p className="text-gray-600">
          Secure payment powered by Stripe. Your card information is encrypted and never stored.
        </p>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking Code:</span>
              <span className="font-medium">{booking.booking_code}</span>
            </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">{paymentUtils.formatAmount(paymentIntent.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium capitalize">{booking.status}</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Billing Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={billingDetails.name}
                onChange={(e) => handleBillingChange('name', e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={billingDetails.email}
                onChange={(e) => handleBillingChange('email', e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={billingDetails.phone}
                onChange={(e) => handleBillingChange('phone', e.target.value)}
                className="input-field"
                placeholder="(555) 123-4567"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                value={billingDetails.address.line1}
                onChange={(e) => handleBillingChange('address.line1', e.target.value)}
                className="input-field"
                placeholder="Street address"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={billingDetails.address.city}
                onChange={(e) => handleBillingChange('address.city', e.target.value)}
                className="input-field"
                placeholder="City"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={billingDetails.address.state}
                onChange={(e) => handleBillingChange('address.state', e.target.value)}
                className="input-field"
                placeholder="State"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={billingDetails.address.postal_code}
                onChange={(e) => handleBillingChange('address.postal_code', e.target.value)}
                className="input-field"
                placeholder="ZIP Code"
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Card Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Information</h3>
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <CardElement
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2zm10-12V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Secure Payment</p>
              <p>Your payment is protected by 256-bit SSL encryption and processed securely by Stripe.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <LoadingButton
            type="submit"
            loading={loading}
            disabled={!cardComplete || !stripe}
            className="flex-1"
          >
            {loading ? 'Processing Payment...' : `Pay ${paymentUtils.formatAmount(paymentIntent.amount)}`}
          </LoadingButton>
        </div>
      </form>
    </div>
  )
}

// Main component with Stripe Elements provider
export function PaymentForm(props: PaymentFormProps) {
  const stripePromise = getStripe()

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner {...props} />
    </Elements>
  )
}
