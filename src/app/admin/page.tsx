// src/app/admin/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useSession, useRequireAuth } from '@/components/auth/AuthProvider'
import { api } from '@/lib/api'

export default function AdminPortalPage() {
  // Require authentication and redirect if not logged in
  useRequireAuth('/admin')
  
  const { user } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saveStatus, setSaveStatus] = useState('')

  // Check if user has admin role
  useEffect(() => {
    if (user?.user_metadata?.role === 'admin') {
      setIsAuthenticated(true)
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // This would call your backend API
      const response = await api.get('/admin/dashboard')
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
      if (loginData.email === 'admin@bluxacorp.com' && loginData.password === 'BLuxA2024Admin!') {
        setIsAuthenticated(true)
        // Load mock dashboard data
        setDashboardData({
          stats: {
            total_bookings: 1247,
            active_drivers: 23,
            total_vehicles: 15,
            monthly_revenue: 125000
          },
          recent_bookings: [
            {
              id: '1',
              booking_code: 'BLX-2025-00123',
              customer_name: 'John Doe',
              pickup_address: 'JFK Airport',
              destination: 'Manhattan Hotel',
              status: 'completed',
              amount: 450,
              driver: 'John Smith',
              created_at: '2025-01-15 10:30'
            },
            {
              id: '2',
              booking_code: 'BLX-2025-00124',
              customer_name: 'Jane Smith',
              pickup_address: 'Manhattan',
              destination: 'LaGuardia Airport',
              status: 'in_progress',
              amount: 520,
              driver: 'Mike Johnson',
              created_at: '2025-01-15 14:30'
            }
          ],
          drivers: [
            { id: '1', name: 'John Smith', status: 'available', rating: 4.9, total_rides: 245 },
            { id: '2', name: 'Mike Johnson', status: 'busy', rating: 4.8, total_rides: 189 },
            { id: '3', name: 'Sarah Wilson', status: 'available', rating: 4.95, total_rides: 312 }
          ],
          vehicles: [
            { id: '1', type: 'Executive Sedan', model: 'BMW 7 Series', status: 'available', driver: 'John Smith' },
            { id: '2', type: 'Luxury SUV', model: 'Mercedes GLS', status: 'in_use', driver: 'Mike Johnson' },
            { id: '3', type: 'Sprinter Van', model: 'Mercedes Sprinter', status: 'maintenance', driver: null }
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

  const handleSave = async (section: string) => {
    setSaveStatus('saving')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="card">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
              <p className="text-gray-600">Sign in to access the admin dashboard</p>
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
                  placeholder="admin@bluxacorp.com"
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
                  'Login to Admin Portal'
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong><br />
                Email: admin@bluxacorp.com<br />
                Password: BLuxA2024Admin!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">BLuxA Corp Management Portal</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: '📊' },
                { id: 'bookings', name: 'Bookings', icon: '📋' },
                { id: 'drivers', name: 'Drivers', icon: '👨‍💼' },
                { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
                { id: 'settings', name: 'Settings', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.total_bookings || 0}</div>
                <p className="text-gray-600">Total Bookings</p>
              </div>

              <div className="card text-center">
                <div className="text-3xl mb-2">👨‍💼</div>
                <div className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.active_drivers || 0}</div>
                <p className="text-gray-600">Active Drivers</p>
              </div>

              <div className="card text-center">
                <div className="text-3xl mb-2">🚗</div>
                <div className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.total_vehicles || 0}</div>
                <p className="text-gray-600">Total Vehicles</p>
              </div>

              <div className="card text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-gray-900">${dashboardData?.stats?.monthly_revenue?.toLocaleString() || 0}</div>
                <p className="text-gray-600">Monthly Revenue</p>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Booking Code</th>
                      <th className="text-left py-2">Customer</th>
                      <th className="text-left py-2">Route</th>
                      <th className="text-left py-2">Driver</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recent_bookings?.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100">
                        <td className="py-3 font-medium">{booking.booking_code}</td>
                        <td className="py-3">{booking.customer_name}</td>
                        <td className="py-3 text-sm">{booking.pickup_address} → {booking.destination}</td>
                        <td className="py-3">{booking.driver}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 font-medium">${booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Bookings</h2>
              <button className="btn-primary">New Booking</button>
            </div>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Bookings Management</h3>
              <p className="text-gray-600">View, edit, and manage all customer bookings</p>
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Drivers</h2>
              <button className="btn-primary">Add Driver</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData?.drivers?.map((driver) => (
                <div key={driver.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      driver.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Rating: {driver.rating} ⭐</p>
                    <p>Total Rides: {driver.total_rides}</p>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="btn-secondary text-xs">Edit</button>
                    <button className="btn-secondary text-xs">Assign</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Vehicles</h2>
              <button className="btn-primary">Add Vehicle</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData?.vehicles?.map((vehicle) => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{vehicle.type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                      vehicle.status === 'in_use' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Model: {vehicle.model}</p>
                    <p>Driver: {vehicle.driver || 'Unassigned'}</p>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="btn-secondary text-xs">Edit</button>
                    <button className="btn-secondary text-xs">Assign</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Executive Sedan Rate</label>
                      <input type="number" className="input-field" defaultValue="65" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Luxury SUV Rate</label>
                      <input type="number" className="input-field" defaultValue="95" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sprinter Van Rate</label>
                      <input type="number" className="input-field" defaultValue="120" />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSave('pricing')}
                    className="btn-primary mt-4"
                  >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Pricing'}
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stripe API Key</label>
                      <input type="password" className="input-field" placeholder="sk_test_..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Service Key</label>
                      <input type="password" className="input-field" placeholder="API key..." />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSave('api')}
                    className="btn-primary mt-4"
                  >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save API Config'}
                  </button>
                </div>
              </div>

              {saveStatus === 'success' && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm">✓ Settings saved successfully!</p>
                </div>
              )}

              {saveStatus === 'error' && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">✗ Failed to save settings. Please try again.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
