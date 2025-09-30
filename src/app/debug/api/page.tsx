'use client'

import React, { useState, useEffect } from 'react'
import { api, APIError } from '@/lib/api'
import { config } from '@/lib/config'

export default function DebugAPI() {
  const [healthStatus, setHealthStatus] = useState<string>('Loading...')
  const [pricingData, setPricingData] = useState<any>(null)
  const [testBooking, setTestBooking] = useState<any>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  // Test health endpoint
  const testHealth = async () => {
    setLoading(prev => ({ ...prev, health: true }))
    try {
      const result = await api.healthCheck()
      setHealthStatus(`✅ Connected - ${result.status} (${result.timestamp})`)
      setErrors(prev => ({ ...prev, health: '' }))
    } catch (error) {
      setHealthStatus('❌ Failed to connect')
      setErrors(prev => ({ 
        ...prev, 
        health: error instanceof APIError ? error.message : 'Unknown error'
      }))
    } finally {
      setLoading(prev => ({ ...prev, health: false }))
    }
  }

  // Test pricing endpoint
  const testPricing = async () => {
    setLoading(prev => ({ ...prev, pricing: true }))
    try {
      const result = await api.getPricing()
      setPricingData(result)
      setErrors(prev => ({ ...prev, pricing: '' }))
    } catch (error) {
      setPricingData(null)
      setErrors(prev => ({ 
        ...prev, 
        pricing: error instanceof APIError ? error.message : 'Unknown error'
      }))
    } finally {
      setLoading(prev => ({ ...prev, pricing: false }))
    }
  }

  // Test booking creation
  const testBookingCreation = async () => {
    setLoading(prev => ({ ...prev, booking: true }))
    try {
      const testData = {
        pickup_location: '123 Test Street, New York, NY',
        destination: '456 Demo Avenue, New York, NY',
        pickup_date: '2024-12-01',
        pickup_time: '14:30',
        vehicle_type: 'executive_sedan',
        customer_name: 'Test User',
        customer_email: 'test@example.com',
        customer_phone: '(555) 123-4567',
        estimated_duration: 60,
        special_instructions: 'This is a test booking from the debug page'
      }
      
      const result = await api.postBooking(testData)
      setTestBooking(result)
      setErrors(prev => ({ ...prev, booking: '' }))
    } catch (error) {
      setTestBooking(null)
      setErrors(prev => ({ 
        ...prev, 
        booking: error instanceof APIError ? error.message : 'Unknown error'
      }))
    } finally {
      setLoading(prev => ({ ...prev, booking: false }))
    }
  }

  // Auto-test health on component mount
  useEffect(() => {
    testHealth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">API Debug Console</h1>
          
          {/* Configuration Display */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Configuration</h2>
            <div className="space-y-1 text-blue-800 text-sm">
              <p><strong>API URL:</strong> {config.apiUrl}</p>
              <p><strong>Supabase URL:</strong> {config.supabase.url}</p>
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Health Check */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Health Check</h2>
                <button
                  onClick={testHealth}
                  disabled={loading.health}
                  className="btn-primary text-sm px-4 py-2"
                >
                  {loading.health ? 'Testing...' : 'Test Health'}
                </button>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Status:</p>
                <p className="text-sm">{healthStatus}</p>
                {errors.health && (
                  <p className="text-sm text-red-600 mt-2">{errors.health}</p>
                )}
              </div>
            </div>

            {/* Pricing Test */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Pricing Data</h2>
                <button
                  onClick={testPricing}
                  disabled={loading.pricing}
                  className="btn-primary text-sm px-4 py-2"
                >
                  {loading.pricing ? 'Loading...' : 'Test Pricing'}
                </button>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Response:</p>
                {pricingData ? (
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-auto">
                    {JSON.stringify(pricingData, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-gray-500">No data loaded</p>
                )}
                {errors.pricing && (
                  <p className="text-sm text-red-600 mt-2">{errors.pricing}</p>
                )}
              </div>
            </div>

            {/* Booking Test */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Booking Creation Test</h2>
                <button
                  onClick={testBookingCreation}
                  disabled={loading.booking}
                  className="btn-primary text-sm px-4 py-2"
                >
                  {loading.booking ? 'Creating...' : 'Test Booking'}
                </button>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Test Booking Response:</p>
                {testBooking ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Booking ID:</strong> {testBooking.booking_id}</div>
                      <div><strong>UUID:</strong> {testBooking.id}</div>
                      <div><strong>Status:</strong> {testBooking.status}</div>
                      <div><strong>Price:</strong> ${testBooking.estimated_price}</div>
                    </div>
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-auto mt-4">
                      {JSON.stringify(testBooking, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No booking created yet</p>
                )}
                {errors.booking && (
                  <p className="text-sm text-red-600 mt-2">{errors.booking}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex gap-4 justify-center">
            <a href="/debug/auth" className="btn-secondary">
              Auth Debug
            </a>
            <a href="/book" className="btn-primary">
              Test Booking Form
            </a>
            <a href="/" className="btn-secondary">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
