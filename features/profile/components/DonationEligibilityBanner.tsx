import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface DonationEligibilityBannerProps {
  isEligible: boolean;
  reason?: string | null;
  lastDonationDate?: string | null;
}

export const DonationEligibilityBanner: React.FC<
  DonationEligibilityBannerProps
> = ({ isEligible, reason, lastDonationDate }) => {
  return (
    <View
      className={`border rounded-2xl p-4 mb-5 ${
        isEligible
          ? "bg-success-surface dark:bg-success/15 border-success"
          : "bg-primary-surface dark:bg-critical/15 border-critical"
      }`}
    >
      <View className="flex-row items-center">
        <View
          className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
            isEligible ? "bg-success/20" : "bg-primary/20"
          }`}
        >
          <Feather
            name={isEligible ? "check-circle" : "alert-circle"}
            size={20}
            color={isEligible ? "#16A34A" : "#DC2626"}
          />
        </View>
        <View className="flex-1">
          <Text
            className={`font-inter-bold text-body-medium ${
              isEligible ? "text-success" : "text-critical"
            }`}
          >
            {isEligible
              ? "Eligible to Donate Blood Now"
              : "Currently Ineligible to Donate"}
          </Text>
          <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary mt-0.5">
            {reason ||
              (lastDonationDate
                ? `Last donation date: ${lastDonationDate}`
                : "No donation date logged yet.")}
          </Text>
        </View>
      </View>
    </View>
  );
};
