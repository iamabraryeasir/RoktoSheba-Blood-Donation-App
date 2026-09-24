import { BloodGroupBadge } from "@/components/ui/BloodGroupBadge";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { showAppAlert, showAppConfirm } from "@/features/dialog/useDialogStore";
import {
  useAdminUsers,
  useToggleUserActive,
  useUpdateUserRole,
} from "@/features/admin/hooks/useAdmin";
import { Profile, UserRole } from "@/types/database.types";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterTab = "all" | "admin" | "banned";

export default function AdminUsersScreen() {
  const router = useRouter();
  const { user: currentAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>("all");

  const {
    data: users,
    isLoading,
    refetch,
    isRefetching,
  } = useAdminUsers({
    search: searchQuery,
    role: selectedFilter === "admin" ? "admin" : "all",
    isActive: selectedFilter === "banned" ? false : "all",
  });

  const toggleActiveMutation = useToggleUserActive();
  const updateRoleMutation = useUpdateUserRole();

  const handleToggleBan = (targetUser: Profile) => {
    if (targetUser.id === currentAdmin?.id) {
      showAppAlert(
        "Action Restricted",
        "You cannot suspend or ban your own administrator account.",
        "warning"
      );
      return;
    }

    const willBan = targetUser.is_active;
    showAppConfirm(
      willBan ? "Suspend User Account" : "Reactivate User Account",
      willBan
        ? `Are you sure you want to suspend ${targetUser.full_name || "this user"}? They will be unable to log in or post requests.`
        : `Are you sure you want to reactivate ${targetUser.full_name || "this user"}?`,
      async () => {
        try {
          await toggleActiveMutation.mutateAsync({
            userId: targetUser.id,
            isActive: !willBan,
          });
          showAppAlert(
            "Account Updated",
            `${targetUser.full_name || "User"} has been ${willBan ? "suspended" : "reactivated"}.`,
            "success"
          );
        } catch (err: any) {
          showAppAlert(
            "Error",
            err?.message || "Failed to update account status.",
            "error"
          );
        }
      },
      undefined,
      willBan ? "Suspend Account" : "Reactivate",
      "Cancel",
      willBan ? "error" : "info"
    );
  };

  const handleRoleChange = (targetUser: Profile, newRole: UserRole) => {
    if (targetUser.id === currentAdmin?.id) {
      showAppAlert(
        "Action Restricted",
        "You cannot change your own administrator role.",
        "warning"
      );
      return;
    }

    showAppConfirm(
      newRole === "admin" ? "Elevate to Admin" : "Demote to User",
      `Are you sure you want to change ${targetUser.full_name || "this user"}'s role to ${newRole.toUpperCase()}?`,
      async () => {
        try {
          await updateRoleMutation.mutateAsync({
            userId: targetUser.id,
            role: newRole,
          });
          showAppAlert(
            "Role Updated",
            `${targetUser.full_name || "User"} is now an ${newRole.toUpperCase()}.`,
            "success"
          );
        } catch (err: any) {
          showAppAlert(
            "Error",
            err?.message || "Failed to update user role.",
            "error"
          );
        }
      },
      undefined,
      "Confirm Role Change",
      "Cancel",
      newRole === "admin" ? "warning" : "info"
    );
  };

  const renderItem = ({ item }: { item: Profile }) => {
    const isCurrentAdmin = item.id === currentAdmin?.id;

    return (
      <View className="bg-surface border border-border rounded-2xl p-4 shadow-sm mb-3">
        {/* Top Info Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1 pr-2">
            <View className="w-10 h-10 rounded-full bg-primary-surface items-center justify-center mr-3">
              <Text className="font-inter-bold text-body text-primary">
                {(item.full_name || "U")[0].toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5 flex-wrap">
                <Text
                  className="font-inter-bold text-body-large text-text-primary"
                  numberOfLines={1}
                >
                  {item.full_name || "Unnamed User"}
                </Text>
                {isCurrentAdmin ? (
                  <View className="bg-info-surface px-2 py-0.2 rounded-full">
                    <Text className="font-inter-bold text-[9px] text-info">
                      YOU
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text className="font-inter text-caption text-text-secondary mt-0.5">
                {item.phone || "No phone logged"}
              </Text>
            </View>
          </View>

          {item.blood_group ? (
            <BloodGroupBadge group={item.blood_group} size="sm" />
          ) : null}
        </View>

        {/* Location & Meta */}
        <View className="flex-row items-center justify-between py-2 border-t border-b border-border mb-3">
          <View className="flex-row items-center">
            <Feather name="map-pin" size={12} color="#6B7280" />
            <Text className="font-inter text-caption text-text-secondary ml-1">
              {item.area ? `${item.area}, ` : ""}{item.district || "Bangladesh"}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5">
            {/* Role Badge */}
            <View
              className={`px-2 py-0.5 rounded-full ${
                item.role === "admin"
                  ? "bg-critical"
                  : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`font-inter-bold text-[10px] ${
                  item.role === "admin" ? "text-white" : "text-text-secondary"
                }`}
              >
                {item.role.toUpperCase()}
              </Text>
            </View>

            {/* Active / Banned Badge */}
            <View
              className={`px-2 py-0.5 rounded-full ${
                item.is_active
                  ? "bg-success-surface border border-success"
                  : "bg-surface border border-critical"
              }`}
            >
              <Text
                className={`font-inter-bold text-[10px] ${
                  item.is_active ? "text-success" : "text-critical"
                }`}
              >
                {item.is_active ? "ACTIVE" : "SUSPENDED"}
              </Text>
            </View>
          </View>
        </View>

        {/* Admin Action Buttons */}
        {!isCurrentAdmin ? (
          <View className="flex-row gap-2">
            {/* Toggle Ban / Unban */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleToggleBan(item)}
              className={`flex-1 py-2 rounded-xl flex-row items-center justify-center ${
                item.is_active
                  ? "bg-surface border border-critical"
                  : "bg-success"
              }`}
            >
              <Feather
                name={item.is_active ? "slash" : "check-circle"}
                size={14}
                color={item.is_active ? "#DC2626" : "#FFFFFF"}
              />
              <Text
                className={`font-inter-semibold text-[12px] ml-1.5 ${
                  item.is_active ? "text-critical" : "text-white"
                }`}
              >
                {item.is_active ? "Suspend User" : "Reactivate"}
              </Text>
            </TouchableOpacity>

            {/* Toggle Role */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                handleRoleChange(
                  item,
                  item.role === "admin" ? "user" : "admin"
                )
              }
              className="bg-surface border border-border px-3.5 py-2 rounded-xl flex-row items-center justify-center"
            >
              <Feather
                name={item.role === "admin" ? "user-minus" : "shield"}
                size={14}
                color="#4B5563"
              />
              <Text className="font-inter-medium text-[12px] text-text-primary ml-1.5">
                {item.role === "admin" ? "Demote" : "Make Admin"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top Header */}
      <View className="px-5 pt-3 pb-3 border-b border-border bg-surface">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1 pr-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              className="p-2 -ml-2 mr-1"
            >
              <Feather name="arrow-left" size={24} color="#111827" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text
                className="font-inter-bold text-h2 text-text-primary"
                numberOfLines={1}
              >
                User Directory
              </Text>
              <Text
                className="font-inter text-caption text-text-secondary"
                numberOfLines={1}
              >
                Manage permissions and user account access
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-background border border-border rounded-xl px-3.5 h-11 mb-2.5 shadow-sm">
          <Feather name="search" size={16} color="#9CA3AF" />
          <TextInput
            placeholder="Search name, phone, district, or division..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 font-inter text-body text-text-primary ml-2 h-full"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Pills */}
        <View className="flex-row gap-2">
          {(
            [
              { label: "All Users", value: "all" },
              { label: "Admins", value: "admin" },
              { label: "Suspended", value: "banned" },
            ] as const
          ).map((tab) => {
            const isSelected = selectedFilter === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                activeOpacity={0.7}
                onPress={() => setSelectedFilter(tab.value)}
                className={`px-3.5 py-1.5 rounded-full border ${
                  isSelected
                    ? "bg-primary border-primary"
                    : "bg-background border-border"
                }`}
              >
                <Text
                  className={`font-inter-semibold text-[11px] ${
                    isSelected ? "text-white" : "text-text-secondary"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Users List */}
      <FlatList
        data={users || []}
        keyExtractor={(item) => item.id}
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
        ListHeaderComponent={
          !isLoading && users ? (
            <Text className="font-inter-semibold text-caption text-text-tertiary mb-3">
              Showing {users.length} {users.length === 1 ? "User" : "Users"}
            </Text>
          ) : null
        }
        renderItem={renderItem}
        ListEmptyComponent={
          isLoading ? (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator size="large" color="#DC2626" />
              <Text className="font-inter text-body text-text-secondary mt-3">
                Loading user directory...
              </Text>
            </View>
          ) : (
            <View className="bg-surface border border-border rounded-3xl p-8 items-center justify-center mt-6">
              <View className="w-16 h-16 rounded-full bg-primary-surface items-center justify-center mb-3">
                <Feather name="users" size={28} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary mb-1 text-center">
                No Users Found
              </Text>
              <Text className="font-inter text-caption text-text-secondary text-center px-4 leading-relaxed">
                No registered accounts match your current filter or search criteria.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

