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
      fans: {
        Row: {
          id: string;
          username: string;
          email: string | null;
          total_spent: number;
          message_count: number;
          tip_count: number;
          subscription_status: "active" | "inactive" | "expired";
          joined_at: string;
          last_active_at: string;
          tags: string[] | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email?: string | null;
          total_spent?: number;
          message_count?: number;
          tip_count?: number;
          subscription_status?: "active" | "inactive" | "expired";
          joined_at?: string;
          last_active_at?: string;
          tags?: string[] | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string | null;
          total_spent?: number;
          message_count?: number;
          tip_count?: number;
          subscription_status?: "active" | "inactive" | "expired";
          joined_at?: string;
          last_active_at?: string;
          tags?: string[] | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chatters: {
        Row: {
          id: string;
          name: string;
          email: string;
          message_count: number;
          revenue: number;
          conversion_rate: number;
          status: "active" | "inactive" | "break";
          assigned_fans: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message_count?: number;
          revenue?: number;
          conversion_rate?: number;
          status?: "active" | "inactive" | "break";
          assigned_fans?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message_count?: number;
          revenue?: number;
          conversion_rate?: number;
          status?: "active" | "inactive" | "break";
          assigned_fans?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
