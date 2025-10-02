// src/app/pricing/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { api, amountUtils, type PricingData } from '@/lib/api'

export default function PricingPage() {
  const [pricing, setPricing] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVehicle, setSelectedVehicle] = useState<string>('executive_sedan')

  // Load pricing data
  useEffect(() => {
    const loadPricing = async () => {
      try {
        const pricingData = await api.getPricing()
        setPricing(pricingData)
      } catch (error) {
        console.error('Failed to load pricing:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPricing()
  }, [])

  const vehicleInfo = {
    executive_sedan: {
      name: 'Executive Sedan',
      description: 'Perfect for business meetings and airport transfers',
      capacity: '1-3 passengers',
      features: ['Leather seats', 'Wi-Fi', 'Phone chargers', 'Water bottles'],
      icon: '🚗'
    },
    luxury_suv: {
      name: 'Luxury SUV',
      description: 'Spacious comfort for groups and families',
      capacity: '1-6 passengers',
      features: ['Premium sound', 'Climate control', 'Tinted windows', 'Refreshments'],
      icon: '🚙'
    },
    sprinter_van: {
      name: 'Sprinter Van',
      description: 'Ultimate luxury for large groups and events',
      capacity: '1-14 passengers',
      features: ['Reclining seats', 'Entertainment', 'Mini bar', 'Privacy partition'],
      icon: '🚐'
    }
  }

  const additionalServices = [
    {
      service: 'Airport Transfer',
      description: 'Fixed rate to/from major airports',
      pricing: {
        executive_sedan: '$75',
        luxury_suv: '$115',
        sprinter_van: '$145'
      }
    },
    {
      service: 'Wedding Package',
      description: 'Special event transportation with decorations',
      pricing: {
        executive_sedan: '$200/event',
        luxury_suv: '$300/event',
        sprinter_van: '$450/event'
      }
    },
    {
      service: 'Corporate Account',
      description: 'Monthly billing with preferred rates',
      pricing: {
        executive_sedan: '10% discount',
        luxury_suv: '10% discount',
        sprinter_van: '10% discount'
      }
    },
    {
      service: 'Wait Time',
      description: 'Additional charges for extended waiting',
      pricing: {
        executive_sedan: '$25/15min',
        luxury_suv: '$35/15min',
        sprinter_van: '$45/15min'
      }
    },
    {
      service: 'Cancellation',
      description: 'Free cancellation up to 2 hours before pickup',
      pricing: {
        executive_sedan: 'Free',
        luxury_suv: 'Free',
        sprinter_van: 'Free'
      }
    },
    {
      service: 'Gratuity',
      description: 'Optional gratuity for exceptional service',
      pricing: {
        executive_sedan: '15-20%',
        luxury_suv: '15-20%',
        sprinter_van: '15-20%'
      }
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transparent Pricing
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              No hidden fees, no surge pricing. Our transparent rates ensure you know 
              exactly what you'll pay for premium luxury transportation.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Rates</h2>
          <p className="text-xl text-gray-600">Choose the perfect vehicle for your needs</p>
        </div>

        {pricing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {Object.entries(pricing.pricing).map(([vehicleType, rates]) => {
              const vehicle = vehicleInfo[vehicleType as keyof typeof vehicleInfo]
              const isPopular = vehicleType === 'luxury_suv'
              
              return (
                <div 
                  key={vehicleType}
                  className={`card relative ${isPopular ? 'ring-2 ring-blue-500 transform scale-105' : ''} hover:shadow-2xl transition-all duration-300`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{vehicle.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                    <p className="text-gray-600 mb-4">{vehicle.description}</p>
                    <p className="text-sm font-medium text-blue-600">{vehicle.capacity}</p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-4 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">
                        {amountUtils.formatCents(rates.per_hour_rate)}
                      </div>
                      <p className="text-gray-600">per hour</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Rate:</span>
                        <span className="font-medium">{amountUtils.formatCents(rates.base_rate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Airport Transfer:</span>
                        <span className="font-medium">{amountUtils.formatCents(rates.airport_transfer_rate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minimum Charge:</span>
                        <span className="font-medium">{amountUtils.formatCents(rates.minimum_charge)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => window.location.href = `/book?vehicle=${vehicleType}`}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300 ${
                      isPopular 
                        ? 'btn-primary' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Book {vehicle.name}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Additional Services */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Additional Services</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Service</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Executive Sedan</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Luxury SUV</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Sprinter Van</th>
                </tr>
              </thead>
              <tbody>
                {additionalServices.map((service, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{service.service}</p>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 font-medium text-gray-700">
                      {service.pricing.executive_sedan}
                    </td>
                    <td className="text-center py-4 px-4 font-medium text-gray-700">
                      {service.pricing.luxury_suv}
                    </td>
                    <td className="text-center py-4 px-4 font-medium text-gray-700">
                      {service.pricing.sprinter_van}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pricing Notes */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Important Pricing Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">💰 No Hidden Fees</h4>
              <p className="text-gray-600 text-sm">
                Our quoted prices include all standard fees. Additional charges only apply for 
                special requests, extended wait times, or premium services.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">🚫 No Surge Pricing</h4>
              <p className="text-gray-600 text-sm">
                Unlike ride-sharing services, our rates remain consistent regardless of demand, 
                weather, or time of day. You pay the same fair price every time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">⏰ Minimum Booking</h4>
              <p className="text-gray-600 text-sm">
                Hourly services have a 2-hour minimum. Airport transfers and point-to-point 
                trips are charged at flat rates with no minimum requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">💳 Payment Options</h4>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, corporate accounts, and cash payments. 
                Gratuity can be added to your card or given directly to your chauffeur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-red-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Book?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get an instant quote and book your luxury transportation today
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
              Custom Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
