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
                    <a href="/book" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                      Book Now
                    </a>
                    <a href="/payment" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                      Payment
                    </a>
                    <a href="/env-check" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                      Debug
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Language Toggle - Preserving existing functionality */}
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition duration-300">
                    EN
                  </button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition duration-300">
                    ES
                  </button>
                </div>

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
