import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Lightweight JWT verify (duplicate of logic without importing prisma-dependent auth.ts)
const JWT_SECRET = process.env.JWT_SECRET || 'metito-tempur'
async function verifyTokenSimple(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as any
  } catch {
    return null
  }
}

// Paths that require admin authentication
const adminPaths = [
  '/admin',
  '/api/products',
  '/api/categories',
  '/api/blog',
  '/api/testimonials',
  '/api/services',
  '/api/certifications',
  '/api/gallery',
  '/api/newsletter'
  // '/api/customers'  // remove from strict admin list: GET should be public; mutations guarded in handlers
]

// Paths that require any authentication
const protectedPaths = [
  '/api/cart',
  '/customer'
]

// Admin API routes that need special protection
const adminApiRoutes = [
  '/api/products',
  '/api/categories',
  '/api/blog',
  '/api/testimonials',
  '/api/services',
  '/api/certifications',
  '/api/gallery',
  '/api/newsletter'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public assets and auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/documents') ||
    pathname.startsWith('/certificates') ||
    pathname.includes('.') ||
    pathname === '/admin' || // Let the admin page handle its own auth
    pathname === '/admin/login' // Let the login page handle its own auth
  ) {
    return NextResponse.next()
  }

  // Get token from cookie or authorization header
  const token = request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  // Check if path requires admin access
  const requiresAdmin = adminPaths.some(path => pathname.startsWith(path))
  const requiresAuth = protectedPaths.some(path => pathname.startsWith(path))

  // Special case: Allow GET requests to categories and products without authentication
  if ((pathname === '/api/categories' || pathname === '/api/products') && request.method === 'GET') {
    return NextResponse.next()
  }

  if (requiresAdmin || requiresAuth) {
    if (!token) {
      // Return 401 for API routes
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Authentication required',
            error: 'UNAUTHORIZED'
          },
          { status: 401 }
        )
      }

      // For admin pages, redirect to login
      if (pathname.startsWith('/admin') && pathname !== '/admin' && pathname !== '/admin/login') {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    // Verify token if it exists
    const payload = token ? await verifyTokenSimple(token) : null

    if (token && !payload) {
      // Return 401 for API routes with invalid token
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid or expired token',
            error: 'INVALID_TOKEN'
          },
          { status: 401 }
        )
      }

      // For admin pages with invalid token, redirect to login
      if (pathname.startsWith('/admin') && pathname !== '/admin' && pathname !== '/admin/login') {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    // Check admin role for admin routes (only if we have a valid token)
    if (requiresAdmin && payload && payload.role !== 'ADMIN') {
      // Redirect to unauthorized page for admin pages
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Return 403 for API routes
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Admin access required',
            error: 'FORBIDDEN'
          },
          { status: 403 }
        )
      }
    }

    // Add user info to headers for API routes
    if (pathname.startsWith('/api/') && payload) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId)
      requestHeaders.set('x-user-email', payload.email)
      requestHeaders.set('x-user-role', payload.role)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 
