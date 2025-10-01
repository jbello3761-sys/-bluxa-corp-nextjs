import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { config as appConfig } from './lib/config'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Only initialize Supabase if we have valid environment variables
  if (!appConfig.supabase.url || !appConfig.supabase.anonKey || 
      appConfig.supabase.url.length === 0 || appConfig.supabase.anonKey.length === 0) {
    return response
  }

  try {
    const supabase = createServerClient(
      appConfig.supabase.url,
      appConfig.supabase.anonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // IMPORTANT: You *must* return the response as-is. If you're creating a new
    // response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myResponse.cookies.setAll(response.cookies.getAll())
    // 3. Change the myResponse object instead of the response object

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
