import { showAppAlert } from "@/features/dialog/useDialogStore";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface DocumentUploadPickerProps {
  imageUri?: string | null;
  onImageSelected: (uri: string | null) => void;
  className?: string;
}

export const DocumentUploadPicker: React.FC<DocumentUploadPickerProps> = ({
  imageUri,
  onImageSelected,
  className = "",
}) => {
  const handlePickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showAppAlert(
          "Permission Required",
          "Media library permission is needed to upload prescription/medical document photos.",
          "warning",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (err: any) {
      console.error("Pick document error:", err);
      showAppAlert("Error", err?.message || "Failed to select image", "error");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        showAppAlert(
          "Permission Required",
          "Camera permission is needed to capture prescription photos.",
          "warning",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (err: any) {
      console.error("Take photo error:", err);
      showAppAlert("Error", err?.message || "Failed to capture photo", "error");
    }
  };

  return (
    <View className={className}>
      <Text className="font-inter-medium text-caption text-text-secondary mb-1">
        Prescription / Requisition Proof (Optional)
      </Text>
      <Text className="font-inter text-[11px] text-text-tertiary mb-2.5">
        Upload a hospital document or doctor&apos;s slip to increase donor trust
      </Text>

      {imageUri ? (
        <View className="relative rounded-2xl overflow-hidden border border-border bg-surface">
          <Image
            source={{ uri: imageUri }}
            className="w-full h-44"
            resizeMode="cover"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onImageSelected(null)}
            className="absolute top-2.5 right-2.5 p-2 rounded-full"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          >
            <Feather name="trash-2" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row gap-3">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePickImage}
            className="flex-1 bg-surface border border-dashed border-border rounded-2xl p-4 items-center justify-center"
          >
            <View className="w-10 h-10 rounded-full bg-primary-surface items-center justify-center mb-1.5">
              <Feather name="image" size={18} color="#DC2626" />
            </View>
            <Text className="font-inter-semibold text-caption text-text-primary">
              Choose from Gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleTakePhoto}
            className="flex-1 bg-surface border border-dashed border-border rounded-2xl p-4 items-center justify-center"
          >
            <View className="w-10 h-10 rounded-full bg-primary-surface items-center justify-center mb-1.5">
              <Feather name="camera" size={18} color="#DC2626" />
            </View>
            <Text className="font-inter-semibold text-caption text-text-primary">
              Take Photo
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
