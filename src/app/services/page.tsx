'use client'

import React from 'react'

export default function ServicesPage() {
  const bookService = (serviceType: string) => {
    window.location.href = `/book?service=${serviceType}`
  }

  return (
    <div className="bg-gray-50">
      <style jsx>{`
        .btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #dc2626 100%);
          color: white;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #b91c1c 100%);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }
        
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          padding: 32px;
          border: 1px solid #f3f4f6;
          transition: all 0.3s ease;
        }
        
        .card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #dc2626 100%);
        }
        
        .fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .service-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1rem;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium Services
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              From airport transfers to special events, we provide comprehensive luxury transportation 
              solutions tailored to your needs in New York City.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">Professional transportation for every occasion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Airport Transfers */}
          <div className="card text-center">
            <div className="service-icon bg-blue-100 text-blue-600">
              ✈️
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Airport Transfers</h3>
            <p className="text-gray-600 mb-6">
              Reliable and punctual airport transportation to and from all NYC airports. 
              Flight tracking ensures we're always on time.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                JFK, LaGuardia, Newark
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Flight tracking
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Meet & greet service
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-4">From $75</div>
            <button className="btn-primary w-full" onClick={() => bookService('airport_transfer')}>
              Book Airport Transfer
            </button>
          </div>

          {/* Corporate Travel */}
          <div className="card text-center">
            <div className="service-icon bg-red-100 text-red-600">
              💼
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Corporate Travel</h3>
            <p className="text-gray-600 mb-6">
              Professional transportation for business meetings, conferences, and corporate events. 
              Impress clients with our executive service.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Executive vehicles
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Professional chauffeurs
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Corporate accounts
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-4">From $65/hr</div>
            <button className="btn-primary w-full" onClick={() => bookService('corporate')}>
              Book Corporate Travel
            </button>
          </div>

          {/* Special Events */}
          <div className="card text-center">
            <div className="service-icon bg-purple-100 text-purple-600">
              🎉
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Special Events</h3>
            <p className="text-gray-600 mb-6">
              Make your special occasions memorable with our luxury transportation. 
              Perfect for weddings, proms, and celebrations.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Weddings & proms
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Red carpet service
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Decorations available
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-4">From $150</div>
            <button className="btn-primary w-full" onClick={() => bookService('special_events')}>
              Book Event Service
            </button>
          </div>

          {/* City Tours */}
          <div className="card text-center">
            <div className="service-icon bg-green-100 text-green-600">
              🗽
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">City Tours</h3>
            <p className="text-gray-600 mb-6">
              Explore NYC in comfort and style with our guided city tours. 
              Perfect for tourists and visitors wanting the VIP experience.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Custom itineraries
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Knowledgeable guides
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Photo opportunities
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-4">From $95/hr</div>
            <button className="btn-primary w-full" onClick={() => bookService('city_tours')}>
              Book City Tour
            </button>
          </div>

          {/* Hourly Service */}
          <div className="card text-center">
            <div className="service-icon bg-yellow-100 text-yellow-600">
              ⏰
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Hourly Service</h3>
            <p className="text-gray-600 mb-6">
              Flexible hourly transportation for multiple stops, shopping trips, 
              or when you need a vehicle at your disposal.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Minimum 2 hours
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Multiple stops
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Wait time included
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-4">From $65/hr</div>
            <button className="btn-primary w-full" onClick={() => bookService('hourly')}>
              Book Hourly Service
            </button>
          </div>

          {/* Long Distance */}
          <div className="card text-center">
            <div className="service-icon bg-indigo-100 text-indigo-600">
              🛣️
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Long Distance</h3>
            <p className="text-gray-600 mb-6">
              Comfortable long-distance transportation to destinations outside NYC. 
              Perfect for business trips and weekend getaways.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Tri-state area
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Comfortable seating
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Refreshments included
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-4">Custom Quote</div>
            <button className="btn-primary w-full" onClick={() => bookService('long_distance')}>
              Get Quote
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to luxury transportation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Online</h3>
              <p className="text-gray-600">Choose your service, select vehicle, and provide trip details</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmation</h3>
              <p className="text-gray-600">Receive instant confirmation with driver and vehicle details</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pickup</h3>
              <p className="text-gray-600">Professional chauffeur arrives on time at your location</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enjoy</h3>
              <p className="text-gray-600">Relax and enjoy your luxury transportation experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Areas Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Service Areas</h2>
            <p className="text-xl text-gray-600">We serve the entire New York metropolitan area</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🏙️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manhattan</h3>
              <p className="text-gray-600">All neighborhoods including Midtown, Financial District, Upper East/West Side</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🌉</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Outer Boroughs</h3>
              <p className="text-gray-600">Brooklyn, Queens, Bronx, and Staten Island with full coverage</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">✈️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Airports</h3>
              <p className="text-gray-600">JFK, LaGuardia, Newark, and Westchester County Airport</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">New Jersey</h3>
              <p className="text-gray-600">Jersey City, Hoboken, and surrounding areas</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🏡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Westchester</h3>
              <p className="text-gray-600">White Plains, Yonkers, and Westchester County</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Long Island</h3>
              <p className="text-gray-600">Nassau and Suffolk counties including the Hamptons</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-red-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Book Your Service?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the difference with BLuxA Transportation's premium transportation services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/book'}
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Book Now
            </button>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Get Custom Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}