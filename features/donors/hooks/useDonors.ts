import { useQuery } from "@tanstack/react-query";
import { DonorFilters, donorService } from "../services/donorService";

export const donorKeys = {
  all: ["donors"] as const,
  lists: () => [...donorKeys.all, "list"] as const,
  list: (filters: DonorFilters) => [...donorKeys.lists(), filters] as const,
  details: () => [...donorKeys.all, "detail"] as const,
  detail: (id: string) => [...donorKeys.details(), id] as const,
};

export function useDonors(filters: DonorFilters = {}) {
  return useQuery({
    queryKey: donorKeys.list(filters),
    queryFn: () => donorService.getDonors(filters),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useDonorDetail(id: string) {
  return useQuery({
    queryKey: donorKeys.detail(id),
    queryFn: () => donorService.getDonorById(id),
    enabled: !!id,
  });
}
