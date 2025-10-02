'use client'

import React from 'react'

export default function AdminPortalPage() {
  return (
    <div>
      <style jsx>{`
        body {
            font-family: 'Inter', sans-serif;
        }
        
        /* Custom BLuxA Corp Styles */
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
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
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
              <span className="text-gray-700">Welcome, <strong id="adminName">Admin User</strong></span>
              <button className="btn-secondary" onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('adminLoggedIn');
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
            <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
            <p className="mt-2 text-gray-600">Sign in to access the admin dashboard</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={(e) => {
            e.preventDefault();
            const email = (document.getElementById('email') as HTMLInputElement)?.value;
            const password = (document.getElementById('password') as HTMLInputElement)?.value;
            
            if (email === 'admin@bluxacorp.com' && password === 'BLuxA2024Admin!') {
              if (typeof window !== 'undefined') {
                localStorage.setItem('adminLoggedIn', 'true');
                document.getElementById('loginForm')?.classList.add('hidden');
                document.getElementById('dashboard')?.classList.remove('hidden');
              }
            } else {
              alert('Invalid credentials. Use admin@bluxacorp.com / BLuxA2024Admin!');
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
                placeholder="admin@bluxacorp.com"
                defaultValue="admin@bluxacorp.com"
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
                defaultValue="BLuxA2024Admin!"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings, drivers, vehicles, and system settings</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="metric-card">
            <div className="metric-value text-blue-600" id="totalBookings">156</div>
            <div className="metric-label">Total Bookings</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-green-600" id="activeDrivers">12</div>
            <div className="metric-label">Active Drivers</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-purple-600" id="totalVehicles">8</div>
            <div className="metric-label">Total Vehicles</div>
          </div>
          <div className="metric-card">
            <div className="metric-value text-yellow-600" id="monthlyRevenue">$45,230</div>
            <div className="metric-label">Monthly Revenue</div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="tab-button active" onClick={(e) => {
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
                document.getElementById('bookings-tab')?.classList.add('active');
                e.currentTarget.classList.add('active');
              }}>Bookings</button>
              <button className="tab-button" onClick={(e) => {
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
                document.getElementById('drivers-tab')?.classList.add('active');
                e.currentTarget.classList.add('active');
              }}>Drivers</button>
              <button className="tab-button" onClick={(e) => {
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
                document.getElementById('vehicles-tab')?.classList.add('active');
                e.currentTarget.classList.add('active');
              }}>Vehicles</button>
              <button className="tab-button" onClick={(e) => {
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
                document.getElementById('settings-tab')?.classList.add('active');
                e.currentTarget.classList.add('active');
              }}>Settings</button>
              <button className="tab-button" onClick={(e) => {
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
                document.getElementById('reports-tab')?.classList.add('active');
                e.currentTarget.classList.add('active');
              }}>Reports</button>
            </nav>
          </div>

          {/* Bookings Tab */}
          <div id="bookings-tab" className="tab-content active p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
              <div className="flex space-x-4">
                <select className="input-field w-auto" onChange={(e) => console.log('Filter:', e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="btn-primary" onClick={() => alert('Exporting bookings to CSV...')}>Export</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Booking ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Route</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Driver</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200" id="bookingsTable">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">BLX-2025-00125</td>
                    <td className="px-4 py-3 text-sm text-gray-600">John Smith</td>
                    <td className="px-4 py-3 text-sm text-gray-600">JFK → Manhattan</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Executive Sedan</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Mike Johnson</td>
                    <td className="px-4 py-3"><span className="status-badge status-confirmed">Confirmed</span></td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">$85.00</td>
                    <td className="px-4 py-3">
                      <button className="btn-secondary mr-2" onClick={() => alert('Viewing booking BLX-2025-00125')}>View</button>
                      <button className="btn-success" onClick={() => {
                        const driver = prompt('Enter driver ID to assign:');
                        if (driver) alert(`Driver ${driver} assigned to booking BLX-2025-00125`);
                      }}>Assign</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">BLX-2025-00124</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Jane Doe</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Manhattan → LGA</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Luxury SUV</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Sarah Wilson</td>
                    <td className="px-4 py-3"><span className="status-badge status-in-progress">In Progress</span></td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">$95.00</td>
                    <td className="px-4 py-3">
                      <button className="btn-secondary mr-2" onClick={() => alert('Viewing booking BLX-2025-00124')}>View</button>
                      <button className="btn-secondary" onClick={() => alert('Opening real-time tracking for BLX-2025-00124')}>Track</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">BLX-2025-00123</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Corporate Group</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Hotel → Conference</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Sprinter Van</td>
                    <td className="px-4 py-3 text-sm text-gray-600">David Brown</td>
                    <td className="px-4 py-3"><span className="status-badge status-completed">Completed</span></td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">$120.00</td>
                    <td className="px-4 py-3">
                      <button className="btn-secondary mr-2" onClick={() => alert('Viewing booking BLX-2025-00123')}>View</button>
                      <button className="btn-secondary" onClick={() => alert('Generating invoice for BLX-2025-00123')}>Invoice</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Drivers Tab */}
          <div id="drivers-tab" className="tab-content p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Driver Management</h2>
              <button className="btn-primary" onClick={() => alert('Opening add driver form...')}>Add New Driver</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">MJ</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Mike Johnson</h3>
                      <p className="text-sm text-gray-600">DRV-001</p>
                    </div>
                  </div>
                  <span className="status-badge status-confirmed">Active</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold">4.9 ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Rides:</span>
                    <span className="font-semibold">245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-semibold">Mercedes S-Class</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="btn-secondary flex-1" onClick={() => alert('Editing driver DRV-001')}>Edit</button>
                  <button className="btn-secondary flex-1" onClick={() => alert('Viewing details for driver DRV-001')}>Details</button>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-semibold">SW</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Sarah Wilson</h3>
                      <p className="text-sm text-gray-600">DRV-002</p>
                    </div>
                  </div>
                  <span className="status-badge status-in-progress">On Duty</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold">4.8 ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Rides:</span>
                    <span className="font-semibold">189</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-semibold">BMW X7</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="btn-secondary flex-1" onClick={() => alert('Editing driver DRV-002')}>Edit</button>
                  <button className="btn-secondary flex-1" onClick={() => alert('Viewing details for driver DRV-002')}>Details</button>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 font-semibold">DB</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">David Brown</h3>
                      <p className="text-sm text-gray-600">DRV-003</p>
                    </div>
                  </div>
                  <span className="status-badge status-completed">Off Duty</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold">5.0 ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Rides:</span>
                    <span className="font-semibold">312</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-semibold">Mercedes Sprinter</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="btn-secondary flex-1" onClick={() => alert('Editing driver DRV-003')}>Edit</button>
                  <button className="btn-secondary flex-1" onClick={() => alert('Viewing details for driver DRV-003')}>Details</button>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicles Tab */}
          <div id="vehicles-tab" className="tab-content p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
              <button className="btn-primary" onClick={() => alert('Opening add vehicle form...')}>Add New Vehicle</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Vehicle ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Make/Model</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">License</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Assigned Driver</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">VEH-001</td>
                    <td className="px-4 py-3 text-sm text-gray-600">2024 Mercedes S-Class</td>
                    <td className="px-4 py-3 text-sm text-gray-600">NYC-LUX-001</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Executive Sedan</td>
                    <td className="px-4 py-3"><span className="status-badge status-confirmed">Active</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">Mike Johnson</td>
                    <td className="px-4 py-3">
                      <button className="btn-secondary mr-2" onClick={() => alert('Editing vehicle VEH-001')}>Edit</button>
                      <button className="btn-secondary" onClick={() => alert('Viewing maintenance records for VEH-001')}>Maintenance</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">VEH-002</td>
                    <td className="px-4 py-3 text-sm text-gray-600">2024 BMW X7</td>
                    <td className="px-4 py-3 text-sm text-gray-600">NYC-LUX-002</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Luxury SUV</td>
                    <td className="px-4 py-3"><span className="status-badge status-in-progress">In Use</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">Sarah Wilson</td>
                    <td className="px-4 py-3">
                      <button className="btn-secondary mr-2" onClick={() => alert('Editing vehicle VEH-002')}>Edit</button>
                      <button className="btn-secondary" onClick={() => alert('Viewing maintenance records for VEH-002')}>Maintenance</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">VEH-003</td>
                    <td className="px-4 py-3 text-sm text-gray-600">2024 Mercedes Sprinter</td>
                    <td className="px-4 py-3 text-sm text-gray-600">NYC-LUX-003</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Sprinter Van</td>
                    <td className="px-4 py-3"><span className="status-badge status-completed">Available</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">David Brown</td>
                    <td className="px-4 py-3">
                      <button className="btn-secondary mr-2" onClick={() => alert('Editing vehicle VEH-003')}>Edit</button>
                      <button className="btn-secondary" onClick={() => alert('Viewing maintenance records for VEH-003')}>Maintenance</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Settings Tab */}
          <div id="settings-tab" className="tab-content p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Executive Sedan (per hour)</label>
                    <input type="number" className="input-field" defaultValue="65" id="sedanRate" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Luxury SUV (per hour)</label>
                    <input type="number" className="input-field" defaultValue="95" id="suvRate" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sprinter Van (per hour)</label>
                    <input type="number" className="input-field" defaultValue="120" id="vanRate" />
                  </div>
                  <button className="btn-primary" onClick={() => {
                    const sedanRate = (document.getElementById('sedanRate') as HTMLInputElement)?.value;
                    const suvRate = (document.getElementById('suvRate') as HTMLInputElement)?.value;
                    const vanRate = (document.getElementById('vanRate') as HTMLInputElement)?.value;
                    alert(`Pricing saved: Sedan $${sedanRate}, SUV $${suvRate}, Van $${vanRate}`);
                  }}>Save Pricing</button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Webhook URL</label>
                    <input type="url" className="input-field" placeholder="https://api.bluxacorp.com/webhooks/stripe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Service Provider</label>
                    <select className="input-field">
                      <option>Resend</option>
                      <option>SendGrid</option>
                      <option>Mailgun</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Integration</label>
                    <input type="url" className="input-field" placeholder="https://make.com/webhook/..." />
                  </div>
                  <button className="btn-primary" onClick={() => alert('API configuration saved successfully!')}>Save Configuration</button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input type="text" className="input-field" defaultValue="BLuxA Corp" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input type="tel" className="input-field" defaultValue="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Area</label>
                    <input type="text" className="input-field" defaultValue="New York Metropolitan Area" />
                  </div>
                  <button className="btn-primary" onClick={() => alert('Business settings saved successfully!')}>Save Settings</button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Database Connection:</span>
                    <span className="status-badge status-completed">Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Stripe Integration:</span>
                    <span className="status-badge status-completed">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Email Service:</span>
                    <span className="status-badge status-completed">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">WhatsApp Service:</span>
                    <span className="status-badge status-confirmed">Connected</span>
                  </div>
                  <button className="btn-secondary w-full" onClick={() => alert('Running system check... All systems operational!')}>Run System Check</button>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Tab */}
          <div id="reports-tab" className="tab-content p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Report</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Today:</span>
                    <span className="font-semibold text-green-600">$1,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">This Week:</span>
                    <span className="font-semibold text-green-600">$8,750</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">This Month:</span>
                    <span className="font-semibold text-green-600">$45,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">This Year:</span>
                    <span className="font-semibold text-green-600">$425,680</span>
                  </div>
                  <button className="btn-secondary w-full" onClick={() => alert('Exporting revenue report to PDF...')}>Export Revenue Report</button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Average Rating:</span>
                    <span className="font-semibold">4.9 ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Completion Rate:</span>
                    <span className="font-semibold text-green-600">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">On-Time Rate:</span>
                    <span className="font-semibold text-green-600">96.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Customer Retention:</span>
                    <span className="font-semibold text-blue-600">87%</span>
                  </div>
                  <button className="btn-secondary w-full" onClick={() => alert('Exporting performance metrics to Excel...')}>Export Metrics Report</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Check if user is logged in
          let isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
          
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