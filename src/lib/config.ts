// Site-wide configuration for BLuxA Transportation
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://bluxa-backend.onrender.com',
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uhpcgbkknsnrgyxseawp.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  googleMaps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  },
} as const;

// Debug environment variables
if (typeof window !== 'undefined') {
  console.log('Environment variables check:');
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL ? 'SET' : 'MISSING');
  console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'SET' : 'MISSING');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
  console.log('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'SET' : 'MISSING');
  console.log('Config object:', config);
}
