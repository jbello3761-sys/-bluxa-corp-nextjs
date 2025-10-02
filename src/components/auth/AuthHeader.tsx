'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthProvider'
import { SignInModal } from './SignInModal'
import { SignUpModal } from './SignUpModal'
import { SkeletonHeader } from '@/components/LoadingStates'

export function AuthHeader() {
  const { user, loading, signOut } = useAuth()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await signOut()
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {loading ? (
        <SkeletonHeader />
      ) : (
        <header className="bg-white shadow-lg" ref={mobileMenuRef}>
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 md:h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-lg md:text-2xl font-bold text-gradient">BLuxA Transportation</h1>
                </div>
        {/* Desktop Navigation */}
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-3">
          <a href="/book" className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-300">
            Book Now
          </a>
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-gray-900 p-1 rounded-md"
            aria-label="Toggle mobile menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
              </div>
              
              {/* Desktop Right Side */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Language Toggle */}
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded transition duration-300">
                    EN
                  </button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition duration-300">
                    ES
                  </button>
                </div>
                
                {/* Book Now Button - Desktop only */}
                <a href="/book" className="bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-red-700 transition duration-300">
                  Book Now
                </a>
              </div>
            </div>
          </nav>
          
          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
              <div className="px-4 py-3 space-y-2">
                <a 
                  href="/" 
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md text-base font-medium transition duration-200"
                >
                  Home
                </a>
                <a 
                  href="/fleet" 
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md text-base font-medium transition duration-200"
                >
                  Fleet
                </a>
                <a 
                  href="/services" 
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md text-base font-medium transition duration-200"
                >
                  Services
                </a>
                <a 
                  href="/pricing" 
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md text-base font-medium transition duration-200"
                >
                  Pricing
                </a>
                <a 
                  href="/contact" 
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md text-base font-medium transition duration-200"
                >
                  Contact
                </a>
                
                {/* Mobile Auth Section */}
                <div className="pt-3 border-t border-gray-200">
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm text-gray-600">
                        Welcome, {user.email}
                      </div>
                      <button
                        onClick={() => {
                          handleSignOut()
                          closeMobileMenu()
                        }}
                        className="block w-full text-left px-3 py-2 text-gray-900 hover:text-red-600 hover:bg-gray-50 rounded-md text-base font-medium transition duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowSignIn(true)
                          closeMobileMenu()
                        }}
                        className="block w-full text-left px-3 py-2 text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md text-base font-medium transition duration-200"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setShowSignUp(true)
                          closeMobileMenu()
                        }}
                        className="block w-full text-left px-3 py-2 text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md text-base font-medium transition duration-200"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
