import { useAuth } from "@/features/auth/hooks/useAuth";
import { showAppAlert, showAppConfirm } from "@/features/dialog/useDialogStore";
import {
  ModerationReport,
} from "@/features/admin/services/adminService";
import {
  useAdminReports,
  useUpdateReportStatus,
} from "@/features/admin/hooks/useAdmin";
import { ReportStatus } from "@/types/database.types";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const REPORT_FILTERS: { label: string; value: ReportStatus | "all" }[] = [
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Dismissed", value: "dismissed" },
  { label: "All", value: "all" },
];

export default function AdminReportsScreen() {
  const router = useRouter();
  const { user: currentAdmin } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "all">(
    "pending"
  );

  const {
    data: reports,
    isLoading,
    refetch,
    isRefetching,
  } = useAdminReports(selectedStatus);

  const updateStatusMutation = useUpdateReportStatus();

  const handleUpdateStatus = (
    report: ModerationReport,
    newStatus: ReportStatus
  ) => {
    if (!currentAdmin?.id) return;

    showAppConfirm(
      newStatus === "reviewed" ? "Mark Report as Reviewed" : "Dismiss Report",
      `Are you sure you want to mark this report as ${newStatus}?`,
      async () => {
        try {
          await updateStatusMutation.mutateAsync({
            reportId: report.id,
            status: newStatus,
            adminId: currentAdmin.id,
          });
          showAppAlert(
            "Report Updated",
            `The report has been marked as ${newStatus}.`,
            "success"
          );
        } catch (err: any) {
          showAppAlert(
            "Error",
            err?.message || "Failed to update report status.",
            "error"
          );
        }
      },
      undefined,
      "Confirm",
      "Cancel",
      "info"
    );
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-warning-surface border-warning",
          text: "text-warning",
          label: "PENDING",
        };
      case "reviewed":
        return {
          bg: "bg-success-surface border-success",
          text: "text-success",
          label: "REVIEWED",
        };
      case "dismissed":
        return {
          bg: "bg-surface border-border",
          text: "text-text-tertiary",
          label: "DISMISSED",
        };
      default:
        return {
          bg: "bg-surface border-border",
          text: "text-text-secondary",
          label: String(status).toUpperCase(),
        };
    }
  };

  const renderItem = ({ item }: { item: ModerationReport }) => {
    const statusBadge = getStatusBadge(item.status);
    let formattedDate = item.created_at;
    try {
      formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {}

    return (
      <View className="bg-surface border border-border rounded-2xl p-4 shadow-sm mb-3">
        {/* Header: Target Type + Status */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-warning-surface items-center justify-center mr-2">
              <Feather
                name={item.target_type === "user" ? "user" : "droplet"}
                size={16}
                color="#D97706"
              />
            </View>
            <View>
              <Text className="font-inter-bold text-caption text-text-primary uppercase tracking-wide">
                Flagged {item.target_type}
              </Text>
              <Text
                className="font-inter text-[11px] text-text-tertiary"
                numberOfLines={1}
              >
                ID: {item.target_id.slice(0, 12)}...
              </Text>
            </View>
          </View>

          <View
            className={`border px-2.5 py-0.5 rounded-full ${statusBadge.bg}`}
          >
            <Text className={`font-inter-bold text-[10px] ${statusBadge.text}`}>
              {statusBadge.label}
            </Text>
          </View>
        </View>

        {/* Reason Box */}
        <View className="bg-background border border-border rounded-xl p-3 mb-3">
          <Text className="font-inter-medium text-[11px] text-text-tertiary mb-1">
            Reason / Report Details:
          </Text>
          <Text className="font-inter text-body text-text-primary leading-relaxed">
            {item.reason}
          </Text>
        </View>

        {/* Reporter Info & Timestamp */}
        <View className="flex-row items-center justify-between py-2 border-t border-border mb-3">
          <View className="flex-row items-center">
            <Feather name="user-check" size={12} color="#6B7280" />
            <Text className="font-inter text-caption text-text-secondary ml-1.5">
              Reported by: {item.reporter_name || "Anonymous"}
            </Text>
          </View>

          <Text className="font-inter text-[11px] text-text-tertiary">
            {formattedDate}
          </Text>
        </View>

        {/* Moderation Controls */}
        {item.status === "pending" ? (
          <View className="flex-row gap-2">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleUpdateStatus(item, "reviewed")}
              className="flex-1 bg-success py-2.5 rounded-xl flex-row items-center justify-center shadow-sm"
            >
              <Feather name="check-circle" size={14} color="#FFFFFF" />
              <Text className="font-inter-semibold text-[12px] text-white ml-1.5">
                Mark as Resolved
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleUpdateStatus(item, "dismissed")}
              className="bg-surface border border-border px-4 py-2.5 rounded-xl flex-row items-center justify-center"
            >
              <Feather name="x" size={14} color="#6B7280" />
              <Text className="font-inter-medium text-[12px] text-text-secondary ml-1">
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row justify-end">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleUpdateStatus(item, "pending")}
              className="bg-surface border border-border px-3.5 py-1.5 rounded-xl flex-row items-center justify-center"
            >
              <Feather name="rotate-ccw" size={12} color="#4B5563" />
              <Text className="font-inter-medium text-[11px] text-text-primary ml-1">
                Reopen as Pending
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
                Community Reports
              </Text>
              <Text
                className="font-inter text-caption text-text-secondary"
                numberOfLines={1}
              >
                Investigate user flags and safety reports
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Pills */}
        <View className="flex-row gap-2">
          {REPORT_FILTERS.map((tab) => {
            const isSelected = selectedStatus === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                activeOpacity={0.7}
                onPress={() => setSelectedStatus(tab.value)}
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

      {/* Reports List */}
      <FlatList
        data={reports || []}
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
          !isLoading && reports ? (
            <Text className="font-inter-semibold text-caption text-text-tertiary mb-3">
              Showing {reports.length}{" "}
              {reports.length === 1 ? "Report" : "Reports"}
            </Text>
          ) : null
        }
        renderItem={renderItem}
        ListEmptyComponent={
          isLoading ? (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator size="large" color="#DC2626" />
              <Text className="font-inter text-body text-text-secondary mt-3">
                Loading community reports...
              </Text>
            </View>
          ) : (
            <View className="bg-surface border border-border rounded-3xl p-8 items-center justify-center mt-6">
              <View className="w-16 h-16 rounded-full bg-success-surface items-center justify-center mb-3">
                <Feather name="shield" size={28} color="#16A34A" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary mb-1 text-center">
                All Clean!
              </Text>
              <Text className="font-inter text-caption text-text-secondary text-center px-4 leading-relaxed">
                There are no {selectedStatus !== "all" ? selectedStatus : ""}{" "}
                moderation reports requiring attention.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

