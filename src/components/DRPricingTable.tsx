'use client'

import React, { useState } from 'react'

interface PricingData {
  salida: string
  destino: string
  precio: number
  van4: number
  van8: number
  van24: number
}

const pricingData: PricingData[] = [
  { salida: 'AEROPUERTO AILA', destino: 'PUNTA CANA', precio: 100, van4: 120, van8: 160, van24: 380 },
  { salida: 'SANTO DOMINGO', destino: 'PUNTA CANA', precio: 115, van4: 135, van8: 175, van24: 400 },
  { salida: 'AEROPUERTO AILA', destino: 'BAVARO', precio: 110, van4: 130, van8: 170, van24: 420 },
  { salida: 'SANTO DOMINGO', destino: 'BAVARO', precio: 120, van4: 140, van8: 180, van24: 460 },
  { salida: 'AEROPUERTO AILA', destino: 'UVERO ALTO', precio: 120, van4: 140, van8: 180, van24: 480 },
  { salida: 'SANTO DOMINGO', destino: 'UVERO ALTO', precio: 140, van4: 160, van8: 200, van24: 500 },
  { salida: 'AEROPUERTO AILA', destino: 'LAS TERREBAS', precio: 135, van4: 155, van8: 195, van24: 400 },
  { salida: 'SANTO DOMINGO', destino: 'LAS TERREBAS', precio: 150, van4: 170, van8: 210, van24: 420 },
  { salida: 'AEROPUERTO AILA', destino: 'SAMANA', precio: 140, van4: 160, van8: 200, van24: 420 },
  { salida: 'SANTO DOMINGO', destino: 'SAMANA', precio: 160, van4: 180, van8: 220, van24: 450 },
  { salida: 'AEROPUERTO AILA', destino: 'LAS GALERAS', precio: 170, van4: 190, van8: 230, van24: 500 },
  { salida: 'SANTO DOMINGO', destino: 'LAS GALERAS', precio: 190, van4: 210, van8: 250, van24: 550 },
  { salida: 'AEROPUERTO AILA', destino: 'SANTIAGO', precio: 120, van4: 140, van8: 180, van24: 400 },
  { salida: 'SANTO DOMINGO', destino: 'SANTIAGO', precio: 100, van4: 120, van8: 160, van24: 360 },
  { salida: 'AEROPUERTO AILA', destino: 'LA VEGA', precio: 100, van4: 120, van8: 160, van24: 350 },
  { salida: 'SANTO DOMINGO', destino: 'LA VEGA', precio: 90, van4: 110, van8: 150, van24: 300 },
  { salida: 'AEROPUERTO AILA', destino: 'PUERTO PLATA', precio: 170, van4: 190, van8: 230, van24: 500 },
  { salida: 'SANTO DOMINGO', destino: 'PUERTO PLATA', precio: 150, van4: 170, van8: 210, van24: 400 },
  { salida: 'AEROPUERTO AILA', destino: 'SOSUA', precio: 180, van4: 200, van8: 240, van24: 550 },
  { salida: 'SANTO DOMINGO', destino: 'SOSUA', precio: 160, van4: 180, van8: 220, van24: 450 },
  { salida: 'AEROPUERTO AILA', destino: 'ROMANA', precio: 80, van4: 100, van8: 140, van24: 300 },
  { salida: 'SANTO DOMINGO', destino: 'ROMANA', precio: 90, van4: 110, van8: 150, van24: 350 },
  { salida: 'AEROPUERTO AILA', destino: 'BAYHIBE', precio: 85, van4: 105, van8: 145, van24: 300 },
  { salida: 'SANTO DOMINGO', destino: 'BAYHIBE', precio: 90, van4: 110, van8: 150, van24: 350 },
  { salida: 'AEROPUERTO AILA', destino: 'HIGUEY', precio: 90, van4: 110, van8: 150, van24: 370 },
  { salida: 'SANTO DOMINGO', destino: 'HIGUEY', precio: 95, van4: 115, van8: 155, van24: 390 },
]

export function DRPricingTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'salida' | 'destino' | 'precio'>('salida')

  const filteredData = pricingData
    .filter(item => 
      item.salida.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.destino.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'precio') {
        return a.precio - b.precio
      }
      return a[sortBy].localeCompare(b[sortBy])
    })

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Dominican Republic Route Pricing</h3>
        <p className="text-gray-600 mb-4">
          Complete pricing matrix for all routes in the Dominican Republic. All prices in USD.
        </p>
        
        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'salida' | 'destino' | 'precio')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="salida">Sort by Departure</option>
              <option value="destino">Sort by Destination</option>
              <option value="precio">Sort by Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Departure</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Destination</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Base Price</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Van 4+</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Van 8+</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Van 24+ Round Trip</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-4 py-3 text-gray-900 font-medium">
                  {item.salida}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-900 font-medium">
                  {item.destino}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-900 font-semibold">
                  ${item.precio}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-900">
                  ${item.van4}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-900">
                  ${item.van8}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-900">
                  ${item.van24}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Vehicle Options:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <span className="font-medium">Base Price:</span> Standard sedan or SUV
          </div>
          <div>
            <span className="font-medium">Van 4+:</span> Comfortable van for 4+ passengers
          </div>
          <div>
            <span className="font-medium">Van 8+:</span> Large van for 8+ passengers
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-700">
          <span className="font-medium">Van 24+ Round Trip:</span> Large group transportation with round trip service
        </div>
      </div>

      {/* Booking CTA */}
      <div className="mt-6 text-center">
        <button 
          onClick={() => window.location.href = '/book?location=dr'}
          className="bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Book Your Dominican Republic Transfer
        </button>
      </div>
    </div>
  )
}

