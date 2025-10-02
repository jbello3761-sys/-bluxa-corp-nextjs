'use client'

import React, { useState } from 'react'
import { useAuth } from './AuthProvider'
import { SignInModal } from './SignInModal'
import { SignUpModal } from './SignUpModal'
import { SkeletonHeader } from '@/components/LoadingStates'

export function AuthHeader() {
  const { user, loading, signOut } = useAuth()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      {loading ? (
        <SkeletonHeader />
      ) : (
        <header className="bg-white shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-gradient">BLuxA Corp</h1>
                </div>
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-4">
            <a href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Home
            </a>
            <a href="/fleet" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Fleet
            </a>
            <a href="/services" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Services
            </a>
            <a href="/pricing" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Pricing
            </a>
            <a href="/contact" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Contact
            </a>
          </div>
        </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Language Toggle */}
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded transition duration-300">
                    EN
                  </button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition duration-300">
                    ES
                  </button>
                </div>
                
                {/* Book Now Button */}
                <a href="/book" className="bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-red-700 transition duration-300">
                  Book Now
                </a>

                {/* Auth Section */}
                {user ? (
                  // Signed in state
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-sm text-gray-700 hover:text-blue-600 transition duration-300"
                    >
                      Sign Out
                    </button>
                    <a href="/book" className="btn-primary">
                      Book Now
                    </a>
                  </div>
                ) : (
                  // Signed out state
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowSignIn(true)}
                      className="text-sm text-gray-700 hover:text-blue-600 transition duration-300"
                    >
                      Sign In
                    </button>
                    <a href="/book" className="btn-primary">
                      Book Now
                    </a>
                  </div>
                )}
              </div>
            </div>
            
        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <a href="/" className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="/fleet" className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Fleet</a>
            <a href="/services" className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Services</a>
            <a href="/pricing" className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
            <a href="/contact" className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Contact</a>
          </div>
        </div>
          </nav>
        </header>
      )}

      {/* Auth Modals */}
      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={() => {
          setShowSignIn(false)
          setShowSignUp(true)
        }}
      />
      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => {
          setShowSignUp(false)
          setShowSignIn(true)
        }}
      />
    </>
  )
}
