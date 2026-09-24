import { BloodGroupBadge } from "@/components/ui/BloodGroupBadge";
import { UrgencyTag } from "@/components/ui/UrgencyTag";
import { showAppAlert, showAppConfirm } from "@/features/dialog/useDialogStore";
import {
  useAdminDeleteRequest,
  useAdminRequests,
  useAdminUpdateRequestStatus,
} from "@/features/admin/hooks/useAdmin";
import { BloodRequest, RequestStatus } from "@/types/database.types";
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

const STATUS_FILTERS: { label: string; value: RequestStatus | "all" }[] = [
  { label: "All Requests", value: "all" },
  { label: "Active", value: "active" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminRequestsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "all">(
    "all"
  );

  const {
    data: requests,
    isLoading,
    refetch,
    isRefetching,
  } = useAdminRequests({
    search: searchQuery,
    status: selectedStatus,
  });

  const updateStatusMutation = useAdminUpdateRequestStatus();
  const deleteRequestMutation = useAdminDeleteRequest();

  const handleStatusChange = (
    request: BloodRequest,
    newStatus: RequestStatus
  ) => {
    showAppConfirm(
      "Update Request Status",
      `Are you sure you want to mark this request for ${request.patient_name} as ${newStatus.toUpperCase()}?`,
      async () => {
        try {
          await updateStatusMutation.mutateAsync({
            requestId: request.id,
            status: newStatus,
          });
          showAppAlert(
            "Status Updated",
            `Request has been marked as ${newStatus}.`,
            "success"
          );
        } catch (err: any) {
          showAppAlert(
            "Error",
            err?.message || "Failed to update request status.",
            "error"
          );
        }
      },
      undefined,
      "Confirm Update",
      "Cancel",
      "info"
    );
  };

  const handleDeleteRequest = (request: BloodRequest) => {
    showAppConfirm(
      "Delete Blood Request",
      `Are you sure you want to permanently delete this request for ${request.patient_name}? This action cannot be undone.`,
      async () => {
        try {
          await deleteRequestMutation.mutateAsync({
            requestId: request.id,
          });
          showAppAlert(
            "Request Deleted",
            "The blood request has been permanently deleted from the database.",
            "success"
          );
        } catch (err: any) {
          showAppAlert(
            "Error",
            err?.message || "Failed to delete request.",
            "error"
          );
        }
      },
      undefined,
      "Permanently Delete",
      "Cancel",
      "error"
    );
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "active":
        return {
          bg: "bg-success-surface border-success",
          text: "text-success",
          label: "ACTIVE",
        };
      case "fulfilled":
        return {
          bg: "bg-primary-surface border-primary",
          text: "text-primary",
          label: "FULFILLED",
        };
      case "cancelled":
        return {
          bg: "bg-surface border-border",
          text: "text-text-secondary",
          label: "CANCELLED",
        };
      default:
        return {
          bg: "bg-surface border-border",
          text: "text-text-secondary",
          label: String(status).toUpperCase(),
        };
    }
  };

  const renderItem = ({ item }: { item: BloodRequest }) => {
    const statusBadge = getStatusBadge(item.status);
    let neededDate = item.needed_date_time;
    try {
      neededDate = new Date(item.needed_date_time).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {}

    return (
      <View className="bg-surface border border-border rounded-2xl p-4 shadow-sm mb-3">
        {/* Top Header: Urgency + Status */}
        <View className="flex-row items-center justify-between mb-3">
          <UrgencyTag urgency={item.urgency} size="sm" />
          <View
            className={`border px-2.5 py-0.5 rounded-full ${statusBadge.bg}`}
          >
            <Text className={`font-inter-bold text-[10px] ${statusBadge.text}`}>
              {statusBadge.label}
            </Text>
          </View>
        </View>

        {/* Patient & Blood Info */}
        <View className="flex-row items-center mb-3">
          <View className="mr-3.5">
            <BloodGroupBadge group={item.blood_group} size="md" />
          </View>
          <View className="flex-1">
            <Text
              className="font-inter-bold text-body-large text-text-primary mb-0.5"
              numberOfLines={1}
            >
              {item.patient_name}
            </Text>
            <Text
              className="font-inter-medium text-caption text-primary"
              numberOfLines={1}
            >
              {item.hospital_name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Feather name="map-pin" size={12} color="#6B7280" />
              <Text
                className="font-inter text-caption text-text-secondary ml-1"
                numberOfLines={1}
              >
                {item.area}, {item.district}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact & Date Details */}
        <View className="flex-row items-center justify-between py-2 border-t border-b border-border mb-3">
          <View className="flex-row items-center">
            <Feather name="phone" size={12} color="#DC2626" />
            <Text className="font-inter-semibold text-caption text-text-primary ml-1.5">
              {item.contact_number}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Feather name="clock" size={12} color="#6B7280" />
            <Text className="font-inter text-caption text-text-secondary ml-1">
              {neededDate}
            </Text>
          </View>
        </View>

        {/* Admin Moderation Actions */}
        <View className="flex-row gap-2">
          {item.status === "active" ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleStatusChange(item, "fulfilled")}
              className="flex-1 bg-success py-2 rounded-xl flex-row items-center justify-center"
            >
              <Feather name="check-circle" size={14} color="#FFFFFF" />
              <Text className="font-inter-semibold text-[12px] text-white ml-1.5">
                Mark Fulfilled
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleStatusChange(item, "active")}
              className="flex-1 bg-primary py-2 rounded-xl flex-row items-center justify-center"
            >
              <Feather name="rotate-ccw" size={14} color="#FFFFFF" />
              <Text className="font-inter-semibold text-[12px] text-white ml-1.5">
                Reopen
              </Text>
            </TouchableOpacity>
          )}

          {item.status !== "cancelled" ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleStatusChange(item, "cancelled")}
              className="bg-surface border border-border px-3 py-2 rounded-xl flex-row items-center justify-center"
            >
              <Feather name="slash" size={14} color="#6B7280" />
              <Text className="font-inter-medium text-[12px] text-text-secondary ml-1">
                Cancel
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleDeleteRequest(item)}
            className="bg-surface border border-critical px-3 py-2 rounded-xl flex-row items-center justify-center"
          >
            <Feather name="trash-2" size={14} color="#DC2626" />
          </TouchableOpacity>
        </View>
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
                Requests Control
              </Text>
              <Text
                className="font-inter text-caption text-text-secondary"
                numberOfLines={1}
              >
                Review, update, and moderate all blood requests
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-background border border-border rounded-xl px-3.5 h-11 mb-2.5 shadow-sm">
          <Feather name="search" size={16} color="#9CA3AF" />
          <TextInput
            placeholder="Search patient, hospital, district, or phone..."
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
          {STATUS_FILTERS.map((tab) => {
            const isSelected = selectedStatus === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                activeOpacity={0.7}
                onPress={() => setSelectedStatus(tab.value)}
                className={`px-3 py-1.5 rounded-full border ${
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

      {/* Requests List */}
      <FlatList
        data={requests || []}
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
          !isLoading && requests ? (
            <Text className="font-inter-semibold text-caption text-text-tertiary mb-3">
              Showing {requests.length}{" "}
              {requests.length === 1 ? "Request" : "Requests"}
            </Text>
          ) : null
        }
        renderItem={renderItem}
        ListEmptyComponent={
          isLoading ? (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator size="large" color="#DC2626" />
              <Text className="font-inter text-body text-text-secondary mt-3">
                Loading requests...
              </Text>
            </View>
          ) : (
            <View className="bg-surface border border-border rounded-3xl p-8 items-center justify-center mt-6">
              <View className="w-16 h-16 rounded-full bg-primary-surface items-center justify-center mb-3">
                <Feather name="droplet" size={28} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary mb-1 text-center">
                No Blood Requests Found
              </Text>
              <Text className="font-inter text-caption text-text-secondary text-center px-4 leading-relaxed">
                No requests match your current search or status filter.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

