export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "patient" | "therapist" | "clinic" | "admin";
          is_subscriber: boolean;
          subscription_tier: "free" | "beyond_plus" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "patient" | "therapist" | "clinic" | "admin";
          is_subscriber?: boolean;
          subscription_tier?: "free" | "beyond_plus" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "patient" | "therapist" | "clinic" | "admin";
          is_subscriber?: boolean;
          subscription_tier?: "free" | "beyond_plus" | null;
          updated_at?: string;
        };
      };
      therapists: {
        Row: {
          id: string;
          user_id: string;
          sanity_id: string | null;
          license_number: string | null;
          bank_account: string | null;
          is_approved: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sanity_id?: string | null;
          license_number?: string | null;
          bank_account?: string | null;
          is_approved?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          sanity_id?: string | null;
          license_number?: string | null;
          bank_account?: string | null;
          is_approved?: boolean;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          sanity_id: string;
          therapist_id: string;
          price: number;
          duration_minutes: number;
          service_type: "online" | "physical" | "both";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sanity_id: string;
          therapist_id: string;
          price: number;
          duration_minutes: number;
          service_type?: "online" | "physical" | "both";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          price?: number;
          duration_minutes?: number;
          service_type?: "online" | "physical" | "both";
          is_active?: boolean;
          updated_at?: string;
        };
      };
      availability: {
        Row: {
          id: string;
          therapist_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          therapist_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_active?: boolean;
        };
        Update: {
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          is_active?: boolean;
        };
      };
      blocked_slots: {
        Row: {
          id: string;
          therapist_id: string;
          start_time: string;
          end_time: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          therapist_id: string;
          start_time: string;
          end_time: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          start_time?: string;
          end_time?: string;
          reason?: string | null;
        };
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          therapist_id: string;
          service_id: string;
          start_time: string;
          end_time: string;
          status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
          meeting_url: string | null;
          notes: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          therapist_id: string;
          service_id: string;
          start_time: string;
          end_time: string;
          status?: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
          meeting_url?: string | null;
          notes?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          start_time?: string;
          end_time?: string;
          status?: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
          meeting_url?: string | null;
          notes?: string | null;
          cancellation_reason?: string | null;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          appointment_id: string;
          patient_id: string;
          therapist_id: string;
          amount: number;
          currency: string;
          stripe_payment_intent_id: string | null;
          status: "pending" | "paid" | "refunded" | "failed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          patient_id: string;
          therapist_id: string;
          amount: number;
          currency?: string;
          stripe_payment_intent_id?: string | null;
          status?: "pending" | "paid" | "refunded" | "failed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          stripe_payment_intent_id?: string | null;
          status?: "pending" | "paid" | "refunded" | "failed";
          updated_at?: string;
        };
      };
      partners: {
        Row: {
          id: string;
          sanity_id: string;
          discount_percentage: number;
          discount_code_prefix: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sanity_id: string;
          discount_percentage: number;
          discount_code_prefix: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          discount_percentage?: number;
          discount_code_prefix?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      redemptions: {
        Row: {
          id: string;
          user_id: string;
          partner_id: string;
          code: string;
          redeemed_at: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          partner_id: string;
          code: string;
          redeemed_at?: string | null;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          redeemed_at?: string | null;
        };
      };
      wellness_logs: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          answers: Json;
          category: string;
          logged_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score: number;
          answers: Json;
          category: string;
          logged_at?: string;
        };
        Update: {
          score?: number;
          answers?: Json;
          category?: string;
        };
      };
      patient_notes: {
        Row: {
          id: string;
          therapist_id: string;
          patient_id: string;
          appointment_id: string | null;
          content: string;
          is_private: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          therapist_id: string;
          patient_id: string;
          appointment_id?: string | null;
          content: string;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          is_private?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Helper types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Commonly used types
export type User = Tables<"users">;
export type Therapist = Tables<"therapists">;
export type Service = Tables<"services">;
export type Appointment = Tables<"appointments">;
export type Order = Tables<"orders">;
export type Partner = Tables<"partners">;
export type WellnessLog = Tables<"wellness_logs">;
