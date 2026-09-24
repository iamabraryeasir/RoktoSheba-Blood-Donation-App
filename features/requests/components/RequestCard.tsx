import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { BloodGroupBadge } from "@/components/ui/BloodGroupBadge";
import { UrgencyTag } from "@/components/ui/UrgencyTag";
import { BloodRequest } from "@/types";

interface RequestCardProps {
  request: BloodRequest;
  onPress?: () => void;
  className?: string;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onPress,
  className = "",
}) => {
  const router = useRouter();

  const formattedDate = React.useMemo(() => {
    if (!request.needed_date_time) return "";
    try {
      const date = new Date(request.needed_date_time);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return request.needed_date_time;
    }
  }, [request.needed_date_time]);

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/(main)/requests/${request.id}` as any);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handleCardPress}
      className={`bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 shadow-sm ${className}`}
    >
      {/* Top Header: Urgency + Date */}
      <View className="flex-row items-center justify-between mb-3">
        <UrgencyTag urgency={request.urgency} size="sm" />
        <View className="flex-row items-center">
          <Feather name="clock" size={12} color="#9CA3AF" />
          <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary ml-1">
            Needed: {formattedDate}
          </Text>
        </View>
      </View>

      {/* Main Body: Blood Group Badge + Info */}
      <View className="flex-row items-center mb-3">
        <View className="mr-3.5">
          <BloodGroupBadge group={request.blood_group} size="md" />
        </View>

        <View className="flex-1 justify-center">
          <Text
            className="font-inter-bold text-body-large text-text-primary dark:text-text-dark-primary mb-0.5"
            numberOfLines={1}
          >
            {request.patient_name}
          </Text>
          <Text
            className="font-inter-medium text-caption text-primary leading-tight"
            numberOfLines={1}
          >
            {request.hospital_name}
          </Text>
          <View className="flex-row items-center mt-1">
            <Feather name="map-pin" size={12} color="#9CA3AF" />
            <Text
              className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary ml-1"
              numberOfLines={1}
            >
              {request.area}, {request.district}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer Action */}
      <View className="flex-row items-center justify-between pt-3 border-t border-border dark:border-border-dark">
        <View className="flex-row items-center">
          <Feather name="phone" size={13} color="#DC2626" />
          <Text className="font-inter-medium text-caption text-text-primary dark:text-text-dark-primary ml-1.5">
            {request.contact_number}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className="font-inter-semibold text-caption text-primary mr-1">
            View Request
          </Text>
          <Feather name="chevron-right" size={14} color="#DC2626" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
