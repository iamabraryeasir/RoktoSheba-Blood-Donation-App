import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/AppButton";
import { BloodGroupBadge } from "@/components/ui/BloodGroupBadge";
import { ReportModal } from "@/components/ui/ReportModal";
import { UrgencyTag } from "@/components/ui/UrgencyTag";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { showAppAlert, showAppConfirm } from "@/features/dialog/useDialogStore";
import {
  useRequestDetail,
  useUpdateRequestStatus,
} from "@/features/requests/hooks/useRequests";
import { RequestStatus } from "@/types";

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [showImageModal, setShowImageModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const {
    data: request,
    isLoading,
    error,
    refetch,
  } = useRequestDetail(id as string);
  const updateStatusMutation = useUpdateRequestStatus();

  const isOwner = !!(user?.id && request?.created_by === user.id);

  const handleCall = () => {
    if (!request?.contact_number) return;
    const phoneUrl = `tel:${request.contact_number}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          showAppAlert(
            "Cannot Place Call",
            "Your device does not support direct calling.",
            "error",
          );
        }
      })
      .catch((err) => {
        console.error("Call error:", err);
      });
  };

  const handleSMS = () => {
    if (!request?.contact_number) return;
    const smsUrl = `sms:${request.contact_number}?body=Hello, I saw your blood request for ${request.patient_name} (${request.blood_group}) on RoktoSheba.`;
    Linking.canOpenURL(smsUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(smsUrl);
        } else {
          showAppAlert(
            "Cannot Send SMS",
            "Your device does not support SMS messaging.",
            "error",
          );
        }
      })
      .catch((err) => {
        console.error("SMS error:", err);
      });
  };

  const handleStatusChange = (newStatus: RequestStatus) => {
    if (!request?.id) return;

    let title = "Update Status";
    let message = `Are you sure you want to mark this request as ${newStatus}?`;

    if (newStatus === "fulfilled") {
      title = "Mark as Fulfilled";
      message = "Did you successfully find a blood donor for this request?";
    } else if (newStatus === "cancelled") {
      title = "Cancel Request";
      message = "Are you sure you want to cancel this emergency request?";
    } else if (newStatus === "active") {
      title = "Reactivate Request";
      message = "This will reopen your request for active donor discovery.";
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
            `Your blood request is now marked as ${newStatus}.`,
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="font-inter text-body text-text-secondary mt-3">
          Loading request details...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !request) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
        <View className="w-16 h-16 rounded-full bg-primary-surface items-center justify-center mb-4">
          <Feather name="alert-triangle" size={32} color="#DC2626" />
        </View>
        <Text className="font-inter-bold text-h2 text-text-primary mb-2 text-center">
          Request Not Found
        </Text>
        <Text className="font-inter text-body text-text-secondary text-center mb-6">
          This blood request may have been fulfilled or removed.
        </Text>
        <View className="flex-row gap-3">
          <AppButton
            title="Go Back"
            variant="outline"
            onPress={() => router.back()}
          />
          <AppButton title="Retry" onPress={() => refetch()} />
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = new Date(request.needed_date_time).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const getStatusBadge = () => {
    switch (request.status) {
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
          label: String(request.status).toUpperCase(),
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-border">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="font-inter-bold text-h3 text-text-primary">
          Emergency Blood Request
        </Text>

        {isOwner ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push(`/(main)/requests/edit?id=${request.id}` as any)
            }
            className="p-2 -mr-2"
          >
            <Feather name="edit-3" size={20} color="#DC2626" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowReportModal(true)}
            className="p-2 -mr-2"
          >
            <Feather name="flag" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 150,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Alert Banner for Completed / Cancelled */}
        {request.status === "fulfilled" ? (
          <View className="bg-success-surface border border-success rounded-2xl p-4 mb-4 flex-row items-center">
            <Feather name="check-circle" size={20} color="#16A34A" />
            <View className="ml-3 flex-1">
              <Text className="font-inter-bold text-caption text-success">
                Request Fulfilled
              </Text>
              <Text className="font-inter text-[11px] text-text-secondary mt-0.5">
                A donor was successfully connected. Thank you for using
                RoktoSheba!
              </Text>
            </View>
          </View>
        ) : null}

        {request.status === "cancelled" ? (
          <View className="bg-surface border border-border rounded-2xl p-4 mb-4 flex-row items-center">
            <Feather name="slash" size={20} color="#6B7280" />
            <View className="ml-3 flex-1">
              <Text className="font-inter-bold text-caption text-text-primary">
                Request Cancelled
              </Text>
              <Text className="font-inter text-[11px] text-text-secondary mt-0.5">
                This request is currently inactive.
              </Text>
            </View>
          </View>
        ) : null}

        {/* Patient Hero Card */}
        <View className="bg-surface border border-border rounded-3xl p-5 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <UrgencyTag urgency={request.urgency} size="md" />
            <View className="flex-row items-center gap-2">
              {isOwner ? (
                <View className="bg-primary-surface border border-primary px-2.5 py-0.5 rounded-full">
                  <Text className="font-inter-bold text-[10px] text-primary">
                    YOUR REQUEST
                  </Text>
                </View>
              ) : null}
              <View
                className={`flex-row items-center border px-2.5 py-0.5 rounded-full ${statusBadge.bg}`}
              >
                <Text
                  className={`font-inter-bold text-[10px] ${statusBadge.text}`}
                >
                  {statusBadge.label}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center mb-4">
            <View className="mr-4">
              <BloodGroupBadge group={request.blood_group} size="lg" />
            </View>
            <View className="flex-1">
              <Text className="font-inter-medium text-caption text-text-tertiary">
                Patient
              </Text>
              <Text className="font-inter-bold text-h2 text-text-primary mb-0.5">
                {request.patient_name}
              </Text>
              <Text className="font-inter-semibold text-body-medium text-primary">
                Blood Group: {request.blood_group}
              </Text>
            </View>
          </View>

          {/* Location & Hospital */}
          <View className="bg-background rounded-2xl p-4 border border-border gap-3">
            <View className="flex-row items-start">
              <View style={{ marginTop: 2 }}>
                <Feather name="activity" size={16} color="#DC2626" />
              </View>
              <View className="ml-2.5 flex-1">
                <Text className="font-inter-medium text-caption text-text-tertiary">
                  Hospital / Clinic
                </Text>
                <Text className="font-inter-bold text-body text-text-primary">
                  {request.hospital_name}
                </Text>
              </View>
            </View>

            <View className="h-[1px] bg-border" />

            <View className="flex-row items-start">
              <View style={{ marginTop: 2 }}>
                <Feather name="map-pin" size={16} color="#DC2626" />
              </View>
              <View className="ml-2.5 flex-1">
                <Text className="font-inter-medium text-caption text-text-tertiary">
                  Location
                </Text>
                <Text className="font-inter-medium text-body text-text-primary">
                  {request.area}, {request.district}, {request.division}
                </Text>
              </View>
            </View>

            <View className="h-[1px] bg-border" />

            <View className="flex-row items-start">
              <View style={{ marginTop: 2 }}>
                <Feather name="calendar" size={16} color="#DC2626" />
              </View>
              <View className="ml-2.5 flex-1">
                <Text className="font-inter-medium text-caption text-text-tertiary">
                  Needed By
                </Text>
                <Text className="font-inter-bold text-body text-text-primary">
                  {formattedDate}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Prescription / Medical Document Section */}
        {request.document_image_url ? (
          <View className="bg-surface border border-border rounded-3xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Feather name="file-text" size={16} color="#DC2626" />
                <Text className="font-inter-bold text-body-large text-text-primary ml-2">
                  Hospital Requisition / Slip
                </Text>
              </View>
              <Text className="font-inter text-caption text-success font-semibold">
                ✓ Verified Proof
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setShowImageModal(true)}
              className="relative rounded-2xl overflow-hidden border border-border bg-surface"
            >
              <Image
                source={{ uri: request.document_image_url }}
                className="w-full h-48"
                resizeMode="cover"
              />
              <View
                style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
                className="absolute bottom-2 right-2 px-3 py-1 rounded-full flex-row items-center"
              >
                <Feather name="maximize-2" size={12} color="#FFFFFF" />
                <Text className="font-inter text-[11px] text-white ml-1">
                  Tap to Zoom
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Owner Management Controls */}
        {isOwner ? (
          <View className="bg-surface border border-border rounded-3xl p-5 mb-4 shadow-sm">
            <Text className="font-inter-bold text-body-large text-text-primary mb-1">
              Manage Your Request
            </Text>
            <Text className="font-inter text-caption text-text-secondary mb-4">
              Update status when you find a donor or edit patient details.
            </Text>

            <View className="gap-2.5">
              {request.status === "active" ? (
                <>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleStatusChange("fulfilled")}
                    className="bg-success rounded-2xl py-3.5 px-4 flex-row items-center justify-center shadow-sm"
                  >
                    <Feather name="check-circle" size={18} color="#FFFFFF" />
                    <Text className="font-inter-bold text-caption-medium text-white ml-2">
                      Mark as Fulfilled
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row gap-2.5">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        router.push(
                          `/(main)/requests/edit?id=${request.id}` as any,
                        )
                      }
                      className="flex-1 bg-surface border border-border rounded-2xl py-3 px-3 flex-row items-center justify-center"
                    >
                      <Feather name="edit-2" size={16} color="#111827" />
                      <Text className="font-inter-semibold text-caption text-text-primary ml-1.5">
                        Edit Details
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleStatusChange("cancelled")}
                      className="flex-1 bg-surface border border-critical rounded-2xl py-3 px-3 flex-row items-center justify-center"
                    >
                      <Feather name="slash" size={16} color="#DC2626" />
                      <Text className="font-inter-semibold text-caption text-critical ml-1.5">
                        Cancel Request
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View className="flex-row gap-2.5">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleStatusChange("active")}
                    className="flex-1 bg-primary rounded-2xl py-3.5 px-4 flex-row items-center justify-center shadow-sm"
                  >
                    <Feather name="rotate-ccw" size={18} color="#FFFFFF" />
                    <Text className="font-inter-bold text-caption-medium text-white ml-2">
                      Reopen as Active
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      router.push(
                        `/(main)/requests/edit?id=${request.id}` as any,
                      )
                    }
                    className="bg-surface border border-border rounded-2xl py-3 px-4 flex-row items-center justify-center"
                  >
                    <Feather name="edit-2" size={16} color="#111827" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ) : (
          /* Non-Owner Contact Actions */
          <View className="bg-surface border border-border rounded-3xl p-5 mb-4 shadow-sm">
            <Text className="font-inter-bold text-body-large text-text-primary mb-1">
              Emergency Contact
            </Text>
            <Text className="font-inter text-caption text-text-secondary mb-4">
              Directly call or message the requester for immediate coordination.
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCall}
                className="flex-1 bg-primary rounded-2xl py-3.5 px-4 flex-row items-center justify-center shadow-sm"
              >
                <Feather name="phone-call" size={18} color="#FFFFFF" />
                <Text className="font-inter-bold text-caption-medium text-white ml-2">
                  Call Now
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSMS}
                className="flex-1 bg-surface border border-primary rounded-2xl py-3.5 px-4 flex-row items-center justify-center"
              >
                <Feather name="message-square" size={18} color="#DC2626" />
                <Text className="font-inter-bold text-caption-medium text-primary ml-2">
                  Send SMS
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Image Modal Preview */}
      {request.document_image_url ? (
        <Modal
          visible={showImageModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowImageModal(false)}
        >
          <View
            style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
            className="flex-1 justify-center items-center p-4"
          >
            <TouchableOpacity
              onPress={() => setShowImageModal(false)}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              className="absolute top-12 right-6 p-2.5 rounded-full z-10"
            >
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Image
              source={{ uri: request.document_image_url }}
              className="w-full h-4/5"
              resizeMode="contain"
            />
          </View>
        </Modal>
      ) : null}

      {/* Report Modal */}
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        reporterId={user?.id}
        targetType="request"
        targetId={request.id}
        targetTitle={`Patient: ${request.patient_name}`}
        onSuccess={() => {
          showAppAlert(
            "Report Submitted",
            "Thank you for reporting. Our moderation team will investigate this request.",
            "success",
          );
        }}
      />
    </SafeAreaView>
  );
}
