'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

// Types
interface Country {
  id: string
  code: string
  name: string
  currency: string
  is_active: boolean
}

interface VehicleClass {
  id: string
  name: string
  description: string
  capacity: number
  base_multiplier: number
  is_active: boolean
}

interface PricingZone {
  id: string
  country_id: string
  name: string
  description: string
  min_distance_km: number
  max_distance_km: number
  is_active: boolean
}

interface PricingRule {
  id: string
  country_id: string
  vehicle_class_id: string
  zone_id: string
  base_price: number
  price_per_km: number
  minimum_charge: number
  is_active: boolean
}

interface TimeModifier {
  id: string
  country_id: string
  name: string
  description: string
  day_of_week: number[]
  start_time: string
  end_time: string
  multiplier: number
  is_active: boolean
}

interface AddonService {
  id: string
  country_id: string
  name: string
  description: string
  price: number
  price_type: string
  is_active: boolean
}

interface PricingCalculation {
  base_price: number
  distance_price: number
  time_modifier_price: number
  addon_price: number
  total_price: number
  currency: string
  breakdown: any
}

// Main Pricing Management Component
export default function PricingManagement() {
  const [activeTab, setActiveTab] = useState('matrix')
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [countries, setCountries] = useState<Country[]>([])
  const [vehicleClasses, setVehicleClasses] = useState<VehicleClass[]>([])
  const [pricingZones, setPricingZones] = useState<PricingZone[]>([])
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([])
  const [timeModifiers, setTimeModifiers] = useState<TimeModifier[]>([])
  const [addonServices, setAddonServices] = useState<AddonService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load all data in parallel
      const [
        countriesRes,
        vehicleClassesRes,
        pricingZonesRes,
        pricingRulesRes,
        timeModifiersRes,
        addonServicesRes
      ] = await Promise.all([
        supabase.from('countries').select('*').order('code'),
        supabase.from('vehicle_classes').select('*').order('name'),
        supabase.from('pricing_zones').select('*').order('name'),
        supabase.from('pricing_rules').select('*'),
        supabase.from('time_modifiers').select('*').order('name'),
        supabase.from('addon_services').select('*').order('name')
      ])

      if (countriesRes.error) throw countriesRes.error
      if (vehicleClassesRes.error) throw vehicleClassesRes.error
      if (pricingZonesRes.error) throw pricingZonesRes.error
      if (pricingRulesRes.error) throw pricingRulesRes.error
      if (timeModifiersRes.error) throw timeModifiersRes.error
      if (addonServicesRes.error) throw addonServicesRes.error

      setCountries(countriesRes.data || [])
      setVehicleClasses(vehicleClassesRes.data || [])
      setPricingZones(pricingZonesRes.data || [])
      setPricingRules(pricingRulesRes.data || [])
      setTimeModifiers(timeModifiersRes.data || [])
      setAddonServices(addonServicesRes.data || [])

      // Set default country
      if (countriesRes.data && countriesRes.data.length > 0) {
        setSelectedCountry(countriesRes.data[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId)
  }

  const toggleRuleStatus = async (ruleId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('pricing_rules')
        .update({ is_active: !isActive })
        .eq('id', ruleId)

      if (error) throw error

      // Update local state
      setPricingRules(prev => 
        prev.map(rule => 
          rule.id === ruleId ? { ...rule, is_active: !isActive } : rule
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rule')
    }
  }

  const updatePricingRule = async (ruleId: string, updates: Partial<PricingRule>) => {
    try {
      const { error } = await supabase
        .from('pricing_rules')
        .update(updates)
        .eq('id', ruleId)

      if (error) throw error

      // Update local state
      setPricingRules(prev => 
        prev.map(rule => 
          rule.id === ruleId ? { ...rule, ...updates } : rule
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rule')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="text-red-400">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dynamic Pricing Management</h1>
        <p className="text-gray-600">Manage pricing rules, modifiers, and add-ons for BLuxA Transportation</p>
      </div>

      {/* Country Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Country/Region
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {countries.map(country => (
            <option key={country.id} value={country.id}>
              {country.name} ({country.code}) - {country.currency}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'matrix', name: 'Pricing Matrix', component: PricingMatrixTab },
            { id: 'modifiers', name: 'Time Modifiers', component: TimeModifiersTab },
            { id: 'addons', name: 'Add-on Services', component: AddonServicesTab },
            { id: 'preview', name: 'Preview Mode', component: PreviewModeTab }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'matrix' && (
          <PricingMatrixTab
            selectedCountry={selectedCountry}
            countries={countries}
            vehicleClasses={vehicleClasses}
            pricingZones={pricingZones}
            pricingRules={pricingRules}
            onToggleRule={toggleRuleStatus}
            onUpdateRule={updatePricingRule}
          />
        )}
        {activeTab === 'modifiers' && (
          <TimeModifiersTab
            selectedCountry={selectedCountry}
            countries={countries}
            timeModifiers={timeModifiers}
            onUpdateModifier={() => {}}
          />
        )}
        {activeTab === 'addons' && (
          <AddonServicesTab
            selectedCountry={selectedCountry}
            countries={countries}
            addonServices={addonServices}
            onUpdateService={() => {}}
          />
        )}
        {activeTab === 'preview' && (
          <PreviewModeTab
            countries={countries}
            vehicleClasses={vehicleClasses}
            addonServices={addonServices}
          />
        )}
      </div>
    </div>
  )
}

// Pricing Matrix Tab Component
function PricingMatrixTab({
  selectedCountry,
  countries,
  vehicleClasses,
  pricingZones,
  pricingRules,
  onToggleRule,
  onUpdateRule
}: {
  selectedCountry: string
  countries: Country[]
  vehicleClasses: VehicleClass[]
  pricingZones: PricingZone[]
  pricingRules: PricingRule[]
  onToggleRule: (ruleId: string, isActive: boolean) => void
  onUpdateRule: (ruleId: string, updates: Partial<PricingRule>) => void
}) {
  const selectedCountryData = countries.find(c => c.id === selectedCountry)
  const countryZones = pricingZones.filter(z => z.country_id === selectedCountry)
  const countryRules = pricingRules.filter(r => r.country_id === selectedCountry)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Pricing Matrix - {selectedCountryData?.name}
        </h2>
        <div className="text-sm text-gray-500">
          Currency: {selectedCountryData?.currency}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Base Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price/KM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min Charge
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicleClasses.map(vehicleClass => 
              countryZones.map(zone => {
                const rule = countryRules.find(r => 
                  r.vehicle_class_id === vehicleClass.id && r.zone_id === zone.id
                )
                
                return (
                  <tr key={`${vehicleClass.id}-${zone.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicleClass.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {zone.name}
                      <div className="text-xs text-gray-400">
                        {zone.min_distance_km}-{zone.max_distance_km}km
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rule ? (
                        <EditablePrice
                          value={rule.base_price}
                          currency={selectedCountryData?.currency}
                          onUpdate={(value) => onUpdateRule(rule.id, { base_price: value })}
                        />
                      ) : (
                        <span className="text-gray-400">No rule</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rule ? (
                        <EditablePrice
                          value={rule.price_per_km}
                          currency={selectedCountryData?.currency}
                          onUpdate={(value) => onUpdateRule(rule.id, { price_per_km: value })}
                        />
                      ) : (
                        <span className="text-gray-400">No rule</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rule ? (
                        <EditablePrice
                          value={rule.minimum_charge}
                          currency={selectedCountryData?.currency}
                          onUpdate={(value) => onUpdateRule(rule.id, { minimum_charge: value })}
                        />
                      ) : (
                        <span className="text-gray-400">No rule</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rule ? (
                        <button
                          onClick={() => onToggleRule(rule.id, rule.is_active)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            rule.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rule.is_active ? 'Active' : 'Inactive'}
                        </button>
                      ) : (
                        <span className="text-gray-400">No rule</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rule ? (
                        <button className="text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                      ) : (
                        <button className="text-green-600 hover:text-green-900">
                          Create Rule
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Editable Price Component
function EditablePrice({
  value,
  currency,
  onUpdate
}: {
  value: number
  currency: string
  onUpdate: (value: number) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value.toString())

  const handleSave = () => {
    const numValue = parseFloat(editValue)
    if (!isNaN(numValue)) {
      onUpdate(numValue)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value.toString())
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
          step="0.01"
        />
        <button
          onClick={handleSave}
          className="text-green-600 hover:text-green-900"
        >
          ✓
        </button>
        <button
          onClick={handleCancel}
          className="text-red-600 hover:text-red-900"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="text-left hover:bg-gray-50 px-2 py-1 rounded"
    >
      {currency} {value.toFixed(2)}
    </button>
  )
}

// Time Modifiers Tab Component
function TimeModifiersTab({
  selectedCountry,
  countries,
  timeModifiers,
  onUpdateModifier
}: {
  selectedCountry: string
  countries: Country[]
  timeModifiers: TimeModifier[]
  onUpdateModifier: (modifierId: string, updates: Partial<TimeModifier>) => void
}) {
  const selectedCountryData = countries.find(c => c.id === selectedCountry)
  const countryModifiers = timeModifiers.filter(m => m.country_id === selectedCountry)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Time Modifiers - {selectedCountryData?.name}
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add New Modifier
        </button>
      </div>

      <div className="grid gap-4">
        {countryModifiers.map(modifier => (
          <div key={modifier.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{modifier.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{modifier.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Days:</span> {
                      modifier.day_of_week?.map(day => {
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                        return days[day]
                      }).join(', ') || 'All days'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {
                      modifier.start_time && modifier.end_time 
                        ? `${modifier.start_time} - ${modifier.end_time}`
                        : 'All day'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Multiplier:</span> {modifier.multiplier}x
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                      modifier.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {modifier.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Addon Services Tab Component
function AddonServicesTab({
  selectedCountry,
  countries,
  addonServices,
  onUpdateService
}: {
  selectedCountry: string
  countries: Country[]
  addonServices: AddonService[]
  onUpdateService: (serviceId: string, updates: Partial<AddonService>) => void
}) {
  const selectedCountryData = countries.find(c => c.id === selectedCountry)
  const countryServices = addonServices.filter(s => s.country_id === selectedCountry)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Add-on Services - {selectedCountryData?.name}
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add New Service
        </button>
      </div>

      <div className="grid gap-4">
        {countryServices.map(service => (
          <div key={service.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Price:</span> {selectedCountryData?.currency} {service.price.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {service.price_type}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                      service.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Preview Mode Tab Component
function PreviewModeTab({
  countries,
  vehicleClasses,
  addonServices
}: {
  countries: Country[]
  vehicleClasses: VehicleClass[]
  addonServices: AddonService[]
}) {
  const [previewData, setPreviewData] = useState({
    country: '',
    vehicleClass: '',
    distance: 10,
    datetime: new Date().toISOString().slice(0, 16),
    addons: [] as string[]
  })
  const [calculation, setCalculation] = useState<PricingCalculation | null>(null)
  const [loading, setLoading] = useState(false)


  const calculatePricing = async () => {
    if (!previewData.country || !previewData.vehicleClass) return

    setLoading(true)
    try {
      const country = countries.find(c => c.id === previewData.country)
      const vehicleClass = vehicleClasses.find(vc => vc.id === previewData.vehicleClass)
      
      if (!country || !vehicleClass) return

      const { data, error } = await supabase.rpc('test_pricing_calculation', {
        p_country_code: country.code,
        p_vehicle_class_name: vehicleClass.name,
        p_distance_km: previewData.distance,
        p_datetime: previewData.datetime,
        p_addon_names: previewData.addons.length > 0 ? previewData.addons : null
      })

      if (error) throw error
      if (data && data.length > 0) {
        setCalculation(data[0])
      }
    } catch (err) {
      console.error('Error calculating pricing:', err)
    } finally {
      setLoading(false)
    }
  }

  const selectedCountryData = countries.find(c => c.id === previewData.country)
  const countryAddons = addonServices.filter(s => s.country_id === previewData.country)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing Preview & Testing</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Test Scenario</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country/Region
            </label>
            <select
              value={previewData.country}
              onChange={(e) => setPreviewData(prev => ({ ...prev, country: e.target.value, addons: [] }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Class
            </label>
            <select
              value={previewData.vehicleClass}
              onChange={(e) => setPreviewData(prev => ({ ...prev, vehicleClass: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Vehicle Class</option>
              {vehicleClasses.map(vehicleClass => (
                <option key={vehicleClass.id} value={vehicleClass.id}>
                  {vehicleClass.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance (km)
            </label>
            <input
              type="number"
              value={previewData.distance}
              onChange={(e) => setPreviewData(prev => ({ ...prev, distance: parseFloat(e.target.value) || 0 }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={previewData.datetime}
              onChange={(e) => setPreviewData(prev => ({ ...prev, datetime: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {countryAddons.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add-on Services
              </label>
              <div className="space-y-2">
                {countryAddons.map(addon => (
                  <label key={addon.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={previewData.addons.includes(addon.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreviewData(prev => ({
                            ...prev,
                            addons: [...prev.addons, addon.name]
                          }))
                        } else {
                          setPreviewData(prev => ({
                            ...prev,
                            addons: prev.addons.filter(name => name !== addon.name)
                          }))
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {addon.name} - {selectedCountryData?.currency} {addon.price.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={calculatePricing}
            disabled={loading || !previewData.country || !previewData.vehicleClass}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Calculating...' : 'Calculate Pricing'}
          </button>
        </div>

        {/* Results */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>
          
          {calculation ? (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Base Price:</span>
                <span>{calculation.currency} {calculation.base_price.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Distance Price:</span>
                <span>{calculation.currency} {calculation.distance_price.toFixed(2)}</span>
              </div>
              
              {calculation.time_modifier_price > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Time Modifier:</span>
                  <span>{calculation.currency} {calculation.time_modifier_price.toFixed(2)}</span>
                </div>
              )}
              
              {calculation.addon_price > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Add-ons:</span>
                  <span>{calculation.currency} {calculation.addon_price.toFixed(2)}</span>
                </div>
              )}
              
              <hr className="border-gray-300" />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Price:</span>
                <span className="text-blue-600">
                  {calculation.currency} {calculation.total_price.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
              Select parameters and click "Calculate Pricing" to see results
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

