export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "user" | "admin";
export type BloodGroupType =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O+"
  | "O-"
  | "AB+"
  | "AB-";
export type UrgencyLevel = "normal" | "urgent" | "critical";
export type RequestStatus = "active" | "fulfilled" | "cancelled" | "expired";
export type ResponseStatus = "pending" | "accepted" | "declined" | "cancelled";
export type ReportStatus = "pending" | "reviewed" | "dismissed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          phone: string | null;
          blood_group: BloodGroupType | null;
          date_of_birth: string | null;
          division: string | null;
          district: string | null;
          area: string | null;
          address_detail: string | null;
          avatar_url: string | null;
          is_available_to_donate: boolean;
          last_donation_date: string | null;
          onboarding_completed: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name?: string | null;
          phone?: string | null;
          blood_group?: BloodGroupType | null;
          date_of_birth?: string | null;
          division?: string | null;
          district?: string | null;
          area?: string | null;
          address_detail?: string | null;
          avatar_url?: string | null;
          is_available_to_donate?: boolean;
          last_donation_date?: string | null;
          onboarding_completed?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string | null;
          phone?: string | null;
          blood_group?: BloodGroupType | null;
          date_of_birth?: string | null;
          division?: string | null;
          district?: string | null;
          area?: string | null;
          address_detail?: string | null;
          avatar_url?: string | null;
          is_available_to_donate?: boolean;
          last_donation_date?: string | null;
          onboarding_completed?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blood_requests: {
        Row: {
          id: string;
          created_by: string;
          patient_name: string;
          blood_group: BloodGroupType;
          hospital_name: string;
          division: string;
          district: string;
          area: string;
          needed_date_time: string;
          urgency: UrgencyLevel;
          contact_number: string;
          document_image_url: string | null;
          latitude: number | null;
          longitude: number | null;
          status: RequestStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          patient_name: string;
          blood_group: BloodGroupType;
          hospital_name: string;
          division: string;
          district: string;
          area: string;
          needed_date_time: string;
          urgency?: UrgencyLevel;
          contact_number: string;
          document_image_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          status?: RequestStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_by?: string;
          patient_name?: string;
          blood_group?: BloodGroupType;
          hospital_name?: string;
          division?: string;
          district?: string;
          area?: string;
          needed_date_time?: string;
          urgency?: UrgencyLevel;
          contact_number?: string;
          document_image_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          status?: RequestStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      donation_responses: {
        Row: {
          id: string;
          request_id: string;
          donor_id: string;
          message: string | null;
          status: ResponseStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          donor_id: string;
          message?: string | null;
          status?: ResponseStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          donor_id?: string;
          message?: string | null;
          status?: ResponseStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      donation_feedback: {
        Row: {
          id: string;
          response_id: string;
          author_id: string;
          recipient_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          response_id: string;
          author_id: string;
          recipient_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          response_id?: string;
          author_id?: string;
          recipient_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          type: string;
          entity_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          type: string;
          entity_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string;
          type?: string;
          entity_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          target_type: "user" | "request";
          target_id: string;
          reason: string;
          status: ReportStatus;
          reviewed_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          target_type: "user" | "request";
          target_id: string;
          reason: string;
          status?: ReportStatus;
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          target_type?: "user" | "request";
          target_id?: string;
          reason?: string;
          status?: ReportStatus;
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      blood_group_type: BloodGroupType;
      urgency_level: UrgencyLevel;
      request_status: RequestStatus;
      response_status: ResponseStatus;
      report_status: ReportStatus;
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type BloodRequest =
  Database["public"]["Tables"]["blood_requests"]["Row"];
export type DonationResponse =
  Database["public"]["Tables"]["donation_responses"]["Row"];
export type DonationFeedback =
  Database["public"]["Tables"]["donation_feedback"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type Report = Database["public"]["Tables"]["reports"]["Row"];
