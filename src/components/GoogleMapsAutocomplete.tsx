'use client'

import React, { useEffect, useRef, useState } from 'react'
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

// Load Google Maps API script with caching
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
      // Wait for it to load
      const checkLoaded = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          resolve()
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMaps.apiKey}&libraries=places`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve()
      } else {
        reject(new Error('Google Maps API failed to load properly'))
      }
    }
    
    script.onerror = () => {
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

  useEffect(() => {
    if (!config.googleMaps.apiKey) {
      setError('Google Maps API key not configured')
      return
    }

    // Check if we're in development and API key might be restricted
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.warn('GoogleMapsAutocomplete: Running on localhost - API key restrictions may apply')
    }

    const initializeAutocomplete = async () => {
      if (isInitialized || disabled) return
      
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
        
        // Check for specific Google Maps errors
        if (err.message.includes('RefererNotAllowedMapError')) {
          setError('Google Maps API key restrictions prevent localhost access. Please update API key settings in Google Cloud Console.')
        } else if (err.message.includes('InvalidKeyMapError')) {
          setError('Invalid Google Maps API key. Please check your configuration.')
        } else {
          setError(`Failed to load address suggestions: ${err.message}`)
        }
        
        setIsLoading(false)
      }
    }

    // Delay initialization to prevent blocking initial render
    const timeoutId = setTimeout(initializeAutocomplete, 500)

    // Cleanup
    return () => {
      clearTimeout(timeoutId)
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }
  }, [onChange, onPlaceSelect, disabled, isInitialized])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  if (error) {
    // Fallback to regular input if Google Maps fails
    return (
      <div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
        />
        <p className="text-xs text-yellow-600 mt-1">
          Address suggestions unavailable - using manual entry
        </p>
        <p className="text-xs text-red-600 mt-1">
          Error: {error}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          <strong>Fix:</strong> Update Google Maps API key restrictions in Google Cloud Console to allow localhost:3000
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={className}
        disabled={disabled || isLoading}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
}

// Utility function to calculate distance between two places
export const calculateDistance = async (
  origin: string,
  destination: string
): Promise<{ distance: number; duration: number } | null> => {
  try {
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps not loaded')
    }

    const service = new window.google.maps.DistanceMatrixService()
    
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
      }, (response: any, status: any) => {
        if (status === window.google.maps.DistanceMatrixStatus.OK && response) {
          const element = response.rows[0]?.elements[0]
          if (element && element.status === 'OK') {
            resolve({
              distance: element.distance?.value || 0, // in meters
              duration: element.duration?.value || 0  // in seconds
            })
          } else {
            resolve(null)
          }
        } else {
          reject(new Error(`Distance calculation failed: ${status}`))
        }
      })
    })
  } catch (error) {
    console.error('Distance calculation error:', error)
    return null
  }
}

// Type declarations for Google Maps
declare global {
  interface Window {
    google: any
  }
}

