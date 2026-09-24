import { useAuth } from "@/features/auth/hooks/useAuth";
import { authService } from "@/features/auth/services/authService";
import { showAppAlert, showAppConfirm } from "@/features/dialog/useDialogStore";
import {
  useDonationEligibility,
  useUserStats,
} from "@/features/profile/hooks/useProfile";
import { profileService } from "@/features/profile/services/profileService";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeSelectorModal } from "@/components/ui/ThemeSelectorModal";
import { DonationEligibilityBanner } from "@/features/profile/components/DonationEligibilityBanner";
import { DonorAvailabilityCard } from "@/features/profile/components/DonorAvailabilityCard";
import { LogDonationModal } from "@/features/profile/components/LogDonationModal";
import { ProfileHeroCard } from "@/features/profile/components/ProfileHeroCard";
import { ProfileStatsGrid } from "@/features/profile/components/ProfileStatsGrid";
import { useTheme } from "@/features/theme/useThemeStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, isAdmin, refreshProfile, signOut } = useAuth();
  const { themeMode, isDark } = useTheme();
  const { data: stats, refetch: refetchStats } = useUserStats(user?.id);
  const eligibility = useDonationEligibility(
    profile?.date_of_birth,
    profile?.last_donation_date,
  );

  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [isSavingDonation, setIsSavingDonation] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshProfile(), refetchStats()]);
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-deactivate donor availability in Supabase if user is currently ineligible
  useEffect(() => {
    if (
      user?.id &&
      !eligibility.isEligible &&
      profile?.is_available_to_donate
    ) {
      authService
        .updateProfile(user.id, { is_available_to_donate: false })
        .then(() => refreshProfile())
        .catch(() => {});
    }
  }, [
    user?.id,
    eligibility.isEligible,
    profile?.is_available_to_donate,
    refreshProfile,
  ]);

  const handleToggleAvailability = async (val: boolean) => {
    if (!user?.id) return;

    if (val && !eligibility.isEligible) {
      showAppAlert(
        "Ineligible to Donate",
        eligibility.reason ||
          "You are currently not eligible to be an active donor.",
        "warning",
      );
      return;
    }

    try {
      await authService.updateProfile(user.id, { is_available_to_donate: val });
      await refreshProfile();
    } catch (err: any) {
      showAppAlert(
        "Error",
        err?.message || "Failed to update donor availability",
        "error",
      );
    }
  };

  const handleSaveLastDonation = async (newDate: string) => {
    if (!user?.id) return;
    setIsSavingDonation(true);
    try {
      await profileService.updateLastDonationDate(user.id, newDate);

      // Check if newly logged donation date puts donor in 90-day rest period
      const today = new Date();
      const lastDate = new Date(newDate);
      const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays < 90 && profile?.is_available_to_donate) {
        await authService.updateProfile(user.id, {
          is_available_to_donate: false,
        });
      }

      await refreshProfile();
      setShowDonationModal(false);
      showAppAlert(
        "Donation Logged",
        diffDays < 90
          ? "Your last donation date has been updated. Donor availability has been set to inactive for your 90-day rest period."
          : "Your last donation date has been updated!",
        "success",
      );
    } catch (err: any) {
      showAppAlert(
        "Error",
        err?.message || "Failed to save donation date",
        "error",
      );
    } finally {
      setIsSavingDonation(false);
    }
  };

  const handleSignOut = () => {
    showAppConfirm(
      "Sign Out",
      "Are you sure you want to sign out of RoktoSheba?",
      signOut,
      undefined,
      "Sign Out",
      "Cancel",
      "warning",
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#DC2626"]}
            tintColor="#DC2626"
          />
        }
      >
        {/* Header Title */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="font-inter-bold text-h1 text-text-primary dark:text-text-dark-primary">
            My Profile
          </Text>
          {isAdmin ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/admin/dashboard" as any)}
              className="bg-critical px-3 py-1 rounded-full flex-row items-center"
            >
              <Feather name="shield" size={14} color="#FFFFFF" />
              <Text className="font-inter-semibold text-caption text-white ml-1">
                Admin Panel
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* User Hero Card */}
        <ProfileHeroCard profile={profile} email={user?.email} />

        {/* Donor Availability Switch */}
        <DonorAvailabilityCard
          isAvailable={profile?.is_available_to_donate ?? false}
          isEligible={eligibility.isEligible}
          reason={eligibility.reason}
          onToggle={handleToggleAvailability}
        />

        {/* Donation Eligibility Banner */}
        <DonationEligibilityBanner
          isEligible={eligibility.isEligible}
          reason={eligibility.reason}
          lastDonationDate={profile?.last_donation_date}
        />

        {/* 2-Column Stats Grid */}
        <ProfileStatsGrid stats={stats} />

        {/* Actions List */}
        <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl overflow-hidden mb-6">
          {/* Edit Profile */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(main)/profile/edit" as any)}
            className="flex-row items-center justify-between p-4 border-b border-border dark:border-border-dark"
          >
            <View className="flex-row items-center">
              <Feather
                name="edit-3"
                size={18}
                color={isDark ? "#94A3B8" : "#4B5563"}
              />
              <Text className="font-inter-semibold text-body text-text-primary dark:text-text-dark-primary ml-3">
                Edit Profile Information
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={18}
              color={isDark ? "#64748B" : "#9CA3AF"}
            />
          </TouchableOpacity>

          {/* Log Donation Date */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (!eligibility.isAgeEligible) {
                showAppAlert(
                  "Underage Donor Ineligible",
                  eligibility.reason ||
                    "Donors must be at least 18 years old to log blood donations.",
                  "warning",
                );
                return;
              }
              setShowDonationModal(true);
            }}
            className={`flex-row items-center justify-between p-4 border-b border-border dark:border-border-dark ${
              !eligibility.isAgeEligible ? "opacity-50" : ""
            }`}
          >
            <View className="flex-row items-center flex-1 pr-2">
              <Feather
                name="calendar"
                size={18}
                color={
                  !eligibility.isAgeEligible
                    ? isDark
                      ? "#64748B"
                      : "#9CA3AF"
                    : isDark
                      ? "#94A3B8"
                      : "#4B5563"
                }
              />
              <Text
                className={`font-inter-semibold text-body ml-3 ${
                  !eligibility.isAgeEligible
                    ? "text-text-tertiary dark:text-text-dark-tertiary"
                    : "text-text-primary dark:text-text-dark-primary"
                }`}
              >
                Log Last Donation Date
              </Text>
              {!eligibility.isAgeEligible ? (
                <View className="ml-2 bg-primary-surface dark:bg-primary-dark/30 border border-critical px-2 py-0.5 rounded-full">
                  <Text className="font-inter-semibold text-[10px] text-critical">
                    Disabled
                  </Text>
                </View>
              ) : null}
            </View>
            <Feather
              name="chevron-right"
              size={18}
              color={
                !eligibility.isAgeEligible
                  ? isDark
                    ? "#475569"
                    : "#D1D5DB"
                  : isDark
                    ? "#64748B"
                    : "#9CA3AF"
              }
            />
          </TouchableOpacity>

          {/* Appearance / Theme Selector */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowThemeModal(true)}
            className="flex-row items-center justify-between p-4 border-b border-border dark:border-border-dark"
          >
            <View className="flex-row items-center">
              <Feather
                name={isDark ? "moon" : "sun"}
                size={18}
                color="#DC2626"
              />
              <Text className="font-inter-semibold text-body text-text-primary dark:text-text-dark-primary ml-3">
                Appearance / Theme
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="bg-primary-surface dark:bg-primary-dark/20 px-2.5 py-1 rounded-full mr-2 border border-primary/20">
                <Text className="font-inter-bold text-[11px] text-primary uppercase">
                  {themeMode}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color={isDark ? "#64748B" : "#9CA3AF"}
              />
            </View>
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSignOut}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center">
              <Feather name="log-out" size={18} color="#DC2626" />
              <Text className="font-inter-semibold text-body text-critical ml-3">
                Sign Out
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Log Donation Date Modal */}
      <LogDonationModal
        visible={showDonationModal}
        initialDate={profile?.last_donation_date}
        onClose={() => setShowDonationModal(false)}
        onSave={handleSaveLastDonation}
        isLoading={isSavingDonation}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />
    </SafeAreaView>
  );
}
