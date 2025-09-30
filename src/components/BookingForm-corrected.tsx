'use client'

import React, { useState, useEffect } from 'react'
import { api, amountUtils, validation, getErrorMessage, type BookingData, type BookingResponse, type PricingData } from '@/lib/api-corrected'
import { useSession } from '@/components/auth/AuthProvider'

interface BookingFormProps {
  onBookingSuccess?: (booking: BookingResponse) => void
  className?: string
}

export function BookingForm({ onBookingSuccess, className = '' }: BookingFormProps) {
  const { user } = useSession()
  
  // Form state with exact field mapping
  const [formData, setFormData] = useState<BookingData>({
    pickup_address: '',           // Corrected from pickup_location
    destination: '',
    pickup_date: '',
    pickup_time: '',
    vehicle_type: 'executive_sedan',
    customer_name: '',
    customer_email: user?.email || '',  // Pre-fill from JWT email only
    customer_phone: '',
    estimated_duration: 60,
    special_requests: '',         // Corrected from special_instructions
  })
  
  const [pricing, setPricing] = useState<PricingData | null>(null)
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<BookingResponse | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Load pricing data on component mount
  useEffect(() => {
    const loadPricing = async () => {
      try {
        const pricingData = await api.getPricing()
        setPricing(pricingData)
      } catch (error) {
        console.error('Failed to load pricing:', error)
        setErrors({ pricing: 'Failed to load pricing information' })
      }
    }
    
    loadPricing()
  }, [])

  // Auto-save form data to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bluxa-booking-form', JSON.stringify(formData))
    }
  }, [formData])

  // Load saved form data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, [user?.email])

  // Calculate estimated price when form data changes
  useEffect(() => {
    if (pricing && formData.vehicle_type && formData.estimated_duration) {
      const vehiclePricing = pricing.pricing[formData.vehicle_type]
      if (vehiclePricing) {
        const isAirportTransfer = 
          formData.pickup_address.toLowerCase().includes('airport') ||
          formData.destination.toLowerCase().includes('airport') ||
          formData.pickup_address.toLowerCase().includes('jfk') ||
          formData.pickup_address.toLowerCase().includes('lga') ||
          formData.pickup_address.toLowerCase().includes('ewr')
        
        const price = amountUtils.calculatePrice(
          vehiclePricing,
          formData.estimated_duration,
          isAirportTransfer
        )
        setEstimatedPrice(price)
      }
    }
  }, [pricing, formData.vehicle_type, formData.estimated_duration, formData.pickup_address, formData.destination])

  // Handle input changes
  const handleInputChange = (field: keyof BookingData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validate individual fields
  const validateField = (field: keyof BookingData, value: any): string => {
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
        return !validation.isValidVehicleType(value) ? 'Please select a valid vehicle type' : ''
      default:
        return ''
    }
  }

  // Validate entire form
  const validateForm = (): boolean => {
    const newFieldErrors: Record<string, string> = {}
    
    Object.keys(formData).forEach(key => {
      const field = key as keyof BookingData
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
      const booking = await api.createBooking(formData)
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
      
      {/* Pricing Display */}
      {pricing && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Current Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {Object.entries(pricing.pricing).map(([type, rates]) => (
              <div key={type} className="text-blue-800">
                <p className="font-medium capitalize">{type.replace('_', ' ')}</p>
                <p>From {amountUtils.formatCents(rates.minimum_charge)}</p>
                <p className="text-xs">{amountUtils.formatCents(rates.per_hour_rate)}/hour</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Address *
              </label>
              <input
                type="text"
                value={formData.pickup_address}
                onChange={(e) => handleInputChange('pickup_address', e.target.value)}
                className={`input-field ${fieldErrors.pickup_address ? 'border-red-500' : ''}`}
                placeholder="Enter pickup address"
                disabled={loading}
              />
              {fieldErrors.pickup_address && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.pickup_address}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className={`input-field ${fieldErrors.destination ? 'border-red-500' : ''}`}
                placeholder="Enter destination"
                disabled={loading}
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
                Vehicle Type *
              </label>
              <select
                value={formData.vehicle_type}
                onChange={(e) => handleInputChange('vehicle_type', e.target.value as BookingData['vehicle_type'])}
                className={`input-field ${fieldErrors.vehicle_type ? 'border-red-500' : ''}`}
                disabled={loading}
              >
                <option value="executive_sedan">Executive Sedan</option>
                <option value="luxury_suv">Luxury SUV</option>
                <option value="sprinter_van">Sprinter Van</option>
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

        {/* Price Estimate */}
        {estimatedPrice > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-green-800 font-medium">Estimated Price:</span>
              <span className="text-2xl font-bold text-green-900">
                {amountUtils.formatCents(estimatedPrice)}
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Final price may vary based on actual duration and route
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-lg px-12 py-4 flex items-center justify-center mx-auto"
          >
            {loading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Creating Booking...
              </>
            ) : (
              'Create Booking'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
