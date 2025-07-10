import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ouadrojjkpgipjdykwdd.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "your-supabase-url"
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Is Supabase actually configured?
export const isSupabaseConfigured =
  supabaseUrl !== "https://placeholder.supabase.co" && supabaseAnonKey !== "public-anon-key"

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      medical_surveys: {
        Row: {
          asked_to_stop: boolean | null
          created_at: string | null
          felt_respected: boolean | null
          gave_consent: boolean | null
          id: string | null
          knew_why_cynto: boolean | null
          more_pain_than_expected: boolean | null
          problems_after_delivery: boolean | null
          told_about_cynto: boolean | null
          too_much_cynto_used: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          asked_to_stop?: boolean | null
          created_at?: string | null
          felt_respected?: boolean | null
          gave_consent?: boolean | null
          id?: string | null
          knew_why_cynto?: boolean | null
          more_pain_than_expected?: boolean | null
          problems_after_delivery?: boolean | null
          told_about_cynto?: boolean | null
          too_much_cynto_used?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          asked_to_stop?: boolean | null
          created_at?: string | null
          felt_respected?: boolean | null
          gave_consent?: boolean | null
          id?: string | null
          knew_why_cynto?: boolean | null
          more_pain_than_expected?: boolean | null
          problems_after_delivery?: boolean | null
          told_about_cynto?: boolean | null
          too_much_cynto_used?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_surveys_user_id_fkey"
            columns: ["user_id"]
            referencedTo: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          is_anonymous: boolean | null
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            referencedTo: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            referencedTo: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string | null
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            referencedTo: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            referencedTo: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string | null
          id: string | null
          image_url: string | null
          is_anonymous: boolean | null
          likes_count: number | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comments_count?: number | null
          content: string | null
          created_at?: string | null
          id?: string | null
          image_url?: string | null
          is_anonymous?: boolean | null
          likes_count?: number | null
          title: string | null
          updated_at?: string | null
          user_id: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          image_url?: string | null
          is_anonymous?: boolean | null
          likes_count?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            referencedTo: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          age: number | null
          birth_place: Database["public"]["Enums"]["birth_place"] | null
          created_at: string | null
          delivery_type: Database["public"]["Enums"]["delivery_type"] | null
          first_name: string | null
          form_completed: boolean | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_first_pregnancy: boolean | null
          last_name: string | null
          living_children_count: number | null
          origin_city: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          birth_place?: Database["public"]["Enums"]["birth_place"] | null
          created_at?: string | null
          delivery_type?: Database["public"]["Enums"]["delivery_type"] | null
          first_name: string | null
          form_completed?: boolean | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_first_pregnancy?: boolean | null
          last_name: string | null
          living_children_count?: number | null
          origin_city?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          birth_place?: Database["public"]["Enums"]["birth_place"] | null
          created_at?: string | null
          delivery_type?: Database["public"]["Enums"]["delivery_type"] | null
          first_name?: string | null
          form_completed?: boolean | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_first_pregnancy?: boolean | null
          last_name?: string | null
          living_children_count?: number | null
          origin_city?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedTo: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_likes: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      increment_likes: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      birth_place: "public_hospital" | "private_hospital" | "clinic" | "other"
      delivery_type: "natural" | "cesarean" | "both"
      gender_type: "male" | "female" | "other"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
