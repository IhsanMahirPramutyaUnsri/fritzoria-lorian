import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session and requesting admin route (except login page)
  if (!session && req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/admin/login")) {
    const loginUrl = new URL("/admin/login", req.url)
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If session exists, verify admin role for admin routes
  if (session && req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/admin/login")) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    // If not admin, redirect to login
    if (profile?.role !== "admin") {
      const loginUrl = new URL("/admin/login", req.url)
      loginUrl.searchParams.set("error", "access_denied")
      return NextResponse.redirect(loginUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}
