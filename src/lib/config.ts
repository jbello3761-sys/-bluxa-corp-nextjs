// Site-wide configuration for BLuxA Corp
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    errorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
  },
} as const;

// Environment validation with detailed error messages
const requiredEnvVars = [
  {
    key: 'NEXT_PUBLIC_API_URL',
    description: 'Backend API URL (e.g., http://localhost:8000 or https://api.bluxacorp.com)',
    example: 'http://localhost:8000'
  },
  {
    key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    description: 'Stripe publishable key (starts with pk_test_ or pk_live_)',
    example: 'pk_test_51...'
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL',
    example: 'https://your-project.supabase.co'
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous key (starts with eyJ)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
] as const;

// Validate environment variables with helpful error messages
function validateEnvironment() {
  const missingVars: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar.key]) {
      missingVars.push(envVar.key);
    }
  }
  
  if (missingVars.length > 0) {
    const errorMessage = `
🚨 Missing required environment variables:

${missingVars.map(key => {
  const envVar = requiredEnvVars.find(v => v.key === key);
  return `  ${key}
     Description: ${envVar?.description}
     Example: ${envVar?.example}`;
}).join('\n\n')}

📝 To fix this:
1. Copy .env.example to .env.local
2. Fill in your actual values
3. Restart your development server

💡 Get your keys from:
- Stripe: https://dashboard.stripe.com/apikeys
- Supabase: https://supabase.com/dashboard/project/settings/api
`;
    
    throw new Error(errorMessage);
  }
}

// Only validate in browser/client-side and not during build
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
  validateEnvironment();
}
