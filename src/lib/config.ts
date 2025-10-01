// Site-wide configuration for BLuxA Corp
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://bluxa-backend.onrender.com',
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uhpcgbkknsnrgyxseawp.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
} as const;

// Validate required environment variables (only in browser, not during build)
if (typeof window !== 'undefined') {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ] as const;

  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
    console.warn('Using fallback values from config');
  }
}
