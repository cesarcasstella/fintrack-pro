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
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone_number: string | null;
          whatsapp_enabled: boolean;
          whatsapp_verified: boolean;
          preferred_currency: string;
          preferred_locale: string;
          timezone: string;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          phone_number?: string | null;
          whatsapp_enabled?: boolean;
          whatsapp_verified?: boolean;
          preferred_currency?: string;
          preferred_locale?: string;
          timezone?: string;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          phone_number?: string | null;
          whatsapp_enabled?: boolean;
          whatsapp_verified?: boolean;
          preferred_currency?: string;
          preferred_locale?: string;
          timezone?: string;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: "checking" | "savings" | "credit" | "cash" | "investment";
          balance: number;
          currency: string;
          color: string;
          icon: string;
          is_active: boolean;
          include_in_total: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: "checking" | "savings" | "credit" | "cash" | "investment";
          balance?: number;
          currency?: string;
          color?: string;
          icon?: string;
          is_active?: boolean;
          include_in_total?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: "checking" | "savings" | "credit" | "cash" | "investment";
          balance?: number;
          currency?: string;
          color?: string;
          icon?: string;
          is_active?: boolean;
          include_in_total?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string;
          color: string;
          type: "expense" | "income";
          budget_amount: number | null;
          is_default: boolean;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          icon?: string;
          color?: string;
          type: "expense" | "income";
          budget_amount?: number | null;
          is_default?: boolean;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          icon?: string;
          color?: string;
          type?: "expense" | "income";
          budget_amount?: number | null;
          is_default?: boolean;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          category_id: string | null;
          type: "income" | "expense" | "transfer";
          amount: number;
          description: string | null;
          date: string;
          notes: string | null;
          tags: string[] | null;
          transfer_to_account_id: string | null;
          source: "manual" | "whatsapp" | "import" | "recurring" | "api";
          external_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          category_id?: string | null;
          type: "income" | "expense" | "transfer";
          amount: number;
          description?: string | null;
          date?: string;
          notes?: string | null;
          tags?: string[] | null;
          transfer_to_account_id?: string | null;
          source?: "manual" | "whatsapp" | "import" | "recurring" | "api";
          external_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          category_id?: string | null;
          type?: "income" | "expense" | "transfer";
          amount?: number;
          description?: string | null;
          date?: string;
          notes?: string | null;
          tags?: string[] | null;
          transfer_to_account_id?: string | null;
          source?: "manual" | "whatsapp" | "import" | "recurring" | "api";
          external_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recurring_rules: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          category_id: string | null;
          type: "income" | "expense";
          amount: number;
          description: string;
          frequency: "daily" | "weekly" | "biweekly" | "monthly" | "yearly";
          interval_count: number;
          day_of_month: number | null;
          day_of_week: number | null;
          start_date: string;
          end_date: string | null;
          next_occurrence: string;
          last_generated: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          category_id?: string | null;
          type: "income" | "expense";
          amount: number;
          description: string;
          frequency: "daily" | "weekly" | "biweekly" | "monthly" | "yearly";
          interval_count?: number;
          day_of_month?: number | null;
          day_of_week?: number | null;
          start_date: string;
          end_date?: string | null;
          next_occurrence: string;
          last_generated?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          category_id?: string | null;
          type?: "income" | "expense";
          amount?: number;
          description?: string;
          frequency?: "daily" | "weekly" | "biweekly" | "monthly" | "yearly";
          interval_count?: number;
          day_of_month?: number | null;
          day_of_week?: number | null;
          start_date?: string;
          end_date?: string | null;
          next_occurrence?: string;
          last_generated?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          name: string;
          amount: number;
          period: "weekly" | "monthly" | "yearly";
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          alert_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          name: string;
          amount: number;
          period: "weekly" | "monthly" | "yearly";
          start_date: string;
          end_date?: string | null;
          is_active?: boolean;
          alert_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          name?: string;
          amount?: number;
          period?: "weekly" | "monthly" | "yearly";
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          alert_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      projections_cache: {
        Row: {
          id: string;
          user_id: string;
          generated_at: string;
          expires_at: string;
          projection_data: Json;
          input_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          generated_at?: string;
          expires_at: string;
          projection_data: Json;
          input_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          generated_at?: string;
          expires_at?: string;
          projection_data?: Json;
          input_hash?: string;
          created_at?: string;
        };
      };
      whatsapp_messages: {
        Row: {
          id: string;
          user_id: string | null;
          direction: "inbound" | "outbound";
          phone_number: string;
          message_sid: string | null;
          message_body: string;
          parsed_intent: string | null;
          parsed_data: Json | null;
          confidence_score: number | null;
          status: "received" | "parsed" | "processed" | "failed" | "sent" | "delivered" | "read";
          error_message: string | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          direction: "inbound" | "outbound";
          phone_number: string;
          message_sid?: string | null;
          message_body: string;
          parsed_intent?: string | null;
          parsed_data?: Json | null;
          confidence_score?: number | null;
          status?: "received" | "parsed" | "processed" | "failed" | "sent" | "delivered" | "read";
          error_message?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          direction?: "inbound" | "outbound";
          phone_number?: string;
          message_sid?: string | null;
          message_body?: string;
          parsed_intent?: string | null;
          parsed_data?: Json | null;
          confidence_score?: number | null;
          status?: "received" | "parsed" | "processed" | "failed" | "sent" | "delivered" | "read";
          error_message?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          tenant_id: string | null;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string | null;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
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

// Convenience aliases
export type Profile = Tables<"profiles">;
export type Account = Tables<"accounts">;
export type Category = Tables<"categories">;
export type Transaction = Tables<"transactions">;
export type RecurringRule = Tables<"recurring_rules">;
export type Budget = Tables<"budgets">;
export type ProjectionCache = Tables<"projections_cache">;
export type WhatsAppMessage = Tables<"whatsapp_messages">;
export type AuditLog = Tables<"audit_log">;
