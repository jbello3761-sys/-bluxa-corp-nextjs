import { NextResponse } from 'next/server'
import { config } from '@/lib/config'

export async function GET() {
  try {
    // Proxy to backend health endpoint
    const response = await fetch(`${config.apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      status: 'OK',
      backend: data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
