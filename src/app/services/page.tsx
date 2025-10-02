// src/app/services/page.tsx
'use client'

import React from 'react'

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: 'Airport Transfers',
      description: 'Reliable and punctual airport transportation with flight tracking',
      icon: '✈️',
      features: [
        'Flight tracking and monitoring',
        'Meet & greet service',
        'Luggage assistance',
        'Fixed pricing - no surge charges'
      ],
      price: 'From $75'
    },
    {
      id: 2,
      title: 'Corporate Transportation',
      description: 'Professional transportation solutions for business needs',
      icon: '🏢',
      features: [
        'Executive vehicles',
        'Professional chauffeurs',
        'Corporate billing',
        'Multi-stop itineraries'
      ],
      price: 'From $65/hour'
    },
    {
      id: 3,
      title: 'Special Events',
      description: 'Luxury transportation for weddings, galas, and celebrations',
      icon: '🎉',
      features: [
        'Wedding packages',
        'Red carpet service',
        'Decorated vehicles',
        'Group transportation'
      ],
      price: 'Custom pricing'
    },
    {
      id: 4,
      title: 'City Tours',
      description: 'Explore New York City in comfort with our guided tours',
      icon: '🗽',
      features: [
        'Knowledgeable guides',
        'Flexible itineraries',
        'Photo stops',
        'Refreshments included'
      ],
      price: 'From $120/hour'
    },
    {
      id: 5,
      title: 'Hourly Service',
      description: 'Flexible hourly transportation for multiple stops',
      icon: '⏰',
      features: [
        'Minimum 2-hour booking',
        'Wait time included',
        'Multiple destinations',
        'Personal chauffeur'
      ],
      price: 'From $65/hour'
    },
    {
      id: 6,
      title: 'Long Distance',
      description: 'Comfortable transportation for trips outside NYC',
      icon: '🛣️',
      features: [
        'Interstate travel',
        'Comfortable seating',
        'Rest stops included',
        'Competitive rates'
      ],
      price: 'Custom quotes'
    }
  ]

  const processSteps = [
    {
      step: 1,
      title: 'Book Online',
      description: 'Easy online booking with instant confirmation',
      icon: '📱'
    },
    {
      step: 2,
      title: 'Confirmation',
      description: 'Receive booking details and driver information',
      icon: '✅'
    },
    {
      step: 3,
      title: 'Pickup',
      description: 'Professional chauffeur arrives at your location',
      icon: '🚗'
    },
    {
      step: 4,
      title: 'Enjoy',
      description: 'Relax and enjoy your luxury transportation experience',
      icon: '🌟'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium Services
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              From airport transfers to special events, we provide comprehensive luxury transportation 
              services tailored to your needs in New York City and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">Professional transportation solutions for every occasion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="card hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                </div>
                <button 
                  onClick={() => window.location.href = '/book'}
                  className="btn-primary w-full"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
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
            {processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Areas */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Service Areas</h2>
            <p className="text-xl text-gray-600">We serve the greater New York metropolitan area</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏙️ Manhattan</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Midtown & Times Square</li>
                <li>• Financial District</li>
                <li>• Upper East & West Side</li>
                <li>• SoHo & Greenwich Village</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🌉 Outer Boroughs</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Brooklyn</li>
                <li>• Queens</li>
                <li>• The Bronx</li>
                <li>• Staten Island</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✈️ Airports</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• JFK International</li>
                <li>• LaGuardia Airport</li>
                <li>• Newark Airport</li>
                <li>• Westchester Airport</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-red-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Book Your Service?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the difference with BLuxA Corp's premium transportation services
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
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
