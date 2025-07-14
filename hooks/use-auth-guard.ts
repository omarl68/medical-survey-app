"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function useAuthGuard(requireAuth = true) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    // 1. Not logged in: always redirect to login (except register)
    if (!user && pathname !== "/auth/login" && pathname !== "/auth/register") {
      router.replace("/auth/login")
      return
    }

    // 2. Logged in and on any /auth/* page: redirect to posts (unless female needs survey)
    if (user && pathname.startsWith("/auth")) {
      if (profile && profile.gender === "female" && !profile.form_completed) {
        router.replace("/survey")
      } else {
        router.replace("/posts")
      }
      return
    }

    // 3. Female, first signup, not completed survey: always redirect to survey (unless already there)
    if (user && profile && profile.gender === "female" && !profile.form_completed && pathname !== "/survey") {
      router.replace("/survey")
      return
    }

    // 4. If on /survey but not female or already completed, redirect to posts
    if (user && profile && (profile.gender !== "female" || profile.form_completed) && pathname === "/survey") {
      router.replace("/posts")
      return
    }
  }, [user, profile, loading, router, pathname, requireAuth])

  return { user, profile, loading }
}

