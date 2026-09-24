import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  RequestCard,
  RequestFilterSheet,
} from "@/features/requests/components";
import { useRequests } from "@/features/requests/hooks/useRequests";
import { BloodGroupType, UrgencyLevel } from "@/types";

const BLOOD_GROUPS: (BloodGroupType | "All")[] = [
  "All",
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

const URGENCY_FILTERS: { label: string; value: UrgencyLevel | "All" }[] = [
  { label: "All Urgencies", value: "All" },
  { label: "Critical", value: "critical" },
  { label: "Urgent", value: "urgent" },
  { label: "Normal", value: "normal" },
];

export default function RequestsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<
    BloodGroupType | "All"
  >("All");
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel | "All">(
    "All",
  );
  const [selectedDivision, setSelectedDivision] = useState<string | undefined>(
    undefined,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(
    undefined,
  );

  const [showFilterSheet, setShowFilterSheet] = useState(false);

  const activeFiltersCount =
    (selectedBloodGroup !== "All" ? 1 : 0) +
    (selectedUrgency !== "All" ? 1 : 0) +
    (selectedDivision ? 1 : 0) +
    (selectedDistrict ? 1 : 0);

  const {
    data: allRequests,
    isLoading,
    refetch,
    isRefetching,
  } = useRequests({
    bloodGroup: selectedBloodGroup !== "All" ? selectedBloodGroup : undefined,
    urgency: selectedUrgency !== "All" ? selectedUrgency : undefined,
    division: selectedDivision,
    district: selectedDistrict,
    status: "active",
    excludeUserId: user?.id,
  });

  // Client-side text search filter for patient name, hospital, and area
  const filteredRequests = useMemo(() => {
    if (!allRequests) return [];
    if (!searchQuery.trim()) return allRequests;

    const term = searchQuery.toLowerCase().trim();
    return allRequests.filter(
      (req) =>
        req.patient_name.toLowerCase().includes(term) ||
        req.hospital_name.toLowerCase().includes(term) ||
        req.area.toLowerCase().includes(term) ||
        req.district.toLowerCase().includes(term),
    );
  }, [allRequests, searchQuery]);

  const handleClearAllFilters = () => {
    setSelectedBloodGroup("All");
    setSelectedUrgency("All");
    setSelectedDivision(undefined);
    setSelectedDistrict(undefined);
    setSearchQuery("");
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Top Header */}
      <View className="px-5 pt-3 pb-2">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1 pr-3">
            <Text className="font-inter-bold text-h1 text-text-primary dark:text-text-dark-primary">
              Blood Requests
            </Text>
            <Text
              className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary mt-0.5"
              numberOfLines={1}
            >
              Urgent blood needs across Bangladesh
            </Text>
          </View>

          {/* My Requests CTA Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(main)/requests/my-requests")}
            className="bg-primary-surface dark:bg-primary-dark/20 border border-primary px-3 py-2 rounded-xl flex-row items-center shadow-sm shrink-0"
          >
            <Feather name="folder" size={15} color="#DC2626" />
            <Text className="font-inter-semibold text-caption text-primary ml-1.5">
              My Requests
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar & Filter Button */}
        <View className="flex-row items-center gap-2.5 mb-3">
          <View className="flex-1 flex-row items-center bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl px-3.5 h-12 shadow-sm">
            <Feather name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Search patient, hospital, or area..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 font-inter text-body text-text-primary dark:text-text-dark-primary ml-2.5 h-full"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={8}>
                <Feather name="x-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Filter Trigger Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowFilterSheet(true)}
            className={`w-12 h-12 rounded-xl items-center justify-center border shadow-sm ${
              selectedDivision || selectedDistrict
                ? "bg-primary border-primary"
                : "bg-surface dark:bg-surface-dark border-border dark:border-border-dark"
            }`}
          >
            <Feather
              name="sliders"
              size={18}
              color={
                selectedDivision || selectedDistrict ? "#FFFFFF" : "#9CA3AF"
              }
            />
            {selectedDivision || selectedDistrict ? (
              <View className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-critical border-2 border-background dark:border-background-dark items-center justify-center">
                <Text className="font-inter-bold text-[10px] text-white">
                  {(selectedDivision ? 1 : 0) + (selectedDistrict ? 1 : 0)}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        {/* Horizontal Blood Group Filter Pills */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={BLOOD_GROUPS}
          keyExtractor={(item) => item}
          contentContainerStyle={{ gap: 8, paddingBottom: 6 }}
          renderItem={({ item }) => {
            const isSelected = selectedBloodGroup === item;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedBloodGroup(item)}
                className={`px-3.5 py-1.5 rounded-full border ${
                  isSelected
                    ? "bg-primary border-primary"
                    : "bg-surface dark:bg-surface-dark border-border dark:border-border-dark"
                }`}
              >
                <Text
                  className={`font-inter-bold text-caption ${
                    isSelected
                      ? "text-white"
                      : "text-text-secondary dark:text-text-dark-secondary"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Horizontal Urgency Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
          className="mt-1"
        >
          {URGENCY_FILTERS.map((item) => {
            const isSelected = selectedUrgency === item.value;
            let activeBg = "bg-primary border-primary";
            if (item.value === "critical")
              activeBg = "bg-critical border-critical";
            if (item.value === "urgent")
              activeBg = "bg-warning-surface dark:bg-warning/20 border-warning";
            if (item.value === "normal")
              activeBg = "bg-info-surface dark:bg-info/20 border-info";

            let activeText = "text-white";
            if (item.value === "urgent") activeText = "text-warning";
            if (item.value === "normal") activeText = "text-info";

            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.7}
                onPress={() => setSelectedUrgency(item.value)}
                className={`px-3 py-1 rounded-full border ${
                  isSelected
                    ? activeBg
                    : "bg-surface dark:bg-surface-dark border-border dark:border-border-dark"
                }`}
              >
                <Text
                  className={`font-inter-semibold text-[11px] ${
                    isSelected
                      ? activeText
                      : "text-text-secondary dark:text-text-dark-secondary"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Active Location Filter Badges */}
        {selectedDivision || selectedDistrict ? (
          <View className="flex-row flex-wrap items-center gap-1.5 mt-2">
            {selectedDivision ? (
              <View className="bg-primary-surface border border-primary px-2.5 py-0.5 rounded-full flex-row items-center">
                <Text className="font-inter-medium text-[11px] text-primary mr-1">
                  Div: {selectedDivision}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedDivision(undefined)}
                >
                  <Feather name="x" size={12} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ) : null}

            {selectedDistrict ? (
              <View className="bg-primary-surface border border-primary px-2.5 py-0.5 rounded-full flex-row items-center">
                <Text className="font-inter-medium text-[11px] text-primary mr-1">
                  Dist: {selectedDistrict}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedDistrict(undefined)}
                >
                  <Feather name="x" size={12} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity onPress={handleClearAllFilters} className="ml-1">
              <Text className="font-inter-semibold text-[11px] text-critical">
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Requests Feed */}
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 140,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#DC2626"]}
            tintColor="#DC2626"
          />
        }
        ListHeaderComponent={
          !isLoading && filteredRequests.length > 0 ? (
            <Text className="font-inter-semibold text-caption text-text-tertiary dark:text-text-dark-tertiary mb-1">
              Showing {filteredRequests.length} Active{" "}
              {filteredRequests.length === 1 ? "Request" : "Requests"}
            </Text>
          ) : null
        }
        renderItem={({ item }) => <RequestCard request={item} />}
        ListEmptyComponent={
          isLoading ? (
            <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-8 items-center justify-center mt-4">
              <Text className="font-inter text-body text-text-secondary dark:text-text-dark-secondary">
                Loading emergency requests...
              </Text>
            </View>
          ) : (
            <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-3xl p-6 items-center justify-center mt-3 shadow-sm">
              <View className="w-16 h-16 rounded-full bg-primary-surface dark:bg-primary-dark/20 items-center justify-center mb-3">
                <Feather name="droplet" size={30} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary mb-1 text-center">
                {activeFiltersCount > 0
                  ? "No Matching Blood Requests"
                  : "No Active Blood Requests"}
              </Text>
              <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary text-center mb-5 px-3 leading-relaxed">
                {activeFiltersCount > 0
                  ? "Try clearing or adjusting your filters to find requests in other areas."
                  : "There are currently no active emergency blood requests."}
              </Text>

              <View className="flex-row gap-2.5">
                {activeFiltersCount > 0 ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleClearAllFilters}
                    className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark px-4 py-2.5 rounded-xl"
                  >
                    <Text className="font-inter-semibold text-caption text-text-primary dark:text-text-dark-primary">
                      Reset Filters
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push("/(main)/requests/create")}
                  className="bg-primary px-4 py-2.5 rounded-xl flex-row items-center shadow-sm"
                >
                  <Feather name="plus" size={15} color="#FFFFFF" />
                  <Text className="font-inter-semibold text-caption text-white ml-1.5">
                    Create Request
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      />

      {/* Location Filter Modal Sheet */}
      <RequestFilterSheet
        visible={showFilterSheet}
        division={selectedDivision}
        district={selectedDistrict}
        onClose={() => setShowFilterSheet(false)}
        onApply={({ division, district }) => {
          setSelectedDivision(division);
          setSelectedDistrict(district);
        }}
        onReset={handleClearAllFilters}
      />
    </SafeAreaView>
  );
}
