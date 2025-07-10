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

    // Save current path for redirect after login
    if (requireAuth && !user && pathname !== "/auth/login" && pathname !== "/auth/register") {
      localStorage.setItem("redirect-after-login", pathname)
      router.push("/auth/login")
      return
    }

    // If user is logged in but on auth pages, redirect appropriately
    if (user && (pathname === "/auth/login" || pathname === "/auth/register")) {
      const redirectPath = localStorage.getItem("redirect-after-login")
      if (redirectPath) {
        localStorage.removeItem("redirect-after-login")
        router.push(redirectPath)
      } else if (!profile?.form_completed) {
        router.push("/survey")
      } else {
        router.push("/posts")
      }
      return
    }

    // If user hasn't completed form, redirect to survey (except if already on survey page)
    if (user && profile && !profile.form_completed && pathname !== "/survey") {
      router.push("/survey")
      return
    }
  }, [user, profile, loading, router, pathname, requireAuth])

  return { user, profile, loading }
}
