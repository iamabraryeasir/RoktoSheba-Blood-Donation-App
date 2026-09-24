import { useAdminStats } from "@/features/admin/hooks/useAdmin";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { data: stats, isLoading, refetch, isRefetching } = useAdminStats();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top Header */}
      <View className="px-5 pt-3 pb-3 border-b border-border bg-surface">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.replace("/(main)" as any)}
              className="p-2 -ml-2 mr-1"
            >
              <Feather name="arrow-left" size={24} color="#111827" />
            </TouchableOpacity>
            <View>
              <Text className="font-inter-bold text-h2 text-text-primary">
                Admin Control Panel
              </Text>
              <Text className="font-inter text-caption text-text-secondary">
                RoktoSheba System Management
              </Text>
            </View>
          </View>

          <View className="bg-critical px-2.5 py-1 rounded-full flex-row items-center">
            <Feather name="shield" size={12} color="#FFFFFF" />
            <Text className="font-inter-bold text-[10px] text-white ml-1">
              ADMIN
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#DC2626"]}
            tintColor="#DC2626"
          />
        }
      >
        {/* 1. Main Platform Metrics (4-Box Grid) */}
        <Text className="font-inter-bold text-h3 text-text-primary mb-3">
          Platform Overview
        </Text>

        {isLoading ? (
          <View className="bg-surface border border-border rounded-2xl p-8 items-center justify-center mb-6">
            <ActivityIndicator size="large" color="#DC2626" />
            <Text className="font-inter text-caption text-text-secondary mt-2">
              Loading platform statistics...
            </Text>
          </View>
        ) : (
          <View className="gap-3 mb-6">
            <View className="flex-row gap-3">
              {/* Total Users */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/admin/users" as any)}
                className="flex-1 bg-surface border border-border rounded-2xl p-4 shadow-sm"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="w-9 h-9 rounded-full bg-primary-surface items-center justify-center">
                    <Feather name="users" size={18} color="#DC2626" />
                  </View>
                  <Feather name="chevron-right" size={16} color="#9CA3AF" />
                </View>
                <Text className="font-inter-bold text-display text-text-primary">
                  {stats?.totalUsers ?? 0}
                </Text>
                <Text className="font-inter-medium text-caption text-text-secondary mt-0.5">
                  Total Users
                </Text>
              </TouchableOpacity>

              {/* Active Requests */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/admin/requests" as any)}
                className="flex-1 bg-surface border border-border rounded-2xl p-4 shadow-sm"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="w-9 h-9 rounded-full bg-critical items-center justify-center">
                    <Feather name="activity" size={18} color="#FFFFFF" />
                  </View>
                  <Feather name="chevron-right" size={16} color="#9CA3AF" />
                </View>
                <Text className="font-inter-bold text-display text-critical">
                  {stats?.activeRequests ?? 0}
                </Text>
                <Text className="font-inter-medium text-caption text-text-secondary mt-0.5">
                  Active Needs
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-3">
              {/* Fulfilled Donations */}
              <View className="flex-1 bg-surface border border-border rounded-2xl p-4 shadow-sm">
                <View className="w-9 h-9 rounded-full bg-success-surface items-center justify-center mb-2">
                  <Feather name="check-circle" size={18} color="#16A34A" />
                </View>
                <Text className="font-inter-bold text-display text-success">
                  {stats?.totalDonations ?? 0}
                </Text>
                <Text className="font-inter-medium text-caption text-text-secondary mt-0.5">
                  Fulfilled Donations
                </Text>
              </View>

              {/* Pending Reports */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/admin/reports" as any)}
                className={`flex-1 rounded-2xl p-4 shadow-sm border ${
                  (stats?.pendingReports ?? 0) > 0
                    ? "bg-warning-surface border-warning"
                    : "bg-surface border-border"
                }`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="w-9 h-9 rounded-full bg-warning-surface items-center justify-center">
                    <Feather name="flag" size={18} color="#D97706" />
                  </View>
                  <Feather name="chevron-right" size={16} color="#9CA3AF" />
                </View>
                <Text className="font-inter-bold text-display text-warning">
                  {stats?.pendingReports ?? 0}
                </Text>
                <Text className="font-inter-medium text-caption text-text-secondary mt-0.5">
                  Pending Reports
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 2. Management & Moderation Tools */}
        <Text className="font-inter-bold text-h3 text-text-primary mb-3">
          Management & Moderation
        </Text>

        <View className="bg-surface border border-border rounded-2xl overflow-hidden mb-6 shadow-sm">
          {/* Manage Users */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/admin/users" as any)}
            className="flex-row items-center justify-between p-4 border-b border-border"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-10 h-10 rounded-full bg-primary-surface items-center justify-center mr-3">
                <Feather name="users" size={20} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="font-inter-semibold text-body text-text-primary">
                  User Directory & Roles
                </Text>
                <Text className="font-inter text-caption text-text-secondary mt-0.5">
                  Search, review user accounts, ban/unban, elevate roles
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Manage Blood Requests */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/admin/requests" as any)}
            className="flex-row items-center justify-between p-4 border-b border-border"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-10 h-10 rounded-full bg-primary-surface items-center justify-center mr-3">
                <Feather name="droplet" size={20} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="font-inter-semibold text-body text-text-primary">
                  Blood Requests Control
                </Text>
                <Text className="font-inter text-caption text-text-secondary mt-0.5">
                  Moderate all requests, force status updates, remove spam
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Review Reports */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/admin/reports" as any)}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-10 h-10 rounded-full bg-warning-surface items-center justify-center mr-3">
                <Feather name="flag" size={20} color="#D97706" />
              </View>
              <View className="flex-1">
                <Text className="font-inter-semibold text-body text-text-primary">
                  Community Safety & Reports
                </Text>
                <Text className="font-inter text-caption text-text-secondary mt-0.5">
                  Investigate flagged users and suspicious blood requests
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Return Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.replace("/(main)" as any)}
          className="bg-surface border border-border py-3.5 rounded-xl items-center justify-center shadow-sm"
        >
          <Text className="font-inter-semibold text-body text-text-primary">
            Return to Main App
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
