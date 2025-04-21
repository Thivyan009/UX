import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/" || path.startsWith("/_next")

  // Get the authentication cookie
  const userId = request.cookies.get("userId")?.value

  // Redirect authenticated users away from login page
  if (isPublicPath && userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users to login page
  if (!isPublicPath && !userId) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Match all paths except for static files, api routes, etc.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
