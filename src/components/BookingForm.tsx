'use client'

import React, { useState, useEffect } from 'react'
import { api, amountUtils, validation, getErrorMessage, type BookingData, type BookingResponse, type PricingData } from '@/lib/api'
import { useSession } from '@/components/auth/AuthProvider'
import { SkeletonBookingForm, LoadingButton } from '@/components/LoadingStates'
import { GoogleMapsAutocomplete, calculateDistance } from '@/components/GoogleMapsAutocompleteOptimized'

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
  const [pricingLoading, setPricingLoading] = useState(true)
  const [success, setSuccess] = useState<BookingResponse | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Load pricing data on component mount with caching and fallback
  useEffect(() => {
    const loadPricing = async () => {
      try {
        setPricingLoading(true)
        
        // Check if pricing is already cached in localStorage
        const cachedPricing = localStorage.getItem('bluxa-pricing-cache')
        const cacheTimestamp = localStorage.getItem('bluxa-pricing-cache-timestamp')
        const now = Date.now()
        const cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity
        const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
        
        if (cachedPricing && cacheAge < CACHE_DURATION) {
          setPricing(JSON.parse(cachedPricing))
          setPricingLoading(false)
          return
        }
        
        try {
          // Add timeout to pricing API call
          const pricingPromise = api.getPricing()
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Pricing API timeout')), 5000)
          )
          
          const pricingData = await Promise.race([pricingPromise, timeoutPromise]) as PricingData
          setPricing(pricingData)
          
          // Cache the pricing data
          localStorage.setItem('bluxa-pricing-cache', JSON.stringify(pricingData))
          localStorage.setItem('bluxa-pricing-cache-timestamp', now.toString())
        } catch (apiError) {
          console.error('API pricing failed, using fallback:', apiError)
          
          // Fallback pricing data
          const fallbackPricing = {
            pricing: {
              executive_sedan: {
                base_rate: 2500, // $25.00 in cents
                per_hour_rate: 6500, // $65.00 in cents
                minimum_charge: 5000, // $50.00 in cents
                airport_transfer_rate: 7500 // $75.00 in cents
              },
              luxury_suv: {
                base_rate: 3500, // $35.00 in cents
                per_hour_rate: 9500, // $95.00 in cents
                minimum_charge: 7000, // $70.00 in cents
                airport_transfer_rate: 10500 // $105.00 in cents
              },
              sprinter_van: {
                base_rate: 5000, // $50.00 in cents
                per_hour_rate: 12000, // $120.00 in cents
                minimum_charge: 10000, // $100.00 in cents
                airport_transfer_rate: 15000 // $150.00 in cents
              },
              stretch_limo: {
                base_rate: 6000, // $60.00 in cents
                per_hour_rate: 15000, // $150.00 in cents
                minimum_charge: 12000, // $120.00 in cents
                airport_transfer_rate: 18000 // $180.00 in cents
              }
            },
            currency: 'USD'
          }
          
          setPricing(fallbackPricing)
          setErrors({ pricing: 'Using offline pricing - rates may not be current' })
        }
        
      } catch (error) {
        console.error('Failed to load pricing:', error)
        setErrors({ pricing: 'Failed to load pricing information' })
      } finally {
        setPricingLoading(false)
      }
    }
    
    // Load pricing in parallel with other operations
    loadPricing()
  }, [])

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

  // Calculate estimated price when form data changes (debounced)
  useEffect(() => {
    if (!pricing || !formData.vehicle_type || !formData.estimated_duration) return
    
    const timeoutId = setTimeout(() => {
      const vehiclePricing = pricing.pricing[formData.vehicle_type]
      if (vehiclePricing) {
        const isAirportTransfer = 
          formData.pickup_address.toLowerCase().includes('airport') ||
          formData.destination.toLowerCase().includes('airport') ||
          formData.pickup_address.toLowerCase().includes('jfk') ||
          formData.pickup_address.toLowerCase().includes('lga') ||
          formData.pickup_address.toLowerCase().includes('ewr')
        
        // Temporary fix: Ensure pricing values are in cents
        const correctedPricing = {
          ...vehiclePricing,
          base_rate: vehiclePricing.base_rate < 100 ? vehiclePricing.base_rate * 100 : vehiclePricing.base_rate,
          per_hour_rate: vehiclePricing.per_hour_rate < 100 ? vehiclePricing.per_hour_rate * 100 : vehiclePricing.per_hour_rate,
          minimum_charge: vehiclePricing.minimum_charge < 100 ? vehiclePricing.minimum_charge * 100 : vehiclePricing.minimum_charge,
          airport_transfer_rate: vehiclePricing.airport_transfer_rate < 100 ? vehiclePricing.airport_transfer_rate * 100 : vehiclePricing.airport_transfer_rate,
        }
        
        const price = amountUtils.calculatePrice(
          correctedPricing,
          formData.estimated_duration,
          isAirportTransfer
        )
        setEstimatedPrice(price)
      }
    }, 300) // Debounce price calculation to avoid excessive recalculations
    
    return () => clearTimeout(timeoutId)
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

  // Show skeleton loader while pricing is loading
  if (pricingLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking form...</p>
        </div>
        <SkeletonBookingForm />
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
            {Object.entries(pricing.pricing).map(([type, rates]) => {
              // Temporary fix: Convert backend decimal values to cents if they're still in dollars
              const minimumCharge = rates.minimum_charge < 100 ? rates.minimum_charge * 100 : rates.minimum_charge;
              const perHourRate = rates.per_hour_rate < 100 ? rates.per_hour_rate * 100 : rates.per_hour_rate;
              
              return (
                <div key={type} className="text-blue-800">
                  <p className="font-medium capitalize">{type.replace('_', ' ')}</p>
                  <p>From {amountUtils.formatCents(minimumCharge)}</p>
                  <p className="text-xs">{amountUtils.formatCents(perHourRate)}/hour</p>
                </div>
              );
            })}
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
                onChange={(e) => handleInputChange('vehicle_type', e.target.value as BookingData['vehicle_type'])}
                className={`input-field ${fieldErrors.vehicle_type ? 'border-red-500' : ''}`}
                disabled={loading}
              >
                <option value="executive_sedan">Executive Sedan</option>
                <option value="luxury_suv">Luxury SUV</option>
                <option value="sprinter_van">Sprinter Van</option>
                <option value="stretch_limo">Stretch Limousine</option>
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
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            
            {/* Pricing Breakdown */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Base Rate:</span>
                <span className="font-medium">{amountUtils.formatCents(pricing?.pricing[formData.vehicle_type]?.base_rate || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Duration ({formData.estimated_duration} min):</span>
                <span className="font-medium">{amountUtils.formatCents(Math.ceil((formData.estimated_duration / 60) * (pricing?.pricing[formData.vehicle_type]?.per_hour_rate || 0)))}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Vehicle:</span>
                <span className="font-medium capitalize">{formData.vehicle_type.replace('_', ' ')}</span>
              </div>
              
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Estimated Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {amountUtils.formatCents(estimatedPrice)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Note:</span> Final price may vary based on actual duration, route, and any additional services requested.
              </p>
            </div>
          </div>
        )}

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
