import { showAppAlert } from "@/features/dialog/useDialogStore";
import { usePermission } from "@/features/permissions/hooks/usePermission";
import { BANGLADESH_LOCATIONS } from "@/lib/utils/bangladeshLocations";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { PermissionRationaleModal } from "./PermissionRationaleModal";

export interface DetectedLocationResult {
  division: string;
  district: string;
  area: string;
  latitude: number;
  longitude: number;
  formattedAddress?: string;
}

interface LocationDetectorProps {
  onLocationDetected: (result: DetectedLocationResult) => void;
  currentDivision?: string;
  currentDistrict?: string;
}

export function LocationDetector({
  onLocationDetected,
  currentDivision,
  currentDistrict,
}: LocationDetectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [showRationale, setShowRationale] = useState(false);
  const [lastDetected, setLastDetected] = useState<string | null>(null);

  const { status, isGranted, isBlocked, request, openSettings } =
    usePermission("location");

  const matchBangladeshLocation = (
    geo: Location.LocationGeocodedAddress,
    lat: number,
    lng: number,
  ): DetectedLocationResult => {
    const rawDivision = geo.region || geo.subregion || "";
    const rawDistrict = geo.subregion || geo.district || geo.city || "";
    const rawArea = geo.name || geo.street || geo.city || geo.district || "";

    // Match division
    let matchedDivision = "Dhaka";
    const divisionKeys = Object.keys(BANGLADESH_LOCATIONS);
    for (const div of divisionKeys) {
      if (
        rawDivision.toLowerCase().includes(div.toLowerCase()) ||
        rawDistrict.toLowerCase().includes(div.toLowerCase()) ||
        (div === "Chattogram" &&
          (rawDivision.toLowerCase().includes("chittagong") ||
            rawDistrict.toLowerCase().includes("chittagong")))
      ) {
        matchedDivision = div;
        break;
      }
    }

    // Match district within division
    const districtKeys = Object.keys(
      BANGLADESH_LOCATIONS[matchedDivision] || {},
    );
    let matchedDistrict = districtKeys[0] || "Dhaka";
    for (const dist of districtKeys) {
      if (
        rawDistrict.toLowerCase().includes(dist.toLowerCase()) ||
        rawDivision.toLowerCase().includes(dist.toLowerCase()) ||
        rawArea.toLowerCase().includes(dist.toLowerCase())
      ) {
        matchedDistrict = dist;
        break;
      }
    }

    // Match area within district
    const areas =
      BANGLADESH_LOCATIONS[matchedDivision]?.[matchedDistrict] || [];
    let matchedArea = areas[0] || "Sadar";
    for (const area of areas) {
      if (rawArea.toLowerCase().includes(area.toLowerCase())) {
        matchedArea = area;
        break;
      }
    }

    const addressParts = [
      geo.name,
      geo.street,
      geo.subregion,
      geo.region,
      geo.country,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      division: matchedDivision,
      district: matchedDistrict,
      area: matchedArea,
      latitude: lat,
      longitude: lng,
      formattedAddress: addressParts,
    };
  };

  const executeDetection = async () => {
    setIsDetecting(true);
    try {
      // Check if location services (GPS toggle) are active
      const isServiceEnabled = await Location.hasServicesEnabledAsync().catch(
        () => false,
      );
      if (!isServiceEnabled) {
        showAppAlert(
          "Location Service Disabled",
          "Please turn on GPS/Location on your device to auto-detect your hospital or city location.",
          "warning",
        );
        setIsDetecting(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;
      const reverseGeocoded = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocoded.length > 0) {
        const result = matchBangladeshLocation(
          reverseGeocoded[0],
          latitude,
          longitude,
        );
        setLastDetected(
          `${result.division} > ${result.district} (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
        );
        onLocationDetected(result);

        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}

        showAppAlert(
          "Location Detected",
          `Detected location: ${result.area}, ${result.district}, ${result.division}`,
          "success",
        );
      } else {
        onLocationDetected({
          division: currentDivision || "Dhaka",
          district: currentDistrict || "Dhaka",
          area: "Sadar",
          latitude,
          longitude,
        });
      }
    } catch (err: any) {
      console.warn("Location detection failed:", err);
      showAppAlert(
        "Location Detection Failed",
        "Could not obtain current GPS position. You can still select your location manually.",
        "error",
      );
    } finally {
      setIsDetecting(false);
    }
  };

  const handlePressDetect = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    if (isGranted) {
      await executeDetection();
      return;
    }

    if (isBlocked) {
      setShowRationale(true);
      return;
    }

    // Undetermined or denied: show rationale first
    setShowRationale(true);
  };

  const handleGrantPermission = async () => {
    setShowRationale(false);
    const newStatus = await request();
    if (newStatus === "granted") {
      await executeDetection();
    } else if (newStatus === "blocked") {
      showAppAlert(
        "Permission Blocked",
        "Location permission is permanently denied. You can enable it in Device Settings.",
        "warning",
      );
    }
  };

  return (
    <>
      <View className="mb-3">
        <TouchableOpacity
          onPress={handlePressDetect}
          disabled={isDetecting}
          activeOpacity={0.8}
          className="flex-row items-center justify-between bg-primary-surface dark:bg-primary-dark/20 border border-primary/30 rounded-xl px-4 py-3"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-8 h-8 rounded-full bg-primary-light dark:bg-primary-dark/30 items-center justify-center mr-3">
              <Feather name="crosshair" size={16} color="#DC2626" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-inter-bold text-text-primary dark:text-text-dark-primary">
                {isDetecting
                  ? "Detecting current GPS location..."
                  : "Auto-detect Location via GPS"}
              </Text>
              <Text
                className="text-[10px] text-primary dark:text-primary-light font-inter-medium mt-0.5"
                numberOfLines={1}
              >
                {lastDetected
                  ? `Detected: ${lastDetected}`
                  : "Pre-fills Division, District & Coordinates"}
              </Text>
            </View>
          </View>

          {isDetecting ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : (
            <Feather name="navigation" size={16} color="#DC2626" />
          )}
        </TouchableOpacity>
      </View>

      <PermissionRationaleModal
        visible={showRationale}
        type="location"
        status={status}
        onClose={() => setShowRationale(false)}
        onGrant={handleGrantPermission}
        onOpenSettings={openSettings}
      />
    </>
  );
}
