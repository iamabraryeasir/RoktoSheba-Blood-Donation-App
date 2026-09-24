import { BloodGroupBadge } from "@/components/ui/BloodGroupBadge";
import { Profile } from "@/types";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

interface ProfileHeroCardProps {
  profile: Profile | null;
  email?: string | null;
}

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
  profile,
  email,
}) => {
  return (
    <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5 mb-5">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1 pr-2">
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              className="w-16 h-16 rounded-full mr-3.5 border-2 border-primary"
            />
          ) : (
            <View className="w-16 h-16 rounded-full bg-primary-surface dark:bg-primary-dark/30 border-2 border-primary items-center justify-center mr-3.5">
              <Text className="font-inter-bold text-h2 text-primary">
                {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
          )}

          <View className="flex-1 justify-center">
            <View className="flex-row items-center flex-wrap gap-1.5 mb-1">
              <Text
                className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary"
                numberOfLines={1}
              >
                {profile?.full_name || "RoktoSheba User"}
              </Text>
              <View className="bg-success-surface dark:bg-success/20 px-2 py-0.5 rounded-full">
                <Text className="font-inter-semibold text-[10px] text-success">
                  Active
                </Text>
              </View>
            </View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary leading-tight"
            >
              {email}
            </Text>
            <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary mt-1">
              {profile?.phone || "No phone added"}
            </Text>
          </View>
        </View>

        {profile?.blood_group ? (
          <BloodGroupBadge group={profile.blood_group} size="md" />
        ) : null}
      </View>

      {/* Location Badge */}
      <View className="bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-xl p-3 flex-row items-center">
        <View className="mt-0.5 mr-2.5">
          <Feather name="map-pin" size={16} color="#DC2626" />
        </View>
        <View className="flex-1">
          <Text className="font-inter-semibold text-caption text-text-primary dark:text-text-dark-primary leading-tight">
            {profile?.area || "Area"}, {profile?.district || "District"}
          </Text>
          <Text className="font-inter text-[11px] text-text-tertiary dark:text-text-dark-tertiary mt-0.5">
            {profile?.division || "Division"} Division, Bangladesh
          </Text>
        </View>
      </View>
    </View>
  );
};
