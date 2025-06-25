import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/images',
  '/fonts',
];

// Admin paths that require admin role
const adminPaths = [
  '/admin',
  '/api/admin',
];

// Auth paths that should redirect to home if already authenticated
const authPaths = [
  '/login',
  '/register',
  '/forgot-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public paths
  if (isPathMatch(pathname, publicPaths)) {
    return NextResponse.next();
  }

  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;

  // Handle authentication
  if (!isAuthenticated) {
    // If not authenticated and trying to access protected route, redirect to login
    return redirectToLogin(request, pathname);
  }

  // Handle authenticated users trying to access auth pages
  if (isPathMatch(pathname, authPaths)) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Check admin access for admin routes
  if (isPathMatch(pathname, adminPaths) && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // CSP Header - adjust according to your needs
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  return response;
}

// Helper function to check if path matches any in the list
function isPathMatch(pathname: string, paths: string[]): boolean {
  return paths.some(path => 
    pathname === path || 
    pathname.startsWith(`${path}/`)
  );
}

// Helper function to redirect to login with callback URL
function redirectToLogin(request: NextRequest, pathname: string): NextResponse {
  const loginUrl = new URL('/login', request.url);
  
  // Only add callbackUrl if it's not the login page and not an API route
  if (!pathname.startsWith('/login') && !pathname.startsWith('/api/')) {
    loginUrl.searchParams.set('callbackUrl', pathname);
  }
  
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Match all paths except static files and API routes
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
