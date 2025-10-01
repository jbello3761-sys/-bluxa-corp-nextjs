'use client'

import React, { useState, useEffect } from 'react'

interface CarouselImage {
  src: string
  name: string
  tagline: string
  category: 'city' | 'airport' | 'vehicle'
}

// Predefined mappings for your images
const imageMappings: Record<string, { name: string; tagline: string; category: 'city' | 'airport' | 'vehicle' }> = {
  'nyc.jpg': { name: 'New York City', tagline: 'The city that never sleeps', category: 'city' },
  'nyc 2.jpg': { name: 'Los Angeles', tagline: 'City of Angels', category: 'city' },
  'nyc 3.jpg': { name: 'Las Vegas', tagline: 'Entertainment Capital', category: 'city' },
  'city.jpg': { name: 'Chicago', tagline: 'The Windy City', category: 'city' },
  'city2.jpg': { name: 'Miami', tagline: 'Magic City', category: 'city' },
  'terminal.jpg': { name: 'JFK Airport', tagline: 'New York\'s Gateway', category: 'airport' },
  'airport walking.jpg': { name: 'LAX Airport', tagline: 'Los Angeles International', category: 'airport' },
  'suv.jpg': { name: 'Luxury SUV', tagline: 'Premium Comfort', category: 'vehicle' },
  'black-sprinter.webp': { name: 'Sprinter Van', tagline: 'Group Transportation', category: 'vehicle' },
}

// Default fallbacks for new images
const getDefaultInfo = (filename: string): { name: string; tagline: string; category: 'city' | 'airport' | 'vehicle' } => {
  const lowerFilename = filename.toLowerCase()
  
  if (lowerFilename.includes('city') || lowerFilename.includes('nyc') || lowerFilename.includes('skyline')) {
    return { name: 'City View', tagline: 'Urban Excellence', category: 'city' }
  }
  if (lowerFilename.includes('airport') || lowerFilename.includes('terminal') || lowerFilename.includes('gate')) {
    return { name: 'Airport Terminal', tagline: 'Your Gateway', category: 'airport' }
  }
  if (lowerFilename.includes('car') || lowerFilename.includes('suv') || lowerFilename.includes('van') || lowerFilename.includes('sprinter') || lowerFilename.includes('sedan')) {
    return { name: 'Luxury Vehicle', tagline: 'Premium Service', category: 'vehicle' }
  }
  
  return { name: 'BLuxA Corp', tagline: 'Luxury Transportation', category: 'city' }
}

export function DynamicCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Fetch the list of images from your public/images folder
    const fetchImages = async () => {
      try {
        // Get list of image files from the API
        const response = await fetch('/api/images')
        if (response.ok) {
          const imageFiles = await response.json()
          
          const carouselImages: CarouselImage[] = imageFiles.map((filename: string) => {
            const mapping = imageMappings[filename] || getDefaultInfo(filename)
            return {
              src: `/images/${filename}`,
              name: mapping.name,
              tagline: mapping.tagline,
              category: mapping.category
            }
          })
          
          setImages(carouselImages)
        }
      } catch (error) {
        console.error('Error fetching images:', error)
        // Fallback to hardcoded images if API fails
        const fallbackImages: CarouselImage[] = Object.entries(imageMappings).map(([filename, info]) => ({
          src: `/images/${filename}`,
          name: info.name,
          tagline: info.tagline,
          category: info.category
        }))
        setImages(fallbackImages)
      }
    }

    fetchImages()
  }, [])

  useEffect(() => {
    if (images.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [images.length])

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-red-600">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p>Loading images...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      <div className="city-carousel">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url("${image.src}"), linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
            }}
          >
            <div className="city-overlay">
              <h3 className="city-name">{image.name}</h3>
              <p className="city-tagline">{image.tagline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

