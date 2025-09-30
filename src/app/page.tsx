// BLuxA Corp Homepage - Dynamic Image Carousel
import { DynamicCarousel } from '@/components/DynamicCarousel'

export default function Home() {
  return (
    <div>
      {/* Hero Section with Dynamic Carousel */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <DynamicCarousel />
        
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          
          <div className="animate-fade-in">
            <h1 className="hero-text mb-6">
              <span className="block text-white">Luxury Transportation</span>
              <span className="block text-yellow-400">Redefined</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              Experience premium transportation services with our professional drivers 
              and luxury fleet in New York City.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/book" className="btn-primary text-lg px-8 py-4">
                Book Now
              </a>
              <a href="tel:+15551234567" className="btn-secondary text-lg px-8 py-4 bg-white bg-opacity-20 backdrop-blur-sm border-white text-white hover:bg-white hover:text-gray-900">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section - Now with backend integration */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Get an instant quote and book your premium ride in seconds
            </p>
          </div>
          {/* Quick booking form - simplified for homepage */}
          <div className="card">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Get Quick Quote</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter pickup address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter destination"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date
                </label>
                <input
                  type="date"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Time
                </label>
                <input
                  type="time"
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select className="input-field">
                  <option>Executive Sedan</option>
                  <option>Luxury SUV</option>
                  <option>Sprinter Van</option>
                </select>
              </div>
            </div>
            <div className="mt-8 text-center">
              <a href="/book" className="btn-primary text-lg px-12 py-4 inline-block">
                Get Full Quote & Book
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section - Preserving existing design */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Why Choose BLuxA Corp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safety First</h3>
              <p className="text-gray-600">
                Professional licensed drivers with extensive background checks and safety training.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Always On Time</h3>
              <p className="text-gray-600">
                Punctual service with real-time tracking and proactive communication.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium Experience</h3>
              <p className="text-gray-600">
                Luxury vehicles with premium amenities for the ultimate comfort and style.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
