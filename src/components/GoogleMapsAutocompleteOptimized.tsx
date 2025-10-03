'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { config } from '@/lib/config'

// Google Maps type declarations
declare global {
  interface Window {
    google: any
  }
}

interface GoogleMapsAutocompleteProps {
  value: string
  onChange: (value: string, placeDetails?: any) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  onPlaceSelect?: (place: any) => void
}

// Global promise to prevent multiple script loads
let googleMapsLoadPromise: Promise<void> | null = null

// Load Google Maps API script with caching and timeout
const loadGoogleMapsScript = (): Promise<void> => {
  // Return existing promise if already loading/loaded
  if (googleMapsLoadPromise) {
    return googleMapsLoadPromise
  }

  googleMapsLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Maps can only be loaded in browser environment'))
      return
    }

    // Check if already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve()
      return
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for it to load with timeout
      let attempts = 0
      const maxAttempts = 50 // 5 seconds max
      const checkLoaded = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          resolve()
        } else if (attempts < maxAttempts) {
          attempts++
          setTimeout(checkLoaded, 100)
        } else {
          reject(new Error('Google Maps API loading timeout'))
        }
      }
      checkLoaded()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMaps.apiKey}&libraries=places`
    script.async = true
    script.defer = true
    
    // Add timeout to script loading
    const timeout = setTimeout(() => {
      reject(new Error('Google Maps API loading timeout'))
    }, 10000) // 10 second timeout
    
    script.onload = () => {
      clearTimeout(timeout)
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve()
      } else {
        reject(new Error('Google Maps API failed to load properly'))
      }
    }
    
    script.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('Failed to load Google Maps API'))
    }
    
    document.head.appendChild(script)
  })

  return googleMapsLoadPromise
}

export function GoogleMapsAutocomplete({
  value,
  onChange,
  placeholder = 'Enter address',
  className = '',
  disabled = false,
  onPlaceSelect
}: GoogleMapsAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)

  // Intersection Observer for lazy loading
  const observerRef = useRef<IntersectionObserver | null>(null)

  const initializeAutocomplete = useCallback(async () => {
    if (isInitialized || disabled || !shouldLoad) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('GoogleMapsAutocomplete: Loading Google Maps script...')
      await loadGoogleMapsScript()
      
      if (!inputRef.current) {
        console.error('GoogleMapsAutocomplete: Input ref not available')
        setError('Input element not available')
        setIsLoading(false)
        return
      }

      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.error('GoogleMapsAutocomplete: Google Maps API not available after loading')
        setError('Google Maps API not available')
        setIsLoading(false)
        return
      }

      console.log('GoogleMapsAutocomplete: Initializing autocomplete...')
      // Initialize autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' }, // Restrict to US addresses
        fields: ['formatted_address', 'geometry', 'name', 'place_id', 'types']
      })

      // Add place changed listener
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace()
        console.log('GoogleMapsAutocomplete: Place selected:', place)
        if (place && place.formatted_address) {
          onChange(place.formatted_address, place)
          onPlaceSelect?.(place)
        }
      })

      console.log('GoogleMapsAutocomplete: Autocomplete initialized successfully')
      setIsInitialized(true)
      setIsLoading(false)
    } catch (err) {
      console.error('GoogleMapsAutocomplete: Failed to initialize:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize Google Maps')
      setIsLoading(false)
    }
  }, [isInitialized, disabled, shouldLoad, onChange, onPlaceSelect])

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!inputRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(inputRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Initialize when shouldLoad becomes true
  useEffect(() => {
    if (shouldLoad && !config.googleMaps.apiKey) {
      setError('Google Maps API key not configured')
      return
    }

    if (shouldLoad) {
      initializeAutocomplete()
    }
  }, [shouldLoad, initializeAutocomplete])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autocompleteRef.current) {
        autocompleteRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error.includes('API key') ? 'Address autocomplete unavailable' : 'Loading address suggestions...'}
        </p>
      )}
    </div>
  )
}

// Distance calculation function with error handling
export async function calculateDistance(origin: string, destination: string): Promise<{ distance: number; duration: number } | null> {
  try {
    if (!window.google || !window.google.maps) {
      console.warn('Google Maps not loaded for distance calculation')
      return null
    }

    const service = new window.google.maps.DistanceMatrixService()
    
    return new Promise((resolve) => {
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.IMPERIAL,
        },
        (response, status) => {
          if (status === window.google.maps.DistanceMatrixStatus.OK && response) {
            const element = response.rows[0].elements[0]
            if (element.status === window.google.maps.DistanceMatrixElementStatus.OK) {
              resolve({
                distance: element.distance.value, // meters
                duration: element.duration.value, // seconds
              })
            } else {
              resolve(null)
            }
          } else {
            console.warn('Distance calculation failed:', status)
            resolve(null)
          }
        }
      )
    })
  } catch (error) {
    console.warn('Distance calculation error:', error)
    return null
  }
}
