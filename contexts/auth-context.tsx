"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  gender: string | null;
  origin_city: string | null;
  role: string | null;
  form_completed: boolean | null;
  is_first_pregnancy: boolean | null;
  living_children_count: number | null;
  delivery_type: string | null;
  birth_place: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null // <-- Add this line
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: any }>
  createProfile: (data: Partial<UserProfile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // <-- Add this line

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn("Supabase not configured. Please add your environment variables.")
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error && error.code !== "PGRST116") {
        setError("There was a problem fetching your profile. Please verify your email or contact support.") // <-- Add this line
        console.error("Error fetching profile:", error)
      } else {
        setProfile(data)
        setError(null) // <-- Reset error if successful
      }
    } catch (error) {
      setError("There was a problem fetching your profile. Please verify your email or contact support.") // <-- Add this line
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error("Supabase not configured. Please add your environment variables.") }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    if (!isSupabaseConfigured) {
      return { error: new Error("Supabase not configured. Please add your environment variables.") }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (!error && data.user) {
      // Store user data temporarily for profile creation after email verification
      localStorage.setItem("pending-profile-data", JSON.stringify(userData))
    }

    return { error }
  }

  const createProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { error: new Error("No user logged in") }

    if (!isSupabaseConfigured) {
      return { error: new Error("Supabase not configured. Please add your environment variables.") }
    }

    console.log("Creating profile with data:", data)

    const profileData = {
      id: user.id,
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      age: data.age || null,
      gender: data.gender || null,
      origin_city: data.origin_city || null,
      role: "user" as const,
      form_completed: data.form_completed || false,
      is_first_pregnancy: data.is_first_pregnancy || null,
      living_children_count: data.living_children_count || 0,
      delivery_type: data.delivery_type || null,
      birth_place: data.birth_place || null,
    }

    const { data: result, error } = await supabase.from("user_profiles").insert(profileData).select().single()

    console.log("Profile creation result:", { result, error })

    if (!error && result) {
      setProfile(result)
    }

    return { error }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { error: new Error("No user logged in") }

    if (!isSupabaseConfigured) {
      return { error: new Error("Supabase not configured. Please add your environment variables.") }
    }

    console.log("Updating profile with data:", data)

    // If no profile exists, create one first
    if (!profile) {
      return await createProfile(data)
    }

    const { data: result, error } = await supabase
      .from("user_profiles")
      .update(data)
      .eq("id", user.id)
      .select()
      .single()

    console.log("Profile update result:", { result, error })

    if (!error && result) {
      setProfile(result)
    }

    return { error }
  }

  const signOut = async () => {
    // Clear any stored redirect path
    localStorage.removeItem("redirect-after-login")
    localStorage.removeItem("pending-profile-data")

    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }

    // Clear local state
    setUser(null)
    setProfile(null)
  }

  const value = {
    user,
    profile,
    loading,
    error, // <-- Add this line
    signIn,
    signUp,
    signOut,
    updateProfile,
    createProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
