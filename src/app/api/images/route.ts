import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images')
    
    // Check if images directory exists
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json([])
    }

    // Read all files in the images directory
    const files = fs.readdirSync(imagesDir)
    
    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return imageExtensions.includes(ext)
    })

    return NextResponse.json(imageFiles)
  } catch (error) {
    console.error('Error reading images directory:', error)
    return NextResponse.json([])
  }
}

