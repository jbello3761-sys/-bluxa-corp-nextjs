'use client'

import React from 'react'

export default function DriverPortalPage() {
  return (
    <div>
      <style jsx>{`
        body {
            font-family: 'Inter', sans-serif;
        }
        
        /* Custom BLuxA Transportation Styles */
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
        
        .hero-gradient {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #dc2626 100%);
        }
        
        .fade-in {
            animation: fadeIn 1s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
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
              <h1 className="text-2xl font-bold gradient-text">BLuxA Transportation</h1>
              <span className="ml-4 text-gray-500">Driver Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, <strong id="driverName">John Smith</strong></span>
              <button className="btn-secondary" onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('driverLoggedIn');
                  window.location.reload();
                }
              }}>Sign Out</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form (Hidden after login) */}
      <div id="loginForm" className="hidden min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Driver Portal</h2>
            <p className="mt-2 text-gray-600">Sign in to access your dashboard</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={(e) => {
            e.preventDefault();
            const email = (document.getElementById('email') as HTMLInputElement)?.value;
            const password = (document.getElementById('password') as HTMLInputElement)?.value;
            
            if (email === 'driver@bluxacorp.com' && password === 'Driver2024!') {
              if (typeof window !== 'undefined') {
                localStorage.setItem('driverLoggedIn', 'true');
                document.getElementById('loginForm')?.classList.add('hidden');
                document.getElementById('dashboard')?.classList.remove('hidden');
              }
            } else {
              alert('Invalid credentials. Use driver@bluxacorp.com / Driver2024!');
            }
          }}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="driver@bluxacorp.com"
                defaultValue="driver@bluxacorp.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="Enter your password"
                defaultValue="Driver2024!"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* Dashboard (Shown after login) */}
      <div id="dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Dashboard</h1>
          <p className="text-gray-600">Manage your rides and track your performance</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="metric-card">
            <div className="metric-value text-blue-600" id="todayRides">3</div>
            <div className="metric-label">Today's Rides</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-green-600" id="totalRides">245</div>
            <div className="metric-label">Total Rides</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-yellow-600" id="rating">4.9</div>
            <div className="metric-label">Rating</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-purple-600" id="earnings">$1,250</div>
            <div className="metric-label">This Week</div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Schedule</h2>
            <div className="space-y-4" id="todaySchedule">
              {/* Ride 1 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50" data-booking="BLX-2025-00123">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Airport Pickup - John Doe</h3>
                    <p className="text-sm text-gray-600">Executive Sedan</p>
                  </div>
                  <span className="status-badge status-completed">Completed</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <p><strong>Route:</strong> JFK Airport → Manhattan Hotel</p>
                  <p><strong>Time:</strong> 10:30 AM - 11:15 AM</p>
                  <p><strong>Booking:</strong> BLX-2025-00123</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold">$85.00</span>
                  <button className="btn-secondary" disabled>Completed</button>
                </div>
              </div>

              {/* Ride 2 */}
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50" data-booking="BLX-2025-00124">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Corporate Transfer - Jane Smith</h3>
                    <p className="text-sm text-gray-600">Luxury SUV</p>
                  </div>
                  <span className="status-badge status-in-progress">In Progress</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <p><strong>Route:</strong> Manhattan → LaGuardia Airport</p>
                  <p><strong>Time:</strong> 2:30 PM - 3:15 PM</p>
                  <p><strong>Booking:</strong> BLX-2025-00124</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-semibold">$95.00</span>
                  <button className="btn-success" onClick={() => {
                    if (confirm('Complete ride BLX-2025-00124?')) {
                      const rideElement = document.querySelector('[data-booking="BLX-2025-00124"]');
                      if (rideElement) {
                        const statusBadge = rideElement.querySelector('.status-badge');
                        if (statusBadge) {
                          statusBadge.textContent = 'Completed';
                          statusBadge.className = 'status-badge status-completed';
                        }
                        const button = rideElement.querySelector('button');
                        if (button) {
                          button.textContent = 'Completed';
                          button.className = 'btn-secondary';
                          (button as HTMLButtonElement).disabled = true;
                        }
                      }
                      console.log('Completed ride: BLX-2025-00124');
                    }
                  }}>
                    Complete Ride
                  </button>
                </div>
              </div>

              {/* Ride 3 */}
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50" data-booking="BLX-2025-00125">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Evening Event - Corporate Group</h3>
                    <p className="text-sm text-gray-600">Sprinter Van</p>
                  </div>
                  <span className="status-badge status-upcoming">Upcoming</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <p><strong>Route:</strong> Hotel → Conference Center</p>
                  <p><strong>Time:</strong> 6:00 PM - 7:00 PM</p>
                  <p><strong>Booking:</strong> BLX-2025-00125</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-semibold">$120.00</span>
                  <button className="btn-warning" onClick={() => {
                    if (confirm('Start ride BLX-2025-00125?')) {
                      const rideElement = document.querySelector('[data-booking="BLX-2025-00125"]');
                      if (rideElement) {
                        const statusBadge = rideElement.querySelector('.status-badge');
                        if (statusBadge) {
                          statusBadge.textContent = 'In Progress';
                          statusBadge.className = 'status-badge status-in-progress';
                        }
                        const button = rideElement.querySelector('button');
                        if (button) {
                          button.textContent = 'Complete Ride';
                          button.className = 'btn-success';
                        }
                      }
                      console.log('Started ride: BLX-2025-00125');
                    }
                  }}>
                    Start Ride
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Status & Vehicle Info */}
          <div className="space-y-6">
            {/* Driver Status */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Driver Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Current Status:</span>
                  <span className="status-badge status-in-progress" id="driverStatus">On Duty</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Shift Start:</span>
                  <span className="font-semibold">8:00 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Hours Today:</span>
                  <span className="font-semibold">6.5 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Next Break:</span>
                  <span className="font-semibold">4:00 PM</span>
                </div>
                <div className="pt-4 border-t">
                  <button className="btn-secondary w-full" onClick={(e) => {
                    const statusElement = document.getElementById('driverStatus');
                    const button = e.currentTarget;
                    
                    if (statusElement?.textContent === 'On Duty') {
                      statusElement.textContent = 'Off Duty';
                      statusElement.className = 'status-badge status-completed';
                      button.textContent = 'Go On Duty';
                    } else if (statusElement) {
                      statusElement.textContent = 'On Duty';
                      statusElement.className = 'status-badge status-in-progress';
                      button.textContent = 'Go Off Duty';
                    }
                  }}>
                    Go Off Duty
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Vehicle:</span>
                  <span className="font-semibold">2024 Mercedes S-Class</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">License:</span>
                  <span className="font-semibold">NYC-LUX-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Fuel Level:</span>
                  <span className="font-semibold text-green-600">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Mileage:</span>
                  <span className="font-semibold">12,450 miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Last Service:</span>
                  <span className="font-semibold">Jan 15, 2025</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="btn-primary w-full" onClick={() => {
                  const issue = prompt('Describe the vehicle issue:');
                  if (issue) {
                    alert('Issue reported successfully. Dispatch will contact you shortly.');
                    console.log('Vehicle issue reported:', issue);
                  }
                }}>
                  Report Vehicle Issue
                </button>
                <button className="btn-secondary w-full" onClick={() => {
                  if (confirm('Request a 15-minute break?')) {
                    alert('Break request sent to dispatch.');
                    console.log('Break requested');
                  }
                }}>
                  Request Break
                </button>
                <button className="btn-secondary w-full" onClick={() => {
                  alert('Earnings report feature coming soon!');
                }}>
                  View Earnings Report
                </button>
                <button className="btn-secondary w-full" onClick={() => {
                  if (confirm('Call dispatch at (555) 123-4567?')) {
                    window.location.href = 'tel:+15551234567';
                  }
                }}>
                  Contact Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Booking</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Route</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Earnings</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Jan 20, 2025</td>
                    <td className="px-4 py-3 text-sm text-gray-900">BLX-2025-00123</td>
                    <td className="px-4 py-3 text-sm text-gray-600">JFK → Manhattan</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Executive Sedan</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">$85.00</td>
                    <td className="px-4 py-3 text-sm text-yellow-600">5.0</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Jan 19, 2025</td>
                    <td className="px-4 py-3 text-sm text-gray-900">BLX-2025-00122</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Manhattan → Newark</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Luxury SUV</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">$105.00</td>
                    <td className="px-4 py-3 text-sm text-yellow-600">4.8</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Jan 19, 2025</td>
                    <td className="px-4 py-3 text-sm text-gray-900">BLX-2025-00121</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Hotel → Conference</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Sprinter Van</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">$120.00</td>
                    <td className="px-4 py-3 text-sm text-yellow-600">5.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Check if user is logged in
          let isLoggedIn = localStorage.getItem('driverLoggedIn') === 'true';
          
          function showDashboard() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
          }
          
          function showLogin() {
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('dashboard').classList.add('hidden');
          }
          
          // Initialize page
          if (isLoggedIn) {
            showDashboard();
          } else {
            showLogin();
          }
        `
      }} />
    </div>
  )
}