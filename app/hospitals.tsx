import { showAppAlert } from "@/features/dialog/useDialogStore";
import { useHospitalSearch } from "@/features/hospitals/hooks/useHospitalSearch";
import { HospitalPlace } from "@/features/hospitals/types/hospital.types";
import { useTheme } from "@/features/theme/useThemeStore";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BANGLADESH_DIVISIONS = [
  "All",
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

export default function HospitalsDirectoryScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("All");

  const activeDivisionFilter =
    selectedDivision === "All" ? undefined : selectedDivision;

  const { data: hospitals = [], isFetching } = useHospitalSearch(
    searchTerm,
    activeDivisionFilter,
  );

  const handleCall = (phone?: string) => {
    if (!phone) {
      showAppAlert(
        "No Phone Available",
        "Contact phone number is not available for this facility.",
        "info",
      );
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() => {
      showAppAlert("Error", "Unable to place call on this device.", "error");
    });
  };

  const handlePostRequestForHospital = (_hospital: HospitalPlace) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    router.push({
      pathname: "/(main)/requests/create" as any,
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
      }}
      edges={["top"]}
    >
      {/* Top Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#334155" : "#E2E8F0",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark ? "#0F172A" : "#FEF2F2",
            borderWidth: 1,
            borderColor: isDark ? "#334155" : "#FCA5A5",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Feather name="arrow-left" size={20} color="#DC2626" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: isDark ? "#F8FAFC" : "#0F172A",
                marginRight: 8,
              }}
            >
              Hospitals & Blood Banks
            </Text>
            <View
              style={{
                backgroundColor: isDark ? "#450A0A" : "#FEF2F2",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 9999,
                borderWidth: 1,
                borderColor: "#DC2626",
                flexDirection: "row",
                alignItems: "center",
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
                REST API
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B" }}>
            Emergency transfusion centers & hospital directory
          </Text>
        </View>
      </View>

      {/* Search Bar & Division Filters */}
      <View
        style={{
          padding: 16,
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#334155" : "#E2E8F0",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
            borderWidth: 1,
            borderColor: isDark ? "#334155" : "#E2E8F0",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}
        >
          <Feather name="search" size={18} color="#DC2626" />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search hospital by name, road or area..."
            placeholderTextColor="#9CA3AF"
            style={{
              flex: 1,
              fontSize: 14,
              color: isDark ? "#F8FAFC" : "#0F172A",
              marginLeft: 8,
            }}
          />
          {isFetching ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : searchTerm ? (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <Feather name="x-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Division Filter Chips (Direct styling to prevent NativeWind CSS interop race condition) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
          contentContainerStyle={{ paddingRight: 10 }}
        >
          {BANGLADESH_DIVISIONS.map((div) => {
            const isSelected = selectedDivision === div;
            return (
              <TouchableOpacity
                key={div}
                activeOpacity={0.75}
                onPress={() => {
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch {}
                  setSelectedDivision(div);
                }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 9999,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: isSelected
                    ? "#DC2626"
                    : isDark
                      ? "#334155"
                      : "#CBD5E1",
                  backgroundColor: isSelected
                    ? "#DC2626"
                    : isDark
                      ? "#1E293B"
                      : "#FFFFFF",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: isSelected ? "700" : "500",
                    color: isSelected
                      ? "#FFFFFF"
                      : isDark
                        ? "#F8FAFC"
                        : "#1E293B",
                  }}
                >
                  {div}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results List */}
      <FlatList
        data={hospitals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isFetching ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 64,
                paddingHorizontal: 16,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: isDark ? "#450A0A" : "#FEF2F2",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Feather name="map-pin" size={28} color="#DC2626" />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: isDark ? "#F8FAFC" : "#0F172A",
                  textAlign: "center",
                }}
              >
                No Facilities Found
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: isDark ? "#94A3B8" : "#64748B",
                  textAlign: "center",
                  marginTop: 4,
                  maxWidth: 240,
                }}
              >
                Try searching with a broader hospital name or switch to
                &quot;All&quot; divisions.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
              borderColor: isDark ? "#334155" : "#E2E8F0",
              borderWidth: 1,
              borderRadius: 16,
              padding: 16,
              marginBottom: 14,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                  marginRight: 8,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
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
                    name={item.isBloodBank ? "droplet" : "plus-square"}
                    size={20}
                    color={item.isBloodBank ? "#DC2626" : "#2563EB"}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: isDark ? "#F8FAFC" : "#0F172A",
                      marginRight: 4,
                    }}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: "#DC2626",
                      marginTop: 2,
                    }}
                  >
                    {item.division} • {item.district} ({item.area})
                  </Text>
                </View>
              </View>

              {item.isBloodBank && (
                <View
                  style={{
                    backgroundColor: isDark ? "#450A0A" : "#FEF2F2",
                    borderColor: "#DC2626",
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 9999,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
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
                fontSize: 12,
                color: isDark ? "#94A3B8" : "#64748B",
                marginTop: 10,
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              📍 {item.address}
            </Text>

            {/* Coordinates & Actions */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 14,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: isDark ? "#334155" : "#E2E8F0",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: isDark ? "#334155" : "#E2E8F0",
                }}
              >
                <Feather name="compass" size={12} color="#DC2626" />
                <Text
                  style={{
                    fontSize: 11,
                    color: isDark ? "#94A3B8" : "#64748B",
                    marginLeft: 6,
                    fontFamily: "monospace",
                  }}
                >
                  {item.latitude.toFixed(3)}, {item.longitude.toFixed(3)}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {item.phone && (
                  <TouchableOpacity
                    onPress={() => handleCall(item.phone)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: isDark ? "#052e16" : "#F0FDF4",
                      borderWidth: 1,
                      borderColor: isDark ? "#166534" : "#BBF7D0",
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 12,
                      marginRight: 8,
                    }}
                  >
                    <Feather name="phone-call" size={13} color="#16A34A" />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#16A34A",
                        marginLeft: 6,
                      }}
                    >
                      Call
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => handlePostRequestForHospital(item)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#DC2626",
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 12,
                  }}
                >
                  <Feather name="plus-circle" size={13} color="#FFFFFF" />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: "#FFFFFF",
                      marginLeft: 6,
                    }}
                  >
                    Request Blood
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
