import { BloodGroupBadge } from "@/components/ui/BloodGroupBadge";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { showAppAlert, showAppConfirm } from "@/features/dialog/useDialogStore";
import { RequestCard } from "@/features/requests/components/RequestCard";
import { useUrgentRequests } from "@/features/requests/hooks/useRequests";
import { BloodGroupType } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BLOOD_GROUPS: BloodGroupType[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

const EMERGENCY_HOTLINES = [
  {
    name: "National Emergency & Ambulance",
    number: "999",
    tag: "24/7 Toll-Free",
    iconName: "phone-call" as const,
  },
  {
    name: "Red Crescent Blood Center",
    number: "10655",
    tag: "National Hotline",
    iconName: "activity" as const,
  },
  {
    name: "Quantum Foundation Blood Lab",
    number: "01714010869",
    tag: "24/7 Emergency Lab",
    iconName: "heart" as const,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile, isAdmin } = useAuth();
  const {
    data: urgentRequests,
    isLoading: isLoadingUrgent,
    refetch: refetchUrgent,
    isRefetching: isRefetchingUrgent,
  } = useUrgentRequests(2, user?.id);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchUrgent();
    } finally {
      setRefreshing(false);
    }
  };

  const handleCallHotline = (name: string, number: string) => {
    showAppConfirm(
      `Call ${name}`,
      `Would you like to dial emergency helpline ${number}?`,
      () => {
        const phoneUrl = `tel:${number}`;
        Linking.canOpenURL(phoneUrl)
          .then((supported) => {
            if (supported) {
              Linking.openURL(phoneUrl);
            } else {
              showAppAlert(
                "Cannot Place Call",
                "Your device does not support direct phone dialing.",
                "error",
              );
            }
          })
          .catch((err) => {
            console.error("Call error:", err);
          });
      },
      undefined,
      "Dial Now",
      "Cancel",
      "info",
    );
  };

  const handleSelectBloodGroup = (bg: BloodGroupType) => {
    router.push({
      pathname: "/(main)/donors" as any,
      params: { bloodGroup: bg },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Top App Bar */}
      <View className="px-5 pt-3 pb-3 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={require("@/assets/images/rokto-sheba-app-logo.png")}
              className="w-10 h-10 mr-3"
              resizeMode="contain"
            />
            <View>
              <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary">
                RoktoSheba
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Feather name="map-pin" size={11} color="#DC2626" />
                <Text className="font-inter-medium text-[11px] text-text-secondary dark:text-text-dark-secondary ml-1">
                  {profile?.division || "Bangladesh"}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            {isAdmin ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/admin/dashboard" as any)}
                className="bg-critical px-2.5 py-1.5 rounded-full flex-row items-center"
              >
                <Feather name="shield" size={13} color="#FFFFFF" />
                <Text className="font-inter-semibold text-[11px] text-white ml-1">
                  Admin
                </Text>
              </TouchableOpacity>
            ) : null}

            {/* Quick Emergency Dial Action */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                handleCallHotline("National Emergency Ambulance", "999")
              }
              className="w-9 h-9 rounded-full bg-critical items-center justify-center shadow-sm"
            >
              <Feather name="phone" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isRefetchingUrgent}
            onRefresh={handleRefresh}
            colors={["#DC2626"]}
            tintColor="#DC2626"
          />
        }
      >
        {/* 1. Emergency Action Hero Banner */}
        <View className="bg-primary rounded-3xl p-5 mb-6 shadow-md overflow-hidden relative">
          <View className="flex-row items-center justify-between mb-2">
            <View
              className="bg-white/20 px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <Text className="font-inter-bold text-[10px] text-white tracking-wider uppercase">
                Emergency Blood Network
              </Text>
            </View>
            <Feather name="heart" size={18} color="#FEE2E2" />
          </View>

          <Text className="font-inter-bold text-h2 text-white mb-1 leading-tight">
            Need Blood in Emergency?
          </Text>
          <Text className="font-inter text-caption text-primary-surface mb-5 leading-relaxed">
            Reach verified blood donors in your district within minutes.
          </Text>

          {/* Action CTA Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/(main)/requests/create")}
              className="flex-1 bg-white py-3 rounded-xl flex-row items-center justify-center shadow-sm"
            >
              <Feather name="plus" size={16} color="#DC2626" />
              <Text className="font-inter-bold text-caption-medium text-primary ml-1.5">
                Post Request
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/(main)/donors" as any)}
              className="flex-1 border border-white/60 py-3 rounded-xl flex-row items-center justify-center"
              style={{ borderColor: "rgba(255, 255, 255, 0.6)" }}
            >
              <Feather name="search" size={16} color="#FFFFFF" />
              <Text className="font-inter-bold text-caption-medium text-white ml-1.5">
                Find Donors
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Fast Search by Blood Group (8 Groups Grid) */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary">
              Search by Blood Group
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(main)/donors" as any)}
            >
              <Text className="font-inter-semibold text-caption text-primary">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-3">
            {BLOOD_GROUPS.map((bg) => (
              <TouchableOpacity
                key={bg}
                activeOpacity={0.75}
                onPress={() => handleSelectBloodGroup(bg)}
                className="w-[22%] bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl py-3 items-center justify-center shadow-sm"
              >
                <BloodGroupBadge group={bg} size="sm" />
                <Text className="font-inter-medium text-[11px] text-text-secondary dark:text-text-dark-secondary mt-1.5">
                  Find
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Live Critical & Urgent Requests Feed */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-critical mr-2" />
              <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary">
                Urgent Blood Needs
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(main)/requests")}
            >
              <Text className="font-inter-semibold text-caption text-primary">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {isLoadingUrgent ? (
            <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-8 items-center justify-center">
              <ActivityIndicator size="small" color="#DC2626" />
              <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary mt-2">
                Checking emergency requests...
              </Text>
            </View>
          ) : urgentRequests && urgentRequests.length > 0 ? (
            <View className="gap-3">
              {urgentRequests.map((req) => (
                <RequestCard key={req.id} request={req} />
              ))}
            </View>
          ) : (
            <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-6 items-center justify-center">
              <View className="w-12 h-12 rounded-full bg-success-surface dark:bg-success/20 items-center justify-center mb-2">
                <Feather name="check" size={24} color="#16A34A" />
              </View>
              <Text className="font-inter-bold text-body text-text-primary dark:text-text-dark-primary mb-0.5 text-center">
                No Pending Critical Emergencies
              </Text>
              <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary text-center mb-3">
                All critical requests are currently fulfilled or attended to.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(main)/requests")}
                className="bg-primary-surface dark:bg-primary-dark/20 border border-primary px-4 py-2 rounded-xl"
              >
                <Text className="font-inter-semibold text-caption text-primary">
                  Browse All Active Requests
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Hospital & Blood Bank Search Direct CTA (External REST API) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/hospitals" as any)}
          className="bg-primary-surface dark:bg-primary-dark/20 border border-primary/30 rounded-3xl p-4 mb-6 flex-row items-center justify-between shadow-sm"
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-12 h-12 rounded-2xl bg-primary items-center justify-center mr-3.5 shadow-sm">
              <Feather name="activity" size={22} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="font-inter-bold text-sm text-text-primary dark:text-text-dark-primary mr-2">
                  Hospitals & Blood Banks
                </Text>
                <View className="bg-primary-light dark:bg-primary-dark/30 px-1.5 py-0.5 rounded border border-primary/20">
                  <Text className="text-[9px] font-inter-bold text-primary dark:text-primary-light">
                    Live API
                  </Text>
                </View>
              </View>
              <Text
                className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary mt-0.5"
                numberOfLines={1}
              >
                Search Bangladesh medical facilities & blood labs
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color="#DC2626" />
        </TouchableOpacity>

        {/* 4. 24/7 Emergency Blood Bank Hotlines (Bangladesh) */}
        <View className="mb-6">
          <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary mb-3">
            Emergency Blood Helplines
          </Text>

          <View className="gap-2.5">
            {EMERGENCY_HOTLINES.map((hotline) => (
              <TouchableOpacity
                key={hotline.number}
                activeOpacity={0.8}
                onPress={() => handleCallHotline(hotline.name, hotline.number)}
                className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 flex-row items-center justify-between shadow-sm"
              >
                <View className="flex-row items-center flex-1 pr-3">
                  <View className="w-10 h-10 rounded-full bg-primary-surface dark:bg-primary-dark/30 items-center justify-center mr-3">
                    <Feather
                      name={hotline.iconName}
                      size={18}
                      color="#DC2626"
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-inter-bold text-body text-text-primary dark:text-text-dark-primary"
                      numberOfLines={1}
                    >
                      {hotline.name}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Text className="font-inter-bold text-caption text-primary mr-2">
                        {hotline.number}
                      </Text>
                      <Text className="font-inter text-[11px] text-text-tertiary dark:text-text-dark-tertiary">
                        • {hotline.tag}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                  <Feather name="phone" size={14} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 5. Blood Donation Eligibility & Facts Micro-Guide */}
        <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-3xl p-5 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full bg-info-surface dark:bg-info/20 items-center justify-center mr-2.5">
              <Feather name="info" size={16} color="#2563EB" />
            </View>
            <Text className="font-inter-bold text-body-large text-text-primary dark:text-text-dark-primary">
              Blood Donation Essentials
            </Text>
          </View>

          <View className="gap-2.5">
            <View className="flex-row items-start">
              <Text className="text-primary font-bold mr-2">•</Text>
              <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary flex-1 leading-relaxed">
                <Text className="font-inter-semibold text-text-primary dark:text-text-dark-primary">
                  Age & Weight:
                </Text>{" "}
                Donors must be 18–60 years old and weigh at least 45 kg.
              </Text>
            </View>

            <View className="flex-row items-start">
              <Text className="text-primary font-bold mr-2">•</Text>
              <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary flex-1 leading-relaxed">
                <Text className="font-inter-semibold text-text-primary dark:text-text-dark-primary">
                  Donation Interval:
                </Text>{" "}
                A minimum rest period of 90 days (3 months) is required between
                whole blood donations.
              </Text>
            </View>

            <View className="flex-row items-start">
              <Text className="text-primary font-bold mr-2">•</Text>
              <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary flex-1 leading-relaxed">
                <Text className="font-inter-semibold text-text-primary dark:text-text-dark-primary">
                  Universal Compatibility:
                </Text>{" "}
                O-negative (O-) is the universal donor; AB-positive (AB+) is the
                universal recipient.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
