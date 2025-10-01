# Set environment variables for Vercel deployment
# Run this script to add all required environment variables

echo "Setting up Vercel environment variables..."

# API URL
echo "Adding NEXT_PUBLIC_API_URL..."
echo "https://bluxa-backend.onrender.com" | npx vercel env add NEXT_PUBLIC_API_URL production

# Stripe Publishable Key
echo "Adding NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY..."
echo "pk_test_51S9XYx1FY4wR5oF6jnwI844v0CYqT1f5RXmn9pvO3UdTx7h8saS8HXUpdd3J7RLq1STTRpnMjq7t4ObRPsrd4Qxg00OcIrGYS4" | npx vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

# Supabase URL
echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
echo "https://uhpcgbkknsnrgyxseawp.supabase.co" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Supabase Anon Key
echo "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVocGNnYmtrbnNucmd5eHNlYXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjUyMTIsImV4cCI6MjA3NDE0MTIxMn0.gXD93radRKIUhcX4Knd-tG1xMQLbRrBNw3mRFPZaaJ0" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "Environment variables set successfully!"
echo "Now deploying to Vercel..."
npx vercel --prod
