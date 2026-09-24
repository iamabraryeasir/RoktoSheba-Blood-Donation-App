import { adminService } from "@/features/admin/services/adminService";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  reporterId?: string;
  targetType: "user" | "request";
  targetId: string;
  targetTitle?: string;
  onSuccess?: () => void;
}

const REQUEST_REASONS = [
  "Fake or fraudulent request",
  "Demanding financial payment",
  "Wrong / unreachable phone number",
  "Already fulfilled elsewhere",
  "Inappropriate or abusive information",
];

const DONOR_REASONS = [
  "Demanding money/payment for donation",
  "Fake / wrong phone number",
  "Abusive behavior or harassment",
  "Ineligible but listed as available",
  "Other suspicious activity",
];

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  reporterId,
  targetType,
  targetId,
  targetTitle,
  onSuccess,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customNotes, setCustomNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!visible) return null;

  const presets = targetType === "request" ? REQUEST_REASONS : DONOR_REASONS;

  const handleClose = () => {
    setSelectedReason("");
    setCustomNotes("");
    setErrorMsg(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!reporterId) {
      setErrorMsg("You must be logged in to submit a report.");
      return;
    }

    const finalReason = selectedReason
      ? customNotes.trim()
        ? `${selectedReason}: ${customNotes.trim()}`
        : selectedReason
      : customNotes.trim();

    if (!finalReason) {
      setErrorMsg("Please select a reason or provide an explanation.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await adminService.submitReport({
        reporterId,
        targetType,
        targetId,
        reason: finalReason,
      });

      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(
        err?.message || "Failed to submit report. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        className="flex-1 justify-center items-center px-5"
      >
        <View className="bg-surface border border-border rounded-3xl p-6 shadow-2xl w-full max-w-sm">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-warning-surface items-center justify-center mr-2.5">
                <Feather name="flag" size={18} color="#D97706" />
              </View>
              <View>
                <Text className="font-inter-bold text-h3 text-text-primary">
                  Report {targetType === "request" ? "Request" : "Donor"}
                </Text>
                <Text
                  className="font-inter text-caption text-text-secondary"
                  numberOfLines={1}
                >
                  {targetTitle || "Help us keep RoktoSheba safe"}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleClose} className="p-1">
              <Feather name="x" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Reason Presets */}
          <Text className="font-inter-medium text-caption text-text-tertiary mb-2">
            Why are you reporting this?
          </Text>

          <View className="gap-1.5 mb-3">
            {presets.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <TouchableOpacity
                  key={reason}
                  activeOpacity={0.7}
                  onPress={() => setSelectedReason(isSelected ? "" : reason)}
                  className={`px-3 py-2 rounded-xl border flex-row items-center justify-between ${
                    isSelected
                      ? "bg-primary-surface border-primary"
                      : "bg-background border-border"
                  }`}
                >
                  <Text
                    className={`font-inter-medium text-[12px] flex-1 ${
                      isSelected ? "text-primary" : "text-text-primary"
                    }`}
                  >
                    {reason}
                  </Text>
                  {isSelected ? (
                    <Feather name="check" size={14} color="#DC2626" />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Additional details */}
          <TextInput
            placeholder="Additional details (optional)..."
            placeholderTextColor="#9CA3AF"
            value={customNotes}
            onChangeText={setCustomNotes}
            multiline
            numberOfLines={2}
            className="bg-background border border-border rounded-xl p-3 font-inter text-caption text-text-primary mb-3 min-h-[60px]"
            textAlignVertical="top"
          />

          {errorMsg ? (
            <Text className="font-inter text-caption text-critical mb-3">
              {errorMsg}
            </Text>
          ) : null}

          {/* Action Buttons */}
          <View className="flex-row gap-2.5">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl border border-border bg-background items-center justify-center"
            >
              <Text className="font-inter-semibold text-caption text-text-secondary">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-critical items-center justify-center shadow-sm"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="font-inter-bold text-caption text-white">
                  Submit Report
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
