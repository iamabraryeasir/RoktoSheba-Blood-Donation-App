import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ErrorBannerProps {
  message?: string | null;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onDismiss,
  className = "mb-4",
}) => {
  if (!message) return null;

  return (
    <View
      className={`bg-primary-surface border border-critical rounded-xl p-3.5 flex-row items-center justify-between ${className}`}
    >
      <View className="flex-row items-center flex-1 pr-2">
        <Feather name="alert-circle" size={18} color="#DC2626" />
        <Text className="font-inter text-caption text-critical ml-2.5 flex-1 leading-snug">
          {message}
        </Text>
      </View>
      {onDismiss ? (
        <TouchableOpacity onPress={onDismiss} hitSlop={8}>
          <Feather name="x" size={16} color="#DC2626" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
