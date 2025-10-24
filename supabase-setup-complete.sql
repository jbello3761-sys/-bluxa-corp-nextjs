-- BLuxA Dynamic Pricing System - Complete Supabase Setup
-- Run this entire file in your Supabase SQL Editor
-- This includes schema, sample data, RLS policies, and admin user setup

-- =============================================
-- PART 1: SCHEMA SETUP
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries/Regions table
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(3) UNIQUE NOT NULL, -- 'US', 'DO'
    name VARCHAR(100) NOT NULL,
    currency VARCHAR(3) NOT NULL, -- 'USD', 'DOP'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle classes/types
CREATE TABLE IF NOT EXISTS vehicle_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- 'Executive Sedan', 'Luxury SUV', 'Sprinter Van'
    description TEXT,
    capacity INTEGER NOT NULL,
    base_multiplier DECIMAL(5,2) DEFAULT 1.00, -- Base price multiplier
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing zones (for distance-based pricing)
CREATE TABLE IF NOT EXISTS pricing_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Airport Zone', 'Downtown', 'Suburbs'
    description TEXT,
    min_distance_km DECIMAL(8,2), -- Minimum distance for this zone
    max_distance_km DECIMAL(8,2), -- Maximum distance for this zone
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Base pricing rules
CREATE TABLE IF NOT EXISTS pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    vehicle_class_id UUID REFERENCES vehicle_classes(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES pricing_zones(id) ON DELETE CASCADE,
    base_price DECIMAL(10,2) NOT NULL, -- Base price in local currency
    price_per_km DECIMAL(8,2) DEFAULT 0, -- Additional price per kilometer
    minimum_charge DECIMAL(10,2) DEFAULT 0, -- Minimum charge for this rule
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country_id, vehicle_class_id, zone_id)
);

-- Time-based modifiers (peak hours, etc.)
CREATE TABLE IF NOT EXISTS time_modifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Peak Hours', 'Weekend Premium', 'Holiday Rate'
    description TEXT,
    day_of_week INTEGER[], -- [1,2,3,4,5] for weekdays, [6,7] for weekends
    start_time TIME, -- Start time for this modifier
    end_time TIME, -- End time for this modifier
    multiplier DECIMAL(5,2) NOT NULL, -- Price multiplier (1.25 = 25% increase)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add-on services
CREATE TABLE IF NOT EXISTS addon_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Baby Seat', 'Airport Toll', 'Extra Luggage'
    description TEXT,
    price DECIMAL(10,2) NOT NULL, -- Fixed price for this add-on
    price_type VARCHAR(20) DEFAULT 'fixed', -- 'fixed', 'percentage', 'per_item'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing calculation cache (for performance)
