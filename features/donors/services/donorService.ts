import { supabase } from "@/lib/supabase/client";
import { BloodGroupType, Profile } from "@/types";

export interface DonorFilters {
  bloodGroup?: BloodGroupType | "All";
  division?: string;
  district?: string;
  searchQuery?: string;
  currentUserId?: string;
}

export const donorService = {
  async getDonors(filters: DonorFilters = {}): Promise<Profile[]> {
    let query = supabase
      .from("profiles")
      .select("*")
      .eq("onboarding_completed", true)
      .eq("is_active", true)
      .eq("is_available_to_donate", true);

    // Exclude the currently logged-in user from search results
    if (filters.currentUserId) {
      query = query.neq("id", filters.currentUserId);
    }

    // Filter by Blood Group
    if (filters.bloodGroup && filters.bloodGroup !== "All") {
      query = query.eq("blood_group", filters.bloodGroup);
    }

    // Filter by Division
    if (filters.division && filters.division !== "All") {
      query = query.eq("division", filters.division);
    }

    // Filter by District
    if (filters.district && filters.district !== "All") {
      query = query.eq("district", filters.district);
    }

    // Search query (full_name or area)
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const term = `%${filters.searchQuery.trim()}%`;
      query = query.or(
        `full_name.ilike.${term},area.ilike.${term},district.ilike.${term}`,
      );
    }

    // Order donors: most recently active first
    query = query.order("updated_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching donors:", error);
      throw error;
    }

    const today = new Date();

    // Strictly ensure only 100% eligible donors are returned (Age >= 18 and Rest Period >= 90 days)
    const eligibleDonors = (data || []).filter((donor) => {
      // 1. Age Verification: Must be >= 18 years old
      if (donor.date_of_birth) {
        const dob = new Date(donor.date_of_birth);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
          age--;
        }
        if (age < 18) return false;
      }

      // 2. Rest Period Verification: Must have rested at least 90 days after last donation
      if (donor.last_donation_date) {
        const lastDate = new Date(donor.last_donation_date);
        const diffDays = Math.floor(
          (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays < 90) return false;
      }

      return true;
    });

    return eligibleDonors;
  },

  async getDonorById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching donor details:", error);
      throw error;
    }

    return data;
  },
};
