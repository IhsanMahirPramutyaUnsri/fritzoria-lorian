"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

type AdminAuthContextType = {
  user: any
  isLoading: boolean
}

export const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isLoading: true,
})

export const useAdminAuth = () => useContext(AdminAuthContext)

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAuth = async () => {
      const supabase = createClientSupabaseClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/admin/login")
        return
      }

      // Check if user has admin role
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

      if (profile?.role !== "admin") {
        await supabase.auth.signOut()
        router.push("/admin/login?error=access_denied")
        return
      }

      setUser(session.user)
      setIsLoading(false)
    }

    checkAdminAuth()

    const supabase = createClientSupabaseClient()
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/admin/login")
      } else if (session) {
        // Check if user has admin role
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

        if (profile?.role !== "admin") {
          await supabase.auth.signOut()
          router.push("/admin/login?error=access_denied")
          return
        }

        setUser(session.user)
      }
      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <AdminAuthContext.Provider value={{ user, isLoading }}>{children}</AdminAuthContext.Provider>
}
