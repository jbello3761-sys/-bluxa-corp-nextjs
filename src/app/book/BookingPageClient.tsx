'use client'

import React, { useState } from 'react'
import { BookingForm } from '@/components/BookingForm'
import { useSession } from '@/components/auth/AuthProvider'
import { type BookingResponse } from '@/lib/api'

export function BookingPageClient() {
  const { user } = useSession()
  const [currentBooking, setCurrentBooking] = useState<BookingResponse | null>(null)

  const handleBookingSuccess = (booking: BookingResponse) => {
    setCurrentBooking(booking)
    // Redirect to payment page with booking ID
    window.location.href = `/payment?booking_id=${booking.id}`
  }

  return (
    <div className="space-y-8">
      {/* User Welcome Message */}
      {user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-blue-800">
              Welcome back, {user.user_metadata?.full_name || user.email}! 
              Your information has been pre-filled for faster booking.
            </span>
          </div>
        </div>
      )}

      {/* Booking Form */}
      <BookingForm 
        onBookingSuccess={handleBookingSuccess}
        className="max-w-none" // Remove max-width constraint for full-width form
      />

      {/* Current Booking Status */}
      {currentBooking && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            🎉 Booking Confirmed!
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-800">Booking Code:</span>
              <span className="ml-2 text-green-700">{currentBooking.booking_code}</span>
            </div>
            <div>
              <span className="font-medium text-green-800">Status:</span>
              <span className="ml-2 text-green-700 capitalize">{currentBooking.status}</span>
            </div>
            <div>
              <span className="font-medium text-green-800">Estimated Price:</span>
              <span className="ml-2 text-green-700">${currentBooking.estimated_price.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-medium text-green-800">Created:</span>
              <span className="ml-2 text-green-700">
                {new Date(currentBooking.created_at).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                // Here you would integrate with Stripe payment
                alert(`Proceeding to payment for booking ${currentBooking.booking_code}`)
              }}
              className="btn-primary"
            >
              Proceed to Payment
            </button>
            <button
              onClick={() => setCurrentBooking(null)}
              className="btn-secondary"
            >
              Book Another Ride
            </button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">📞 Call Us</h4>
            <p className="text-gray-600 text-sm mb-2">
              Speak with our customer service team for immediate assistance.
            </p>
            <a 
              href="tel:+15551234567" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              (555) 123-4567
            </a>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">✉️ Email Support</h4>
            <p className="text-gray-600 text-sm mb-2">
              Send us a message and we'll respond within 1 hour.
            </p>
            <a 
              href="mailto:support@bluxacorp.com" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              support@bluxacorp.com
            </a>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Booking Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Book at least 2 hours in advance for guaranteed availability</li>
            <li>• Airport transfers include 30 minutes of complimentary wait time</li>
            <li>• Special requests can be added in the instructions field</li>
            <li>• All vehicles are equipped with WiFi and phone chargers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
