import { supabase } from "@/lib/supabase/client";
import { Profile, ProfileUpdate } from "@/types/database.types";

export const authService = {
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },

  async verifyOtp(
    email: string,
    token: string,
    type: "signup" | "recovery" | "email" = "signup",
  ) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });
    if (error) throw error;
    return data;
  },

  async resendOtp(email: string, type: "signup" | "email_change" = "signup") {
    const { data, error } = await supabase.auth.resend({
      type,
      email,
    });
    if (error) throw error;
    return data;
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  },

  async fetchProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      throw error;
    }
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
