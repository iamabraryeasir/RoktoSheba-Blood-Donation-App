import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { DonorCard } from "@/features/donors/components/DonorCard";
import { DonorFilterSheet } from "@/features/donors/components/DonorFilterSheet";
import { useDonors } from "@/features/donors/hooks/useDonors";
import { BloodGroupType } from "@/types";

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

export default function DonorsScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ bloodGroup?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<
    BloodGroupType | "All"
  >((params.bloodGroup as BloodGroupType) || "All");
  const [selectedDivision, setSelectedDivision] = useState<string | undefined>(
    undefined,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (params.bloodGroup && BLOOD_GROUPS.includes(params.bloodGroup as any)) {
      setSelectedBloodGroup(params.bloodGroup as BloodGroupType);
    }
  }, [params.bloodGroup]);

  const [showFilterSheet, setShowFilterSheet] = useState(false);

  const activeFiltersCount =
    (selectedBloodGroup !== "All" ? 1 : 0) +
    (selectedDivision ? 1 : 0) +
    (selectedDistrict ? 1 : 0);

  const {
    data: donors,
    isLoading,
    refetch,
    isRefetching,
  } = useDonors({
    bloodGroup: selectedBloodGroup,
    division: selectedDivision,
    district: selectedDistrict,
    searchQuery,
    currentUserId: user?.id,
  });

  const handleClearAllFilters = () => {
    setSelectedBloodGroup("All");
    setSelectedDivision(undefined);
    setSelectedDistrict(undefined);
    setSearchQuery("");
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Top Header */}
      <View className="px-5 pt-3 pb-2">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="font-inter-bold text-h1 text-text-primary dark:text-text-dark-primary">
              Find Donors
            </Text>
            <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary mt-0.5">
              Connect with eligible blood donors across Bangladesh
            </Text>
          </View>
        </View>

        {/* Search Bar & Filter Button */}
        <View className="flex-row items-center gap-2.5 mb-3">
          <View className="flex-1 flex-row items-center bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl px-3.5 h-12 shadow-sm">
            <Feather name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Search donor name, area, or district..."
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
              activeFiltersCount > 0
                ? "bg-primary border-primary"
                : "bg-surface dark:bg-surface-dark border-border dark:border-border-dark"
            }`}
          >
            <Feather
              name="sliders"
              size={18}
              color={activeFiltersCount > 0 ? "#FFFFFF" : "#9CA3AF"}
            />
            {activeFiltersCount > 0 ? (
              <View className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-critical border-2 border-background dark:border-background-dark items-center justify-center">
                <Text className="font-inter-bold text-[10px] text-white">
                  {activeFiltersCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        {/* Horizontal Blood Group Pills */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={BLOOD_GROUPS}
          keyExtractor={(item) => item}
          contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
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

        {/* Active Filter Badges */}
        {selectedDivision || selectedDistrict ? (
          <View className="flex-row flex-wrap items-center gap-1.5 mt-2.5">
            {selectedDivision ? (
              <View className="bg-primary-surface border border-primary px-2.5 py-1 rounded-full flex-row items-center">
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
              <View className="bg-primary-surface border border-primary px-2.5 py-1 rounded-full flex-row items-center">
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

      {/* Donors List */}
      <FlatList
        data={donors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
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
          !isLoading && donors && donors.length > 0 ? (
            <Text className="font-inter-semibold text-caption text-text-tertiary dark:text-text-dark-tertiary mb-1">
              Showing {donors.length} Eligible{" "}
              {donors.length === 1 ? "Donor" : "Donors"}
            </Text>
          ) : null
        }
        renderItem={({ item }) => <DonorCard donor={item} />}
        ListEmptyComponent={
          isLoading ? (
            <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-8 items-center justify-center mt-4">
              <Text className="font-inter text-body text-text-secondary dark:text-text-dark-secondary">
                Searching for eligible donors...
              </Text>
            </View>
          ) : (
            <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-8 items-center justify-center mt-4">
              <View className="w-16 h-16 rounded-full bg-primary-surface dark:bg-primary-dark/20 items-center justify-center mb-3">
                <Feather name="user-x" size={32} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary mb-1">
                No Eligible Donors Found
              </Text>
              <Text className="font-inter text-body text-text-secondary dark:text-text-dark-secondary text-center mb-5 px-4">
                We couldn&apos;t find any eligible donors matching your search
                criteria.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleClearAllFilters}
                className="bg-primary px-5 py-2.5 rounded-xl"
              >
                <Text className="font-inter-semibold text-caption-medium text-white">
                  Reset All Filters
                </Text>
              </TouchableOpacity>
            </View>
          )
        }
      />

      {/* Filter Sheet Modal */}
      <DonorFilterSheet
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
