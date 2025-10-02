// src/app/fleet/page.tsx
'use client'

import React from 'react'

export default function FleetPage() {
  const vehicles = [
    {
      id: 1,
      name: 'Executive Sedan',
      type: 'executive_sedan',
      description: 'Perfect for business meetings and airport transfers',
      features: ['Leather seats', 'Wi-Fi', 'Phone chargers', 'Water bottles'],
      capacity: '1-3 passengers',
      luggage: '3-4 bags',
      price: 'From $65/hour',
      image: '/api/placeholder/400/300'
    },
    {
      id: 2,
      name: 'Luxury SUV',
      type: 'luxury_suv',
      description: 'Spacious comfort for groups and families',
      features: ['Premium sound system', 'Climate control', 'Tinted windows', 'Refreshments'],
      capacity: '1-6 passengers',
      luggage: '6-8 bags',
      price: 'From $95/hour',
      image: '/api/placeholder/400/300'
    },
    {
      id: 3,
      name: 'Sprinter Van',
      type: 'sprinter_van',
      description: 'Ultimate luxury for large groups and events',
      features: ['Reclining seats', 'Entertainment system', 'Mini bar', 'Privacy partition'],
      capacity: '1-14 passengers',
      luggage: '10+ bags',
      price: 'From $120/hour',
      image: '/api/placeholder/400/300'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our Premium Fleet
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Experience luxury and comfort with our meticulously maintained fleet of premium vehicles, 
              each equipped with modern amenities for your ultimate travel experience.
            </p>
          </div>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="card hover:shadow-2xl transition-all duration-300">
              {/* Vehicle Image */}
              <div className="relative h-64 bg-gray-200 rounded-lg mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-red-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🚗</div>
                    <p className="text-gray-600 font-medium">{vehicle.name}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>

                {/* Capacity & Luggage */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">👥</div>
                    <p className="text-sm font-medium text-blue-900">{vehicle.capacity}</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl mb-1">🧳</div>
                    <p className="text-sm font-medium text-red-900">{vehicle.luggage}</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {vehicle.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Book Button */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">{vehicle.price}</span>
                    <span className="text-sm text-gray-500">+ taxes & fees</span>
                  </div>
                  <button 
                    onClick={() => window.location.href = `/book?vehicle=${vehicle.type}`}
                    className="btn-primary w-full"
                  >
                    Book This Vehicle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fleet Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Fleet?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every vehicle in our fleet is maintained to the highest standards and equipped with premium amenities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">Regular maintenance and safety inspections ensure your security</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pristine Condition</h3>
              <p className="text-gray-600">Detailed cleaning and maintenance after every ride</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Amenities</h3>
              <p className="text-gray-600">Wi-Fi, charging ports, and entertainment systems</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Luxury Experience</h3>
              <p className="text-gray-600">Premium materials and attention to every detail</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-red-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Experience Luxury?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your premium ride today and discover the BLuxA Corp difference
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
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
