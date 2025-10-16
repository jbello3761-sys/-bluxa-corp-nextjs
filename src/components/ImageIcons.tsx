import React from 'react'
import Image from 'next/image'

interface ImageIconProps {
  src: string
  alt: string
  className?: string
  size?: number
}

// Service Images Component (Real Photos)
export const ServiceImageIcon = ({ src, alt, className = "", size = 64 }: ImageIconProps) => (
  <div className={`service-image-icon ${className}`} style={{ width: size, height: size }}>
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-lg object-cover"
      style={{ width: '100%', height: '100%' }}
    />
  </div>
)

// Feature Icons Component (Professional Icons)
export const FeatureIcon = ({ src, alt, className = "", size = 32 }: ImageIconProps) => (
  <div className={`feature-icon ${className}`} style={{ width: size, height: size }}>
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-contain"
      style={{ width: '100%', height: '100%' }}
    />
  </div>
)

// Service Area Images Component (Mix of Photos and Icons)
export const ServiceAreaImage = ({ src, alt, className = "", size = 48 }: ImageIconProps) => (
  <div className={`service-area-image ${className}`} style={{ width: size, height: size }}>
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-cover rounded-lg"
      style={{ width: '100%', height: '100%' }}
    />
  </div>
)

// Fleet Feature Icons Component
export const FleetFeatureIcon = ({ src, alt, className = "", size = 32 }: ImageIconProps) => (
  <div className={`fleet-feature-icon ${className}`} style={{ width: size, height: size }}>
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-contain"
      style={{ width: '100%', height: '100%' }}
    />
  </div>
)

// Footer Contact Icons Component
export const ContactIcon = ({ src, alt, className = "", size = 16 }: ImageIconProps) => (
  <div className={`contact-icon ${className}`} style={{ width: size, height: size }}>
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-contain"
      style={{ width: '100%', height: '100%' }}
    />
  </div>
)
