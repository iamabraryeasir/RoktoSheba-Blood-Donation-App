import { RequestStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateRequestInput,
  RequestFilters,
  requestService,
} from "../services/requestService";

export const requestKeys = {
  all: ["requests"] as const,
  lists: () => [...requestKeys.all, "list"] as const,
  list: (filters: RequestFilters) => [...requestKeys.lists(), filters] as const,
  userRequests: (userId?: string) =>
    [...requestKeys.all, "user", userId] as const,
  urgent: (limit?: number, excludeUserId?: string) =>
    [...requestKeys.all, "urgent", limit, excludeUserId] as const,
  recent: (limit?: number) => [...requestKeys.all, "recent", limit] as const,
  details: () => [...requestKeys.all, "detail"] as const,
  detail: (id: string) => [...requestKeys.details(), id] as const,
};

export function useUrgentRequests(limit = 2, excludeUserId?: string) {
  return useQuery({
    queryKey: requestKeys.urgent(limit, excludeUserId),
    queryFn: () => requestService.getUrgentRequests(limit, excludeUserId),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useRecentRequests(limit = 10) {
  return useQuery({
    queryKey: requestKeys.recent(limit),
    queryFn: () => requestService.getRecentRequests(limit),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useRequests(filters: RequestFilters = {}) {
  return useQuery({
    queryKey: requestKeys.list(filters),
    queryFn: () => requestService.getRequests(filters),
    staleTime: 1000 * 60,
  });
}

export function useUserRequests(userId?: string) {
  return useQuery({
    queryKey: requestKeys.userRequests(userId),
    queryFn: () => (userId ? requestService.getUserRequests(userId) : []),
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useRequestDetail(id: string) {
  return useQuery({
    queryKey: requestKeys.detail(id),
    queryFn: () => requestService.getRequestById(id),
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      input,
    }: {
      userId: string;
      input: CreateRequestInput;
    }) => requestService.createRequest(userId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
    },
  });
}

export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<CreateRequestInput>;
    }) => requestService.updateRequest(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: requestKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RequestStatus }) =>
      requestService.updateRequestStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: requestKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
    },
  });
}

export function useDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => requestService.deleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
    },
  });
}
