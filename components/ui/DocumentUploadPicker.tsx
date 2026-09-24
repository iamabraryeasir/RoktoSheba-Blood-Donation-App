import { showAppAlert } from "@/features/dialog/useDialogStore";
import { usePermission } from "@/features/permissions/hooks/usePermission";
import { AppPermissionType } from "@/features/permissions/types/permission.types";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { PermissionRationaleModal } from "./PermissionRationaleModal";

export interface DocumentUploadPickerProps {
  label?: string;
  sublabel?: string;
  value?: string | null;
  imageUri?: string | null;
  onChange?: (uri: string | null) => void;
  onImageSelected?: (uri: string | null) => void;
  error?: string;
  className?: string;
}

export function DocumentUploadPicker({
  label = "Hospital Prescription / Requisition Proof",
  sublabel = "Attach medical verification proof (optional)",
  value,
  imageUri,
  onChange,
  onImageSelected,
  error,
  className = "",
}: DocumentUploadPickerProps) {
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [activePermissionType, setActivePermissionType] =
    useState<AppPermissionType | null>(null);

  const currentUri = value ?? imageUri ?? null;

  const handleUpdate = (uri: string | null) => {
    if (onChange) onChange(uri);
    if (onImageSelected) onImageSelected(uri);
  };

  const cameraPermission = usePermission("camera");
  const mediaLibraryPermission = usePermission("mediaLibrary");

  const handleOpenSourcePicker = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setShowSourceModal(true);
  };

  const handleLaunchCamera = async () => {
    setShowSourceModal(false);

    if (cameraPermission.isGranted) {
      await pickFromCamera();
      return;
    }

    setActivePermissionType("camera");
  };

  const pickFromCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
        handleUpdate(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Camera error:", err);
      showAppAlert(
        "Camera Error",
        "Could not open camera on this device.",
        "error",
      );
    }
  };

  const handleLaunchGallery = async () => {
    setShowSourceModal(false);

    if (mediaLibraryPermission.isGranted) {
      await pickFromGallery();
      return;
    }

    setActivePermissionType("mediaLibrary");
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
        handleUpdate(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Gallery error:", err);
      showAppAlert("Gallery Error", "Could not open photo library.", "error");
    }
  };

  const handleGrantActivePermission = async () => {
    if (!activePermissionType) return;
    const currentPerm =
      activePermissionType === "camera"
        ? cameraPermission
        : mediaLibraryPermission;
    const newStatus = await currentPerm.request();
    const type = activePermissionType;
    setActivePermissionType(null);

    if (newStatus === "granted") {
      if (type === "camera") {
        await pickFromCamera();
      } else {
        await pickFromGallery();
      }
    } else if (newStatus === "blocked") {
      showAppAlert(
        "Permission Required",
        `${type === "camera" ? "Camera" : "Photo Library"} access is permanently denied. Please grant it in App Settings.`,
        "warning",
      );
    }
  };

  const handleRemove = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    handleUpdate(null);
  };

  const activePermHook =
    activePermissionType === "camera"
      ? cameraPermission
      : mediaLibraryPermission;

  return (
    <View className={`mb-4 ${className}`}>
      {/* Header labels */}
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-gray-700 dark:text-text-dark-primary">
          {label}
        </Text>
        <Text className="text-[11px] text-gray-400 dark:text-text-dark-muted">
          Optional
        </Text>
      </View>
      {sublabel && (
        <Text className="text-xs text-gray-500 dark:text-text-dark-secondary mb-2">
          {sublabel}
        </Text>
      )}

      {/* Preview Card or Dashed Upload Box */}
      {currentUri ? (
        <View className="relative bg-gray-50 dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-3 flex-row items-center">
          <Image
            source={{ uri: currentUri }}
            className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-800"
            resizeMode="cover"
          />
          <View className="flex-1 ml-3 mr-2">
            <View className="flex-row items-center">
              <Feather name="file-text" size={14} color="#16A34A" />
              <Text
                className="text-xs font-semibold text-gray-900 dark:text-text-dark-primary ml-1.5"
                numberOfLines={1}
              >
                Medical Document Attached
              </Text>
            </View>
            <Text className="text-[11px] text-gray-500 dark:text-text-dark-secondary mt-0.5">
              Verified image ready for upload
            </Text>
            <TouchableOpacity
              onPress={handleOpenSourcePicker}
              className="mt-1"
              activeOpacity={0.7}
            >
              <Text className="text-[11px] font-semibold text-primary-600 dark:text-primary-400">
                Change photo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Remove Button */}
          <TouchableOpacity
            onPress={handleRemove}
            activeOpacity={0.7}
            className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/60 items-center justify-center"
          >
            <Feather name="x" size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleOpenSourcePicker}
          activeOpacity={0.8}
          className="border-2 border-dashed border-gray-300 dark:border-border-dark rounded-2xl p-4 items-center justify-center bg-gray-50/50 dark:bg-surface-dark/40"
        >
          <View className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-950/40 items-center justify-center mb-2">
            <Feather name="upload-cloud" size={22} color="#DC2626" />
          </View>
          <Text className="text-xs font-bold text-gray-800 dark:text-text-dark-primary">
            Upload Prescription / Requisition Slip
          </Text>
          <Text className="text-[11px] text-gray-400 dark:text-text-dark-muted mt-0.5">
            Take photo with Camera or pick from Gallery
          </Text>
        </TouchableOpacity>
      )}

      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}

      {/* Source Choice Modal (Camera vs Gallery) */}
      <Modal
        visible={showSourceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSourceModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSourceModal(false)}>
          <View className="flex-1 bg-black/60 items-center justify-end p-4">
            <TouchableWithoutFeedback>
              <View className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-2xl border border-border-light dark:border-border-dark">
                <Text className="text-base font-bold text-gray-900 dark:text-text-dark-primary text-center mb-1">
                  Select Photo Source
                </Text>
                <Text className="text-xs text-gray-500 dark:text-text-dark-secondary text-center mb-4">
                  Choose how you want to provide your document photo
                </Text>

                {/* Option 1: Camera */}
                <TouchableOpacity
                  onPress={handleLaunchCamera}
                  activeOpacity={0.8}
                  className="flex-row items-center p-3.5 rounded-xl bg-gray-50 dark:bg-background-dark/50 border border-gray-100 dark:border-border-dark mb-2.5"
                >
                  <View className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/60 items-center justify-center mr-3">
                    <Feather name="camera" size={20} color="#DC2626" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-900 dark:text-text-dark-primary">
                      Take Photo
                    </Text>
                    <Text className="text-[11px] text-gray-500 dark:text-text-dark-secondary">
                      Use device camera to snap picture now
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {/* Option 2: Gallery */}
                <TouchableOpacity
                  onPress={handleLaunchGallery}
                  activeOpacity={0.8}
                  className="flex-row items-center p-3.5 rounded-xl bg-gray-50 dark:bg-background-dark/50 border border-gray-100 dark:border-border-dark mb-4"
                >
                  <View className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 items-center justify-center mr-3">
                    <Feather name="image" size={20} color="#2563EB" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-900 dark:text-text-dark-primary">
                      Choose from Gallery
                    </Text>
                    <Text className="text-[11px] text-gray-500 dark:text-text-dark-secondary">
                      Select existing photo from storage
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {/* Cancel */}
                <TouchableOpacity
                  onPress={() => setShowSourceModal(false)}
                  className="py-2.5 items-center justify-center"
                >
                  <Text className="text-xs font-semibold text-gray-500 dark:text-text-dark-muted">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Rationale Modal */}
      {activePermissionType && (
        <PermissionRationaleModal
          visible={!!activePermissionType}
          type={activePermissionType}
          status={activePermHook.status}
          onClose={() => setActivePermissionType(null)}
          onGrant={handleGrantActivePermission}
          onOpenSettings={activePermHook.openSettings}
        />
      )}
    </View>
  );
}
