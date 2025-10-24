# 🚀 BLuxA Supabase Database Setup Guide

## Quick Setup (5 minutes)

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your BLuxA project: `https://uhpcgbkknsnrgyxseawp.supabase.co`

### Step 2: Run the Complete Setup
1. **Click "SQL Editor"** in the left sidebar
2. **Copy the entire contents** of `supabase-setup-complete.sql`
3. **Paste it into the SQL Editor**
4. **Click "Run"** (or press Ctrl+Enter)

### Step 3: Verify Setup
After running the SQL, you should see:
- ✅ "Setup Complete!" message
- ✅ Count of records in each table
- ✅ Sample pricing calculation result

## What This Sets Up

### 📊 **Database Tables**
- `countries` - US and Dominican Republic
- `vehicle_classes` - Executive Sedan, Luxury SUV, Sprinter Van
- `pricing_zones` - Airport, City Center, Suburbs, Long Distance
- `pricing_rules` - Base pricing for each country/vehicle/zone combination
- `time_modifiers` - Peak hours and weekend pricing
- `addon_services` - Baby seat, airport toll, extra luggage
- `pricing_calculations` - Performance cache
- `pricing_audit_log` - Admin action tracking

### 🔒 **Security (RLS Policies)**
- ✅ Public can read pricing data (for booking calculations)
- ✅ Only admins can modify pricing data
- ✅ Complete audit logging of all changes

### 👤 **Admin User**
- ✅ Email: `admin@bluxacorp.com`
- ✅ Password: `BLuxA2024Admin!`
- ✅ Role: `admin` (with full access)

### 🧮 **Pricing Functions**
- ✅ Real-time pricing calculations
- ✅ Country-specific pricing (US vs DR)
- ✅ Distance-based pricing zones
- ✅ Time-based modifiers (peak hours, weekends)
- ✅ Add-on services pricing

## Test Your Setup

### In Supabase SQL Editor, run:
```sql
-- Test pricing calculation
SELECT * FROM test_pricing_calculation(
    'US',                    -- Country
    'Executive Sedan',       -- Vehicle class
    10.5,                   -- Distance in km
    NOW(),                  -- Current time
    ARRAY['Baby Seat']      -- Add-ons
);
```

### Expected Result:
- Base Price: $35.00 (City Center zone)
- Distance Price: $31.50 (10.5 km × $3.00/km)
- Time Modifier: $0.00 (if not peak hours)
- Addon Price: $15.00 (Baby Seat)
- **Total Price: $81.50**

## 🎯 Next Steps

Once the database is set up:

1. **Test the admin interface** at `https://bluxat.com/admin`
2. **Login** with `admin@bluxacorp.com` / `BLuxA2024Admin!`
3. **Click the Pricing tab** - it should now load real data!
4. **Test all CRUD operations** - add, edit, delete pricing rules
5. **Test the preview mode** - calculate pricing for different scenarios

## 🔧 Troubleshooting

### If you get errors:
1. **Check Supabase project** - Make sure you're in the right project
2. **Check permissions** - Ensure you have admin access to the project
3. **Run in parts** - If the full script fails, run sections individually
4. **Check existing data** - The script uses `IF NOT EXISTS` to avoid conflicts

### If admin login doesn't work:
1. **Check user exists**: `SELECT * FROM auth.users WHERE email = 'admin@bluxacorp.com';`
2. **Check user metadata**: `SELECT user_metadata FROM auth.users WHERE email = 'admin@bluxacorp.com';`
3. **Should show**: `{"app_role": "admin", "full_name": "BLuxA Admin"}`

## 🎉 Success!

Once this is complete, your admin interface will be **fully functional** with:
- ✅ Real-time pricing calculations
- ✅ Complete CRUD operations
- ✅ Country-specific pricing
- ✅ Time-based modifiers
- ✅ Add-on services
- ✅ Audit logging
- ✅ Performance optimization

**Your dynamic pricing system will be live and ready for production!** 🚀
