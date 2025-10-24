# BLuxA Dynamic Pricing System - Implementation Guide

## 🎯 **Overview**

This comprehensive dynamic pricing system provides flexible, admin-manageable pricing for BLuxA Transportation's U.S. and Dominican Republic operations. The system includes distance-based pricing, vehicle class tiers, time modifiers, and add-on services.

## 📁 **Files Created**

### Database Schema
- `pricing-schema.sql` - Complete PostgreSQL schema with sample data
- `pricing-rls-policies.sql` - Supabase RLS policies and security functions

### Frontend Components
- `src/components/PricingManagement.tsx` - Main admin interface component
- `src/lib/pricing-api.ts` - API functions for pricing operations

### Integration
- Updated `src/app/admin/page.tsx` - Added pricing tab to admin portal

## 🗄️ **Database Schema Features**

### Core Tables
1. **countries** - U.S. and Dominican Republic with currency support
2. **vehicle_classes** - Executive Sedan, Luxury SUV, Sprinter Van
3. **pricing_zones** - Distance-based zones (Airport, City Center, Suburbs, Long Distance)
4. **pricing_rules** - Base pricing matrix (country × vehicle × zone)
5. **time_modifiers** - Peak hours, weekend pricing, holiday rates
6. **addon_services** - Baby seat, airport toll, extra luggage

### Advanced Features
- **Pricing calculation cache** for performance
- **Audit logging** for all pricing changes
- **Automatic timestamp updates** via triggers
- **Comprehensive indexing** for fast queries

## 🔐 **Security & Access Control**

### RLS Policies
- **Public read access** for pricing data (needed for booking calculations)
- **Admin-only write access** for all pricing management
- **Audit trail** for all changes with user tracking
- **Function-based security** with `is_admin()` helper

### Admin Authentication
- Uses Supabase JWT with `user_metadata.app_role = 'admin'`
- Secure function execution with `SECURITY DEFINER`
- Comprehensive error handling and logging

## ⚛️ **React Admin Interface**

### Features
1. **Pricing Matrix Tab**
   - Interactive table for base pricing rules
   - Inline editing with real-time updates
   - Country/vehicle/zone filtering
   - Status toggles (active/inactive)

2. **Time Modifiers Tab**
   - Peak hour management
   - Weekend/holiday pricing
   - Day-of-week and time range configuration
   - Multiplier-based pricing adjustments

3. **Add-on Services Tab**
   - Service management (baby seat, tolls, luggage)
   - Fixed/percentage/per-item pricing types
   - Country-specific pricing

4. **Preview Mode Tab**
   - Real-time pricing calculation testing
   - Scenario simulation
   - Breakdown visualization
   - Add-on selection interface

### User Experience
- **Responsive design** with Tailwind CSS
- **Real-time updates** without page refresh
- **Error handling** with user-friendly messages
- **Loading states** for better UX
- **Confirmation dialogs** for destructive actions

## 🚀 **Implementation Steps**

### 1. Database Setup
```sql
-- Run the schema file in Supabase SQL editor
-- This creates all tables, functions, triggers, and sample data
```

### 2. Environment Configuration
```typescript
// Ensure these are in your .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Admin User Setup
```sql
-- Set admin role for a user
UPDATE auth.users 
SET user_metadata = jsonb_set(
  COALESCE(user_metadata, '{}'), 
  '{app_role}', 
  '"admin"'
) 
WHERE email = 'admin@bluxacorp.com';
```

### 4. Component Integration
```typescript
// Import and use in your admin page
import PricingManagement from '@/components/PricingManagement'

