'use client'

import React, { useEffect, useState } from 'react'
import { config } from '@/lib/config'

export default function EnvCheck() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setEnvVars({
      'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL,
      'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Present' : 'Missing',
    })
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading environment check...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Environment Variables Check</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Runtime Environment Variables</h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="space-y-3">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="font-mono text-sm text-gray-700">{key}:</span>
                    <span className={`font-mono text-sm px-2 py-1 rounded ${
                      value && value !== 'Missing' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {value || 'Not Set'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Config Object Values</h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-gray-700">config.apiUrl:</span>
                  <span className={`font-mono text-sm px-2 py-1 rounded ${
                    config.apiUrl 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {config.apiUrl || 'Not Set'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-gray-700">config.supabase.url:</span>
                  <span className={`font-mono text-sm px-2 py-1 rounded ${
                    config.supabase.url 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {config.supabase.url || 'Not Set'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-gray-700">config.supabase.anonKey:</span>
                  <span className={`font-mono text-sm px-2 py-1 rounded ${
                    config.supabase.anonKey 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {config.supabase.anonKey ? 'Present' : 'Missing'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-gray-700">config.stripe.publishableKey:</span>
                  <span className={`font-mono text-sm px-2 py-1 rounded ${
                    config.stripe.publishableKey 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {config.stripe.publishableKey ? 'Present' : 'Missing'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Environment Info</h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</div>
                <div><strong>VERCEL:</strong> {process.env.VERCEL ? 'Yes' : 'No'}</div>
                <div><strong>VERCEL_ENV:</strong> {process.env.VERCEL_ENV || 'Not Set'}</div>
                <div><strong>VERCEL_URL:</strong> {process.env.VERCEL_URL || 'Not Set'}</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="btn-primary inline-block"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

