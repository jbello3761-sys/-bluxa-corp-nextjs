// BLuxA Dynamic Pricing System - API Functions
// Supabase client functions for pricing management

import { supabase } from '@/lib/supabaseClient'

// =============================================
// PRICING CALCULATION FUNCTIONS
// =============================================

export interface PricingCalculationRequest {
  countryCode: string
  vehicleClassName: string
  distanceKm: number
  datetime?: string
  addonNames?: string[]
}

export interface PricingCalculationResult {
  base_price: number
  distance_price: number
  time_modifier_price: number
  addon_price: number
  total_price: number
  currency: string
  breakdown: {
    country: string
    vehicle_class: string
    distance_km: number
    datetime: string
    addons: string[]
  }
}

/**
 * Calculate pricing for a booking scenario
 */
export async function calculatePricing(request: PricingCalculationRequest): Promise<PricingCalculationResult> {
  try {
    const { data, error } = await supabase.rpc('test_pricing_calculation', {
      p_country_code: request.countryCode,
      p_vehicle_class_name: request.vehicleClassName,
      p_distance_km: request.distanceKm,
      p_datetime: request.datetime || new Date().toISOString(),
      p_addon_names: request.addonNames || null
    })

    if (error) {
      throw new Error(`Pricing calculation failed: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('No pricing data returned')
    }

    return data[0]
  } catch (error) {
    console.error('Error calculating pricing:', error)
    throw error
  }
}

/**
 * Get cached pricing calculation
 */
export async function getCachedPricing(
  countryId: string,
  vehicleClassId: string,
  zoneId: string,
  distanceKm: number
): Promise<PricingCalculationResult | null> {
  try {
    const { data, error } = await supabase
      .from('pricing_calculations')
      .select('*')
      .eq('country_id', countryId)
      .eq('vehicle_class_id', vehicleClassId)
      .eq('zone_id', zoneId)
      .eq('distance_km', distanceKm)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }

    return data
  } catch (error) {
    console.error('Error getting cached pricing:', error)
    return null
  }
}

// =============================================
// ADMIN MANAGEMENT FUNCTIONS
// =============================================

/**
 * Get pricing matrix for admin interface
 */
export async function getPricingMatrix(countryId?: string) {
  try {
    const { data, error } = await supabase.rpc('get_pricing_matrix', {
      p_country_id: countryId || null
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting pricing matrix:', error)
    throw error
  }
}

/**
 * Get time modifiers matrix for admin interface
 */
export async function getTimeModifiersMatrix(countryId?: string) {
  try {
    const { data, error } = await supabase.rpc('get_time_modifiers_matrix', {
      p_country_id: countryId || null
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting time modifiers matrix:', error)
    throw error
  }
}

/**
 * Get addon services matrix for admin interface
 */
export async function getAddonServicesMatrix(countryId?: string) {
  try {
    const { data, error } = await supabase.rpc('get_addon_services_matrix', {
      p_country_id: countryId || null
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting addon services matrix:', error)
    throw error
  }
}

// =============================================
// CRUD OPERATIONS FOR PRICING RULES
// =============================================

export interface PricingRule {
  id?: string
  country_id: string
  vehicle_class_id: string
  zone_id: string
  base_price: number
  price_per_km: number
  minimum_charge: number
  is_active: boolean
}

/**
 * Create a new pricing rule
 */
export async function createPricingRule(rule: Omit<PricingRule, 'id'>): Promise<PricingRule> {
  try {
    const { data, error } = await supabase
      .from('pricing_rules')
      .insert([rule])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating pricing rule:', error)
    throw error
  }
}

/**
 * Update a pricing rule
 */
export async function updatePricingRule(id: string, updates: Partial<PricingRule>): Promise<PricingRule> {
  try {
    const { data, error } = await supabase
      .from('pricing_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating pricing rule:', error)
    throw error
  }
}

/**
 * Delete a pricing rule
 */
export async function deletePricingRule(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('pricing_rules')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting pricing rule:', error)
    throw error
  }
}

// =============================================
// CRUD OPERATIONS FOR TIME MODIFIERS
// =============================================

export interface TimeModifier {
  id?: string
  country_id: string
  name: string
  description?: string
  day_of_week?: number[]
  start_time?: string
  end_time?: string
  multiplier: number
  is_active: boolean
}

/**
 * Create a new time modifier
 */
export async function createTimeModifier(modifier: Omit<TimeModifier, 'id'>): Promise<TimeModifier> {
  try {
    const { data, error } = await supabase
      .from('time_modifiers')
      .insert([modifier])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating time modifier:', error)
    throw error
  }
}

/**
 * Update a time modifier
 */
export async function updateTimeModifier(id: string, updates: Partial<TimeModifier>): Promise<TimeModifier> {
  try {
    const { data, error } = await supabase
      .from('time_modifiers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating time modifier:', error)
    throw error
  }
}

/**
 * Delete a time modifier
 */
export async function deleteTimeModifier(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('time_modifiers')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting time modifier:', error)
    throw error
  }
}

// =============================================
// CRUD OPERATIONS FOR ADDON SERVICES
// =============================================

export interface AddonService {
  id?: string
  country_id: string
  name: string
  description?: string
  price: number
  price_type: 'fixed' | 'percentage' | 'per_item'
  is_active: boolean
}

/**
 * Create a new addon service
 */
export async function createAddonService(service: Omit<AddonService, 'id'>): Promise<AddonService> {
  try {
    const { data, error } = await supabase
      .from('addon_services')
      .insert([service])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating addon service:', error)
    throw error
  }
}

/**
 * Update an addon service
 */
export async function updateAddonService(id: string, updates: Partial<AddonService>): Promise<AddonService> {
  try {
    const { data, error } = await supabase
      .from('addon_services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating addon service:', error)
    throw error
  }
}

/**
 * Delete an addon service
 */
export async function deleteAddonService(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('addon_services')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting addon service:', error)
    throw error
  }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Get all countries
 */
export async function getCountries() {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('code')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting countries:', error)
    throw error
  }
}

/**
 * Get all vehicle classes
 */
export async function getVehicleClasses() {
  try {
    const { data, error } = await supabase
      .from('vehicle_classes')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting vehicle classes:', error)
    throw error
  }
}

/**
 * Get pricing zones for a country
 */
export async function getPricingZones(countryId: string) {
  try {
    const { data, error } = await supabase
      .from('pricing_zones')
      .select('*')
      .eq('country_id', countryId)
      .order('min_distance_km')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting pricing zones:', error)
    throw error
  }
}

/**
 * Get addon services for a country
 */
export async function getAddonServices(countryId: string) {
  try {
    const { data, error } = await supabase
      .from('addon_services')
      .select('*')
      .eq('country_id', countryId)
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting addon services:', error)
    throw error
  }
}

/**
 * Get pricing audit log
 */
export async function getPricingAuditLog(limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('pricing_audit_log')
      .select(`
        *,
        admin_user:admin_user_id
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting pricing audit log:', error)
    throw error
  }
}

/**
 * Clear expired pricing calculations
 */
export async function clearExpiredCalculations(): Promise<void> {
  try {
    const { error } = await supabase
      .from('pricing_calculations')
      .delete()
      .lt('expires_at', new Date().toISOString())

    if (error) throw error
  } catch (error) {
    console.error('Error clearing expired calculations:', error)
    throw error
  }
}

// =============================================
// BULK OPERATIONS
// =============================================

/**
 * Bulk update pricing rules
 */
export async function bulkUpdatePricingRules(updates: Array<{ id: string; updates: Partial<PricingRule> }>): Promise<void> {
  try {
    const promises = updates.map(({ id, updates }) => 
      updatePricingRule(id, updates)
    )

    await Promise.all(promises)
  } catch (error) {
    console.error('Error bulk updating pricing rules:', error)
    throw error
  }
}

/**
 * Export pricing data for backup
 */
export async function exportPricingData() {
  try {
    const [
      countries,
      vehicleClasses,
      pricingZones,
      pricingRules,
      timeModifiers,
      addonServices
    ] = await Promise.all([
      getCountries(),
      getVehicleClasses(),
      supabase.from('pricing_zones').select('*'),
      supabase.from('pricing_rules').select('*'),
      supabase.from('time_modifiers').select('*'),
      supabase.from('addon_services').select('*')
    ])

    return {
      countries,
      vehicleClasses,
      pricingZones: pricingZones.data,
      pricingRules: pricingRules.data,
      timeModifiers: timeModifiers.data,
      addonServices: addonServices.data,
      exported_at: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error exporting pricing data:', error)
    throw error
  }
}

