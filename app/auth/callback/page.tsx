"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        router.push("/auth/login");
        return;
      }
      if (data.session) {
        const user = data.session.user;
        // Try to fetch profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!profile) {
          // Create minimal profile for Google OAuth
          await supabase.from("user_profiles").insert({
            id: user.id,
            first_name: user.user_metadata?.full_name?.split(" ")[0] || "",
            last_name: user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
            role: "user",
            form_completed: false,
          });
          router.push("/complete-profile");
          return;
        }

        if (!profile.form_completed) {
          router.push("/complete-profile");
          return;
        }

        // If profile is complete, redirect based on gender
        if (profile.gender === "female") {
          router.push("/survey");
        } else {
          router.push("/posts");
        }
      } else {
        router.push("/auth/login");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Processing authentication...</div>
    </div>
  )
}
