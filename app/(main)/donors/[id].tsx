import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/AppButton";
import { BloodGroupBadge } from "@/components/ui/BloodGroupBadge";
import { ReportModal } from "@/components/ui/ReportModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { showAppAlert, showAppConfirm } from "@/features/dialog/useDialogStore";
import { useDonorDetail } from "@/features/donors/hooks/useDonors";

export default function DonorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: donor, isLoading, error } = useDonorDetail(id || "");

  const handleCall = () => {
    if (!donor?.phone) {
      showAppAlert(
        "No Phone Number",
        "This donor has not listed a contact number.",
        "info",
      );
      return;
    }

    showAppConfirm(
      "Call Donor",
      `Would you like to dial ${donor.full_name || "this donor"} at ${donor.phone}?`,
      () => {
        Linking.openURL(`tel:${donor.phone}`).catch(() => {
          showAppAlert("Error", "Unable to dial phone number.", "error");
        });
      },
      undefined,
      "Call Now",
      "Cancel",
      "info",
    );
  };

  const handleSMS = () => {
    if (!donor?.phone) {
      showAppAlert(
        "No Phone Number",
        "This donor has not listed a contact number.",
        "info",
      );
      return;
    }

    const message = encodeURIComponent(
      `Hello ${donor.full_name || "Donor"}, I found your profile on RoktoSheba. We have an urgent blood requirement.`,
    );
    Linking.openURL(`sms:${donor.phone}?body=${message}`).catch(() => {
      showAppAlert("Error", "Unable to open SMS app.", "error");
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="font-inter text-body text-text-secondary">
          Loading donor details...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !donor) {
    return (
      <SafeAreaView className="flex-1 bg-background p-6 items-center justify-center">
        <View className="w-16 h-16 rounded-full bg-primary-surface items-center justify-center mb-3">
          <Feather name="alert-circle" size={32} color="#DC2626" />
        </View>
        <Text className="font-inter-bold text-h3 text-text-primary mb-1">
          Donor Not Found
        </Text>
        <Text className="font-inter text-body text-text-secondary text-center mb-6">
          This donor profile could not be loaded or is no longer active.
        </Text>
        <AppButton title="Go Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-border">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="font-inter-bold text-h3 text-text-primary">
          Donor Profile
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowReportModal(true)}
          className="p-2 -mr-2"
        >
          <Feather name="flag" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 150,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Donor Hero Card */}
        <View className="bg-surface border border-border rounded-3xl p-6 items-center mb-5 shadow-sm">
          <View className="relative mb-4">
            {donor.avatar_url ? (
              <Image
                source={{ uri: donor.avatar_url }}
                className="w-24 h-24 rounded-full border-4 border-primary"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-primary-surface border-4 border-primary items-center justify-center">
                <Text className="font-inter-bold text-display text-primary">
                  {donor.full_name?.charAt(0)?.toUpperCase() || "D"}
                </Text>
              </View>
            )}

            {donor.is_available_to_donate ? (
              <View className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-success border-2 border-surface" />
            ) : null}
          </View>

          <Text className="font-inter-bold text-h2 text-text-primary text-center mb-1">
            {donor.full_name || "RoktoSheba Donor"}
          </Text>

          <View className="flex-row items-center gap-2 mb-4">
            <View
              className={`px-2.5 py-0.5 rounded-full ${
                donor.is_available_to_donate
                  ? "bg-success-surface"
                  : "bg-background"
              }`}
            >
              <Text
                className={`font-inter-semibold text-caption ${
                  donor.is_available_to_donate
                    ? "text-success"
                    : "text-text-secondary"
                }`}
              >
                {donor.is_available_to_donate
                  ? "Available to Donate"
                  : "Currently Inactive"}
              </Text>
            </View>
          </View>

          {/* Blood Group Badge */}
          {donor.blood_group ? (
            <View className="mb-4">
              <BloodGroupBadge group={donor.blood_group} size="lg" />
            </View>
          ) : null}

          {/* Location Badge */}
          <View className="bg-background border border-border rounded-xl px-4 py-2.5 flex-row items-center">
            <Feather name="map-pin" size={16} color="#DC2626" />
            <Text className="font-inter-medium text-caption-medium text-text-primary ml-2">
              {donor.area ? `${donor.area}, ` : ""}
              {donor.district}, {donor.division}
            </Text>
          </View>
        </View>

        {/* Contact Actions */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCall}
            className="flex-1 bg-primary rounded-2xl py-3.5 px-4 flex-row items-center justify-center shadow-sm"
          >
            <Feather name="phone-call" size={18} color="#FFFFFF" />
            <Text className="font-inter-bold text-body text-white ml-2">
              Call Donor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSMS}
            className="flex-1 bg-surface border border-border rounded-2xl py-3.5 px-4 flex-row items-center justify-center shadow-sm"
          >
            <Feather name="message-square" size={18} color="#DC2626" />
            <Text className="font-inter-bold text-body text-text-primary ml-2">
              Send SMS
            </Text>
          </TouchableOpacity>
        </View>

        {/* Donor Information Details */}
        <View className="bg-surface border border-border rounded-2xl p-5 mb-5 gap-3.5">
          <Text className="font-inter-bold text-h3 text-text-primary mb-1">
            Donation Status
          </Text>

          <View className="flex-row justify-between py-2 border-b border-border">
            <Text className="font-inter text-caption text-text-secondary">
              Last Donation Date
            </Text>
            <Text className="font-inter-semibold text-caption text-text-primary">
              {donor.last_donation_date || "Never donated / Not logged"}
            </Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-border">
            <Text className="font-inter text-caption text-text-secondary">
              Registered Division
            </Text>
            <Text className="font-inter-semibold text-caption text-text-primary">
              {donor.division || "Bangladesh"}
            </Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="font-inter text-caption text-text-secondary">
              Phone Number
            </Text>
            <Text className="font-inter-semibold text-caption text-primary">
              {donor.phone || "Private"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Report Modal */}
      {donor ? (
        <ReportModal
          visible={showReportModal}
          onClose={() => setShowReportModal(false)}
          reporterId={user?.id}
          targetType="user"
          targetId={donor.id}
          targetTitle={`Donor: ${donor.full_name || "Anonymous"}`}
          onSuccess={() => {
            showAppAlert(
              "Report Submitted",
              "Thank you for reporting. Our moderation team will investigate this user profile.",
              "success",
            );
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}
