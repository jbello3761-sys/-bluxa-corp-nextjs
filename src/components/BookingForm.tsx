'use client'

import React, { useState, useEffect } from 'react'
import { api, validation, getErrorMessage, type BookingData, type BookingResponse } from '@/lib/api'
import { useSession } from '@/components/auth/AuthProvider'
import { LoadingButton } from '@/components/LoadingStates'
import { GoogleMapsAutocomplete, calculateDistance } from '@/components/GoogleMapsAutocompleteOptimized'

// Form data interface (different from API interface)
interface FormData {
  location: 'nyc' | 'dr'
  pickup_address: string
  destination: string
  pickup_date: string
  pickup_time: string
  vehicle_type: 'executive_sedan' | 'luxury_suv' | 'sprinter_van' | 'stretch_limo' | 'van_4' | 'van_8' | 'van_24'
  service_type?: 'hourly' | 'airport_transfer' | 'corporate' | 'special_events' | 'city_tours' | 'long_distance' | 'resort_transfer' | 'group_transport'
  customer_name: string
  customer_email: string
  customer_phone: string
  estimated_duration: number
  special_requests?: string
  // DR-specific fields
  departure_point?: 'aeropuerto_aila' | 'santo_domingo'
  destination_type?: 'resort' | 'city' | 'airport' | 'tourist_area'
  group_size?: number
  round_trip?: boolean
}

interface BookingFormProps {
  onBookingSuccess?: (booking: BookingResponse) => void
  className?: string
  initialLocation?: 'nyc' | 'dr'
  initialService?: string
}

