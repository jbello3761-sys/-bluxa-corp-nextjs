'use client'

import React from 'react'

export default function PricingPage() {
  const bookVehicle = (vehicleType: string) => {
    window.location.href = `/book?vehicle=${vehicleType}`
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
        
        .pricing-card {
          position: relative;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          padding: 40px;
          border: 2px solid #f3f4f6;
          transition: all 0.3s ease;
        }
        
        .pricing-card:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transform: translateY(-4px);
        }
        
        .pricing-card.featured {
          border-color: #2563eb;
          transform: scale(1.05);
        }
        
        .pricing-card.featured::before {
          content: 'Most Popular';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #2563eb 0%, #dc2626 100%);
          color: white;
          padding: 8px 24px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transparent Pricing
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              No hidden fees, no surprises. Our competitive rates include all taxes and gratuities 
              for a truly transparent luxury transportation experience.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Rates</h2>
          <p className="text-xl text-gray-600">Choose the perfect vehicle for your budget and needs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Executive Sedan */}
          <div className="pricing-card">
            <div className="text-center mb-8">
              <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/executive-sedan.jpg" 
                  alt="Executive Sedan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Executive Sedan</h3>
              <p className="text-gray-600">Perfect for business and airport transfers</p>
            </div>

            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">Dynamic</div>
              <div className="text-gray-600">pricing based on distance & route</div>
              <div className="text-sm text-gray-500 mt-1">Transparent calculation</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">1-3 passengers</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">3-4 bags</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">Leather seats</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">Wi-Fi & charging</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">Water bottles</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-gray-900">Airport Transfer</div>
                <div className="text-2xl font-bold text-blue-600">From $75</div>
                <div className="text-sm text-gray-500">calculated by distance</div>
              </div>
              <button className="btn-primary w-full" onClick={() => bookVehicle('executive_sedan')}>
                Book Executive Sedan
              </button>
            </div>
          </div>

          {/* Luxury SUV */}
          <div className="pricing-card featured">
            <div className="text-center mb-8">
              <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/luxury-suv.jpg" 
                  alt="Luxury SUV" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Luxury SUV</h3>
              <p className="text-gray-600">Spacious comfort for groups and families</p>
            </div>

            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">Dynamic</div>
              <div className="text-gray-600">pricing based on distance & route</div>
              <div className="text-sm text-gray-500 mt-1">Transparent calculation</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">1-6 passengers</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">6-8 bags</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">Premium sound system</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">Climate control</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">Refreshments</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-gray-900">Airport Transfer</div>
                <div className="text-2xl font-bold text-blue-600">From $105</div>
                <div className="text-sm text-gray-500">calculated by distance</div>
              </div>
              <button className="btn-primary w-full" onClick={() => bookVehicle('luxury_suv')}>
                Book Luxury SUV
              </button>
            </div>
          </div>

          {/* Sprinter Van */}
          <div className="pricing-card">
            <div className="text-center mb-8">
              <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/sprinter-van.jpg" 
                  alt="Sprinter Van" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sprinter Van</h3>
              <p className="text-gray-600">Ultimate luxury for large groups</p>
            </div>

            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">Dynamic</div>
              <div className="text-gray-600">pricing based on distance & route</div>
              <div className="text-sm text-gray-500 mt-1">Transparent calculation</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">1-14 passengers</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">10+ bags</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">Reclining seats</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">Entertainment system</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">•</span>
                <span className="text-gray-700">Mini bar</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-gray-900">Airport Transfer</div>
                <div className="text-2xl font-bold text-blue-600">From $130</div>
                <div className="text-sm text-gray-500">calculated by distance</div>
              </div>
              <button className="btn-primary w-full" onClick={() => bookVehicle('sprinter_van')}>
                Book Sprinter Van
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Additional Services</h2>
            <p className="text-xl text-gray-600">Enhance your experience with our premium add-ons</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Airport Meet & Greet</td>
                  <td className="px-6 py-4 text-gray-600">Chauffeur meets you at baggage claim with name sign</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">$25</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center">
                      <div className="w-16 h-12 mr-4 rounded-lg overflow-hidden">
                        <img 
                          src="/images/stretch-limo.jpg" 
                          alt="Wedding Package - Stretch Limo" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      Wedding Package
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">Decorations, red carpet service, and champagne</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">$150</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Corporate Account</td>
                  <td className="px-6 py-4 text-gray-600">Monthly billing and dedicated account manager</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">Free</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Wait Time</td>
                  <td className="px-6 py-4 text-gray-600">Additional waiting time beyond included 15 minutes</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">$2/min</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Cancellation</td>
                  <td className="px-6 py-4 text-gray-600">Free cancellation up to 2 hours before pickup</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">Free</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Gratuity</td>
                  <td className="px-6 py-4 text-gray-600">Included in all rates - no additional tipping required</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">Included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pricing Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What's Included</h2>
            <p className="text-xl text-gray-600">Every ride includes these premium features at no extra cost</p>
            
            {/* Fleet Showcase */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="relative h-20 rounded-lg overflow-hidden">
                <img 
                  src="/images/executive-sedan.jpg" 
                  alt="Executive Sedan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-20 rounded-lg overflow-hidden">
                <img 
                  src="/images/luxury-suv.jpg" 
                  alt="Luxury SUV" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-20 rounded-lg overflow-hidden">
                <img 
                  src="/images/sprinter-van.jpg" 
                  alt="Sprinter Van" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-20 rounded-lg overflow-hidden">
                <img 
                  src="/images/stretch-limo.jpg" 
                  alt="Stretch Limo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">•</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Taxes & Fees</h3>
              <p className="text-gray-600">No hidden charges or surprise fees</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">$</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gratuity Included</h3>
              <p className="text-gray-600">20% gratuity included in all rates</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">GPS</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Track your vehicle in real-time</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">INS</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Insurance</h3>
              <p className="text-gray-600">Comprehensive coverage included</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing FAQ</h2>
            <p className="text-xl text-gray-600">Common questions about our rates and billing</p>
            
            {/* Fleet Preview */}
            <div className="mt-8 flex justify-center items-center space-x-4">
              <div className="relative h-16 w-24 rounded-lg overflow-hidden">
                <img 
                  src="/images/executive-sedan.jpg" 
                  alt="Executive Sedan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-16 w-24 rounded-lg overflow-hidden">
                <img 
                  src="/images/luxury-suv.jpg" 
                  alt="Luxury SUV" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-16 w-24 rounded-lg overflow-hidden">
                <img 
                  src="/images/sprinter-van.jpg" 
                  alt="Sprinter Van" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-16 w-24 rounded-lg overflow-hidden">
                <img 
                  src="/images/stretch-limo.jpg" 
                  alt="Stretch Limo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Are there any hidden fees?</h3>
              <p className="text-gray-600">No, our rates include all taxes, fees, and gratuity. The price you see is the price you pay.</p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How is wait time calculated?</h3>
              <p className="text-gray-600">We include 15 minutes of complimentary wait time. Additional waiting is charged at $2 per minute.</p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer corporate discounts?</h3>
              <p className="text-gray-600">Yes, we offer volume discounts for corporate accounts with monthly billing and dedicated support.</p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, corporate accounts, and digital payment methods.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I get a custom quote?</h3>
              <p className="text-gray-600">Absolutely! Contact us for custom quotes on long-distance trips, multi-day events, or special requirements.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-red-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Book?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience luxury transportation with transparent, competitive pricing
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