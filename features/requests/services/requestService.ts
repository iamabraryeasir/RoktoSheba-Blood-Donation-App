import { supabase } from "@/lib/supabase/client";
import {
  BloodGroupType,
  BloodRequest,
  RequestStatus,
  UrgencyLevel,
} from "@/types";

export interface RequestFilters {
  division?: string;
  district?: string;
  bloodGroup?: BloodGroupType;
  urgency?: UrgencyLevel;
  status?: RequestStatus;
  excludeUserId?: string;
}

export interface CreateRequestInput {
  patient_name: string;
  blood_group: BloodGroupType;
  hospital_name: string;
  division: string;
  district: string;
  area: string;
  needed_date_time: string;
  urgency: UrgencyLevel;
  contact_number: string;
  document_image_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export const requestService = {
  async getUrgentRequests(
    limit = 2,
    excludeUserId?: string,
  ): Promise<BloodRequest[]> {
    let query = supabase
      .from("blood_requests")
      .select("*")
      .eq("status", "active")
      .in("urgency", ["critical", "urgent"]);

    if (excludeUserId) {
      query = query.neq("created_by", excludeUserId);
    }

    query = query
      .order("urgency", { ascending: true }) // critical first
      .order("created_at", { ascending: false })
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching urgent requests:", error);
      throw error;
    }
    return data || [];
  },

  async getRecentRequests(limit = 10): Promise<BloodRequest[]> {
    const { data, error } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent requests:", error);
      throw error;
    }
    return data || [];
  },

  async getRequests(filters: RequestFilters = {}): Promise<BloodRequest[]> {
    let query = supabase.from("blood_requests").select("*");

    if (filters.status) {
      query = query.eq("status", filters.status);
    } else {
      query = query.eq("status", "active");
    }

    // Exclude the current user's own requests from public discovery feed
    if (filters.excludeUserId) {
      query = query.neq("created_by", filters.excludeUserId);
    }

    if (filters.division) {
      query = query.eq("division", filters.division);
    }
    if (filters.district) {
      query = query.eq("district", filters.district);
    }
    if (filters.bloodGroup) {
      query = query.eq("blood_group", filters.bloodGroup);
    }
    if (filters.urgency) {
      query = query.eq("urgency", filters.urgency);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error("Error querying blood requests:", error);
      throw error;
    }
    return data || [];
  },

  async getUserRequests(
    userId: string,
    status?: RequestStatus | "all",
  ): Promise<BloodRequest[]> {
    let query = supabase
      .from("blood_requests")
      .select("*")
      .eq("created_by", userId);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching user blood requests:", error);
      throw error;
    }
    return data || [];
  },

  async getRequestById(id: string): Promise<BloodRequest | null> {
    const { data, error } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching request by ID:", error);
      throw error;
    }
    return data;
  },

  async uploadRequestDocument(
    userId: string,
    imageUri: string,
  ): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `${userId}/doc-${Date.now()}.${fileExt}`;
      const contentType = `image/${fileExt === "png" ? "png" : "jpeg"}`;

      const { error: uploadError } = await supabase.storage
        .from("request-documents")
        .upload(filePath, arrayBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error("Document upload error:", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("request-documents")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error("Failed to upload request document:", err);
      throw err;
    }
  },

  async createRequest(
    userId: string,
    input: CreateRequestInput,
  ): Promise<BloodRequest> {
    const { data, error } = await supabase
      .from("blood_requests")
      .insert({
        created_by: userId,
        patient_name: input.patient_name,
        blood_group: input.blood_group,
        hospital_name: input.hospital_name,
        division: input.division,
        district: input.district,
        area: input.area,
        needed_date_time: input.needed_date_time,
        urgency: input.urgency,
        contact_number: input.contact_number,
        document_image_url: input.document_image_url || null,
        latitude: input.latitude || null,
        longitude: input.longitude || null,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating blood request:", error);
      throw error;
    }
    return data;
  },

  async updateRequest(
    id: string,
    input: Partial<CreateRequestInput>,
  ): Promise<BloodRequest> {
    const { data, error } = await supabase
      .from("blood_requests")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating blood request:", error);
      throw error;
    }
    return data;
  },

  async updateRequestStatus(id: string, status: RequestStatus): Promise<void> {
    const { error } = await supabase
      .from("blood_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  },

  async deleteRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from("blood_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting blood request:", error);
      throw error;
    }
  },
};
