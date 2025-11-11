import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let globalClient: SupabaseClient | undefined

export function resetClient() {
  globalClient = undefined
}

/**
 * Creates a singleton Supabase client for browser/client-side use
 * Persists across hot reloads to prevent multiple instances
 */
export function createClient() {
  if (globalClient) {
    return globalClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase configuration is missing. Please check your environment variables.")
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch (error) {
    throw new Error("Invalid Supabase URL configuration")
  }

  globalClient = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      detectSessionInUrl: true,
      persistSession: true,
      storageKey: "sb-auth-token",
      flowType: "pkce", // Explicitly set PKCE flow for OAuth
    },
    cookies: {
      // Ensure cookies work across subdomains in preview environments
      get(name: string) {
        const cookies = document.cookie.split("; ")
        const cookie = cookies.find((c) => c.startsWith(`${name}=`))
        return cookie?.split("=")[1] || null
      },
      set(name: string, value: string, options: any) {
        document.cookie = `${name}=${value}; path=${options.path || "/"}; max-age=${options.maxAge || 31536000}; ${
          options.sameSite ? `SameSite=${options.sameSite}` : "SameSite=Lax"
        }; ${window.location.protocol === "https:" ? "Secure" : ""}`
      },
      remove(name: string, options: any) {
        document.cookie = `${name}=; path=${options.path || "/"}; max-age=0`
      },
    },
    global: {
      headers: {
        "X-Client-Info": "supabase-js-web",
      },
    },
    // Suppress the multiple instances warning in development
    isSingleton: true,
  })

  return globalClient
}

export { createClient as createBrowserClient }
