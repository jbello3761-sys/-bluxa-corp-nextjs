-- BLuxA Dynamic Pricing System Database Schema
-- PostgreSQL Schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CORE PRICING TABLES
-- =============================================

-- Countries/Regions table
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(3) UNIQUE NOT NULL, -- 'US', 'DO'
    name VARCHAR(100) NOT NULL,
    currency VARCHAR(3) NOT NULL, -- 'USD', 'DOP'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle classes/types
CREATE TABLE vehicle_classes (
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
CREATE TABLE pricing_zones (
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
CREATE TABLE pricing_rules (
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
CREATE TABLE time_modifiers (
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
CREATE TABLE addon_services (
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

-- =============================================
-- PRICING CALCULATION TABLES
-- =============================================

-- Pricing calculation cache (for performance)
CREATE TABLE pricing_calculations (
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
CREATE TABLE pricing_audit_log (
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
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_pricing_rules_country_vehicle ON pricing_rules(country_id, vehicle_class_id);
CREATE INDEX idx_pricing_rules_active ON pricing_rules(is_active) WHERE is_active = true;
CREATE INDEX idx_time_modifiers_country_active ON time_modifiers(country_id, is_active);
CREATE INDEX idx_addon_services_country_active ON addon_services(country_id, is_active);
CREATE INDEX idx_pricing_calculations_lookup ON pricing_calculations(country_id, vehicle_class_id, zone_id, distance_km);
CREATE INDEX idx_pricing_calculations_expires ON pricing_calculations(expires_at);

-- =============================================
-- FUNCTIONS AND TRIGGERS
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
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicle_classes_updated_at BEFORE UPDATE ON vehicle_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_zones_updated_at BEFORE UPDATE ON pricing_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON pricing_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_modifiers_updated_at BEFORE UPDATE ON time_modifiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
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
    SELECT currency INTO v_currency FROM countries WHERE id = p_country_id;
    
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
        TIME(p_datetime) BETWEEN start_time AND end_time
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
-- SAMPLE DATA
-- =============================================

-- Insert countries
INSERT INTO countries (code, name, currency) VALUES 
('US', 'United States', 'USD'),
('DO', 'Dominican Republic', 'DOP');

-- Insert vehicle classes
INSERT INTO vehicle_classes (name, description, capacity, base_multiplier) VALUES 
('Executive Sedan', 'Luxury sedan for executive travel', 4, 1.0),
('Luxury SUV', 'Premium SUV for comfort and space', 6, 1.3),
('Sprinter Van', 'Large van for group transportation', 12, 1.8);

-- Insert pricing zones for US
INSERT INTO pricing_zones (country_id, name, description, min_distance_km, max_distance_km) VALUES 
((SELECT id FROM countries WHERE code = 'US'), 'Airport Zone', 'Airport pickup/dropoff', 0, 5),
((SELECT id FROM countries WHERE code = 'US'), 'City Center', 'Downtown area', 5, 15),
((SELECT id FROM countries WHERE code = 'US'), 'Suburbs', 'Suburban areas', 15, 50),
((SELECT id FROM countries WHERE code = 'US'), 'Long Distance', 'Inter-city travel', 50, 999999);

-- Insert pricing zones for DR
INSERT INTO pricing_zones (country_id, name, description, min_distance_km, max_distance_km) VALUES 
((SELECT id FROM countries WHERE code = 'DO'), 'Airport Zone', 'Airport pickup/dropoff', 0, 5),
((SELECT id FROM countries WHERE code = 'DO'), 'City Center', 'Downtown area', 5, 15),
((SELECT id FROM countries WHERE code = 'DO'), 'Suburbs', 'Suburban areas', 15, 50),
((SELECT id FROM countries WHERE code = 'DO'), 'Long Distance', 'Inter-city travel', 50, 999999);

-- Insert base pricing rules for US
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
WHERE c.code = 'US' AND z.country_id = c.id;

-- Insert base pricing rules for DR
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
WHERE c.code = 'DO' AND z.country_id = c.id;

-- Insert time modifiers
INSERT INTO time_modifiers (country_id, name, description, day_of_week, start_time, end_time, multiplier) VALUES 
((SELECT id FROM countries WHERE code = 'US'), 'Peak Hours', 'Rush hour pricing', ARRAY[1,2,3,4,5], '07:00', '09:00', 1.25),
((SELECT id FROM countries WHERE code = 'US'), 'Peak Hours', 'Evening rush hour', ARRAY[1,2,3,4,5], '17:00', '19:00', 1.25),
((SELECT id FROM countries WHERE code = 'US'), 'Weekend Premium', 'Weekend pricing', ARRAY[6,7], NULL, NULL, 1.15),
((SELECT id FROM countries WHERE code = 'DO'), 'Peak Hours', 'Rush hour pricing', ARRAY[1,2,3,4,5], '07:00', '09:00', 1.25),
((SELECT id FROM countries WHERE code = 'DO'), 'Peak Hours', 'Evening rush hour', ARRAY[1,2,3,4,5], '17:00', '19:00', 1.25),
((SELECT id FROM countries WHERE code = 'DO'), 'Weekend Premium', 'Weekend pricing', ARRAY[6,7], NULL, NULL, 1.15);

-- Insert addon services
INSERT INTO addon_services (country_id, name, description, price, price_type) VALUES 
((SELECT id FROM countries WHERE code = 'US'), 'Baby Seat', 'Child safety seat', 15.00, 'fixed'),
((SELECT id FROM countries WHERE code = 'US'), 'Airport Toll', 'Airport access fee', 5.00, 'fixed'),
((SELECT id FROM countries WHERE code = 'US'), 'Extra Luggage', 'Additional luggage space', 10.00, 'fixed'),
((SELECT id FROM countries WHERE code = 'DO'), 'Baby Seat', 'Child safety seat', 500.00, 'fixed'),
((SELECT id FROM countries WHERE code = 'DO'), 'Airport Toll', 'Airport access fee', 200.00, 'fixed'),
((SELECT id FROM countries WHERE code = 'DO'), 'Extra Luggage', 'Additional luggage space', 300.00, 'fixed');

