'use client'

import { config } from '@/lib/config'
import { supabase } from '@/lib/supabaseClient'

export default function DebugConfig() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuration Debug</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Environment Variables */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment Variables</h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</div>
                  <div><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</div>
                  <div><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</div>
                  <div><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</div>
                  <div><strong>SUPABASE_URL:</strong> {process.env.SUPABASE_URL || 'Not set'}</div>
                  <div><strong>SUPABASE_ANON_KEY:</strong> {process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</div>
                </div>
              </div>
            </div>

            {/* Config Object */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Config Object</h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
                  {JSON.stringify({
                    apiUrl: config.apiUrl,
                    supabase: {
                      url: config.supabase.url,
                      anonKey: config.supabase.anonKey ? 'Present' : 'Missing',
                      serviceKey: config.supabase.serviceKey ? 'Present' : 'Missing'
                    },
                    stripe: {
                      publishableKey: config.stripe.publishableKey ? 'Present' : 'Missing'
                    }
                  }, null, 2)}
                </pre>
              </div>
            </div>

            {/* Supabase Client Status */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Supabase Client Status</h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div><strong>Supabase Client:</strong> {supabase ? 'Initialized' : 'Not Available'}</div>
                  {supabase && (
                    <div><strong>Supabase URL:</strong> {supabase.supabaseUrl}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
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
