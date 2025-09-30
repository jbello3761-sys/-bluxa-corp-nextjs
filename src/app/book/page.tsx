import { Metadata } from 'next'
import { BookingPageClient } from './BookingPageClient'
import { BookingErrorBoundary } from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'Book Your Ride - BLuxA Corp',
  description: 'Book premium luxury transportation in New York City. Executive sedans, luxury SUVs, and sprinter vans available 24/7.',
  keywords: 'book ride, luxury transportation, NYC booking, executive sedan booking, luxury SUV rental',
}

// Server component shell for the booking page
export default function BookPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-red-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Book Your Premium Ride
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Experience luxury transportation with professional drivers and premium vehicles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Professional Drivers
            </div>
            <div className="flex items-center text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Always On Time
            </div>
            <div className="flex items-center text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Premium Experience
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <BookingErrorBoundary>
            <BookingPageClient />
          </BookingErrorBoundary>
        </div>
      </section>

      {/* Vehicle Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Choose Your Vehicle</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Executive Sedan</h3>
              <p className="text-gray-600 mb-4">
                Perfect for business meetings and airport transfers. Comfortable seating for up to 3 passengers.
              </p>
              <div className="text-blue-600 font-semibold">Starting at $65/hour</div>
            </div>
            
            <div className="feature-card">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Luxury SUV</h3>
              <p className="text-gray-600 mb-4">
                Spacious and elegant for special events and group travel. Seating for up to 6 passengers.
              </p>
              <div className="text-green-600 font-semibold">Starting at $95/hour</div>
            </div>
            
            <div className="feature-card">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sprinter Van</h3>
              <p className="text-gray-600 mb-4">
                Perfect for large groups and corporate events. Comfortable seating for up to 14 passengers.
              </p>
              <div className="text-yellow-600 font-semibold">Starting at $120/hour</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
