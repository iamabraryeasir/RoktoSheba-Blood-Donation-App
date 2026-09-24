import {
  AdminRequestFilters,
  AdminStats,
  AdminUserFilters,
  adminService,
  ModerationReport,
} from "../services/adminService";
import {
  BloodRequest,
  Profile,
  ReportStatus,
  RequestStatus,
  UserRole,
} from "@/types/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  users: (filters: AdminUserFilters) =>
    [...adminKeys.all, "users", filters] as const,
  requests: (filters: AdminRequestFilters) =>
    [...adminKeys.all, "requests", filters] as const,
  reports: (status?: ReportStatus | "all") =>
    [...adminKeys.all, "reports", status] as const,
};

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: adminKeys.stats(),
    queryFn: () => adminService.fetchAdminStats(),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useAdminUsers(filters: AdminUserFilters = {}) {
  return useQuery<Profile[]>({
    queryKey: adminKeys.users(filters),
    queryFn: () => adminService.fetchUsers(filters),
    staleTime: 1000 * 30,
  });
}

export function useAdminRequests(filters: AdminRequestFilters = {}) {
  return useQuery<BloodRequest[]>({
    queryKey: adminKeys.requests(filters),
    queryFn: () => adminService.fetchAdminRequests(filters),
    staleTime: 1000 * 30,
  });
}

export function useAdminReports(status?: ReportStatus | "all") {
  return useQuery<ModerationReport[]>({
    queryKey: adminKeys.reports(status),
    queryFn: () => adminService.fetchReports(status),
    staleTime: 1000 * 30,
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      isActive,
    }: {
      userId: string;
      isActive: boolean;
    }) => adminService.toggleUserActive(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useAdminUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      status,
    }: {
      requestId: string;
      status: RequestStatus;
    }) => adminService.updateRequestStatus(requestId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useAdminDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId }: { requestId: string }) =>
      adminService.deleteRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      status,
      adminId,
    }: {
      reportId: string;
      status: ReportStatus;
      adminId: string;
    }) => adminService.updateReportStatus(reportId, status, adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

