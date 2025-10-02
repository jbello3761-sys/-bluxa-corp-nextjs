// src/app/driver/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useSession, useRequireAuth } from '@/components/auth/AuthProvider'
import { api } from '@/lib/api'

export default function DriverPortalPage() {
  // Require authentication and redirect if not logged in
  useRequireAuth('/driver')
  
  const { user } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if user has driver role
  useEffect(() => {
    if (user?.user_metadata?.role === 'driver') {
      setIsAuthenticated(true)
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // This would call your backend API
      const response = await api.get('/driver/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Demo login - in production this would use Supabase Auth
      if (loginData.email === 'driver@bluxacorp.com' && loginData.password === 'Driver2024!') {
        setIsAuthenticated(true)
        // Load mock dashboard data
        setDashboardData({
          driver: {
            name: 'John Smith',
            rating: 4.9,
            total_rides: 245,
            status: 'available'
          },
          today: {
            rides: 3,
            earnings: 1250
          },
          rides: [
            {
              id: '1',
              booking_code: 'BLX-2025-00123',
              customer_name: 'John Doe',
              pickup_address: 'JFK Airport',
              destination: 'Manhattan Hotel',
              pickup_time: '10:30 AM',
              status: 'completed',
              vehicle: 'Executive Sedan',
              earnings: 450
            },
            {
              id: '2',
              booking_code: 'BLX-2025-00124',
              customer_name: 'Jane Smith',
              pickup_address: 'Manhattan',
              destination: 'LaGuardia Airport',
              pickup_time: '2:30 PM',
              status: 'in_progress',
              vehicle: 'Luxury SUV',
              earnings: 520
            },
            {
              id: '3',
              booking_code: 'BLX-2025-00125',
              customer_name: 'Corporate Group',
              pickup_address: 'Hotel',
              destination: 'Conference Center',
              pickup_time: '6:00 PM',
              status: 'upcoming',
              vehicle: 'Sprinter Van',
              earnings: 680
            }
          ]
        })
      } else {
        setError('Invalid credentials')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateRideStatus = async (rideId: string, newStatus: string) => {
    try {
      // This would call your backend API
      console.log(`Updating ride ${rideId} to ${newStatus}`)
      
      // Update local state
      setDashboardData(prev => ({
        ...prev,
        rides: prev.rides.map(ride => 
          ride.id === rideId ? { ...ride, status: newStatus } : ride
        )
      }))
    } catch (error) {
      console.error('Failed to update ride status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusActions = (status: string, rideId: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <button
            onClick={() => updateRideStatus(rideId, 'in_progress')}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Start Ride
          </button>
        )
      case 'in_progress':
        return (
          <button
            onClick={() => updateRideStatus(rideId, 'completed')}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
          >
            Complete
          </button>
        )
      case 'completed':
        return (
          <span className="text-green-600 text-sm font-medium">✓ Completed</span>
        )
      default:
        return null
    }
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="card">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Portal</h1>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
                  placeholder="driver@bluxacorp.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="input-field"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Signing In...
                  </span>
                ) : (
                  'Login to Driver Portal'
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong><br />
                Email: driver@bluxacorp.com<br />
                Password: Driver2024!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard
  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
              <p className="text-gray-600">Welcome back, {dashboardData?.driver?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Available
                </span>
              </div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="btn-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl mb-2">🚗</div>
            <div className="text-2xl font-bold text-gray-900">{dashboardData?.today?.rides || 0}</div>
            <p className="text-gray-600">Today's Rides</p>
          </div>

          <div className="card text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-900">{dashboardData?.driver?.total_rides || 0}</div>
            <p className="text-gray-600">Total Rides</p>
          </div>

          <div className="card text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-gray-900">{dashboardData?.driver?.rating || 0}</div>
            <p className="text-gray-600">Rating</p>
          </div>

          <div className="card text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-gray-900">${dashboardData?.today?.earnings || 0}</div>
            <p className="text-gray-600">This Week</p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Today's Schedule</h2>
            <button 
              onClick={loadDashboardData}
              className="btn-secondary"
            >
              Refresh
            </button>
          </div>

          {dashboardData?.rides?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.rides.map((ride) => (
                <div key={ride.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
                        {ride.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{ride.booking_code}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">${ride.earnings}</p>
                      <p className="text-sm text-gray-600">{ride.pickup_time}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Customer</p>
                      <p className="text-gray-900">{ride.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Pickup</p>
                      <p className="text-gray-900">{ride.pickup_address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Destination</p>
                      <p className="text-gray-900">{ride.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Vehicle: {ride.vehicle}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusActions(ride.status, ride.id)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No rides scheduled</h3>
              <p className="text-gray-600">Check back later for new assignments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