export function BookingForm({ onBookingSuccess, className = '', initialLocation = 'nyc', initialService }: BookingFormProps) {
  const { user } = useSession()
  
  // Form state with exact field mapping
  const [formData, setFormData] = useState<FormData>({
    location: initialLocation,
    pickup_address: '',           // Corrected from pickup_location
    destination: '',
    pickup_date: '',
    pickup_time: '',
    vehicle_type: initialLocation === 'dr' ? 'van_4' : 'executive_sedan',
    service_type: initialService as any,
    customer_name: '',
    customer_email: user?.email || '',  // Pre-fill from JWT email only
    customer_phone: '',
    estimated_duration: 60,
    special_requests: '',         // Corrected from special_instructions
    // DR-specific fields
    departure_point: 'aeropuerto_aila',
    destination_type: 'resort',
    group_size: 4,
    round_trip: false,
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<BookingResponse | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Remove frontend price calculation - pricing is now handled entirely by backend

  // Auto-save form data to localStorage (debounced)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const timeoutId = setTimeout(() => {
      localStorage.setItem('bluxa-booking-form', JSON.stringify(formData))
    }, 500) // Debounce saves to avoid excessive localStorage writes
    
    return () => clearTimeout(timeoutId)
  }, [formData])

  // Load saved form data on mount (only once)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const saved = localStorage.getItem('bluxa-booking-form')
    if (saved) {
      try {
        const savedData = JSON.parse(saved)
        setFormData(prev => ({
          ...savedData,
          customer_email: user?.email || savedData.customer_email, // Always use current user email
        }))
      } catch (error) {
        console.warn('Failed to load saved form data:', error)
      }
    }
  }, []) // Remove user?.email dependency to prevent re-loading

  // Remove frontend price calculation - pricing is now handled entirely by backend

  // Handle input changes
  const handleInputChange = (field: keyof BookingData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validate individual fields
  const validateField = (field: keyof FormData, value: any): string => {
    switch (field) {
      case 'pickup_address':
        return !value || value.trim().length < 3 ? 'Pickup address is required (minimum 3 characters)' : ''
      case 'destination':
        return !value || value.trim().length < 3 ? 'Destination is required (minimum 3 characters)' : ''
      case 'pickup_date':
        return !value ? 'Pickup date is required' : 
               !validation.isValidDate(value) ? 'Pickup date cannot be in the past' : ''
      case 'pickup_time':
        return !value ? 'Pickup time is required' : 
               !validation.isValidTime(value) ? 'Please enter a valid time' : ''
      case 'customer_name':
        return !value || value.trim().length < 2 ? 'Full name is required (minimum 2 characters)' : ''
      case 'customer_email':
        return !value ? 'Email address is required' : 
               !validation.isValidEmail(value) ? 'Please enter a valid email address' : ''
      case 'customer_phone':
        return !value ? 'Phone number is required' : 
               !validation.isValidPhone(value) ? 'Please enter a valid phone number' : ''
      case 'vehicle_type':
        return !['executive_sedan', 'luxury_suv', 'sprinter_van', 'stretch_limo'].includes(value) ? 'Please select a valid vehicle type' : ''
      default:
        return ''
    }
  }

  // Validate entire form
  const validateForm = (): boolean => {
    const newFieldErrors: Record<string, string> = {}
    
    Object.keys(formData).forEach(key => {
      const field = key as keyof FormData
      if (field !== 'special_requests') { // special_requests is optional
        const error = validateField(field, formData[field])
        if (error) {
          newFieldErrors[field] = error
        }
      }
    })
    
    setFieldErrors(newFieldErrors)
    return Object.keys(newFieldErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setErrors({ form: 'Please correct the errors above' })
      return
    }
    
    setLoading(true)
    setErrors({})
    
    try {
      // Transform form data to match backend API format
      const bookingData = {
        pickup_location: formData.pickup_address,
        dropoff_location: formData.destination,
        pickup_datetime: `${formData.pickup_date}T${formData.pickup_time}:00`,
        vehicle_type: formData.vehicle_type,
        service_type: formData.service_type,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        estimated_duration: formData.estimated_duration,
        special_requests: formData.special_requests,
        passenger_count: 1,
        contact_info: {
          name: formData.customer_name,
          email: formData.customer_email,
          phone: formData.customer_phone
        }
      }
      
      const booking = await api.createBooking(bookingData)
      setSuccess(booking)
      
      // Clear saved form data on success
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bluxa-booking-form')
      }
      
      // Call success callback
      onBookingSuccess?.(booking)
      
    } catch (error) {
      console.error('Booking failed:', error)
      setErrors({ form: getErrorMessage(error as Error) })
    } finally {
      setLoading(false)
    }
  }

  // Handle new booking
  const handleNewBooking = () => {
    setSuccess(null)
    setFormData({
      pickup_address: '',
      destination: '',
      pickup_date: '',
      pickup_time: '',
      vehicle_type: 'executive_sedan',
      customer_name: '',
      customer_email: user?.email || '',
      customer_phone: '',
      estimated_duration: 60,
      special_requests: '',
    })
    setErrors({})
    setFieldErrors({})
  }

  // Success state
  if (success) {
    return (
      <div className={`card ${className}`}>
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Created Successfully!</h3>
          <p className="text-gray-600 mb-6">Your luxury transportation has been reserved.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Booking Code:</span>
                <span className="ml-2 text-gray-900 font-mono">{success.booking_code}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 text-green-600 capitalize">{success.status}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Estimated Price:</span>
                <span className="ml-2 text-gray-900">{amountUtils.formatCents(success.estimated_price)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(success.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleNewBooking}
              className="btn-secondary"
            >
              Book Another Ride
            </button>
            <button
              onClick={() => {
                // Redirect to payment page using UUID
                window.location.href = `/payment?booking_id=${success.id}`
              }}
              className="btn-primary"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className={`card ${className}`}>
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Book Your Luxury Ride</h2>
      

      {/* Error Display */}
      {errors.form && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
          
          {/* Location Switcher */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Service Location *
            </label>
            <div className="flex bg-gray-100 rounded-lg p-1 max-w-md">
              <button
                type="button"
                onClick={() => handleInputChange('location', 'nyc')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  formData.location === 'nyc'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                disabled={loading}
              >
                NYC New York City
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('location', 'dr')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  formData.location === 'dr'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                disabled={loading}
              >
                DR Dominican Republic
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Address *
              </label>
              <GoogleMapsAutocomplete
                value={formData.pickup_address}
                onChange={(value) => handleInputChange('pickup_address', value)}
                onPlaceSelect={(place) => {
                  handleInputChange('pickup_address', place.formatted_address)
                  // Calculate distance and update duration if destination is also set
                  if (formData.destination) {
                    calculateDistance(place.formatted_address, formData.destination)
                      .then(result => {
                        if (result && result.duration) {
                          handleInputChange('estimated_duration', Math.ceil(result.duration / 60))
                        }
                      })
                      .catch(error => console.warn('Distance calculation failed:', error))
                  }
                }}
                placeholder="Enter pickup address"
                disabled={loading}
                className={fieldErrors.pickup_address ? 'border-red-500' : ''}
              />
              {fieldErrors.pickup_address && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.pickup_address}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <GoogleMapsAutocomplete
                value={formData.destination}
                onChange={(value) => handleInputChange('destination', value)}
                onPlaceSelect={(place) => {
                  handleInputChange('destination', place.formatted_address)
                  // Calculate distance and update duration if pickup is also set
                  if (formData.pickup_address) {
                    calculateDistance(formData.pickup_address, place.formatted_address)
                      .then(result => {
                        if (result && result.duration) {
                          handleInputChange('estimated_duration', Math.ceil(result.duration / 60))
                        }
                      })
                      .catch(error => console.warn('Distance calculation failed:', error))
                  }
                }}
                placeholder="Enter destination"
                disabled={loading}
                className={fieldErrors.destination ? 'border-red-500' : ''}
              />
              {fieldErrors.destination && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.destination}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Date *
              </label>
              <input
                type="date"
                value={formData.pickup_date}
                onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                className={`input-field ${fieldErrors.pickup_date ? 'border-red-500' : ''}`}
                min={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
              {fieldErrors.pickup_date && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.pickup_date}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Time *
              </label>
              <input
                type="time"
                value={formData.pickup_time}
                onChange={(e) => handleInputChange('pickup_time', e.target.value)}
                className={`input-field ${fieldErrors.pickup_time ? 'border-red-500' : ''}`}
                disabled={loading}
              />
              {fieldErrors.pickup_time && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.pickup_time}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type *
              </label>
              <select
                value={formData.service_type || 'hourly'}
                onChange={(e) => handleInputChange('service_type', e.target.value)}
                className={`input-field ${fieldErrors.service_type ? 'border-red-500' : ''}`}
                disabled={loading}
              >
                <option value="hourly">Hourly Service</option>
                <option value="airport_transfer">Airport Transfer</option>
                <option value="corporate">Corporate Travel</option>
                <option value="special_events">Special Events</option>
                <option value="city_tours">City Tours</option>
                <option value="long_distance">Long Distance</option>
              </select>
              {fieldErrors.service_type && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.service_type}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type *
              </label>
              <select
                value={formData.vehicle_type}
                onChange={(e) => handleInputChange('vehicle_type', e.target.value as any)}
                className={`input-field ${fieldErrors.vehicle_type ? 'border-red-500' : ''}`}
                disabled={loading}
              >
                {formData.location === 'nyc' ? (
                  <>
                    <option value="executive_sedan">Executive Sedan</option>
                    <option value="luxury_suv">Luxury SUV</option>
                    <option value="sprinter_van">Sprinter Van</option>
                    <option value="stretch_limo">Stretch Limousine</option>
                  </>
                ) : (
                  <>
                    <option value="van_4">Van 4+ Passengers</option>
                    <option value="van_8">Van 8+ Passengers</option>
                    <option value="van_24">Van 24+ Passengers</option>
                    <option value="executive_sedan">Executive Sedan</option>
                    <option value="luxury_suv">Luxury SUV</option>
                  </>
                )}
              </select>
              {fieldErrors.vehicle_type && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.vehicle_type}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.estimated_duration}
                onChange={(e) => handleInputChange('estimated_duration', parseInt(e.target.value) || 60)}
                className="input-field"
                min="30"
                max="480"
                step="15"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* DR-Specific Fields */}
          {formData.location === 'dr' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-md font-semibold text-blue-900 mb-4">DR Dominican Republic Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Point *
                  </label>
                  <select
                    value={formData.departure_point}
                    onChange={(e) => handleInputChange('departure_point', e.target.value as any)}
                    className="input-field"
                    disabled={loading}
                  >
                    <option value="aeropuerto_aila">Aeropuerto AILA (SDQ)</option>
                    <option value="santo_domingo">Santo Domingo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination Type *
                  </label>
                  <select
                    value={formData.destination_type}
                    onChange={(e) => handleInputChange('destination_type', e.target.value as any)}
                    className="input-field"
                    disabled={loading}
                  >
                    <option value="resort">Resort</option>
                    <option value="city">City</option>
                    <option value="airport">Airport</option>
                    <option value="tourist_area">Tourist Area</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Size *
                  </label>
                  <input
                    type="number"
                    value={formData.group_size}
                    onChange={(e) => handleInputChange('group_size', parseInt(e.target.value) || 4)}
                    className="input-field"
                    min="1"
                    max="24"
                    disabled={loading}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="round_trip"
                    checked={formData.round_trip}
                    onChange={(e) => handleInputChange('round_trip', e.target.checked)}
                    className="mr-2"
                    disabled={loading}
                  />
                  <label htmlFor="round_trip" className="text-sm font-medium text-gray-700">
                    Round Trip Service
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                className={`input-field ${fieldErrors.customer_name ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
                disabled={loading}
              />
              {fieldErrors.customer_name && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.customer_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) => handleInputChange('customer_email', e.target.value)}
                className={`input-field ${fieldErrors.customer_email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                disabled={loading}
              />
              {fieldErrors.customer_email && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.customer_email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                className={`input-field ${fieldErrors.customer_phone ? 'border-red-500' : ''}`}
                placeholder="(555) 123-4567"
                disabled={loading}
              />
              {fieldErrors.customer_phone && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.customer_phone}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={formData.special_requests}
                onChange={(e) => handleInputChange('special_requests', e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Any special requests or instructions..."
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Pricing Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Vehicle:</span>
              <span className="font-medium capitalize">{formData.vehicle_type.replace('_', ' ')}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Estimated Duration:</span>
              <span className="font-medium">{formData.estimated_duration} minutes</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Service Type:</span>
              <span className="font-medium capitalize">{formData.service_type?.replace('_', ' ') || 'Hourly Service'}</span>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Note:</span> Final pricing will be calculated by our system based on your specific route, duration, and vehicle selection. You'll receive the exact price before confirming your booking.
            </p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment_method"
                value="card"
                defaultChecked
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Credit/Debit Card</div>
                  <div className="text-sm text-gray-500">Pay securely with Visa, Mastercard, or American Express</div>
                </div>
              </div>
            </label>
            
            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment_method"
                value="cash"
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Cash Payment</div>
                  <div className="text-sm text-gray-500">Pay directly to your chauffeur upon completion</div>
                </div>
              </div>
            </label>
            
            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment_method"
                value="corporate"
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Corporate Account</div>
                  <div className="text-sm text-gray-500">Invoice billing for corporate clients</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
              </a>
              . I understand that final pricing may vary based on actual trip duration and route.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <LoadingButton
            type="submit"
            loading={loading}
            className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold py-4 px-12 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Your Booking...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Complete Booking
              </div>
            )}
          </LoadingButton>
          
          <p className="text-sm text-gray-500 mt-3">
            You'll receive a confirmation email with your booking details
          </p>
        </div>
      </form>
    </div>
  )
}
