import { UrgencyLevel } from "@/types/database.types";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface UrgencySelectorProps {
  selectedUrgency: UrgencyLevel;
  onSelect: (urgency: UrgencyLevel) => void;
  error?: string;
  className?: string;
}

export const UrgencySelector: React.FC<UrgencySelectorProps> = ({
  selectedUrgency,
  onSelect,
  error,
  className = "",
}) => {
  return (
    <View className={className}>
      <Text className="font-inter-medium text-caption text-text-secondary mb-2">
        Urgency Level *
      </Text>

      <View className="flex-row gap-2.5">
        {/* Critical Option */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelect("critical")}
          className={`flex-1 rounded-2xl p-3 border items-center justify-center ${
            selectedUrgency === "critical"
              ? "bg-critical border-critical"
              : "bg-surface border-border"
          }`}
        >
          <Feather
            name="alert-octagon"
            size={18}
            color={selectedUrgency === "critical" ? "#FFFFFF" : "#DC2626"}
          />
          <Text
            className={`font-inter-bold text-caption-medium mt-1.5 ${
              selectedUrgency === "critical"
                ? "text-white"
                : "text-text-primary"
            }`}
          >
            Critical
          </Text>
          <Text
            className={`font-inter text-[10px] mt-0.5 text-center ${
              selectedUrgency === "critical"
                ? "text-white"
                : "text-text-tertiary"
            }`}
          >
            Immediate (0-4h)
          </Text>
        </TouchableOpacity>

        {/* Urgent Option */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelect("urgent")}
          className={`flex-1 rounded-2xl p-3 border items-center justify-center ${
            selectedUrgency === "urgent"
              ? "bg-warning-surface border-warning"
              : "bg-surface border-border"
          }`}
        >
          <Feather name="clock" size={18} color="#D97706" />
          <Text
            className={`font-inter-bold text-caption-medium mt-1.5 ${
              selectedUrgency === "urgent"
                ? "text-warning"
                : "text-text-primary"
            }`}
          >
            Urgent
          </Text>
          <Text className="font-inter text-[10px] mt-0.5 text-center text-text-tertiary">
            Within 24 hours
          </Text>
        </TouchableOpacity>

        {/* Normal Option */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelect("normal")}
          className={`flex-1 rounded-2xl p-3 border items-center justify-center ${
            selectedUrgency === "normal"
              ? "bg-info-surface border-info"
              : "bg-surface border-border"
          }`}
        >
          <Feather name="calendar" size={18} color="#2563EB" />
          <Text
            className={`font-inter-bold text-caption-medium mt-1.5 ${
              selectedUrgency === "normal" ? "text-info" : "text-text-primary"
            }`}
          >
            Normal
          </Text>
          <Text className="font-inter text-[10px] mt-0.5 text-center text-text-tertiary">
            Scheduled date
          </Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <Text className="font-inter text-caption text-critical mt-1.5">
          {error}
        </Text>
      ) : null}
    </View>
  );
};
