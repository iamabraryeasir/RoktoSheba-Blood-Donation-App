import { AppButton } from "@/components/ui/AppButton";
import { AppDatePicker } from "@/components/ui/AppDatePicker";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface LogDonationModalProps {
  visible: boolean;
  initialDate?: string | null;
  onClose: () => void;
  onSave: (date: string) => Promise<void>;
  isLoading?: boolean;
}

export const LogDonationModal: React.FC<LogDonationModalProps> = ({
  visible,
  initialDate,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    initialDate || new Date().toISOString().split("T")[0],
  );

  const handleSave = async () => {
    await onSave(selectedDate);
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
          <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-border">
            <Text className="font-inter-bold text-h3 text-text-primary">
              Log Donation Date
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Feather name="x" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text className="font-inter text-body text-text-secondary mb-4">
            Select the date of your most recent blood donation to track your
            eligibility for future donations.
          </Text>

          <View className="mb-6">
            <AppDatePicker
              label="Last Donation Date"
              value={selectedDate}
              onChange={setSelectedDate}
              maxDate={new Date()}
            />
          </View>

          <AppButton
            title="Save Donation Date"
            onPress={handleSave}
            loading={isLoading}
          />
        </View>
      </View>
    </Modal>
  );
};
