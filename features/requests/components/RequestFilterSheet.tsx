import { AppButton } from "@/components/ui/AppButton";
import { SelectModal } from "@/components/ui/SelectModal";
import {
  BANGLADESH_LOCATIONS,
  DIVISIONS,
} from "@/lib/utils/bangladeshLocations";
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface RequestFilterSheetProps {
  visible: boolean;
  division?: string;
  district?: string;
  onClose: () => void;
  onApply: (filters: { division?: string; district?: string }) => void;
  onReset: () => void;
}

export const RequestFilterSheet: React.FC<RequestFilterSheetProps> = ({
  visible,
  division: initialDivision,
  district: initialDistrict,
  onClose,
  onApply,
  onReset,
}) => {
  const [selectedDivision, setSelectedDivision] = useState(
    initialDivision || "All",
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    initialDistrict || "All",
  );

  const [showDivisionModal, setShowDivisionModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);

  const divisionOptions = useMemo(() => ["All", ...DIVISIONS], []);

  const districtOptions = useMemo(() => {
    if (
      selectedDivision &&
      selectedDivision !== "All" &&
      BANGLADESH_LOCATIONS[selectedDivision]
    ) {
      return ["All", ...Object.keys(BANGLADESH_LOCATIONS[selectedDivision])];
    }
    return ["All"];
  }, [selectedDivision]);

  const handleSelectDivision = (div: string) => {
    setSelectedDivision(div);
    setSelectedDistrict("All");
  };

  const handleApply = () => {
    onApply({
      division: selectedDivision === "All" ? undefined : selectedDivision,
      district: selectedDistrict === "All" ? undefined : selectedDistrict,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedDivision("All");
    setSelectedDistrict("All");
    onReset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View className="bg-surface rounded-t-3xl p-5 pb-8">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-5 pb-3 border-b border-border">
            <Text className="font-inter-bold text-h3 text-text-primary">
              Filter Requests by Location
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Feather name="x" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Division Selector */}
          <View className="mb-4">
            <Text className="font-inter-medium text-caption text-text-secondary mb-1">
              Division
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowDivisionModal(true)}
              className="flex-row items-center justify-between bg-surface border border-border rounded-xl px-3.5 h-12"
            >
              <View className="flex-row items-center">
                <Feather name="compass" size={18} color="#DC2626" />
                <Text className="font-inter text-body text-text-primary ml-2.5">
                  {selectedDivision}
                </Text>
              </View>
              <Feather name="chevron-down" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* District Selector */}
          <View className="mb-6">
            <Text className="font-inter-medium text-caption text-text-secondary mb-1">
              District
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowDistrictModal(true)}
              disabled={selectedDivision === "All"}
              className={`flex-row items-center justify-between bg-surface border border-border rounded-xl px-3.5 h-12 ${
                selectedDivision === "All" ? "opacity-50" : ""
              }`}
            >
              <View className="flex-row items-center">
                <Feather name="map" size={18} color="#DC2626" />
                <Text className="font-inter text-body text-text-primary ml-2.5">
                  {selectedDistrict}
                </Text>
              </View>
              <Feather name="chevron-down" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <AppButton
              title="Reset"
              variant="outline"
              onPress={handleReset}
              className="flex-1"
            />
            <AppButton
              title="Apply Filters"
              onPress={handleApply}
              className="flex-1"
            />
          </View>
        </View>
      </View>

      {/* Division Modal */}
      <SelectModal
        visible={showDivisionModal}
        title="Select Division"
        options={divisionOptions}
        selectedValue={selectedDivision}
        onSelect={handleSelectDivision}
        onClose={() => setShowDivisionModal(false)}
      />

      {/* District Modal */}
      <SelectModal
        visible={showDistrictModal}
        title={`Select District (${selectedDivision})`}
        options={districtOptions}
        selectedValue={selectedDistrict}
        onSelect={setSelectedDistrict}
        onClose={() => setShowDistrictModal(false)}
      />
    </Modal>
  );
};
