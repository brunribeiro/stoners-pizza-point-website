import { NextResponse } from 'next/server';

/**
 * Middleware for adding security headers and performance optimizations
 * Runs on Vercel's Edge Network for better performance
 */
export function middleware() {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=(self)',
  );

  // Remove X-Powered-By header for security
  response.headers.delete('X-Powered-By');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (API routes handle their own headers)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt (static files)
     * - public files (fonts, icons, images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|font|icons|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)',
  ],
};
