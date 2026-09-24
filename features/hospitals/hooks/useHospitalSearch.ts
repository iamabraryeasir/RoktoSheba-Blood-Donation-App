import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { hospitalApiService } from "../services/hospitalApiService";
import { HospitalPlace } from "../types/hospital.types";

export const hospitalKeys = {
  all: ["hospitals"] as const,
  search: (query: string, division?: string) =>
    [
      ...hospitalKeys.all,
      "search",
      query.trim().toLowerCase(),
      division || "all",
    ] as const,
  featured: (division?: string) =>
    [...hospitalKeys.all, "featured", division || "all"] as const,
};

export function useHospitalSearch(
  query: string,
  division?: string,
  debounceMs = 350,
) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceMs]);

  return useQuery<HospitalPlace[]>({
    queryKey: hospitalKeys.search(debouncedQuery, division),
    queryFn: () => hospitalApiService.searchHospitals(debouncedQuery, division),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    placeholderData: (previousData) => previousData,
  });
}

export function useFeaturedBloodBanks(division?: string) {
  return useQuery<HospitalPlace[]>({
    queryKey: hospitalKeys.featured(division),
    queryFn: () => hospitalApiService.getFeaturedBloodBanks(division),
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
}
