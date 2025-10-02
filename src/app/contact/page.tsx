// src/app/contact/page.tsx
'use client'

import React, { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service_type: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        service_type: 'general'
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: '📞',
      title: 'Phone',
      details: ['+1 (555) 123-4567', '24/7 Customer Support'],
      action: 'tel:+15551234567'
    },
    {
      icon: '✉️',
      title: 'Email',
      details: ['info@bluxacorp.com', 'Quick Response Guaranteed'],
      action: 'mailto:info@bluxacorp.com'
    },
    {
      icon: '📍',
      title: 'Office',
      details: ['123 Luxury Lane', 'New York, NY 10001'],
      action: 'https://maps.google.com/?q=123+Luxury+Lane+New+York+NY'
    },
    {
      icon: '⏰',
      title: 'Hours',
      details: ['24/7 Booking Available', 'Office: Mon-Fri 9AM-6PM'],
      action: null
    }
  ]

  const serviceAreas = [
    'Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island',
    'JFK Airport', 'LaGuardia Airport', 'Newark Airport',
    'Westchester County', 'Long Island', 'New Jersey'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
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

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="card text-center hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">{info.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
              <div className="space-y-1">
                {info.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className={`${detailIndex === 0 ? 'font-semibold text-gray-900' : 'text-gray-600 text-sm'}`}>
                    {detail}
                  </p>
                ))}
              </div>
              {info.action && (
                <a 
                  href={info.action}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  {info.title === 'Phone' ? 'Call Now' : 
                   info.title === 'Email' ? 'Send Email' : 'View Map'}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <p className="text-green-800">Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  <p className="text-red-800">Sorry, there was an error sending your message. Please try again or call us directly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Your full name"
                  />
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
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <select
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="booking">New Booking</option>
                    <option value="corporate">Corporate Account</option>
                    <option value="wedding">Wedding/Event</option>
                    <option value="airport">Airport Transfer</option>
                    <option value="support">Customer Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="input-field resize-none"
                  placeholder="Please provide details about your transportation needs, dates, times, and any special requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Sending Message...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-8">
            {/* Quick Booking */}
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Service?</h3>
              <p className="text-gray-600 mb-6">
                For urgent bookings or immediate assistance, call us directly or use our online booking system.
              </p>
              <div className="space-y-3">
                <a 
                  href="tel:+15551234567"
                  className="btn-primary w-full text-center block"
                >
                  📞 Call Now: (555) 123-4567
                </a>
                <button 
                  onClick={() => window.location.href = '/book'}
                  className="btn-secondary w-full"
                >
                  🚗 Book Online
                </button>
              </div>
            </div>

            {/* Service Areas */}
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Service Areas</h3>
              <p className="text-gray-600 mb-4">We provide luxury transportation throughout:</p>
              <div className="grid grid-cols-2 gap-2">
                {serviceAreas.map((area, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {area}
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Booking Hours</h4>
                  <p className="text-gray-600">24/7 Online & Phone Booking</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Office Hours</h4>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 4:00 PM</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Response Time</h4>
                  <p className="text-gray-600">Email: Within 2 hours during business hours</p>
                  <p className="text-gray-600">Phone: Immediate assistance 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How far in advance should I book?</h3>
              <p className="text-gray-600">We recommend booking at least 2 hours in advance for regular services. For special events, weddings, or corporate accounts, we suggest booking 24-48 hours ahead to ensure availability.</p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you provide service outside NYC?</h3>
              <p className="text-gray-600">Yes! We provide transportation throughout the tri-state area including New Jersey, Connecticut, and Long Island. Contact us for custom quotes on longer distance trips.</p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards (Visa, MasterCard, American Express), corporate accounts, and cash payments. Payment can be processed online during booking or with your chauffeur.</p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is gratuity included in the price?</h3>
              <p className="text-gray-600">Gratuity is not included in our quoted prices. While not required, a 15-20% gratuity is customary for exceptional service and can be added to your payment or given directly to your chauffeur.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-red-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Experience Luxury?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us today to discuss your transportation needs or book your next ride
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/book'}
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Book Now
            </button>
            <a 
              href="tel:+15551234567"
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Call (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
