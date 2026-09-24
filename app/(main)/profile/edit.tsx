import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/AppButton";
import { AppDatePicker } from "@/components/ui/AppDatePicker";
import { AppInput } from "@/components/ui/AppInput";
import { BloodGroupSelector } from "@/components/ui/BloodGroupSelector";
import { LocationDetector } from "@/components/ui/LocationDetector";
import { LocationSelector } from "@/components/ui/LocationSelector";
import { PermissionRationaleModal } from "@/components/ui/PermissionRationaleModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { showAppAlert } from "@/features/dialog/useDialogStore";
import { usePermission } from "@/features/permissions/hooks/usePermission";
import { AppPermissionType } from "@/features/permissions/types/permission.types";
import {
  ProfileEditFormData,
  profileEditSchema,
} from "@/features/profile/schemas/profileSchema";
import { profileService } from "@/features/profile/services/profileService";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile?.avatar_url || null,
  );

  // Photo Source & Permission States
  const [showPhotoSourceModal, setShowPhotoSourceModal] = useState(false);
  const [activePermissionType, setActivePermissionType] =
    useState<AppPermissionType | null>(null);

  const cameraPermission = usePermission("camera");
  const mediaLibraryPermission = usePermission("mediaLibrary");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      fullName: profile?.full_name || "",
      phone: profile?.phone || "+8801",
      bloodGroup: profile?.blood_group || "O+",
      dateOfBirth: profile?.date_of_birth || "2000-01-01",
      division: profile?.division || "Dhaka",
      district: profile?.district || "Dhaka",
      area: profile?.area || "Dhanmondi",
      addressDetail: profile?.address_detail || "",
    },
  });

  const selectedDivision = watch("division");
  const selectedDistrict = watch("district");
  const selectedArea = watch("area");
  const selectedBloodGroup = watch("bloodGroup");

  const handleOpenPhotoOptions = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setShowPhotoSourceModal(true);
  };

  const uploadSelectedImage = async (uri: string) => {
    if (!user?.id) return;
    try {
      setIsUploadingAvatar(true);
      const uploadedUrl = await profileService.uploadAvatar(user.id, uri);
      setAvatarUrl(uploadedUrl);
      await refreshProfile();
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      showAppAlert("Success", "Profile photo updated successfully!", "success");
    } catch (err: any) {
      console.error("Pick avatar error:", err);
      showAppAlert(
        "Upload Error",
        err?.message || "Failed to upload photo",
        "error",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLaunchCamera = async () => {
    setShowPhotoSourceModal(false);

    if (cameraPermission.isGranted) {
      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!res.canceled && res.assets?.[0]?.uri) {
        await uploadSelectedImage(res.assets[0].uri);
      }
      return;
    }

    setActivePermissionType("camera");
  };

  const handleLaunchGallery = async () => {
    setShowPhotoSourceModal(false);

    if (mediaLibraryPermission.isGranted) {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!res.canceled && res.assets?.[0]?.uri) {
        await uploadSelectedImage(res.assets[0].uri);
      }
      return;
    }

    setActivePermissionType("mediaLibrary");
  };

  const handleGrantPermission = async () => {
    if (!activePermissionType) return;
    const permHook =
      activePermissionType === "camera"
        ? cameraPermission
        : mediaLibraryPermission;
    const newStatus = await permHook.request();
    const type = activePermissionType;
    setActivePermissionType(null);

    if (newStatus === "granted") {
      if (type === "camera") {
        const res = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        if (!res.canceled && res.assets?.[0]?.uri) {
          await uploadSelectedImage(res.assets[0].uri);
        }
      } else {
        const res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        if (!res.canceled && res.assets?.[0]?.uri) {
          await uploadSelectedImage(res.assets[0].uri);
        }
      }
    } else if (newStatus === "blocked") {
      showAppAlert(
        "Permission Denied",
        `${type === "camera" ? "Camera" : "Photo Library"} permission is blocked. Please allow access in Device Settings.`,
        "warning",
      );
    }
  };

  const onSubmit = async (data: ProfileEditFormData) => {
    if (!user?.id) return;
    setIsSubmitting(true);
    try {
      await profileService.updateProfile(user.id, {
        full_name: data.fullName.trim(),
        phone: data.phone.trim(),
        blood_group: data.bloodGroup,
        date_of_birth: data.dateOfBirth,
        division: data.division,
        district: data.district,
        area: data.area,
        address_detail: data.addressDetail?.trim() || null,
      });
      await refreshProfile();
      showAppAlert(
        "Saved",
        "Your profile details have been updated.",
        "success",
      );
      router.back();
    } catch (err: any) {
      console.error("Update profile error:", err);
      showAppAlert(
        "Save Failed",
        err?.message || "Failed to update profile",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const activePermHook =
    activePermissionType === "camera"
      ? cameraPermission
      : mediaLibraryPermission;

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
      edges={["top"]}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-variant dark:bg-border-dark items-center justify-center"
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="font-inter-bold text-h2 text-text-primary dark:text-text-dark-primary">
          Edit Profile
        </Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View className="items-center mb-6">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenPhotoOptions}
              className="relative"
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-24 h-24 rounded-full border-4 border-primary"
                />
              ) : (
                <View className="w-24 h-24 rounded-full bg-primary-surface dark:bg-primary-950/60 border-4 border-primary items-center justify-center">
                  <Text className="font-inter-bold text-display text-primary">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </Text>
                </View>
              )}

              {/* Camera Badge Overlay */}
              <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary items-center justify-center border-2 border-background dark:border-background-dark shadow-md">
                {isUploadingAvatar ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Feather name="camera" size={16} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
            <Text className="font-inter-medium text-caption text-primary dark:text-primary-400 mt-2">
              {isUploadingAvatar ? "Uploading photo..." : "Tap to Change Photo"}
            </Text>
          </View>

          {/* Section 1: Personal Details */}
          <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 mb-5 gap-4">
            <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary mb-1">
              Personal Information
            </Text>

            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Full Name *"
                  placeholder="Enter full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fullName?.message}
                  leftIcon={<Feather name="user" size={18} color="#9CA3AF" />}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Phone Number *"
                  placeholder="+8801XXXXXXXXX"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  leftIcon={<Feather name="phone" size={18} color="#9CA3AF" />}
                />
              )}
            />

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, value } }) => (
                <AppDatePicker
                  label="Date of Birth *"
                  value={value}
                  onChange={onChange}
                  error={errors.dateOfBirth?.message}
                />
              )}
            />
          </View>

          {/* Section 2: Blood Group */}
          <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 mb-5">
            <BloodGroupSelector
              selectedGroup={selectedBloodGroup}
              onSelect={(group) => setValue("bloodGroup", group)}
              error={errors.bloodGroup?.message}
            />
          </View>

          {/* Section 3: Location */}
          <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 mb-6 gap-3.5">
            <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary mb-1">
              Location Details
            </Text>

            {/* GPS Auto Detector */}
            <LocationDetector
              currentDivision={selectedDivision}
              currentDistrict={selectedDistrict}
              onLocationDetected={(detected) => {
                setValue("division", detected.division);
                setValue("district", detected.district);
                setValue("area", detected.area);
                if (detected.formattedAddress && !watch("addressDetail")) {
                  setValue("addressDetail", detected.formattedAddress);
                }
              }}
            />

            <LocationSelector
              division={selectedDivision}
              district={selectedDistrict}
              area={selectedArea}
              onLocationChange={({ division, district, area }) => {
                setValue("division", division);
                setValue("district", district);
                setValue("area", area);
              }}
              errors={{
                division: errors.division?.message,
                district: errors.district?.message,
                area: errors.area?.message,
              }}
            />

            <Controller
              control={control}
              name="addressDetail"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Detailed Address (Optional)"
                  placeholder="House, Street, Hospital or Landmark"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  leftIcon={<Feather name="home" size={18} color="#9CA3AF" />}
                />
              )}
            />
          </View>

          {/* Submit Button */}
          <AppButton
            title="Save Profile Changes"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            className="mb-4"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Photo Source Modal (Camera vs Gallery) */}
      <Modal
        visible={showPhotoSourceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoSourceModal(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setShowPhotoSourceModal(false)}
        >
          <View className="flex-1 bg-black/60 items-center justify-end p-4">
            <TouchableWithoutFeedback>
              <View className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-2xl border border-border-light dark:border-border-dark">
                <Text className="text-base font-bold text-gray-900 dark:text-text-dark-primary text-center mb-1">
                  Change Profile Photo
                </Text>
                <Text className="text-xs text-gray-500 dark:text-text-dark-secondary text-center mb-4">
                  Take a new selfie or select an existing photo
                </Text>

                {/* Camera */}
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
                      Use front or back camera
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {/* Gallery */}
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
                      Select photo from your phone gallery
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {/* Cancel */}
                <TouchableOpacity
                  onPress={() => setShowPhotoSourceModal(false)}
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

      {/* Permission Rationale Modal */}
      {activePermissionType && (
        <PermissionRationaleModal
          visible={!!activePermissionType}
          type={activePermissionType}
          status={activePermHook.status}
          onClose={() => setActivePermissionType(null)}
          onGrant={handleGrantPermission}
          onOpenSettings={activePermHook.openSettings}
        />
      )}
    </SafeAreaView>
  );
}
