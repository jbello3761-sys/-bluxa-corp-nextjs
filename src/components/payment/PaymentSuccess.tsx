'use client'

import React, { useState, useEffect } from 'react'
import { paymentUtils, stripeAPI, type PaymentIntent } from '@/lib/stripe'
import { type BookingResponse } from '@/lib/api'

interface PaymentSuccessProps {
  paymentIntent: PaymentIntent
  booking: BookingResponse
  onNewBooking: () => void
}

export function PaymentSuccess({ paymentIntent, booking, onNewBooking }: PaymentSuccessProps) {
  const [bookingStatus, setBookingStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch updated booking status after payment
  useEffect(() => {
    const fetchBookingStatus = async () => {
      try {
        const status = await stripeAPI.getPaymentStatus(paymentIntent.id)
        setBookingStatus(status)
      } catch (error) {
        console.error('Failed to fetch booking status:', error)
        // Use original booking data as fallback
        setBookingStatus({ status: 'confirmed', booking })
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay to allow backend processing
    const timer = setTimeout(fetchBookingStatus, 2000)
    return () => clearTimeout(timer)
  }, [paymentIntent.id, booking])

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Payment</h3>
          <p className="text-gray-600">Please wait while we confirm your booking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="card text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your luxury transportation has been booked and confirmed.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium">
            Confirmation details have been sent to your email address.
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Booking Code</span>
              <p className="text-lg font-semibold text-gray-900">{booking.booking_code}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Status</span>
              <p className="text-lg font-semibold text-green-600 capitalize">
                {bookingStatus?.status || booking.status}
              </p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Payment Amount</span>
              <p className="text-lg font-semibold text-gray-900">
                {paymentUtils.formatAmount(paymentIntent.amount)}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Payment ID</span>
              <p className="text-sm font-mono text-gray-700">{paymentIntent.id}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Payment Method</span>
              <p className="text-sm text-gray-700">Card ending in ****</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Transaction Date</span>
              <p className="text-sm text-gray-700">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happens Next?</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <span className="text-sm font-semibold text-blue-600">1</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Confirmation Email</h3>
              <p className="text-sm text-gray-600">
                You'll receive a detailed confirmation email with your booking information and driver details.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <span className="text-sm font-semibold text-blue-600">2</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Driver Assignment</h3>
              <p className="text-sm text-gray-600">
                A professional driver will be assigned to your booking and you'll receive their contact information.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <span className="text-sm font-semibold text-blue-600">3</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Pre-Arrival Notification</h3>
              <p className="text-sm text-gray-600">
                You'll receive a notification 30 minutes before your scheduled pickup time.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <span className="text-sm font-semibold text-blue-600">4</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Enjoy Your Ride</h3>
              <p className="text-sm text-gray-600">
                Your luxury vehicle will arrive on time for a premium transportation experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Customer Support</h3>
            <p className="text-sm text-gray-600 mb-2">
              Available 24/7 for any questions or changes to your booking.
            </p>
            <a 
              href="tel:+15551234567" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              (555) 123-4567
            </a>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-2">
              Send us your booking ID for quick assistance.
            </p>
            <a 
              href={`mailto:support@bluxacorp.com?subject=Booking ${booking.booking_code}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              support@bluxacorp.com
            </a>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onNewBooking}
          className="btn-primary flex-1"
        >
          Book Another Ride
        </button>
        
        <a
          href="/"
          className="btn-secondary flex-1 text-center"
        >
          Return to Home
        </a>
        
        <button
          onClick={() => window.print()}
          className="btn-secondary flex-1"
        >
          Print Receipt
        </button>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .btn-primary, .btn-secondary {
            display: none;
          }
          .card {
            box-shadow: none;
            border: 1px solid #e5e7eb;
          }
        }
      `}</style>
    </div>
  )
}
