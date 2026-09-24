import { showAppAlert } from "@/features/dialog/useDialogStore";
import React from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";

interface DonorAvailabilityCardProps {
  isAvailable: boolean;
  isEligible: boolean;
  reason?: string | null;
  onToggle: (newValue: boolean) => void;
}

export const DonorAvailabilityCard: React.FC<DonorAvailabilityCardProps> = ({
  isAvailable,
  isEligible,
  reason,
  onToggle,
}) => {
  const handleTouchDisabled = () => {
    if (!isEligible) {
      showAppAlert(
        "Ineligible to Donate",
        reason || "You are currently not eligible to be an active donor.",
        "warning",
      );
    }
  };

  return (
    <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 mb-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center flex-wrap gap-2">
            <Text className="font-inter-bold text-body-large text-text-primary dark:text-text-dark-primary">
              Available to Donate Blood
            </Text>
            {!isEligible ? (
              <View className="bg-primary-surface dark:bg-primary-dark/30 border border-critical px-2 py-0.5 rounded-full">
                <Text className="font-inter-semibold text-[10px] text-critical">
                  Ineligible
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary mt-0.5">
            {isEligible
              ? "List profile in active donor searches for your area"
              : reason || "Ineligible to be an active donor"}
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={handleTouchDisabled}>
          <Switch
            value={isEligible ? isAvailable : false}
            onValueChange={onToggle}
            disabled={!isEligible}
            trackColor={{ false: "#475569", true: "#DC2626" }}
            thumbColor="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
