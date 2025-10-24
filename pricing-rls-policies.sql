-- BLuxA Dynamic Pricing System - Supabase RLS Policies
-- Row Level Security policies for admin access control

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_audit_log ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            (auth.jwt() ->> 'user_metadata' ->> 'app_role')::text = 'admin',
            false
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user ID
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- COUNTRIES POLICIES
-- =============================================

-- Allow everyone to read countries (needed for public pricing)
CREATE POLICY "Countries are viewable by everyone" ON countries
    FOR SELECT USING (true);

-- Only admins can modify countries
CREATE POLICY "Only admins can insert countries" ON countries
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update countries" ON countries
    FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete countries" ON countries
    FOR DELETE USING (is_admin());

-- =============================================
-- VEHICLE CLASSES POLICIES
-- =============================================

-- Allow everyone to read vehicle classes
CREATE POLICY "Vehicle classes are viewable by everyone" ON vehicle_classes
    FOR SELECT USING (true);

-- Only admins can modify vehicle classes
CREATE POLICY "Only admins can insert vehicle classes" ON vehicle_classes
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update vehicle classes" ON vehicle_classes
    FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete vehicle classes" ON vehicle_classes
    FOR DELETE USING (is_admin());

-- =============================================
-- PRICING ZONES POLICIES
-- =============================================

-- Allow everyone to read pricing zones
CREATE POLICY "Pricing zones are viewable by everyone" ON pricing_zones
    FOR SELECT USING (true);

-- Only admins can modify pricing zones
CREATE POLICY "Only admins can insert pricing zones" ON pricing_zones
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update pricing zones" ON pricing_zones
    FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete pricing zones" ON pricing_zones
    FOR DELETE USING (is_admin());

-- =============================================
-- PRICING RULES POLICIES
-- =============================================

-- Allow everyone to read pricing rules
CREATE POLICY "Pricing rules are viewable by everyone" ON pricing_rules
    FOR SELECT USING (true);

-- Only admins can modify pricing rules
CREATE POLICY "Only admins can insert pricing rules" ON pricing_rules
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update pricing rules" ON pricing_rules
    FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete pricing rules" ON pricing_rules
    FOR DELETE USING (is_admin());

-- =============================================
-- TIME MODIFIERS POLICIES
-- =============================================

-- Allow everyone to read time modifiers
CREATE POLICY "Time modifiers are viewable by everyone" ON time_modifiers
    FOR SELECT USING (true);

-- Only admins can modify time modifiers
CREATE POLICY "Only admins can insert time modifiers" ON time_modifiers
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update time modifiers" ON time_modifiers
    FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete time modifiers" ON time_modifiers
    FOR DELETE USING (is_admin());

-- =============================================
-- ADDON SERVICES POLICIES
-- =============================================

-- Allow everyone to read addon services
CREATE POLICY "Addon services are viewable by everyone" ON addon_services
    FOR SELECT USING (true);

-- Only admins can modify addon services
CREATE POLICY "Only admins can insert addon services" ON addon_services
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update addon services" ON addon_services
    FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete addon services" ON addon_services
    FOR DELETE USING (is_admin());

-- =============================================
-- PRICING CALCULATIONS POLICIES
-- =============================================

-- Allow everyone to read pricing calculations (for caching)
CREATE POLICY "Pricing calculations are viewable by everyone" ON pricing_calculations
    FOR SELECT USING (true);

-- Only system can insert pricing calculations (via function)
CREATE POLICY "Only system can insert pricing calculations" ON pricing_calculations
    FOR INSERT WITH CHECK (true); -- Function handles this

-- Only admins can delete pricing calculations (for cache management)
CREATE POLICY "Only admins can delete pricing calculations" ON pricing_calculations
    FOR DELETE USING (is_admin());

-- =============================================
-- PRICING AUDIT LOG POLICIES
-- =============================================

-- Only admins can read audit logs
CREATE POLICY "Only admins can view audit logs" ON pricing_audit_log
    FOR SELECT USING (is_admin());

-- Only system can insert audit logs
CREATE POLICY "Only system can insert audit logs" ON pricing_audit_log
    FOR INSERT WITH CHECK (true); -- Function handles this

-- =============================================
-- AUDIT TRIGGER FUNCTION
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

-- =============================================
-- AUDIT TRIGGERS
-- =============================================

-- Apply audit triggers to all pricing tables
CREATE TRIGGER audit_countries_changes
    AFTER INSERT OR UPDATE OR DELETE ON countries
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

CREATE TRIGGER audit_vehicle_classes_changes
    AFTER INSERT OR UPDATE OR DELETE ON vehicle_classes
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

CREATE TRIGGER audit_pricing_zones_changes
    AFTER INSERT OR UPDATE OR DELETE ON pricing_zones
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

CREATE TRIGGER audit_pricing_rules_changes
    AFTER INSERT OR UPDATE OR DELETE ON pricing_rules
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

CREATE TRIGGER audit_time_modifiers_changes
    AFTER INSERT OR UPDATE OR DELETE ON time_modifiers
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

CREATE TRIGGER audit_addon_services_changes
    AFTER INSERT OR UPDATE OR DELETE ON addon_services
    FOR EACH ROW EXECUTE FUNCTION log_pricing_changes();

-- =============================================
-- API FUNCTIONS FOR ADMIN INTERFACE
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

