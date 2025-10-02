'use client'

import React, { useState, useEffect } from 'react'

export default function DriverPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })

  // Mock authentication check
  useEffect(() => {
    const authStatus = localStorage.getItem('driverAuth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo credentials: driver@bluxacorp.com / Driver2024!
    if (loginData.email === 'driver@bluxacorp.com' && loginData.password === 'Driver2024!') {
      localStorage.setItem('driverAuth', 'true')
      setIsAuthenticated(true)
    } else {
      alert('Invalid credentials. Use: driver@bluxacorp.com / Driver2024!')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('driverAuth')
    setIsAuthenticated(false)
  }

  const updateRideStatus = (rideId: string, newStatus: string) => {
    console.log(`Updating ride ${rideId} to ${newStatus}`)
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
            <h2 className="text-xl font-semibold text-gray-900">Driver Portal</h2>
            <p className="text-gray-600 mt-2">Sign in to access your driver dashboard</p>
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
                placeholder="driver@bluxacorp.com"
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
              Email: driver@bluxacorp.com<br />
              Password: Driver2024!
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
        
        .btn-warning {
          background: #f59e0b;
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
        
        .status-upcoming {
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
      `}</style>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">BLuxA Corp</h1>
              <span className="ml-4 text-gray-500">Driver Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, <strong>Michael Johnson</strong></span>
              <button className="btn-secondary" onClick={handleLogout}>Sign Out</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Driver Dashboard</h2>
          <p className="text-gray-600">Manage your rides and track your performance</p>
        </div>

        {/* Today's Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="metric-card">
            <div className="metric-value text-blue-600">3</div>
            <div className="metric-label">Rides Scheduled</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-green-600">245</div>
            <div className="metric-label">Total Rides Completed</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-yellow-600">4.9</div>
            <div className="metric-label">Current Rating</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-purple-600">$1,250</div>
            <div className="metric-label">Weekly Earnings</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Schedule */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Today's Schedule</h3>
            
            <div className="space-y-4">
              {[
                {
                  id: 'BLX-2025-001',
                  time: '14:30',
                  customer: 'John Smith',
                  pickup: '123 Park Avenue, NYC',
                  destination: 'JFK Airport',
                  status: 'upcoming',
                  duration: '45 min'
                },
                {
                  id: 'BLX-2025-002',
                  time: '16:00',
                  customer: 'Sarah Davis',
                  pickup: 'Corporate Plaza, Manhattan',
                  destination: 'LaGuardia Airport',
                  status: 'in-progress',
                  duration: '35 min'
                },
                {
                  id: 'BLX-2025-003',
                  time: '18:30',
                  customer: 'Robert Wilson',
                  pickup: 'Grand Central Terminal',
                  destination: '456 Broadway, NYC',
                  status: 'upcoming',
                  duration: '25 min'
                }
              ].map((ride) => (
                <div key={ride.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg text-blue-600">{ride.time}</span>
                        <span className={`status-badge status-${ride.status}`}>
                          {ride.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Booking ID: {ride.id}</p>
                    </div>
                    <span className="text-sm text-gray-500">{ride.duration}</span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="font-semibold text-gray-900">{ride.customer}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">📍</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pickup:</p>
                        <p className="text-sm text-gray-600">{ride.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-600 mr-2">🎯</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Destination:</p>
                        <p className="text-sm text-gray-600">{ride.destination}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {ride.status === 'upcoming' && (
                      <>
                        <button 
                          className="btn-success flex-1"
                          onClick={() => updateRideStatus(ride.id, 'in-progress')}
                        >
                          Start Ride
                        </button>
                        <button className="btn-secondary">Contact Customer</button>
                      </>
                    )}
                    {ride.status === 'in-progress' && (
                      <>
                        <button 
                          className="btn-primary flex-1"
                          onClick={() => updateRideStatus(ride.id, 'completed')}
                        >
                          Complete Ride
                        </button>
                        <button className="btn-warning">Update Status</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Tracking */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Tracking</h3>
            
            <div className="space-y-6">
              {/* Rating Breakdown */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Rating Breakdown</h4>
                <div className="space-y-2">
                  {[
                    { stars: 5, count: 198, percentage: 81 },
                    { stars: 4, count: 35, percentage: 14 },
                    { stars: 3, count: 8, percentage: 3 },
                    { stars: 2, count: 3, percentage: 1 },
                    { stars: 1, count: 1, percentage: 1 }
                  ].map((rating) => (
                    <div key={rating.stars} className="flex items-center space-x-3">
                      <span className="text-sm w-8">{rating.stars}⭐</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12">{rating.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Stats */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">This Week's Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">18</div>
                    <div className="text-sm text-blue-800">Rides Completed</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$1,250</div>
                    <div className="text-sm text-green-800">Earnings</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">42h</div>
                    <div className="text-sm text-purple-800">Hours Worked</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">4.9</div>
                    <div className="text-sm text-yellow-800">Avg Rating</div>
                  </div>
                </div>
              </div>

              {/* Recent Feedback */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recent Customer Feedback</h4>
                <div className="space-y-3">
                  {[
                    { customer: 'John S.', rating: 5, comment: 'Excellent service! Very professional and punctual.' },
                    { customer: 'Sarah D.', rating: 5, comment: 'Smooth ride and great conversation. Highly recommend!' },
                    { customer: 'Robert W.', rating: 4, comment: 'Good service, clean vehicle. Thank you!' }
                  ].map((feedback, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{feedback.customer}</span>
                        <span className="text-yellow-500">{'⭐'.repeat(feedback.rating)}</span>
                      </div>
                      <p className="text-sm text-gray-600">"{feedback.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="btn-primary">Report Issue</button>
              <button className="btn-secondary">Update Availability</button>
              <button className="btn-secondary">View Earnings Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}