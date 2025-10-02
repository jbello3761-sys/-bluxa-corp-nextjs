'use client'

import React, { useState, useEffect } from 'react'

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState('bookings')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })

  // Mock authentication check
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo credentials: admin@bluxacorp.com / BLuxA2024Admin!
    if (loginData.email === 'admin@bluxacorp.com' && loginData.password === 'BLuxA2024Admin!') {
      localStorage.setItem('adminAuth', 'true')
      setIsAuthenticated(true)
    } else {
      alert('Invalid credentials. Use: admin@bluxacorp.com / BLuxA2024Admin!')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
    setActiveTab('bookings')
  }

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    console.log(`Updating booking ${bookingId} to ${newStatus}`)
    // In real app, this would make an API call
  }

  const assignDriver = (bookingId: string, driverId: string) => {
    console.log(`Assigning driver ${driverId} to booking ${bookingId}`)
    // In real app, this would make an API call
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <style jsx>{`
          .btn-primary {
            background: linear-gradient(135deg, #2563eb 0%, #dc2626 100%);
            color: white;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            width: 100%;
          }
          
          .btn-primary:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #b91c1c 100%);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
          }
          
          .input-field {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
            background: white;
          }
          
          .input-field:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          
          .gradient-text {
            background: linear-gradient(135deg, #2563eb 0%, #dc2626 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>

        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">BLuxA Corp</h1>
            <h2 className="text-xl font-semibold text-gray-900">Admin Portal</h2>
            <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="input-field"
                placeholder="admin@bluxacorp.com"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input-field"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Sign In
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
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <style jsx>{`
        .btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #dc2626 100%);
          color: white;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #b91c1c 100%);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }
        
        .btn-secondary {
          background: white;
          color: #374151;
          border: 2px solid #d1d5db;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 14px;
        }
        
        .btn-secondary:hover {
          border-color: #9ca3af;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .btn-success {
          background: #10b981;
          color: white;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
        
        .btn-danger {
          background: #ef4444;
          color: white;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
        
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          padding: 24px;
          border: 1px solid #f3f4f6;
          transition: all 0.3s ease;
        }
        
        .card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #dc2626 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-pending {
          background: #fef3c7;
          color: #d97706;
        }
        
        .status-confirmed {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .status-in-progress {
          background: #fef3c7;
          color: #d97706;
        }
        
        .status-completed {
          background: #d1fae5;
          color: #065f46;
        }
        
        .status-cancelled {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .metric-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
        }
        
        .metric-value {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 8px;
        }
        
        .metric-label {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }
        
        .tab-button {
          padding: 12px 24px;
          border: none;
          background: transparent;
          color: #6b7280;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .tab-button.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">BLuxA Corp</h1>
              <span className="ml-4 text-gray-500">Admin Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, <strong>Admin User</strong></span>
              <button className="btn-secondary" onClick={handleLogout}>Sign Out</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Manage your luxury transportation business</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="metric-card">
            <div className="metric-value text-blue-600">156</div>
            <div className="metric-label">Total Bookings</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-green-600">12</div>
            <div className="metric-label">Active Drivers</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-purple-600">8</div>
            <div className="metric-label">Total Vehicles</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-red-600">$45,230</div>
            <div className="metric-label">Monthly Revenue</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'bookings', label: 'Bookings Management' },
                { id: 'drivers', label: 'Driver Management' },
                { id: 'vehicles', label: 'Vehicle Management' },
                { id: 'settings', label: 'System Settings' },
                { id: 'reports', label: 'Reports & Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Bookings Management Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
                  <button className="btn-primary">Add New Booking</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Booking ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Date & Time</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Driver</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'BLX-2025-001', customer: 'John Smith', service: 'Airport Transfer', date: '2025-01-15 14:30', status: 'confirmed', driver: 'Michael Johnson' },
                        { id: 'BLX-2025-002', customer: 'Sarah Davis', service: 'Corporate Travel', date: '2025-01-15 16:00', status: 'pending', driver: 'Unassigned' },
                        { id: 'BLX-2025-003', customer: 'Robert Wilson', service: 'Special Event', date: '2025-01-16 18:00', status: 'in-progress', driver: 'David Brown' }
                      ].map((booking) => (
                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-blue-600">{booking.id}</td>
                          <td className="py-3 px-4">{booking.customer}</td>
                          <td className="py-3 px-4">{booking.service}</td>
                          <td className="py-3 px-4">{booking.date}</td>
                          <td className="py-3 px-4">
                            <span className={`status-badge status-${booking.status}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{booking.driver}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="btn-success" onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                                Confirm
                              </button>
                              <button className="btn-secondary" onClick={() => assignDriver(booking.id, 'driver-1')}>
                                Assign
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Driver Management Tab */}
            {activeTab === 'drivers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Driver Management</h3>
                  <button className="btn-primary">Add New Driver</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { id: 1, name: 'Michael Johnson', rating: 4.9, rides: 245, status: 'Active', vehicle: 'Mercedes S-Class' },
                    { id: 2, name: 'David Brown', rating: 4.8, rides: 189, status: 'On Duty', vehicle: 'BMW X7' },
                    { id: 3, name: 'James Wilson', rating: 4.7, rides: 156, status: 'Off Duty', vehicle: 'Mercedes Sprinter' }
                  ].map((driver) => (
                    <div key={driver.id} className="card">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                          <span className="text-lg font-bold text-gray-600">
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{driver.name}</h4>
                          <p className="text-sm text-gray-600">{driver.vehicle}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <span className="font-semibold">⭐ {driver.rating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Rides:</span>
                          <span className="font-semibold">{driver.rides}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`status-badge ${driver.status === 'Active' ? 'status-completed' : driver.status === 'On Duty' ? 'status-confirmed' : 'status-pending'}`}>
                            {driver.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="btn-secondary flex-1">Edit</button>
                        <button className="btn-success flex-1">Assign</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vehicle Management Tab */}
            {activeTab === 'vehicles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Vehicle Management</h3>
                  <button className="btn-primary">Add New Vehicle</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { id: 1, model: 'Mercedes S-Class', license: 'NYC-001', status: 'Active', driver: 'Michael Johnson', mileage: '45,230' },
                    { id: 2, model: 'BMW X7', license: 'NYC-002', status: 'In Use', driver: 'David Brown', mileage: '32,100' },
                    { id: 3, model: 'Mercedes Sprinter', license: 'NYC-003', status: 'Maintenance', driver: 'Unassigned', mileage: '67,890' }
                  ].map((vehicle) => (
                    <div key={vehicle.id} className="card">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">🚗</div>
                        <h4 className="font-bold text-gray-900">{vehicle.model}</h4>
                        <p className="text-sm text-gray-600">License: {vehicle.license}</p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`status-badge ${vehicle.status === 'Active' ? 'status-completed' : vehicle.status === 'In Use' ? 'status-confirmed' : 'status-pending'}`}>
                            {vehicle.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Driver:</span>
                          <span className="font-semibold">{vehicle.driver}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mileage:</span>
                          <span className="font-semibold">{vehicle.mileage} mi</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="btn-secondary flex-1">Edit</button>
                        <button className="btn-success flex-1">Assign</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">System Settings</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing Configuration</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Executive Sedan (per hour)</label>
                        <input type="number" className="input-field" defaultValue="65" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Luxury SUV (per hour)</label>
                        <input type="number" className="input-field" defaultValue="95" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sprinter Van (per hour)</label>
                        <input type="number" className="input-field" defaultValue="120" />
                      </div>
                      <button className="btn-primary">Update Pricing</button>
                    </div>
                  </div>

                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input type="text" className="input-field" defaultValue="BLuxA Corp" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" className="input-field" defaultValue="(555) 123-4567" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" className="input-field" defaultValue="info@bluxacorp.com" />
                      </div>
                      <button className="btn-primary">Update Information</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports & Analytics Tab */}
            {activeTab === 'reports' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Reports & Analytics</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Today's Revenue:</span>
                        <span className="text-2xl font-bold text-green-600">$2,450</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">This Week:</span>
                        <span className="text-xl font-semibold text-blue-600">$12,300</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">This Month:</span>
                        <span className="text-xl font-semibold text-purple-600">$45,230</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">This Year:</span>
                        <span className="text-xl font-semibold text-red-600">$234,560</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Rating:</span>
                        <span className="text-xl font-semibold">⭐ 4.8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Completion Rate:</span>
                        <span className="text-xl font-semibold text-green-600">98.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">On-Time Rate:</span>
                        <span className="text-xl font-semibold text-blue-600">96.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Customer Satisfaction:</span>
                        <span className="text-xl font-semibold text-purple-600">4.9/5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex space-x-4">
                    <button className="btn-primary">Export PDF Report</button>
                    <button className="btn-secondary">Export Excel Report</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}