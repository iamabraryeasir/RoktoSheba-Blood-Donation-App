import {
  DialogVariant,
  useDialogStore,
} from "@/features/dialog/useDialogStore";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

const VARIANT_CONFIG: Record<
  DialogVariant,
  {
    iconName: keyof typeof Feather.glyphMap;
    iconColor: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  info: {
    iconName: "info",
    iconColor: "#DC2626",
    bgColor: "bg-primary-surface dark:bg-primary-dark/30",
    borderColor: "border-primary",
  },
  warning: {
    iconName: "alert-triangle",
    iconColor: "#D97706",
    bgColor: "bg-warning-surface dark:bg-warning/20",
    borderColor: "border-warning",
  },
  error: {
    iconName: "alert-circle",
    iconColor: "#DC2626",
    bgColor: "bg-primary-surface dark:bg-primary-dark/30",
    borderColor: "border-critical",
  },
  success: {
    iconName: "check-circle",
    iconColor: "#16A34A",
    bgColor: "bg-success-surface dark:bg-success/20",
    borderColor: "border-success",
  },
};

export const AppDialog: React.FC = () => {
  const {
    isOpen,
    title,
    message,
    variant,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    closeDialog,
  } = useDialogStore();

  if (!isOpen) return null;

  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.info;

  const handleConfirm = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    closeDialog();
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    closeDialog();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        className="flex-1 justify-center items-center px-5"
      >
        <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-3xl p-6 shadow-2xl w-full max-w-sm items-center">
          {/* Icon Header Badge */}
          <View
            className={`w-14 h-14 rounded-full ${config.bgColor} border ${config.borderColor} items-center justify-center mb-3`}
          >
            <Feather
              name={config.iconName}
              size={28}
              color={config.iconColor}
            />
          </View>

          {/* Title */}
          <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary text-center mb-2">
            {title}
          </Text>

          {/* Message Description */}
          <Text className="font-inter text-body text-text-secondary dark:text-text-dark-secondary text-center mb-6 leading-relaxed">
            {message}
          </Text>

          {/* Action Buttons */}
          {cancelText ? (
            <View className="flex-row gap-3 w-full">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCancel}
                className="flex-1 py-3.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-background-dark items-center justify-center"
              >
                <Text className="font-inter-semibold text-body text-text-primary dark:text-text-dark-primary">
                  {cancelText}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleConfirm}
                className="flex-1 py-3.5 rounded-xl bg-primary items-center justify-center shadow-sm"
              >
                <Text className="font-inter-bold text-body text-white">
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleConfirm}
              className="w-full py-3.5 rounded-xl bg-primary items-center justify-center shadow-sm"
            >
              <Text className="font-inter-bold text-body text-white">
                {confirmText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};
