import { BloodGroupType } from "@/types/database.types";
import React from "react";
import { Text, View } from "react-native";
import { BloodGroupBadge } from "./BloodGroupBadge";

export const ALL_BLOOD_GROUPS: BloodGroupType[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

interface BloodGroupSelectorProps {
  label?: string;
  selectedGroup: BloodGroupType | null;
  onSelect: (group: BloodGroupType) => void;
  error?: string;
  className?: string;
}

export const BloodGroupSelector: React.FC<BloodGroupSelectorProps> = ({
  label = "Blood Group *",
  selectedGroup,
  onSelect,
  error,
  className = "",
}) => {
  return (
    <View className={className}>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="font-inter-medium text-caption text-text-secondary">
          {label}
        </Text>
        {selectedGroup ? (
          <View className="bg-primary-surface px-2 py-0.5 rounded">
            <Text className="font-inter-bold text-[11px] text-primary">
              Selected: {selectedGroup}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="flex-row flex-wrap gap-2.5 justify-start">
        {ALL_BLOOD_GROUPS.map((group) => (
          <BloodGroupBadge
            key={group}
            group={group}
            size="md"
            selected={selectedGroup === group}
            onPress={() => onSelect(group)}
          />
        ))}
      </View>

      {error ? (
        <Text className="font-inter text-caption text-critical mt-1.5">
          {error}
        </Text>
      ) : null}
    </View>
  );
};
