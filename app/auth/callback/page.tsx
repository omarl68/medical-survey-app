"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Auth callback error:", error)
        router.push("/auth/login")
        return
      }

      if (data.session) {
        // Check if user has completed their profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("form_completed")
          .eq("id", data.session.user.id)
          .single()

        if (profile?.form_completed) {
          router.push("/posts")
        } else {
          router.push("/survey")
        }
      } else {
        router.push("/auth/login")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Processing authentication...</div>
    </div>
  )
}
