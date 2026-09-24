import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

import { BloodGroupBadge } from "@/components/ui/BloodGroupBadge";
import { showAppAlert, showAppConfirm } from "@/features/dialog/useDialogStore";
import { Profile } from "@/types";

interface DonorCardProps {
  donor: Profile;
  className?: string;
}

export const DonorCard: React.FC<DonorCardProps> = ({
  donor,
  className = "",
}) => {
  const router = useRouter();

  const formattedDonationStatus = React.useMemo(() => {
    if (!donor.last_donation_date) {
      return "Ready to donate";
    }

    try {
      const today = new Date();
      const lastDate = new Date(donor.last_donation_date);
      const diffMonths = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24 * 30.4),
      );

      if (diffMonths <= 0) {
        return "Donated this month";
      } else if (diffMonths === 1) {
        return "Last donated 1 month ago";
      } else {
        return `Last donated ${diffMonths} months ago`;
      }
    } catch {
      return `Last donated: ${donor.last_donation_date}`;
    }
  }, [donor.last_donation_date]);

  const handleCall = () => {
    if (!donor.phone) {
      showAppAlert(
        "No Phone Number",
        "This donor has not listed a contact number.",
        "info",
      );
      return;
    }

    showAppConfirm(
      "Contact Donor",
      `Would you like to call ${donor.full_name || "this donor"} at ${donor.phone}?`,
      () => {
        Linking.openURL(`tel:${donor.phone}`).catch(() => {
          showAppAlert(
            "Error",
            "Unable to initiate phone call on this device.",
            "error",
          );
        });
      },
      undefined,
      "Call Now",
      "Cancel",
      "info",
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/(main)/donors/${donor.id}` as any)}
      className={`bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 shadow-sm ${className}`}
    >
      <View className="flex-row items-center justify-between mb-3">
        {/* Donor Avatar + Info */}
        <View className="flex-row items-center flex-1 pr-2">
          <View className="flex-1">
            <View className="flex-row items-center flex-wrap gap-1.5 mb-0.5">
              <Text
                className="font-inter-bold text-body-large text-text-primary dark:text-text-dark-primary"
                numberOfLines={1}
              >
                {donor.full_name || "RoktoSheba Donor"}
              </Text>
              {donor.is_available_to_donate ? (
                <View className="bg-success-surface dark:bg-success/20 px-1.5 py-0.5 rounded-full">
                  <Text className="font-inter-semibold text-[9px] text-success">
                    Available
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Location Pill */}
            <View className="flex-row items-center">
              <Feather name="map-pin" size={12} color="#DC2626" />
              <Text
                className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary ml-1"
                numberOfLines={1}
              >
                {donor.area ? `${donor.area}, ` : ""}
                {donor.district || "Bangladesh"}
              </Text>
            </View>
          </View>
        </View>

        {/* Blood Group Badge */}
        {donor.blood_group ? (
          <View className="ml-2">
            <BloodGroupBadge group={donor.blood_group} size="md" />
          </View>
        ) : null}
      </View>

      {/* Footer Info: Donation Status + Call Action */}
      <View className="flex-row items-center justify-between pt-2.5 border-t border-border dark:border-border-dark">
        <View className="flex-row items-center flex-1 pr-2">
          <Feather name="clock" size={12} color="#9CA3AF" />
          <Text
            className="font-inter text-caption text-text-tertiary dark:text-text-dark-tertiary ml-1.5"
            numberOfLines={1}
          >
            {formattedDonationStatus}
          </Text>
        </View>

        {/* Direct Call Action */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleCall}
          className="bg-primary-surface dark:bg-primary-dark/20 border border-primary px-3 py-1.5 rounded-xl flex-row items-center"
        >
          <Feather name="phone" size={13} color="#DC2626" />
          <Text className="font-inter-semibold text-caption text-primary ml-1.5">
            Call
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
