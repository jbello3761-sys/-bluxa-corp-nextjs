import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { AuthHeader } from '@/components/auth/AuthHeader'
import { ErrorBoundary, AuthErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BLuxA Corp - Luxury Transportation Redefined',
  description: 'Premium luxury transportation services in New York City. Executive sedans, luxury SUVs, and sprinter vans available 24/7.',
  keywords: 'luxury transportation, NYC, executive sedan, luxury SUV, airport transfer, corporate travel',
}

// Footer Component - Preserving existing design
function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">BLuxA Corp</h3>
            <p className="text-gray-300 mb-4">
              Premium luxury transportation services in New York City. 
              Experience the difference with our professional drivers and luxury fleet.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Airport Transfer</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Corporate Travel</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Special Events</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Hourly Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📞 +1 (555) 123-4567</li>
              <li>✉️ info@bluxacorp.com</li>
              <li>📍 New York City, NY</li>
              <li>🕒 24/7 Available</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; 2024 BLuxA Corp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts - Preserving existing typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthErrorBoundary>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <AuthHeader />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </AuthProvider>
          </AuthErrorBoundary>
        </ErrorBoundary>
      </body>
    </html>
  )
}
