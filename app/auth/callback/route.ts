import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/collections"

  console.log("[v0] 🔐 Auth callback received")
  console.log("[v0]   Code present:", !!code)
  console.log("[v0]   Next destination:", next)
  console.log("[v0]   Request URL:", requestUrl.toString())

  if (code) {
    const cookieStore = await cookies()

    console.log("[v0] 🍪 Available cookies:")
    cookieStore.getAll().forEach((cookie) => {
      console.log(`[v0]   - ${cookie.name}: ${cookie.value.substring(0, 20)}...`)
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                console.log(`[v0] 📝 Setting cookie: ${name}`)
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              console.error("[v0] ❌ Error setting cookies:", error)
            }
          },
        },
      },
    )

    console.log("[v0] 🔄 Exchanging code for session...")
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[v0] ❌ Error exchanging code:", error.message)
      console.error("[v0]   Error details:", error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    console.log("[v0] ✅ Successfully exchanged code for session")
    console.log("[v0]   User:", data.user?.email)
    console.log("[v0] 🎯 Redirecting to:", next)

    const redirectUrl = `${requestUrl.origin}${next}`
    return NextResponse.redirect(redirectUrl)
  }

  console.log("[v0] ⚠️  No code provided in callback")
  return NextResponse.redirect(`${requestUrl.origin}/login?error=No+code+provided`)
}
