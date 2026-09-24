import { supabase } from "@/lib/supabase/client";
import {
  BloodRequest,
  Profile,
  ReportStatus,
  RequestStatus,
  UserRole,
} from "@/types/database.types";

export interface AdminStats {
  totalUsers: number;
  activeRequests: number;
  totalDonations: number;
  pendingReports: number;
  bannedUsers: number;
  totalRequests: number;
}

export interface AdminUserFilters {
  search?: string;
  role?: UserRole | "all";
  isActive?: boolean | "all";
}

export interface AdminRequestFilters {
  search?: string;
  status?: RequestStatus | "all";
}

export interface ModerationReport {
  id: string;
  reporter_id: string;
  target_type: "user" | "request";
  target_id: string;
  reason: string;
  status: ReportStatus;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
  reporter_name?: string | null;
  reporter_phone?: string | null;
}

export const adminService = {
  async fetchAdminStats(): Promise<AdminStats> {
    try {
      const [
        totalUsersRes,
        activeRequestsRes,
        totalDonationsRes,
        pendingReportsRes,
        bannedUsersRes,
        totalRequestsRes,
      ] = await Promise.allSettled([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("blood_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("donation_responses")
          .select("*", { count: "exact", head: true })
          .eq("status", "accepted"),
        supabase
          .from("reports")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("is_active", false),
        supabase
          .from("blood_requests")
          .select("*", { count: "exact", head: true }),
      ]);

      const getCount = (res: PromiseSettledResult<{ count: number | null }>) =>
        res.status === "fulfilled" ? res.value.count || 0 : 0;

      return {
        totalUsers: getCount(totalUsersRes),
        activeRequests: getCount(activeRequestsRes),
        totalDonations: getCount(totalDonationsRes),
        pendingReports: getCount(pendingReportsRes),
        bannedUsers: getCount(bannedUsersRes),
        totalRequests: getCount(totalRequestsRes),
      };
    } catch (err) {
      console.error("Error fetching admin stats:", err);
      return {
        totalUsers: 0,
        activeRequests: 0,
        totalDonations: 0,
        pendingReports: 0,
        bannedUsers: 0,
        totalRequests: 0,
      };
    }
  },

  async fetchUsers(filters: AdminUserFilters = {}): Promise<Profile[]> {
    let query = supabase.from("profiles").select("*");

    if (filters.role && filters.role !== "all") {
      query = query.eq("role", filters.role);
    }

    if (filters.isActive !== undefined && filters.isActive !== "all") {
      query = query.eq("is_active", filters.isActive);
    }

    if (filters.search && filters.search.trim()) {
      const term = filters.search.trim();
      query = query.or(
        `full_name.ilike.%${term}%,phone.ilike.%${term}%,district.ilike.%${term}%,division.ilike.%${term}%`,
      );
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching admin users:", error);
      throw error;
    }
    return data || [];
  },

  async toggleUserActive(userId: string, isActive: boolean): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error toggling user active state:", error);
      throw error;
    }
    return data as Profile;
  },

  async updateUserRole(userId: string, role: UserRole): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
    return data as Profile;
  },

  async fetchAdminRequests(
    filters: AdminRequestFilters = {},
  ): Promise<BloodRequest[]> {
    let query = supabase.from("blood_requests").select("*");

    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters.search && filters.search.trim()) {
      const term = filters.search.trim();
      query = query.or(
        `patient_name.ilike.%${term}%,hospital_name.ilike.%${term}%,district.ilike.%${term}%,area.ilike.%${term}%,contact_number.ilike.%${term}%`,
      );
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching admin requests:", error);
      throw error;
    }
    return data || [];
  },

  async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
  ): Promise<BloodRequest> {
    const { data, error } = await supabase
      .from("blood_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", requestId)
      .select()
      .single();

    if (error) {
      console.error("Error updating request status by admin:", error);
      throw error;
    }
    return data as BloodRequest;
  },

  async deleteRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from("blood_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      console.error("Error deleting request by admin:", error);
      throw error;
    }
  },

  async fetchReports(
    status?: ReportStatus | "all",
  ): Promise<ModerationReport[]> {
    try {
      let query = supabase.from("reports").select("*");

      if (status && status !== "all") {
        query = query.eq("status", status);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.warn(
          "Could not fetch reports (table may not exist yet):",
          error.message,
        );
        return [];
      }

      if (!data || data.length === 0) return [];

      // Fetch reporter names
      const reporterIds = [...new Set(data.map((r) => r.reporter_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .in("id", reporterIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      return data.map((report) => ({
        ...report,
        reporter_name:
          profileMap.get(report.reporter_id)?.full_name || "Unknown",
        reporter_phone: profileMap.get(report.reporter_id)?.phone || null,
      }));
    } catch (err) {
      console.warn("Error in fetchReports:", err);
      return [];
    }
  },

  async submitReport(input: {
    reporterId: string;
    targetType: "user" | "request";
    targetId: string;
    reason: string;
  }): Promise<void> {
    const { error } = await supabase.from("reports").insert({
      reporter_id: input.reporterId,
      target_type: input.targetType,
      target_id: input.targetId,
      reason: input.reason.trim(),
      status: "pending",
    });

    if (error) {
      console.error("Error submitting report:", error);
      throw error;
    }
  },

  async updateReportStatus(
    reportId: string,
    status: ReportStatus,
    adminId: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("reports")
      .update({
        status,
        reviewed_by: adminId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    if (error) {
      console.error("Error updating report status:", error);
      throw error;
    }
  },
};
