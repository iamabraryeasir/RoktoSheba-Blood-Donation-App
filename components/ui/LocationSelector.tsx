import {
  BANGLADESH_LOCATIONS,
  DIVISIONS,
} from "@/lib/utils/bangladeshLocations";
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SelectModal } from "./SelectModal";

interface LocationSelectorProps {
  division: string;
  district: string;
  area: string;
  onLocationChange: (location: {
    division: string;
    district: string;
    area: string;
  }) => void;
  errors?: {
    division?: string;
    district?: string;
    area?: string;
  };
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  division,
  district,
  area,
  onLocationChange,
  errors,
  className = "",
}) => {
  const [showDivisionModal, setShowDivisionModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);

  // Available districts based on selected division
  const availableDistricts = useMemo(() => {
    if (division && BANGLADESH_LOCATIONS[division]) {
      return Object.keys(BANGLADESH_LOCATIONS[division]);
    }
    return ["Dhaka"];
  }, [division]);

  // Available areas based on selected division and district
  const availableAreas = useMemo(() => {
    if (
      division &&
      district &&
      BANGLADESH_LOCATIONS[division] &&
      BANGLADESH_LOCATIONS[division][district]
    ) {
      return BANGLADESH_LOCATIONS[division][district];
    }
    return ["Dhanmondi"];
  }, [division, district]);

  const handleSelectDivision = (selectedDiv: string) => {
    const districts = Object.keys(BANGLADESH_LOCATIONS[selectedDiv] || {});
    const firstDistrict = districts[0] || "";
    const areas = BANGLADESH_LOCATIONS[selectedDiv]?.[firstDistrict] || [];
    const firstArea = areas[0] || "";

    onLocationChange({
      division: selectedDiv,
      district: firstDistrict,
      area: firstArea,
    });
  };

  const handleSelectDistrict = (selectedDist: string) => {
    const areas = BANGLADESH_LOCATIONS[division]?.[selectedDist] || [];
    const firstArea = areas[0] || "";

    onLocationChange({
      division,
      district: selectedDist,
      area: firstArea,
    });
  };

  const handleSelectArea = (selectedArea: string) => {
    onLocationChange({
      division,
      district,
      area: selectedArea,
    });
  };

  return (
    <View className={`gap-3.5 ${className}`}>
      {/* Division Selector */}
      <View>
        <Text className="font-inter-medium text-caption text-text-secondary mb-1">
          Division *
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowDivisionModal(true)}
          className={`flex-row items-center justify-between bg-surface border rounded-md px-3.5 h-12 w-full ${
            errors?.division ? "border-critical" : "border-border"
          }`}
        >
          <View className="flex-row items-center flex-1 pr-2">
            <Feather name="compass" size={18} color="#DC2626" />
            <Text
              className="font-inter text-body text-text-primary ml-2.5"
              numberOfLines={1}
            >
              {division || "Select Division"}
            </Text>
          </View>
          <Feather name="chevron-down" size={18} color="#9CA3AF" />
        </TouchableOpacity>
        {errors?.division ? (
          <Text className="font-inter text-caption text-critical mt-1">
            {errors.division}
          </Text>
        ) : null}
      </View>

      {/* District Selector */}
      <View>
        <Text className="font-inter-medium text-caption text-text-secondary mb-1">
          District *
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowDistrictModal(true)}
          className={`flex-row items-center justify-between bg-surface border rounded-md px-3.5 h-12 w-full ${
            errors?.district ? "border-critical" : "border-border"
          }`}
        >
          <View className="flex-row items-center flex-1 pr-2">
            <Feather name="map" size={18} color="#DC2626" />
            <Text
              className="font-inter text-body text-text-primary ml-2.5"
              numberOfLines={1}
            >
              {district || "Select District"}
            </Text>
          </View>
          <Feather name="chevron-down" size={18} color="#9CA3AF" />
        </TouchableOpacity>
        {errors?.district ? (
          <Text className="font-inter text-caption text-critical mt-1">
            {errors.district}
          </Text>
        ) : null}
      </View>

      {/* Area / Upazila Selector */}
      <View>
        <Text className="font-inter-medium text-caption text-text-secondary mb-1">
          Area / Upazila *
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowAreaModal(true)}
          className={`flex-row items-center justify-between bg-surface border rounded-md px-3.5 h-12 w-full ${
            errors?.area ? "border-critical" : "border-border"
          }`}
        >
          <View className="flex-row items-center flex-1 pr-2">
            <Feather name="map-pin" size={18} color="#DC2626" />
            <Text
              className="font-inter text-body text-text-primary ml-2.5"
              numberOfLines={1}
            >
              {area || "Select Area / Upazila"}
            </Text>
          </View>
          <Feather name="chevron-down" size={18} color="#9CA3AF" />
        </TouchableOpacity>
        {errors?.area ? (
          <Text className="font-inter text-caption text-critical mt-1">
            {errors.area}
          </Text>
        ) : null}
      </View>

      {/* Modals */}
      <SelectModal
        visible={showDivisionModal}
        title="Select Division"
        options={DIVISIONS}
        selectedValue={division}
        onSelect={handleSelectDivision}
        onClose={() => setShowDivisionModal(false)}
        placeholder="Search Division..."
      />

      <SelectModal
        visible={showDistrictModal}
        title={`Select District (${division})`}
        options={availableDistricts}
        selectedValue={district}
        onSelect={handleSelectDistrict}
        onClose={() => setShowDistrictModal(false)}
        placeholder="Search District..."
      />

      <SelectModal
        visible={showAreaModal}
        title={`Select Area (${district})`}
        options={availableAreas}
        selectedValue={area}
        onSelect={handleSelectArea}
        onClose={() => setShowAreaModal(false)}
        placeholder="Search Area / Upazila..."
      />
    </View>
  );
};
