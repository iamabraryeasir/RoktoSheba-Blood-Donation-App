import { BloodGroupType } from "@/types/database.types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface BloodGroupBadgeProps {
  group: BloodGroupType;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  onPress?: () => void;
  className?: string;
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({
  group,
  size = "md",
  selected = false,
  onPress,
  className = "",
}) => {
  let sizeStyles = "min-w-[48px] h-10 px-md py-xs rounded-md";
  let textStyles = "text-h3 font-inter-bold";

  if (size === "sm") {
    sizeStyles = "min-w-[36px] h-8 px-sm py-xs rounded-sm";
    textStyles = "text-caption-medium font-inter-bold";
  } else if (size === "lg") {
    sizeStyles = "min-w-[64px] h-14 px-lg py-sm rounded-lg";
    textStyles = "text-h2 font-inter-bold";
  }

  const badgeBg = selected
    ? "bg-primary border-primary"
    : "bg-primary-light border-primary";
  const textColor = selected ? "text-text-on-primary" : "text-primary";

  const content = (
    <View
      className={`items-center justify-center border ${badgeBg} ${sizeStyles} ${className}`}
    >
      <Text className={`${textColor} ${textStyles}`}>{group}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};
