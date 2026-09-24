import { UrgencyLevel } from "@/types/database.types";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface UrgencyTagProps {
  urgency: UrgencyLevel;
  size?: "sm" | "md";
}

export const UrgencyTag: React.FC<UrgencyTagProps> = ({
  urgency,
  size = "md",
}) => {
  const isCritical = urgency === "critical";
  const isUrgent = urgency === "urgent";

  const containerClasses = isCritical
    ? "bg-critical border border-critical"
    : isUrgent
      ? "bg-warning-surface border border-warning"
      : "bg-info-surface border border-info";

  const textClasses = isCritical
    ? "text-white"
    : isUrgent
      ? "text-warning"
      : "text-info";

  const iconName = isCritical ? "alert-octagon" : isUrgent ? "clock" : "info";
  const iconColor = isCritical ? "#FFFFFF" : isUrgent ? "#D97706" : "#2563EB";
  const iconSize = size === "sm" ? 10 : 12;

  const label = isCritical ? "CRITICAL" : isUrgent ? "URGENT" : "NORMAL";

  return (
    <View
      className={`flex-row items-center rounded-full ${
        size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1"
      } ${containerClasses}`}
    >
      <Feather name={iconName} size={iconSize} color={iconColor} />
      <Text
        className={`font-inter-bold ml-1 tracking-wider ${
          size === "sm" ? "text-[9px]" : "text-[11px]"
        } ${textClasses}`}
      >
        {label}
      </Text>
    </View>
  );
};
