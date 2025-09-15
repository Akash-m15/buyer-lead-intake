import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'


const RATE_LIMIT = 15; 
const TIME_WINDOW = 60 * 1000; 
const ipMap = new Map<string, number[]>();


export async function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const now = Date.now();

  // Get existing timestamps or init new
  const timestamps = ipMap.get(ip) || [];

  // Filter out timestamps outside of the window
  const recent = timestamps.filter(ts => now - ts < TIME_WINDOW);

  if (recent.length >= RATE_LIMIT) {
    return NextResponse.json(
      { error: "Too many requests, slow down!" },
      { status: 429 }
    );
  }
  recent.push(now);
  ipMap.set(ip, recent);

  // return NextResponse.next();
  
  return await updateSession(request)
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