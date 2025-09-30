'use client'

import React from 'react'

// Base skeleton component
interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean
  animate?: boolean
}

export function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem', 
  rounded = true,
  animate = true 
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200'
  const roundedClasses = rounded ? 'rounded' : ''
  const animateClasses = animate ? 'animate-pulse' : ''
  
  return (
    <div
      className={`${baseClasses} ${roundedClasses} ${animateClasses} ${className}`}
      style={{ width, height }}
    />
  )
}

// Specific skeleton components for common UI patterns
export function SkeletonText({ 
  lines = 1, 
  className = '',
  lastLineWidth = '75%' 
}: { 
  lines?: number
  className?: string
  lastLineWidth?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <Skeleton key={i} height="1rem" />
      ))}
      {lines > 0 && (
        <Skeleton height="1rem" width={lastLineWidth} />
      )}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="space-y-4">
        <Skeleton height="1.5rem" width="60%" />
        <SkeletonText lines={3} />
        <div className="flex space-x-2">
          <Skeleton height="2rem" width="4rem" />
          <Skeleton height="2rem" width="4rem" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonForm({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Form Title */}
      <Skeleton height="2rem" width="50%" className="mx-auto" />
      
      {/* Form Fields */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton height="1rem" width="25%" />
            <Skeleton height="3rem" />
          </div>
        ))}
      </div>
      
      {/* Submit Button */}
      <div className="text-center">
        <Skeleton height="3rem" width="12rem" className="mx-auto" />
      </div>
    </div>
  )
}

export function SkeletonBookingForm({ className = '' }: { className?: string }) {
  return (
    <div className={`card ${className}`}>
      <div className="space-y-8">
        {/* Title */}
        <Skeleton height="2rem" width="60%" className="mx-auto" />
        
        {/* Pricing Display */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <Skeleton height="1.25rem" width="30%" className="mb-2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton height="1rem" width="80%" />
                <Skeleton height="0.875rem" width="60%" />
                <Skeleton height="0.75rem" width="40%" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Trip Details Section */}
        <div className="space-y-4">
          <Skeleton height="1.5rem" width="25%" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton height="1rem" width="40%" />
                <Skeleton height="3rem" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Customer Information Section */}
        <div className="space-y-4">
          <Skeleton height="1.5rem" width="35%" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton height="1rem" width="30%" />
                <Skeleton height="3rem" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Price Estimate */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Skeleton height="1.25rem" width="40%" />
            <Skeleton height="2rem" width="25%" />
          </div>
          <Skeleton height="0.875rem" width="80%" className="mt-1" />
        </div>
        
        {/* Submit Button */}
        <div className="text-center">
          <Skeleton height="3.5rem" width="12rem" className="mx-auto" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonPaymentForm({ className = '' }: { className?: string }) {
  return (
    <div className={`card ${className}`}>
      <div className="space-y-6">
        {/* Title */}
        <Skeleton height="2rem" width="50%" className="mx-auto" />
        
        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <Skeleton height="1.25rem" width="30%" className="mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton height="1rem" width="40%" />
                <Skeleton height="1rem" width="30%" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Payment Form */}
        <div className="space-y-4">
          <Skeleton height="1.5rem" width="25%" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton height="1rem" width="20%" />
              <Skeleton height="3rem" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton height="1rem" width="30%" />
                <Skeleton height="3rem" />
              </div>
              <div className="space-y-2">
                <Skeleton height="1rem" width="25%" />
                <Skeleton height="3rem" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Total */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Skeleton height="1.5rem" width="30%" />
            <Skeleton height="2rem" width="25%" />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton height="3rem" width="8rem" />
          <Skeleton height="3rem" width="10rem" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonHeader({ className = '' }: { className?: string }) {
  return (
    <header className={`bg-white shadow-lg ${className}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Skeleton height="2rem" width="8rem" />
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} height="1rem" width="4rem" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <Skeleton height="1.5rem" width="2rem" />
              <Skeleton height="1.5rem" width="2rem" />
            </div>
            <Skeleton height="2rem" width="6rem" />
          </div>
        </div>
      </nav>
    </header>
  )
}

export function SkeletonVehicleCard({ className = '' }: { className?: string }) {
  return (
    <div className={`feature-card ${className}`}>
      <div className="space-y-4">
        <Skeleton height="4rem" width="4rem" className="mx-auto rounded-full" />
        <Skeleton height="1.5rem" width="80%" className="mx-auto" />
        <SkeletonText lines={3} />
        <Skeleton height="1.25rem" width="60%" className="mx-auto" />
      </div>
    </div>
  )
}

// Loading states for different components
export function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  
  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} ${className}`} />
  )
}

export function LoadingButton({ 
  loading = false, 
  children, 
  className = '',
  ...props 
}: { 
  loading?: boolean
  children: React.ReactNode
  className?: string
  [key: string]: any
}) {
  return (
    <button
      className={`btn-primary flex items-center justify-center ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

export function LoadingPage({ 
  title = "Loading...", 
  description = "Please wait while we load your content.",
  className = '' 
}: { 
  title?: string
  description?: string
  className?: string 
}) {
  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center px-4 ${className}`}>
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}

// Higher-order component for loading states
export function withLoading<T extends object>(
  Component: React.ComponentType<T>,
  LoadingComponent: React.ComponentType = LoadingPage
) {
  return function LoadingWrapper(props: T & { loading?: boolean }) {
    const { loading, ...restProps } = props
    
    if (loading) {
      return <LoadingComponent />
    }
    
    return <Component {...(restProps as T)} />
  }
}



