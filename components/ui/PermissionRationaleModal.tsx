import {
  AppPermissionStatus,
  AppPermissionType,
  PERMISSION_CONFIGS,
} from "@/features/permissions/types/permission.types";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface PermissionRationaleModalProps {
  visible: boolean;
  type: AppPermissionType;
  status: AppPermissionStatus;
  onClose: () => void;
  onGrant: () => void | Promise<void>;
  onOpenSettings: () => void | Promise<void>;
}

export function PermissionRationaleModal({
  visible,
  type,
  status,
  onClose,
  onGrant,
  onOpenSettings,
}: PermissionRationaleModalProps) {
  const config = PERMISSION_CONFIGS[type];
  const isBlocked = status === "blocked";

  const handleAction = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    if (isBlocked) {
      await onOpenSettings();
      onClose();
    } else {
      await onGrant();
    }
  };

  const handleCancel = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/60 items-center justify-center p-6">
          <TouchableWithoutFeedback>
            <View className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl border border-border-light dark:border-border-dark">
              {/* Header Icon */}
              <View className="items-center mb-4">
                <View className="w-16 h-16 rounded-2xl bg-primary-surface dark:bg-primary-dark/20 items-center justify-center mb-3">
                  <Feather
                    name={config.icon as any}
                    size={32}
                    color="#DC2626"
                  />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-text-dark-primary text-center">
                  {isBlocked ? "Permission Required" : config.title}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-text-dark-secondary text-center mt-1">
                  {config.subtitle}
                </Text>
              </View>

              {/* Description */}
              <View className="bg-gray-50 dark:bg-background-dark/50 rounded-2xl p-4 mb-4 border border-border dark:border-border-dark/60">
                <Text className="text-xs text-gray-600 dark:text-text-dark-secondary leading-relaxed">
                  {isBlocked
                    ? `You previously denied ${type} access with "Don't ask again". To use this feature, please enable it in your device settings.`
                    : config.description}
                </Text>
              </View>

              {/* Benefits Checklist */}
              {!isBlocked && (
                <View className="mb-6 space-y-2">
                  {config.benefits.map((benefit, idx) => (
                    <View
                      key={idx}
                      className="flex-row items-center space-x-2 my-0.5"
                    >
                      <Feather name="check-circle" size={15} color="#16A34A" />
                      <Text className="text-xs text-gray-700 dark:text-text-dark-primary flex-1 ml-2">
                        {benefit}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Action Buttons */}
              <View className="space-y-2.5">
                <TouchableOpacity
                  onPress={handleAction}
                  activeOpacity={0.85}
                  className="w-full bg-primary py-3.5 rounded-xl items-center justify-center flex-row shadow-sm active:bg-primary-hover"
                >
                  <Feather
                    name={isBlocked ? "settings" : "check"}
                    size={16}
                    color="#FFFFFF"
                    className="mr-2"
                  />
                  <Text className="text-white font-bold text-sm ml-2">
                    {isBlocked ? "Open App Settings" : "Allow Access"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCancel}
                  activeOpacity={0.7}
                  className="w-full py-3 rounded-xl items-center justify-center mt-2"
                >
                  <Text className="text-gray-500 dark:text-text-dark-muted font-medium text-xs">
                    Not Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