CREATE TABLE IF NOT EXISTS pricing_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    vehicle_class_id UUID REFERENCES vehicle_classes(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES pricing_zones(id) ON DELETE CASCADE,
    distance_km DECIMAL(8,2) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    distance_price DECIMAL(10,2) NOT NULL,
    time_modifier_price DECIMAL(10,2) DEFAULT 0,
    addon_price DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Pricing audit log
CREATE TABLE IF NOT EXISTS pricing_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL, -- References auth.users
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'activate', 'deactivate'
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PART 2: INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_pricing_rules_country_vehicle ON pricing_rules(country_id, vehicle_class_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_active ON pricing_rules(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_time_modifiers_country_active ON time_modifiers(country_id, is_active);
CREATE INDEX IF NOT EXISTS idx_addon_services_country_active ON addon_services(country_id, is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_calculations_lookup ON pricing_calculations(country_id, vehicle_class_id, zone_id, distance_km);
CREATE INDEX IF NOT EXISTS idx_pricing_calculations_expires ON pricing_calculations(expires_at);

-- =============================================
-- PART 3: FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
DROP TRIGGER IF EXISTS update_countries_updated_at ON countries;
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vehicle_classes_updated_at ON vehicle_classes;
CREATE TRIGGER update_vehicle_classes_updated_at BEFORE UPDATE ON vehicle_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pricing_zones_updated_at ON pricing_zones;
CREATE TRIGGER update_pricing_zones_updated_at BEFORE UPDATE ON pricing_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pricing_rules_updated_at ON pricing_rules;
CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON pricing_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_time_modifiers_updated_at ON time_modifiers;
CREATE TRIGGER update_time_modifiers_updated_at BEFORE UPDATE ON time_modifiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_addon_services_updated_at ON addon_services;
CREATE TRIGGER update_addon_services_updated_at BEFORE UPDATE ON addon_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate pricing
CREATE OR REPLACE FUNCTION calculate_pricing(
    p_country_id UUID,
    p_vehicle_class_id UUID,
    p_distance_km DECIMAL,
    p_datetime TIMESTAMP WITH TIME ZONE,
    p_addon_ids UUID[] DEFAULT NULL
)
RETURNS TABLE(
    base_price DECIMAL,
    distance_price DECIMAL,
    time_modifier_price DECIMAL,
    addon_price DECIMAL,
    total_price DECIMAL,
    currency VARCHAR,
    calculation_id UUID
) AS $$
DECLARE
    v_zone_id UUID;
    v_base_price DECIMAL;
    v_price_per_km DECIMAL;
    v_minimum_charge DECIMAL;
    v_time_multiplier DECIMAL := 1.0;
    v_addon_total DECIMAL := 0;
    v_currency VARCHAR;
    v_calculation_id UUID;
BEGIN
    -- Get currency
    SELECT countries.currency INTO v_currency FROM countries WHERE id = p_country_id;
    
    -- Find appropriate zone based on distance
    SELECT id INTO v_zone_id 
    FROM pricing_zones 
    WHERE country_id = p_country_id 
    AND p_distance_km >= COALESCE(min_distance_km, 0)
    AND p_distance_km <= COALESCE(max_distance_km, 999999)
    AND is_active = true
    ORDER BY min_distance_km DESC
    LIMIT 1;
    
    -- Get base pricing rule
    SELECT pr.base_price, pr.price_per_km, pr.minimum_charge
    INTO v_base_price, v_price_per_km, v_minimum_charge
    FROM pricing_rules pr
    WHERE pr.country_id = p_country_id
    AND pr.vehicle_class_id = p_vehicle_class_id
    AND pr.zone_id = v_zone_id
    AND pr.is_active = true;
    
    -- Calculate time modifier
    SELECT COALESCE(multiplier, 1.0) INTO v_time_multiplier
    FROM time_modifiers
    WHERE country_id = p_country_id
    AND is_active = true
    AND (
        day_of_week IS NULL OR 
        EXTRACT(DOW FROM p_datetime) = ANY(day_of_week)
    )
    AND (
        start_time IS NULL OR 
        p_datetime::time BETWEEN start_time AND end_time
    )
    ORDER BY multiplier DESC
    LIMIT 1;
    
    -- Calculate addon prices
    IF p_addon_ids IS NOT NULL THEN
        SELECT COALESCE(SUM(price), 0) INTO v_addon_total
        FROM addon_services
        WHERE id = ANY(p_addon_ids)
        AND country_id = p_country_id
        AND is_active = true;
    END IF;
    
    -- Generate calculation ID
    v_calculation_id := uuid_generate_v4();
    
    -- Cache the calculation
    INSERT INTO pricing_calculations (
        id, country_id, vehicle_class_id, zone_id, distance_km,
        base_price, distance_price, time_modifier_price, addon_price,
        total_price, currency
    ) VALUES (
        v_calculation_id, p_country_id, p_vehicle_class_id, v_zone_id, p_distance_km,
        v_base_price, (v_price_per_km * p_distance_km), 
        ((v_base_price + (v_price_per_km * p_distance_km)) * (v_time_multiplier - 1)),
        v_addon_total,
        GREATEST(v_minimum_charge, (v_base_price + (v_price_per_km * p_distance_km)) * v_time_multiplier + v_addon_total),
        v_currency
    );
    
    -- Return the calculation
    RETURN QUERY SELECT 
        v_base_price,
        (v_price_per_km * p_distance_km),
        ((v_base_price + (v_price_per_km * p_distance_km)) * (v_time_multiplier - 1)),
        v_addon_total,
        GREATEST(v_minimum_charge, (v_base_price + (v_price_per_km * p_distance_km)) * v_time_multiplier + v_addon_total),
        v_currency,
        v_calculation_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PART 4: SAMPLE DATA (Only if tables are empty)
-- =============================================

-- Insert countries (only if not exists)
INSERT INTO countries (code, name, currency) 
SELECT 'US', 'United States', 'USD'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE code = 'US');

INSERT INTO countries (code, name, currency) 
SELECT 'DO', 'Dominican Republic', 'DOP'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE code = 'DO');

-- Insert vehicle classes (only if not exists)
INSERT INTO vehicle_classes (name, description, capacity, base_multiplier) 
SELECT 'Executive Sedan', 'Luxury sedan for executive travel', 4, 1.0
WHERE NOT EXISTS (SELECT 1 FROM vehicle_classes WHERE name = 'Executive Sedan');

INSERT INTO vehicle_classes (name, description, capacity, base_multiplier) 
SELECT 'Luxury SUV', 'Premium SUV for comfort and space', 6, 1.3
WHERE NOT EXISTS (SELECT 1 FROM vehicle_classes WHERE name = 'Luxury SUV');

INSERT INTO vehicle_classes (name, description, capacity, base_multiplier) 
SELECT 'Sprinter Van', 'Large van for group transportation', 12, 1.8
WHERE NOT EXISTS (SELECT 1 FROM vehicle_classes WHERE name = 'Sprinter Van');

-- Insert pricing zones for US (only if not exists)
INSERT INTO pricing_zones (country_id, name, description, min_distance_km, max_distance_km) 
SELECT (SELECT id FROM countries WHERE code = 'US'), 'Airport Zone', 'Airport pickup/dropoff', 0, 5
WHERE NOT EXISTS (SELECT 1 FROM pricing_zones WHERE country_id = (SELECT id FROM countries WHERE code = 'US') AND name = 'Airport Zone');

INSERT INTO pricing_zones (country_id, name, description, min_distance_km, max_distance_km) 
SELECT (SELECT id FROM countries WHERE code = 'US'), 'City Center', 'Downtown area', 5, 15
WHERE NOT EXISTS (SELECT 1 FROM pricing_zones WHERE country_id = (SELECT id FROM countries WHERE code = 'US') AND name = 'City Center');

INSERT INTO pricing_zones (country_id, name, description, min_distance_km, max_distance_km) 
SELECT (SELECT id FROM countries WHERE code = 'US'), 'Suburbs', 'Suburban areas', 15, 50
WHERE NOT EXISTS (SELECT 1 FROM pricing_zones WHERE country_id = (SELECT id FROM countries WHERE code = 'US') AND name = 'Suburbs');

INSERT INTO pricing_zones (country_id, name, description, min_distance_km, max_distance_km) 
SELECT (SELECT id FROM countries WHERE code = 'US'), 'Long Distance', 'Inter-city travel', 50, 999999
WHERE NOT EXISTS (SELECT 1 FROM pricing_zones WHERE country_id = (SELECT id FROM countries WHERE code = 'US') AND name = 'Long Distance');

-- Insert pricing zones for DR (only if not exists)
INSERT INTO pricing_zones (country_id, name, description, min_distance_km, max_distance_km) 
SELECT (SELECT id FROM countries WHERE code = 'DO'), 'Airport Zone', 'Airport pickup/dropoff', 0, 5
WHERE NOT EXISTS (SELECT 1 FROM pricing_zones WHERE country_id = (SELECT id FROM countries WHERE code = 'DO') AND name = 'Airport Zone');

INSERT INTO pricing_zones (country_id, name, description, min_distance_km, max_distance_km) 
SELECT (SELECT id FROM countries WHERE code = 'DO'), 'City Center', 'Downtown area', 5, 15
WHERE NOT EXISTS (SELECT 1 FROM pricing_zones WHERE country_id = (SELECT id FROM countries WHERE code = 'DO') AND name = 'City Center');

INSERT INTO pricing_zones (country_id, name, description, min_distance_km, max_distance_km) 
SELECT (SELECT id FROM countries WHERE code = 'DO'), 'Suburbs', 'Suburban areas', 15, 50
WHERE NOT EXISTS (SELECT 1 FROM pricing_zones WHERE country_id = (SELECT id FROM countries WHERE code = 'DO') AND name = 'Suburbs');

INSERT INTO pricing_zones (country_id, name, description, min_distance_km, max_distance_km) 
SELECT (SELECT id FROM countries WHERE code = 'DO'), 'Long Distance', 'Inter-city travel', 50, 999999
WHERE NOT EXISTS (SELECT 1 FROM pricing_zones WHERE country_id = (SELECT id FROM countries WHERE code = 'DO') AND name = 'Long Distance');

-- Insert base pricing rules for US (only if not exists)
INSERT INTO pricing_rules (country_id, vehicle_class_id, zone_id, base_price, price_per_km, minimum_charge) 
SELECT 
    c.id, vc.id, z.id,
    CASE 
        WHEN z.name = 'Airport Zone' THEN 25.00
        WHEN z.name = 'City Center' THEN 35.00
        WHEN z.name = 'Suburbs' THEN 45.00
        ELSE 60.00
    END,
    CASE 
        WHEN z.name = 'Airport Zone' THEN 2.50
        WHEN z.name = 'City Center' THEN 3.00
        WHEN z.name = 'Suburbs' THEN 2.75
        ELSE 2.25
    END,
    CASE 
        WHEN z.name = 'Airport Zone' THEN 25.00
        WHEN z.name = 'City Center' THEN 35.00
        WHEN z.name = 'Suburbs' THEN 45.00
        ELSE 60.00
    END
FROM countries c, vehicle_classes vc, pricing_zones z
WHERE c.code = 'US' AND z.country_id = c.id
AND NOT EXISTS (SELECT 1 FROM pricing_rules WHERE country_id = c.id AND vehicle_class_id = vc.id AND zone_id = z.id);

-- Insert base pricing rules for DR (only if not exists)
INSERT INTO pricing_rules (country_id, vehicle_class_id, zone_id, base_price, price_per_km, minimum_charge) 
SELECT 
    c.id, vc.id, z.id,
    CASE 
        WHEN z.name = 'Airport Zone' THEN 800.00
        WHEN z.name = 'City Center' THEN 1200.00
        WHEN z.name = 'Suburbs' THEN 1500.00
        ELSE 2000.00
    END,
    CASE 
        WHEN z.name = 'Airport Zone' THEN 80.00
        WHEN z.name = 'City Center' THEN 100.00
        WHEN z.name = 'Suburbs' THEN 90.00
        ELSE 75.00
    END,
    CASE 
        WHEN z.name = 'Airport Zone' THEN 800.00
        WHEN z.name = 'City Center' THEN 1200.00
        WHEN z.name = 'Suburbs' THEN 1500.00
        ELSE 2000.00
    END
FROM countries c, vehicle_classes vc, pricing_zones z
WHERE c.code = 'DO' AND z.country_id = c.id
AND NOT EXISTS (SELECT 1 FROM pricing_rules WHERE country_id = c.id AND vehicle_class_id = vc.id AND zone_id = z.id);

-- Insert time modifiers (only if not exists)
INSERT INTO time_modifiers (country_id, name, description, day_of_week, start_time, end_time, multiplier) 
SELECT (SELECT id FROM countries WHERE code = 'US'), 'Peak Hours', 'Rush hour pricing', ARRAY[1,2,3,4,5], '07:00', '09:00', 1.25
WHERE NOT EXISTS (SELECT 1 FROM time_modifiers WHERE country_id = (SELECT id FROM countries WHERE code = 'US') AND name = 'Peak Hours' AND start_time = '07:00');

INSERT INTO time_modifiers (country_id, name, description, day_of_week, start_time, end_time, multiplier) 
SELECT (SELECT id FROM countries WHERE code = 'US'), 'Peak Hours', 'Evening rush hour', ARRAY[1,2,3,4,5], '17:00', '19:00', 1.25
WHERE NOT EXISTS (SELECT 1 FROM time_modifiers WHERE country_id = (SELECT id FROM countries WHERE code = 'US') AND name = 'Peak Hours' AND start_time = '17:00');

INSERT INTO time_modifiers (country_id, name, description, day_of_week, start_time, end_time, multiplier) 
SELECT (SELECT id FROM countries WHERE code = 'US'), 'Weekend Premium', 'Weekend pricing', ARRAY[6,7], NULL, NULL, 1.15
WHERE NOT EXISTS (SELECT 1 FROM time_modifiers WHERE country_id = (SELECT id FROM countries WHERE code = 'US') AND name = 'Weekend Premium');

INSERT INTO time_modifiers (country_id, name, description, day_of_week, start_time, end_time, multiplier) 
SELECT (SELECT id FROM countries WHERE code = 'DO'), 'Peak Hours', 'Rush hour pricing', ARRAY[1,2,3,4,5], '07:00', '09:00', 1.25
WHERE NOT EXISTS (SELECT 1 FROM time_modifiers WHERE country_id = (SELECT id FROM countries WHERE code = 'DO') AND name = 'Peak Hours' AND start_time = '07:00');

INSERT INTO time_modifiers (country_id, name, description, day_of_week, start_time, end_time, multiplier) 
SELECT (SELECT id FROM countries WHERE code = 'DO'), 'Peak Hours', 'Evening rush hour', ARRAY[1,2,3,4,5], '17:00', '19:00', 1.25
WHERE NOT EXISTS (SELECT 1 FROM time_modifiers WHERE country_id = (SELECT id FROM countries WHERE code = 'DO') AND name = 'Peak Hours' AND start_time = '17:00');

INSERT INTO time_modifiers (country_id, name, description, day_of_week, start_time, end_time, multiplier) 
SELECT (SELECT id FROM countries WHERE code = 'DO'), 'Weekend Premium', 'Weekend pricing', ARRAY[6,7], NULL, NULL, 1.15
WHERE NOT EXISTS (SELECT 1 FROM time_modifiers WHERE country_id = (SELECT id FROM countries WHERE code = 'DO') AND name = 'Weekend Premium');

-- Insert addon services (only if not exists)
INSERT INTO addon_services (country_id, name, description, price, price_type) 
SELECT (SELECT id FROM countries WHERE code = 'US'), 'Baby Seat', 'Child safety seat', 15.00, 'fixed'
WHERE NOT EXISTS (SELECT 1 FROM addon_services WHERE country_id = (SELECT id FROM countries WHERE code = 'US') AND name = 'Baby Seat');

INSERT INTO addon_services (country_id, name, description, price, price_type) 
SELECT (SELECT id FROM countries WHERE code = 'US'), 'Airport Toll', 'Airport access fee', 5.00, 'fixed'
WHERE NOT EXISTS (SELECT 1 FROM addon_services WHERE country_id = (SELECT id FROM countries WHERE code = 'US') AND name = 'Airport Toll');

INSERT INTO addon_services (country_id, name, description, price, price_type) 
SELECT (SELECT id FROM countries WHERE code = 'US'), 'Extra Luggage', 'Additional luggage space', 10.00, 'fixed'
WHERE NOT EXISTS (SELECT 1 FROM addon_services WHERE country_id = (SELECT id FROM countries WHERE code = 'US') AND name = 'Extra Luggage');

INSERT INTO addon_services (country_id, name, description, price, price_type) 
SELECT (SELECT id FROM countries WHERE code = 'DO'), 'Baby Seat', 'Child safety seat', 500.00, 'fixed'
WHERE NOT EXISTS (SELECT 1 FROM addon_services WHERE country_id = (SELECT id FROM countries WHERE code = 'DO') AND name = 'Baby Seat');

INSERT INTO addon_services (country_id, name, description, price, price_type) 
SELECT (SELECT id FROM countries WHERE code = 'DO'), 'Airport Toll', 'Airport access fee', 200.00, 'fixed'
WHERE NOT EXISTS (SELECT 1 FROM addon_services WHERE country_id = (SELECT id FROM countries WHERE code = 'DO') AND name = 'Airport Toll');

INSERT INTO addon_services (country_id, name, description, price, price_type) 
SELECT (SELECT id FROM countries WHERE code = 'DO'), 'Extra Luggage', 'Additional luggage space', 300.00, 'fixed'
WHERE NOT EXISTS (SELECT 1 FROM addon_services WHERE country_id = (SELECT id FROM countries WHERE code = 'DO') AND name = 'Extra Luggage');

-- =============================================
-- PART 5: RLS POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_audit_log ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            (auth.jwt() ->> 'raw_user_meta_data' ->> 'app_role')::text = 'admin',
            false
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Countries policies
DROP POLICY IF EXISTS "Countries are viewable by everyone" ON countries;
CREATE POLICY "Countries are viewable by everyone" ON countries
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert countries" ON countries;
CREATE POLICY "Only admins can insert countries" ON countries
    FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update countries" ON countries;
CREATE POLICY "Only admins can update countries" ON countries
    FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Only admins can delete countries" ON countries;
CREATE POLICY "Only admins can delete countries" ON countries
    FOR DELETE USING (is_admin());

-- Vehicle classes policies
DROP POLICY IF EXISTS "Vehicle classes are viewable by everyone" ON vehicle_classes;
CREATE POLICY "Vehicle classes are viewable by everyone" ON vehicle_classes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert vehicle classes" ON vehicle_classes;
CREATE POLICY "Only admins can insert vehicle classes" ON vehicle_classes
    FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update vehicle classes" ON vehicle_classes;
CREATE POLICY "Only admins can update vehicle classes" ON vehicle_classes
    FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Only admins can delete vehicle classes" ON vehicle_classes;
CREATE POLICY "Only admins can delete vehicle classes" ON vehicle_classes
    FOR DELETE USING (is_admin());

-- Pricing zones policies
DROP POLICY IF EXISTS "Pricing zones are viewable by everyone" ON pricing_zones;
CREATE POLICY "Pricing zones are viewable by everyone" ON pricing_zones
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert pricing zones" ON pricing_zones;
CREATE POLICY "Only admins can insert pricing zones" ON pricing_zones
    FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update pricing zones" ON pricing_zones;
CREATE POLICY "Only admins can update pricing zones" ON pricing_zones
    FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Only admins can delete pricing zones" ON pricing_zones;
CREATE POLICY "Only admins can delete pricing zones" ON pricing_zones
    FOR DELETE USING (is_admin());

-- Pricing rules policies
DROP POLICY IF EXISTS "Pricing rules are viewable by everyone" ON pricing_rules;
CREATE POLICY "Pricing rules are viewable by everyone" ON pricing_rules
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert pricing rules" ON pricing_rules;
CREATE POLICY "Only admins can insert pricing rules" ON pricing_rules
    FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update pricing rules" ON pricing_rules;
CREATE POLICY "Only admins can update pricing rules" ON pricing_rules
    FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Only admins can delete pricing rules" ON pricing_rules;
CREATE POLICY "Only admins can delete pricing rules" ON pricing_rules
    FOR DELETE USING (is_admin());

-- Time modifiers policies
DROP POLICY IF EXISTS "Time modifiers are viewable by everyone" ON time_modifiers;
CREATE POLICY "Time modifiers are viewable by everyone" ON time_modifiers
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert time modifiers" ON time_modifiers;
CREATE POLICY "Only admins can insert time modifiers" ON time_modifiers
    FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update time modifiers" ON time_modifiers;
CREATE POLICY "Only admins can update time modifiers" ON time_modifiers
    FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Only admins can delete time modifiers" ON time_modifiers;
CREATE POLICY "Only admins can delete time modifiers" ON time_modifiers
    FOR DELETE USING (is_admin());

-- Addon services policies
DROP POLICY IF EXISTS "Addon services are viewable by everyone" ON addon_services;
CREATE POLICY "Addon services are viewable by everyone" ON addon_services
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert addon services" ON addon_services;
CREATE POLICY "Only admins can insert addon services" ON addon_services
    FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update addon services" ON addon_services;
CREATE POLICY "Only admins can update addon services" ON addon_services
    FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Only admins can delete addon services" ON addon_services;
CREATE POLICY "Only admins can delete addon services" ON addon_services
    FOR DELETE USING (is_admin());

-- Pricing calculations policies
DROP POLICY IF EXISTS "Pricing calculations are viewable by everyone" ON pricing_calculations;
CREATE POLICY "Pricing calculations are viewable by everyone" ON pricing_calculations
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only system can insert pricing calculations" ON pricing_calculations;
CREATE POLICY "Only system can insert pricing calculations" ON pricing_calculations
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can delete pricing calculations" ON pricing_calculations;
CREATE POLICY "Only admins can delete pricing calculations" ON pricing_calculations
    FOR DELETE USING (is_admin());

-- Pricing audit log policies
DROP POLICY IF EXISTS "Only admins can view audit logs" ON pricing_audit_log;
CREATE POLICY "Only admins can view audit logs" ON pricing_audit_log
    FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Only system can insert audit logs" ON pricing_audit_log;
CREATE POLICY "Only system can insert audit logs" ON pricing_audit_log
    FOR INSERT WITH CHECK (true);

-- =============================================
-- PART 6: AUDIT FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to log pricing changes
CREATE OR REPLACE FUNCTION log_pricing_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_action TEXT;
    v_old_values JSONB;
    v_new_values JSONB;
BEGIN
    -- Determine action type
    IF TG_OP = 'INSERT' THEN
        v_action := 'create';
        v_new_values := to_jsonb(NEW);
        v_old_values := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        v_action := 'update';
        v_old_values := to_jsonb(OLD);
        v_new_values := to_jsonb(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        v_action := 'delete';
        v_old_values := to_jsonb(OLD);
        v_new_values := NULL;
    END IF;
    
    -- Insert audit log entry
    INSERT INTO pricing_audit_log (
        admin_user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values
    ) VALUES (
        get_current_user_id(),
        v_action,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        v_old_values,
        v_new_values
    );
    
    -- Return appropriate record
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to all pricing tables
DROP TRIGGER IF EXISTS audit_countries_changes ON countries;
CREATE TRIGGER audit_countries_changes
    AFTER INSERT OR UPDATE OR DELETE ON countries
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

DROP TRIGGER IF EXISTS audit_vehicle_classes_changes ON vehicle_classes;
CREATE TRIGGER audit_vehicle_classes_changes
    AFTER INSERT OR UPDATE OR DELETE ON vehicle_classes
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

DROP TRIGGER IF EXISTS audit_pricing_zones_changes ON pricing_zones;
CREATE TRIGGER audit_pricing_zones_changes
    AFTER INSERT OR UPDATE OR DELETE ON pricing_zones
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

DROP TRIGGER IF EXISTS audit_pricing_rules_changes ON pricing_rules;
CREATE TRIGGER audit_pricing_rules_changes
    AFTER INSERT OR UPDATE OR DELETE ON pricing_rules
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

DROP TRIGGER IF EXISTS audit_time_modifiers_changes ON time_modifiers;
CREATE TRIGGER audit_time_modifiers_changes
    AFTER INSERT OR UPDATE OR DELETE ON time_modifiers
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

DROP TRIGGER IF EXISTS audit_addon_services_changes ON addon_services;
CREATE TRIGGER audit_addon_services_changes
    AFTER INSERT OR UPDATE OR DELETE ON addon_services
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

-- =============================================
-- PART 7: API FUNCTIONS FOR ADMIN INTERFACE
-- =============================================

-- Function to get pricing matrix for admin interface
CREATE OR REPLACE FUNCTION get_pricing_matrix(p_country_id UUID DEFAULT NULL)
RETURNS TABLE(
    country_code VARCHAR,
    country_name VARCHAR,
    vehicle_class_name VARCHAR,
    zone_name VARCHAR,
    base_price DECIMAL,
    price_per_km DECIMAL,
    minimum_charge DECIMAL,
    is_active BOOLEAN,
    rule_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.code,
        c.name,
        vc.name,
        z.name,
        pr.base_price,
        pr.price_per_km,
        pr.minimum_charge,
        pr.is_active,
        pr.id
    FROM pricing_rules pr
    JOIN countries c ON pr.country_id = c.id
    JOIN vehicle_classes vc ON pr.vehicle_class_id = vc.id
    JOIN pricing_zones z ON pr.zone_id = z.id
    WHERE (p_country_id IS NULL OR pr.country_id = p_country_id)
    ORDER BY c.code, vc.name, z.min_distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get time modifiers for admin interface
CREATE OR REPLACE FUNCTION get_time_modifiers_matrix(p_country_id UUID DEFAULT NULL)
RETURNS TABLE(
    country_code VARCHAR,
    modifier_name VARCHAR,
    description TEXT,
    day_of_week INTEGER[],
    start_time TIME,
    end_time TIME,
    multiplier DECIMAL,
    is_active BOOLEAN,
    modifier_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.code,
        tm.name,
        tm.description,
        tm.day_of_week,
        tm.start_time,
        tm.end_time,
        tm.multiplier,
        tm.is_active,
        tm.id
    FROM time_modifiers tm
    JOIN countries c ON tm.country_id = c.id
    WHERE (p_country_id IS NULL OR tm.country_id = p_country_id)
    ORDER BY c.code, tm.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get addon services for admin interface
CREATE OR REPLACE FUNCTION get_addon_services_matrix(p_country_id UUID DEFAULT NULL)
RETURNS TABLE(
    country_code VARCHAR,
    service_name VARCHAR,
    description TEXT,
    price DECIMAL,
    price_type VARCHAR,
    is_active BOOLEAN,
    service_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.code,
        ads.name,
        ads.description,
        ads.price,
        ads.price_type,
        ads.is_active,
        ads.id
    FROM addon_services ads
    JOIN countries c ON ads.country_id = c.id
    WHERE (p_country_id IS NULL OR ads.country_id = p_country_id)
    ORDER BY c.code, ads.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to test pricing calculation (for preview mode)
CREATE OR REPLACE FUNCTION test_pricing_calculation(
    p_country_code VARCHAR,
    p_vehicle_class_name VARCHAR,
    p_distance_km DECIMAL,
    p_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    p_addon_names VARCHAR[] DEFAULT NULL
)
RETURNS TABLE(
    base_price DECIMAL,
    distance_price DECIMAL,
    time_modifier_price DECIMAL,
    addon_price DECIMAL,
    total_price DECIMAL,
    currency VARCHAR,
    breakdown JSONB
) AS $$
DECLARE
    v_country_id UUID;
    v_vehicle_class_id UUID;
    v_addon_ids UUID[];
    v_calculation_result RECORD;
    v_breakdown JSONB;
BEGIN
    -- Get country ID
    SELECT id INTO v_country_id FROM countries WHERE code = p_country_code;
    
    -- Get vehicle class ID
    SELECT id INTO v_vehicle_class_id FROM vehicle_classes WHERE name = p_vehicle_class_name;
    
    -- Get addon IDs if provided
    IF p_addon_names IS NOT NULL THEN
        SELECT ARRAY_AGG(id) INTO v_addon_ids
        FROM addon_services
        WHERE name = ANY(p_addon_names)
        AND country_id = v_country_id;
    END IF;
    
    -- Calculate pricing
    SELECT * INTO v_calculation_result
    FROM calculate_pricing(
        v_country_id,
        v_vehicle_class_id,
        p_distance_km,
        p_datetime,
        v_addon_ids
    );
    
    -- Build breakdown JSON
    v_breakdown := jsonb_build_object(
        'country', p_country_code,
        'vehicle_class', p_vehicle_class_name,
        'distance_km', p_distance_km,
        'datetime', p_datetime,
        'addons', COALESCE(p_addon_names, ARRAY[]::VARCHAR[])
    );
    
    -- Return results
    RETURN QUERY SELECT 
        v_calculation_result.base_price,
        v_calculation_result.distance_price,
        v_calculation_result.time_modifier_price,
        v_calculation_result.addon_price,
        v_calculation_result.total_price,
        v_calculation_result.currency,
        v_breakdown;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PART 8: ADMIN USER SETUP (Manual Step Required)
-- =============================================

-- NOTE: Admin user creation should be done through Supabase Auth UI
-- Go to Authentication > Users > Add User
-- Email: admin@bluxacorp.com
-- Password: BLuxA2024Admin!
-- Then update the user's metadata to include app_role: 'admin'

-- =============================================
-- PART 9: TEST QUERIES
-- =============================================

-- Test that everything is working
SELECT 'Setup Complete!' as status;

-- Show sample data
SELECT 'Countries:' as table_name, count(*) as count FROM countries
UNION ALL
SELECT 'Vehicle Classes:', count(*) FROM vehicle_classes
UNION ALL
SELECT 'Pricing Zones:', count(*) FROM pricing_zones
UNION ALL
SELECT 'Pricing Rules:', count(*) FROM pricing_rules
UNION ALL
SELECT 'Time Modifiers:', count(*) FROM time_modifiers
UNION ALL
SELECT 'Addon Services:', count(*) FROM addon_services;

-- Test pricing calculation
SELECT 'Test Pricing Calculation:' as test_name;
SELECT * FROM test_pricing_calculation(
    'US',                    -- Country
    'Executive Sedan',       -- Vehicle class
    10.5,                   -- Distance in km
    NOW(),                  -- Current time
    ARRAY['Baby Seat']      -- Add-ons
);
