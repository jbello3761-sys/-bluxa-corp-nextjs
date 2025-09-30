'use client'

import React, { useState } from 'react'
import { stripeAPI, paymentUtils, getStripeErrorMessage } from '@/lib/stripe'
import { config } from '@/lib/config'

export default function DebugStripe() {
  const [testBookingId, setTestBookingId] = useState('')
  const [paymentIntent, setPaymentIntent] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<any>(null)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Test creating payment intent
  const testCreatePaymentIntent = async () => {
    if (!testBookingId.trim()) {
      setErrors(prev => ({ ...prev, create: 'Please enter a booking ID' }))
      return
    }

    setLoading(prev => ({ ...prev, create: true }))
    setErrors(prev => ({ ...prev, create: '' }))

    try {
      const intent = await stripeAPI.createPaymentIntent(testBookingId)
      setPaymentIntent(intent)
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        create: error instanceof Error ? error.message : 'Failed to create payment intent'
      }))
    } finally {
      setLoading(prev => ({ ...prev, create: false }))
    }
  }

  // Test getting payment status
  const testGetPaymentStatus = async () => {
    if (!paymentIntent?.id) {
      setErrors(prev => ({ ...prev, status: 'No payment intent ID available' }))
      return
    }

    setLoading(prev => ({ ...prev, status: true }))
    setErrors(prev => ({ ...prev, status: '' }))

    try {
      const status = await stripeAPI.getPaymentStatus(paymentIntent.id)
      setPaymentStatus(status)
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        status: error instanceof Error ? error.message : 'Failed to get payment status'
      }))
    } finally {
      setLoading(prev => ({ ...prev, status: false }))
    }
  }

  // Test payment confirmation
  const testConfirmPayment = async () => {
    if (!paymentIntent?.id) {
      setErrors(prev => ({ ...prev, confirm: 'No payment intent ID available' }))
      return
    }

    setLoading(prev => ({ ...prev, confirm: true }))
    setErrors(prev => ({ ...prev, confirm: '' }))

    try {
      const result = await stripeAPI.confirmPayment(paymentIntent.id)
      setPaymentStatus(result)
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        confirm: error instanceof Error ? error.message : 'Failed to confirm payment'
      }))
    } finally {
      setLoading(prev => ({ ...prev, confirm: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Stripe Integration Debug</h1>
          
          {/* Configuration Display */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Stripe Configuration</h2>
            <div className="space-y-1 text-blue-800 text-sm">
              <p><strong>Publishable Key:</strong> {config.stripe.publishableKey.substring(0, 20)}...</p>
              <p><strong>API URL:</strong> {config.apiUrl}</p>
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Intent Creation */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Create Payment Intent</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking ID (UUID)
                </label>
                <input
                  type="text"
                  value={testBookingId}
                  onChange={(e) => setTestBookingId(e.target.value)}
                  className="input-field"
                  placeholder="Enter booking UUID"
                />
              </div>
              
              <button
                onClick={testCreatePaymentIntent}
                disabled={loading.create}
                className="btn-primary w-full"
              >
                {loading.create ? 'Creating...' : 'Create Payment Intent'}
              </button>
              
              {errors.create && (
                <p className="text-sm text-red-600">{errors.create}</p>
              )}
              
              {paymentIntent && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Payment Intent Created:</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>ID:</strong> {paymentIntent.id}</p>
                    <p><strong>Amount:</strong> {paymentUtils.formatAmount(paymentIntent.amount)}</p>
                    <p><strong>Currency:</strong> {paymentIntent.currency.toUpperCase()}</p>
                    <p><strong>Status:</strong> {paymentIntent.status}</p>
                    <p><strong>Client Secret:</strong> {paymentIntent.client_secret.substring(0, 30)}...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Payment Status</h2>
                <button
                  onClick={testGetPaymentStatus}
                  disabled={loading.status || !paymentIntent}
                  className="btn-primary text-sm px-4 py-2"
                >
                  {loading.status ? 'Loading...' : 'Get Status'}
                </button>
              </div>
              
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status}</p>
              )}
              
              {paymentStatus && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Payment Status:</p>
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-auto">
                    {JSON.stringify(paymentStatus, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Payment Confirmation */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Payment Confirmation Test</h2>
                <button
                  onClick={testConfirmPayment}
                  disabled={loading.confirm || !paymentIntent}
                  className="btn-primary text-sm px-4 py-2"
                >
                  {loading.confirm ? 'Confirming...' : 'Test Confirm Payment'}
                </button>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> This tests the backend confirmation endpoint. 
                  In a real payment flow, this would be called after Stripe confirms the payment on the frontend.
                </p>
              </div>
              
              {errors.confirm && (
                <p className="text-sm text-red-600">{errors.confirm}</p>
              )}
            </div>

            {/* Test Card Numbers */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Test Card Numbers</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">✅ Successful Payment</h3>
                  <p className="text-sm text-green-800 font-mono">4242 4242 4242 4242</p>
                  <p className="text-xs text-green-700 mt-1">Use any future expiry date and any 3-digit CVC</p>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-900 mb-2">❌ Declined Payment</h3>
                  <p className="text-sm text-red-800 font-mono">4000 0000 0000 0002</p>
                  <p className="text-xs text-red-700 mt-1">Card will be declined with generic decline code</p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-900 mb-2">⚠️ Insufficient Funds</h3>
                  <p className="text-sm text-yellow-800 font-mono">4000 0000 0000 9995</p>
                  <p className="text-xs text-yellow-700 mt-1">Card will be declined with insufficient funds</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">🔐 3D Secure Required</h3>
                  <p className="text-sm text-blue-800 font-mono">4000 0025 0000 3155</p>
                  <p className="text-xs text-blue-700 mt-1">Requires 3D Secure authentication</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex gap-4 justify-center">
            <a href="/debug/api" className="btn-secondary">
              API Debug
            </a>
            <a href="/payment?booking_id=test" className="btn-primary">
              Test Payment Flow
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
