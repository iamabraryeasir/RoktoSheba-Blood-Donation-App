import { supabase } from "@/lib/supabase/client";
import { Profile, ProfileUpdate } from "@/types/database.types";

export interface UserStats {
  totalRequests: number;
  activeRequests: number;
  totalDonations: number;
}

export const profileService = {
  async fetchUserStats(userId: string): Promise<UserStats> {
    try {
      // 1. Fetch total requests created by user
      const { count: requestsCount, error: reqError } = await supabase
        .from("blood_requests")
        .select("*", { count: "exact", head: true })
        .eq("created_by", userId);

      if (reqError) throw reqError;

      // 2. Fetch active requests created by user
      const { count: activeRequestsCount, error: activeReqError } =
        await supabase
          .from("blood_requests")
          .select("*", { count: "exact", head: true })
          .eq("created_by", userId)
          .eq("status", "active");

      if (activeReqError) throw activeReqError;

      // 3. Fetch total fulfilled donation responses by donor
      const { count: donationsCount, error: donError } = await supabase
        .from("donation_responses")
        .select("*", { count: "exact", head: true })
        .eq("donor_id", userId)
        .eq("status", "accepted");

      if (donError) throw donError;

      return {
        totalRequests: requestsCount || 0,
        activeRequests: activeRequestsCount || 0,
        totalDonations: donationsCount || 0,
      };
    } catch (err) {
      console.warn("Failed to fetch user stats:", err);
      return { totalRequests: 0, activeRequests: 0, totalDonations: 0 };
    }
  },

  async uploadAvatar(userId: string, imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const fileExt = imageUri.split(".").pop() || "jpg";
      const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;
      const contentType = `image/${fileExt === "png" ? "png" : "jpeg"}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, arrayBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update user's avatar_url in public.profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      return publicUrl;
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      throw new Error(err?.message || "Failed to upload avatar photo");
    }
  },

  async updateLastDonationDate(
    userId: string,
    dateIso: string,
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update({ last_donation_date: dateIso })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async updateProfile(
    userId: string,
    updates: ProfileUpdate,
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates as any)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },
};
