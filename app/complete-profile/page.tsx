"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CompleteProfilePage() {
  const [gender, setGender] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (user) {
      await supabase.from("user_profiles").update({
        gender,
        form_completed: true,
      }).eq("id", user.id);
      if (gender === "female") {
        router.replace("/survey");
      } else {
        router.replace("/posts");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <h2>Complete Your Profile</h2>
      <label>
        Gender:
        <select value={gender} onChange={e => setGender(e.target.value)} required>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>
      <button type="submit">Complete Profile</button>
    </form>
  );
}