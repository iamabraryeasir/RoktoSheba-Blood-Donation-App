import { BloodGroupBadge } from "@/components/ui/BloodGroupBadge";
import { UrgencyTag } from "@/components/ui/UrgencyTag";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { showAppAlert, showAppConfirm } from "@/features/dialog/useDialogStore";
import {
  useUpdateRequestStatus,
  useUserRequests,
} from "@/features/requests/hooks/useRequests";
import { BloodRequest, RequestStatus } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyRequestsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: allRequests,
    isLoading,
    refetch,
    isRefetching,
  } = useUserRequests(user?.id);

  const updateStatusMutation = useUpdateRequestStatus();

  const handleStatusChange = (
    request: BloodRequest,
    newStatus: RequestStatus,
  ) => {
    let title = "Update Status";
    let message = `Are you sure you want to mark this request as ${newStatus}?`;

    if (newStatus === "fulfilled") {
      title = "Mark as Fulfilled";
      message = "Did you successfully connect with a donor for this request?";
    } else if (newStatus === "cancelled") {
      title = "Cancel Request";
      message = "Are you sure you want to cancel this emergency request?";
    } else if (newStatus === "active") {
      title = "Reopen Request";
      message = "This will reactivate your blood request for donor discovery.";
    }

    showAppConfirm(
      title,
      message,
      async () => {
        try {
          await updateStatusMutation.mutateAsync({
            id: request.id,
            status: newStatus,
          });
          showAppAlert(
            "Status Updated",
            `Your request for ${request.patient_name} is now marked as ${newStatus}.`,
            "success",
          );
        } catch (err: any) {
          showAppAlert(
            "Error",
            err?.message || "Failed to update request status.",
            "error",
          );
        }
      },
      undefined,
      "Confirm",
      "Cancel",
      newStatus === "cancelled" ? "error" : "info",
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
      case "expired":
        return {
          bg: "bg-surface border-border",
          text: "text-text-tertiary",
          label: "EXPIRED",
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
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push(`/(main)/requests/${item.id}` as any)}
        className="bg-surface border border-border rounded-2xl p-4 shadow-sm mb-3"
      >
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

        {/* Needed Date */}
        <View className="flex-row items-center mb-3 pt-2 border-t border-border">
          <Feather name="clock" size={12} color="#6B7280" />
          <Text className="font-inter text-caption text-text-secondary ml-1">
            Needed: {neededDate}
          </Text>
        </View>

        {/* Owner Quick Controls */}
        <View className="flex-row gap-2 pt-2 border-t border-border">
          {item.status === "active" ? (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleStatusChange(item, "fulfilled")}
                className="flex-1 bg-success py-2.5 rounded-xl flex-row items-center justify-center shadow-sm"
              >
                <Feather name="check-circle" size={14} color="#FFFFFF" />
                <Text className="font-inter-semibold text-[12px] text-white ml-1.5">
                  Fulfilled
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  router.push(`/(main)/requests/edit?id=${item.id}` as any)
                }
                className="bg-background border border-border px-3.5 py-2.5 rounded-xl flex-row items-center justify-center"
              >
                <Feather name="edit-2" size={14} color="#111827" />
                <Text className="font-inter-medium text-[12px] text-text-primary ml-1.5">
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleStatusChange(item, "cancelled")}
                className="bg-background border border-critical px-3.5 py-2.5 rounded-xl flex-row items-center justify-center"
              >
                <Feather name="slash" size={14} color="#DC2626" />
                <Text className="font-inter-medium text-[12px] text-critical ml-1.5">
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleStatusChange(item, "active")}
                className="flex-1 bg-primary py-2.5 rounded-xl flex-row items-center justify-center shadow-sm"
              >
                <Feather name="rotate-ccw" size={14} color="#FFFFFF" />
                <Text className="font-inter-semibold text-[12px] text-white ml-1.5">
                  Reopen as Active
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  router.push(`/(main)/requests/edit?id=${item.id}` as any)
                }
                className="bg-background border border-border px-3.5 py-2.5 rounded-xl flex-row items-center justify-center"
              >
                <Feather name="edit-2" size={14} color="#111827" />
                <Text className="font-inter-medium text-[12px] text-text-primary ml-1.5">
                  Edit
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-5 pt-3 pb-3 border-b border-border">
        <View className="flex-row items-center justify-between">
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
                My Blood Requests
              </Text>
              <Text
                className="font-inter text-caption text-text-secondary"
                numberOfLines={1}
              >
                Manage all your posted emergency requests
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(main)/requests/create")}
            className="bg-primary px-3.5 py-2 rounded-xl flex-row items-center shadow-sm shrink-0"
          >
            <Feather name="plus" size={15} color="#FFFFFF" />
            <Text className="font-inter-semibold text-caption text-white ml-1">
              New
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Requests List */}
      <FlatList
        data={allRequests || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 100,
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
          !isLoading && allRequests && allRequests.length > 0 ? (
            <Text className="font-inter-semibold text-caption text-text-tertiary mb-3">
              Showing {allRequests.length}{" "}
              {allRequests.length === 1 ? "Request" : "Requests"}
            </Text>
          ) : null
        }
        renderItem={renderItem}
        ListEmptyComponent={
          isLoading ? (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator size="large" color="#DC2626" />
              <Text className="font-inter text-body text-text-secondary mt-3">
                Loading your requests...
              </Text>
            </View>
          ) : (
            <View className="bg-surface border border-border rounded-3xl p-8 items-center justify-center mt-6 shadow-sm">
              <View className="w-16 h-16 rounded-full bg-primary-surface items-center justify-center mb-3">
                <Feather name="folder-plus" size={30} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary mb-1 text-center">
                No Requests Posted Yet
              </Text>
              <Text className="font-inter text-caption text-text-secondary text-center mb-6 px-4 leading-relaxed">
                When you post a blood request for a patient in need, it will
                appear here so you can easily manage its status.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(main)/requests/create")}
                className="bg-primary px-5 py-3 rounded-xl flex-row items-center shadow-sm"
              >
                <Feather name="plus" size={16} color="#FFFFFF" />
                <Text className="font-inter-semibold text-body text-white ml-2">
                  Create Blood Request
                </Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
