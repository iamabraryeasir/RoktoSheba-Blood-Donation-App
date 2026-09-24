import { useHospitalSearch } from "@/features/hospitals/hooks/useHospitalSearch";
import { HospitalPlace } from "@/features/hospitals/types/hospital.types";
import { useTheme } from "@/features/theme/useThemeStore";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface HospitalSearchInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onHospitalSelected?: (hospital: HospitalPlace) => void;
  error?: string;
  filterDivision?: string;
}

export function HospitalSearchInput({
  label = "Hospital / Clinic Name *",
  placeholder = "Search e.g. Dhaka Medical, Square, Apollo...",
  value,
  onChangeText,
  onHospitalSelected,
  error,
  filterDivision,
}: HospitalSearchInputProps) {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: suggestions = [], isFetching } = useHospitalSearch(
    value,
    filterDivision,
  );

  const handleSelect = (item: HospitalPlace) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    onChangeText(item.name);
    setShowDropdown(false);

    if (onHospitalSelected) {
      onHospitalSelected(item);
    }
  };

  const handleClear = () => {
    onChangeText("");
    setShowDropdown(false);
  };

  return (
    <View style={{ marginBottom: 8, position: "relative", zIndex: 50 }}>
      {/* Label and Live API Badge */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: isDark ? "#F8FAFC" : "#0F172A",
          }}
        >
          {label}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark ? "#450A0A" : "#FEF2F2",
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: "#DC2626",
          }}
        >
          <Feather name="globe" size={10} color="#DC2626" />
          <Text
            style={{
              fontSize: 10,
              fontWeight: "700",
              color: "#DC2626",
              marginLeft: 4,
            }}
          >
            Live OSM API
          </Text>
        </View>
      </View>

      {/* Input Field */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          borderWidth: 1,
          borderColor: error
            ? "#DC2626"
            : isFocused
              ? "#DC2626"
              : isDark
                ? "#334155"
                : "#CBD5E1",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        <Feather name="plus-square" size={18} color="#DC2626" />

        <TextInput
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (!showDropdown && text.length > 0) {
              setShowDropdown(true);
            }
          }}
          onFocus={() => {
            setIsFocused(true);
            if (value.length > 0 || suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          onBlur={() => {
            setIsFocused(false);
            // Small delay to allow tap on dropdown items
            setTimeout(() => setShowDropdown(false), 250);
          }}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          style={{
            flex: 1,
            fontSize: 14,
            color: isDark ? "#F8FAFC" : "#0F172A",
            marginLeft: 8,
          }}
        />

        {/* Loading Indicator or Clear Button */}
        {isFetching ? (
          <ActivityIndicator
            size="small"
            color="#DC2626"
            style={{ marginLeft: 8 }}
          />
        ) : value ? (
          <TouchableOpacity
            onPress={handleClear}
            activeOpacity={0.7}
            style={{ padding: 4 }}
          >
            <Feather name="x-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      {error && (
        <Text style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>
          {error}
        </Text>
      )}

      {/* Autocomplete Dropdown List */}
      {showDropdown && suggestions.length > 0 && (
        <View
          style={{
            marginTop: 6,
            backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isDark ? "#334155" : "#E2E8F0",
            overflow: "hidden",
            maxHeight: 220,
          }}
        >
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
              borderBottomWidth: 1,
              borderBottomColor: isDark ? "#334155" : "#E2E8F0",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: isDark ? "#94A3B8" : "#64748B",
              }}
            >
              Verified Hospitals & Blood Banks
            </Text>
            <Text style={{ fontSize: 10, color: "#9CA3AF" }}>
              Tap to auto-fill location
            </Text>
          </View>

          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? "#334155" : "#F1F5F9",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    backgroundColor: item.isBloodBank
                      ? isDark
                        ? "#450A0A"
                        : "#FEF2F2"
                      : isDark
                        ? "#172554"
                        : "#EFF6FF",
                  }}
                >
                  <Feather
                    name={item.isBloodBank ? "droplet" : "activity"}
                    size={16}
                    color={item.isBloodBank ? "#DC2626" : "#2563EB"}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: isDark ? "#F8FAFC" : "#0F172A",
                        marginRight: 6,
                      }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    {item.isBloodBank && (
                      <View
                        style={{
                          backgroundColor: isDark ? "#450A0A" : "#FEF2F2",
                          paddingHorizontal: 6,
                          paddingVertical: 1,
                          borderRadius: 4,
                          borderWidth: 1,
                          borderColor: "#DC2626",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 9,
                            fontWeight: "700",
                            color: "#DC2626",
                          }}
                        >
                          Blood Bank
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={{
                      fontSize: 11,
                      color: isDark ? "#94A3B8" : "#64748B",
                      marginTop: 2,
                    }}
                    numberOfLines={1}
                  >
                    📍 {item.area}, {item.district}, {item.division}
                  </Text>
                </View>

                <Feather name="arrow-up-left" size={14} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
