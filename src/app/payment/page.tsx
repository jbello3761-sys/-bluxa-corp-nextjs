'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PaymentForm } from '@/components/payment/PaymentForm'
import { PaymentSuccess } from '@/components/payment/PaymentSuccess'
import { PaymentErrorBoundary } from '@/components/ErrorBoundary'
import { api, type BookingResponse } from '@/lib/api'
import { type PaymentIntent } from '@/lib/stripe'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [booking, setBooking] = useState<BookingResponse | null>(null)
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [paymentComplete, setPaymentComplete] = useState(false)

  // Get booking ID from URL parameters
  const bookingId = searchParams.get('booking_id')

  // Load booking data on component mount
  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        setError('No booking ID provided')
        setLoading(false)
        return
      }

      try {
        const bookingData = await api.getBooking(bookingId)
        setBooking(bookingData)
      } catch (error) {
        console.error('Failed to load booking:', error)
        setError(error instanceof Error ? error.message : 'Failed to load booking')
      } finally {
        setLoading(false)
      }
    }

    loadBooking()
  }, [bookingId])

  // Handle successful payment
  const handlePaymentSuccess = (intent: PaymentIntent) => {
    setPaymentIntent(intent)
    setPaymentComplete(true)
  }

  // Handle payment error
  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  // Handle cancel/go back
  const handleCancel = () => {
    if (booking) {
      router.push(`/book?booking_id=${booking.booking_id}`)
    } else {
      router.push('/book')
    }
  }

  // Handle new booking
  const handleNewBooking = () => {
    router.push('/book')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card">
            <div className="text-center py-8">
              <div className="loading-spinner mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Booking</h2>
              <p className="text-gray-600">Please wait while we retrieve your booking details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
              <p className="text-gray-600 mb-6">
                {error || 'We couldn\'t find the booking you\'re trying to pay for.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/book')}
                  className="btn-primary"
                >
                  Create New Booking
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="btn-secondary"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {paymentComplete ? 'Payment Complete' : 'Secure Payment'}
          </h1>
          <p className="text-gray-600">
            {paymentComplete 
              ? 'Your booking has been confirmed and payment processed successfully.'
              : 'Complete your luxury transportation booking with secure payment.'
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Booking Created</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                paymentComplete 
                  ? 'bg-green-500' 
                  : 'bg-blue-500'
              }`}>
                {paymentComplete ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium text-white">2</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Payment</span>
            </div>
            
            <div className={`w-16 h-0.5 ${paymentComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                paymentComplete 
                  ? 'bg-green-500' 
                  : 'bg-gray-300'
              }`}>
                {paymentComplete ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium text-gray-500">3</span>
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                paymentComplete ? 'text-gray-900' : 'text-gray-500'
              }`}>
                Confirmation
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {paymentComplete && paymentIntent ? (
          <PaymentErrorBoundary>
            <PaymentSuccess
              paymentIntent={paymentIntent}
              booking={booking}
              onNewBooking={handleNewBooking}
            />
          </PaymentErrorBoundary>
        ) : (
          <PaymentErrorBoundary>
            <PaymentForm
              booking={booking}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onCancel={handleCancel}
            />
          </PaymentErrorBoundary>
        )}
      </div>
    </div>
  )
}