// Replace the placeholder content with:
<PricingManagement />
```

## 💡 **Key Features**

### Pricing Calculation Engine
- **Multi-factor pricing** with base + distance + time + addons
- **Zone-based logic** for different distance ranges
- **Time-aware modifiers** for peak hours and weekends
- **Caching system** for performance optimization
- **Real-time calculation** via PostgreSQL functions

### Admin Management
- **Bulk operations** for efficient updates
- **Audit logging** for compliance and tracking
- **Preview mode** for testing before deployment
- **Export functionality** for backup and analysis
- **Status management** for enabling/disabling rules

### Scalability
- **Modular design** for easy extension
- **Performance optimization** with caching and indexing
- **Multi-country support** with currency handling
- **Flexible pricing models** for different business needs

## 🔧 **API Functions**

### Core Functions
- `calculatePricing()` - Main pricing calculation
- `getPricingMatrix()` - Admin interface data
- `createPricingRule()` - Add new pricing rules
- `updatePricingRule()` - Modify existing rules
- `testPricingCalculation()` - Preview mode testing

### Utility Functions
- `getCountries()` - Country list
- `getVehicleClasses()` - Vehicle types
- `getPricingZones()` - Distance zones
- `getAddonServices()` - Available add-ons
- `exportPricingData()` - Backup functionality

## 📊 **Sample Data Included**

### U.S. Pricing (USD)
- **Airport Zone**: $25 base + $2.50/km
- **City Center**: $35 base + $3.00/km
- **Suburbs**: $45 base + $2.75/km
- **Long Distance**: $60 base + $2.25/km

### Dominican Republic Pricing (DOP)
- **Airport Zone**: 800 DOP base + 80 DOP/km
- **City Center**: 1200 DOP base + 100 DOP/km
- **Suburbs**: 1500 DOP base + 90 DOP/km
- **Long Distance**: 2000 DOP base + 75 DOP/km

### Time Modifiers
- **Peak Hours** (7-9 AM, 5-7 PM): 1.25x multiplier
- **Weekend Premium**: 1.15x multiplier

### Add-on Services
- **Baby Seat**: $15 USD / 500 DOP
- **Airport Toll**: $5 USD / 200 DOP
- **Extra Luggage**: $10 USD / 300 DOP

## 🎨 **UI/UX Features**

### Design System
- **Consistent styling** with BLuxA brand colors
- **Responsive grid layouts** for different screen sizes
- **Interactive elements** with hover states
- **Status indicators** with color coding
- **Loading animations** for better UX

### Accessibility
- **Keyboard navigation** support
- **Screen reader friendly** markup
- **High contrast** color schemes
- **Focus indicators** for interactive elements

## 🔄 **Workflow**

### Admin Workflow
1. **Select Country** - Choose US or Dominican Republic
2. **View Pricing Matrix** - See current pricing rules
3. **Edit Rules** - Modify base prices, per-km rates, minimums
4. **Manage Modifiers** - Set peak hours, weekend rates
5. **Configure Add-ons** - Set service prices
6. **Test Changes** - Use preview mode to validate
7. **Deploy** - Activate new pricing rules

### Customer Workflow
1. **Select Service** - Choose vehicle class and add-ons
2. **Enter Details** - Pickup/dropoff locations, time
3. **Calculate Price** - System computes total cost
4. **Book Service** - Complete reservation

## 🚀 **Next Steps**

### Immediate Implementation
1. Run the SQL schema in Supabase
2. Set up admin user permissions
3. Integrate PricingManagement component
4. Test with sample data

### Future Enhancements
1. **Real-time booking integration**
2. **Advanced analytics dashboard**
3. **A/B testing for pricing strategies**
4. **Machine learning price optimization**
5. **Multi-language support**
6. **Mobile admin app**

## 📈 **Performance Considerations**

### Database Optimization
- **Indexed queries** for fast lookups
- **Caching layer** for frequent calculations
- **Connection pooling** for scalability
- **Query optimization** for complex operations

### Frontend Optimization
- **Lazy loading** for large datasets
- **Debounced updates** for real-time editing
- **Error boundaries** for graceful failures
- **Progressive enhancement** for better UX

This dynamic pricing system provides a solid foundation for BLuxA's transportation business with room for future growth and feature expansion.

