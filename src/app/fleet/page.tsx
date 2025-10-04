'use client'

import React from 'react'

export default function FleetPage() {
  const bookVehicle = (vehicleType: string) => {
    window.location.href = `/book?vehicle=${vehicleType}`
  }

  const vehicles = [
    {
      id: 'executive_sedan',
      name: 'Executive Sedan',
      description: 'Perfect for business meetings and airport transfers',
      image: '/images/executive-sedan.jpg',
      passengers: '1-3',
      bags: '3-4',
      features: ['Leather seats', 'Wi-Fi', 'Phone chargers', 'Water bottles'],
      price: '$65/hour',
      popular: false
    },
    {
      id: 'luxury_suv',
      name: 'Luxury SUV',
      description: 'Spacious comfort for groups and families',
      image: '/images/luxury-suv.jpg',
      passengers: '1-6',
      bags: '6-8',
      features: ['Premium sound system', 'Climate control', 'Tinted windows', 'Refreshments'],
      price: '$95/hour',
      popular: true
    },
    {
      id: 'sprinter_van',
      name: 'Sprinter Van',
      description: 'Ultimate luxury for large groups and events',
      image: '/images/sprinter-van.jpg',
      passengers: '1-14',
      bags: '10+',
      features: ['Reclining seats', 'Entertainment system', 'Mini bar', 'Privacy partition'],
      price: '$120/hour',
      popular: false
    },
    {
      id: 'stretch_limo',
      name: 'Stretch Limousine',
      description: 'Ultimate luxury experience for special occasions',
      image: '/images/stretch-limo.jpg',
      passengers: '1-8',
      bags: '6-8',
      features: ['Premium bar', 'LED lighting', 'Sound system', 'Privacy partition'],
      price: '$150/hour',
      popular: false
    }
  ]

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
      `}</style>

      {/* Hero Section */}
      <div className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center fade-in">
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Vehicles</h2>
          <p className="text-xl text-gray-600">Choose the perfect vehicle for your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className={`card ${vehicle.popular ? 'ring-2 ring-blue-500 transform scale-105 relative' : ''}`}>
              {vehicle.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="relative h-64 bg-gray-200 rounded-lg mb-6 overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">👥</div>
                    <p className="text-sm font-medium text-blue-900">{vehicle.passengers} passengers</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl mb-1">🧳</div>
                    <p className="text-sm font-medium text-red-900">{vehicle.bags} bags</p>
                  </div>
                </div>

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

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">From {vehicle.price}</span>
                    <span className="text-sm text-gray-500">+ taxes & fees</span>
                  </div>
                  <button className="btn-primary w-full" onClick={() => bookVehicle(vehicle.id)}>
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
            Book your premium ride today and discover the BLuxA Transportation difference
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
