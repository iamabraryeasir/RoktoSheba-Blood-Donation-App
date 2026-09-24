import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { UserStats } from "../services/profileService";

interface ProfileStatsGridProps {
  stats?: UserStats;
}

export const ProfileStatsGrid: React.FC<ProfileStatsGridProps> = ({
  stats,
}) => {
  const router = useRouter();

  return (
    <View className="flex-row gap-2.5 mb-5">
      {/* Active Requests Card */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => router.push("/(main)/requests/my-requests" as any)}
        className="flex-1 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-3.5 items-center shadow-sm"
      >
        <View className="w-9 h-9 rounded-full bg-critical items-center justify-center mb-1.5">
          <Feather name="activity" size={18} color="#FFFFFF" />
        </View>
        <Text className="font-inter-bold text-h2 text-critical">
          {stats?.activeRequests ?? 0}
        </Text>
        <Text
          className="font-inter text-[11px] text-text-secondary dark:text-text-dark-secondary text-center mt-0.5"
          numberOfLines={1}
        >
          Active Needs
        </Text>
      </TouchableOpacity>

      {/* Total Requests Card */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => router.push("/(main)/requests/my-requests" as any)}
        className="flex-1 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-3.5 items-center shadow-sm"
      >
        <View className="w-9 h-9 rounded-full bg-primary-surface dark:bg-primary-dark/30 items-center justify-center mb-1.5">
          <Feather name="file-text" size={18} color="#DC2626" />
        </View>
        <Text className="font-inter-bold text-h2 text-text-primary dark:text-text-dark-primary">
          {stats?.totalRequests ?? 0}
        </Text>
        <Text
          className="font-inter text-[11px] text-text-secondary dark:text-text-dark-secondary text-center mt-0.5"
          numberOfLines={1}
        >
          Total Requests
        </Text>
      </TouchableOpacity>

      {/* Total Donations Card */}
      <View className="flex-1 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-3.5 items-center shadow-sm">
        <View className="w-9 h-9 rounded-full bg-success-surface dark:bg-success/20 items-center justify-center mb-1.5">
          <Feather name="heart" size={18} color="#16A34A" />
        </View>
        <Text className="font-inter-bold text-h2 text-text-primary dark:text-text-dark-primary">
          {stats?.totalDonations ?? 0}
        </Text>
        <Text
          className="font-inter text-[11px] text-text-secondary dark:text-text-dark-secondary text-center mt-0.5"
          numberOfLines={1}
        >
          Donations
        </Text>
      </View>
    </View>
  );
};
