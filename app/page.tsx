"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import InfiniteScroll from "react-infinite-scroll-component";
import { format } from "date-fns";

export default function HomePage() {
  const { user, profile, loading, error } = useAuth() // <-- Add error here
  const router = useRouter()
  useEffect(() => {
    if (user && !profile) {
      // Only create if profile does not exist
      const pendingData = localStorage.getItem("pending-profile-data");
      if (pendingData) {
        const userData = JSON.parse(pendingData);
        // Assuming createProfile is defined elsewhere or will be added
        // For now, we'll just log the data and remove it
        console.log("Creating profile from pending data:", userData);
        localStorage.removeItem("pending-profile-data");
      }
    }
  }, [user, profile]);

  useEffect(() => {
    if (!loading && !error) { // <-- Only redirect if no error
      if (!user) {
        router.push("/auth/login")
      } else if (profile && !profile.form_completed && profile.gender === "female") {
        router.push("/survey")
      } else if (profile && profile.form_completed) {
        router.push("/posts")
      }
    }
  }, [user, profile, loading, error, router]) // <-- Add error to deps

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg text-center">
          {error}
          <br />
          Please check your email for a verification link.
        </div>
      </div>
    )
  }

  return null
}
