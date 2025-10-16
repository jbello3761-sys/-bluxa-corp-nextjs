'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
    message: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 6) {
      value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`
    } else if (value.length >= 3) {
      value = `(${value.slice(0,3)}) ${value.slice(3)}`
    }
    setFormData(prev => ({
      ...prev,
      phone: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulate form submission
    setShowSuccess(true)
    setShowError(false)
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      serviceType: '',
      message: ''
    })
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 5000)
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
        
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
        }
        
        .input-field:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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
        
        .contact-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 1rem;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Get in touch with our team for bookings, questions, or custom transportation solutions. 
              We're here to provide exceptional service 24/7.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="input-field"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="input-field"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="input-field"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="input-field"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                />
              </div>

              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select 
                  id="serviceType" 
                  name="serviceType" 
                  className="input-field"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                >
                  <option value="">Select a service</option>
                  <option value="airport_transfer">Airport Transfer</option>
                  <option value="corporate">Corporate Travel</option>
                  <option value="special_events">Special Events</option>
                  <option value="city_tours">City Tours</option>
                  <option value="hourly">Hourly Service</option>
                  <option value="long_distance">Long Distance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="input-field"
                  placeholder="Tell us about your transportation needs..."
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>

            {/* Success/Error Messages */}
            {showSuccess && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">Success: Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</p>
              </div>
            )}

            {showError && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">✗ Sorry, there was an error sending your message. Please try again or call us directly.</p>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card text-center">
              <div className="contact-icon bg-blue-100 text-blue-600">
                <Image 
                  src="/images/terminal.jpg" 
                  alt="Phone Contact"
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600 mb-4">Available 24/7 for bookings and support</p>
              <a href="tel:+15551234567" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                (555) 123-4567
              </a>
            </div>

            <div className="card text-center">
              <div className="contact-icon bg-red-100 text-red-600">
                <Image 
                  src="/images/luxarysedan.jpg" 
                  alt="Email Contact"
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">Send us your questions or booking requests</p>
              <a href="mailto:info@bluxacorp.com" className="text-xl font-bold text-blue-600 hover:text-blue-700">
                info@bluxacorp.com
              </a>
            </div>

            <div className="card text-center">
              <div className="contact-icon bg-green-100 text-green-600">
                <Image 
                  src="/images/nyc.jpg" 
                  alt="Office Location"
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Office</h3>
              <p className="text-gray-600 mb-4">Visit us for corporate accounts and partnerships</p>
              <address className="text-gray-900 not-italic">
                123 Luxury Lane<br />
                New York, NY 10001<br />
                United States
              </address>
            </div>

            <div className="card text-center">
              <div className="contact-icon bg-purple-100 text-purple-600">
                <Image 
                  src="/images/city.jpg" 
                  alt="Service Hours"
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hours</h3>
              <p className="text-gray-600 mb-4">Transportation services available 24/7</p>
              <div className="text-gray-900">
                <p><strong>Service:</strong> 24/7</p>
                <p><strong>Office:</strong> Mon-Fri 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Areas */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Service Areas</h2>
            <p className="text-xl text-gray-600">We provide luxury transportation throughout the New York metropolitan area</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">
                <Image 
                  src="/images/nyc 2.jpg" 
                  alt="Manhattan"
                  width={64}
                  height={64}
                  className="rounded-lg object-cover mx-auto"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manhattan</h3>
              <p className="text-gray-600">All neighborhoods including Midtown, Financial District, Upper East/West Side</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">
                <Image 
                  src="/images/city.jpg" 
                  alt="Outer Boroughs"
                  width={64}
                  height={64}
                  className="rounded-lg object-cover mx-auto"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Outer Boroughs</h3>
              <p className="text-gray-600">Brooklyn, Queens, Bronx, and Staten Island</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">
                <Image 
                  src="/images/airport walking.jpg" 
                  alt="Airports"
                  width={64}
                  height={64}
                  className="rounded-lg object-cover mx-auto"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Airports</h3>
              <p className="text-gray-600">JFK, LaGuardia, Newark, Westchester</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">
                <Image 
                  src="/images/downtownla.jpg" 
                  alt="New Jersey"
                  width={64}
                  height={64}
                  className="rounded-lg object-cover mx-auto"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">New Jersey</h3>
              <p className="text-gray-600">Jersey City, Hoboken, surrounding areas</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">
                <Image 
                  src="/images/city2.jpg" 
                  alt="Westchester"
                  width={64}
                  height={64}
                  className="rounded-lg object-cover mx-auto"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Westchester</h3>
              <p className="text-gray-600">White Plains, Yonkers, Westchester County</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">
                <Image 
                  src="/images/miami beach.jpg" 
                  alt="Long Island"
                  width={64}
                  height={64}
                  className="rounded-lg object-cover mx-auto"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Long Island</h3>
              <p className="text-gray-600">Nassau, Suffolk counties, the Hamptons</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How far in advance should I book?</h3>
              <p className="text-gray-600">We recommend booking at least 2 hours in advance, but we can often accommodate last-minute requests. For special events or peak times, booking 24-48 hours ahead is preferred.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you provide car seats for children?</h3>
              <p className="text-gray-600">Yes, we provide complimentary car seats and booster seats upon request. Please specify the age and weight of children when booking to ensure we have the appropriate safety equipment.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if my flight is delayed?</h3>
              <p className="text-gray-600">We monitor all flights in real-time and adjust pickup times automatically. There's no additional charge for flight delays, and we include 60 minutes of complimentary wait time for airport pickups.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I make changes to my reservation?</h3>
              <p className="text-gray-600">Yes, you can modify or cancel your reservation up to 2 hours before pickup time without any fees. Changes can be made by calling our 24/7 customer service line.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer corporate accounts?</h3>
              <p className="text-gray-600">Absolutely! We offer corporate accounts with monthly billing, dedicated account managers, and volume discounts. Contact us to set up your corporate transportation program.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-red-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Experience Luxury?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your premium transportation today or contact us for a custom quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/book'}
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Book Now
            </button>
            <button 
              onClick={() => window.location.href = 'tel:+15551234567'}
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Call (555) 123-4567
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}