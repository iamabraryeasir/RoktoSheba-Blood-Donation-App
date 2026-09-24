import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';

import { AppButton } from '@/components/ui/AppButton';
import { AppDatePicker } from '@/components/ui/AppDatePicker';
import { AppInput } from '@/components/ui/AppInput';
import { BloodGroupSelector } from '@/components/ui/BloodGroupSelector';
import { LocationSelector } from '@/components/ui/LocationSelector';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  ProfileEditFormData,
  profileEditSchema,
} from '@/features/profile/schemas/profileSchema';
import { profileService } from '@/features/profile/services/profileService';
import { showAppAlert } from '@/features/dialog/useDialogStore';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile?.avatar_url || null
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      fullName: profile?.full_name || '',
      phone: profile?.phone || '+8801',
      bloodGroup: profile?.blood_group || 'O+',
      dateOfBirth: profile?.date_of_birth || '2000-01-01',
      division: profile?.division || 'Dhaka',
      district: profile?.district || 'Dhaka',
      area: profile?.area || 'Dhanmondi',
      addressDetail: profile?.address_detail || '',
    },
  });

  const selectedDivision = watch('division');
  const selectedDistrict = watch('district');
  const selectedArea = watch('area');
  const selectedBloodGroup = watch('bloodGroup');

  const handlePickAvatar = async () => {
    if (!user?.id) return;

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showAppAlert(
          'Permission Denied',
          'Media library permission is required to change profile photo.',
          'warning'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setIsUploadingAvatar(true);
        const uploadedUrl = await profileService.uploadAvatar(
          user.id,
          result.assets[0].uri
        );
        setAvatarUrl(uploadedUrl);
        await refreshProfile();
        showAppAlert('Success', 'Profile photo updated successfully!', 'success');
      }
    } catch (err: any) {
      console.error('Pick avatar error:', err);
      showAppAlert('Upload Error', err?.message || 'Failed to upload photo', 'error');
    } finally {
      setIsUploadingAvatar(false);
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
        'Profile Saved',
        'Your profile details have been updated.',
        'success',
        () => router.back()
      );
    } catch (err: any) {
      console.error('Update profile error:', err);
      showAppAlert('Error', err?.message || 'Failed to update profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        {/* Top Header */}
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-border">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            className="p-2 -ml-2"
          >
            <Feather name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="font-inter-bold text-h3 text-text-primary">
            Edit Profile
          </Text>
          <View className="w-8" />
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Edit Section */}
          <View className="items-center mb-6">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePickAvatar}
              className="relative"
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-24 h-24 rounded-full border-4 border-primary"
                />
              ) : (
                <View className="w-24 h-24 rounded-full bg-primary-surface border-4 border-primary items-center justify-center">
                  <Text className="font-inter-bold text-display text-primary">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
              )}

              {/* Camera Badge Overlay */}
              <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary items-center justify-center border-2 border-background shadow-md">
                {isUploadingAvatar ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Feather name="camera" size={16} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
            <Text className="font-inter-medium text-caption text-primary mt-2">
              {isUploadingAvatar ? 'Uploading photo...' : 'Tap to Change Photo'}
            </Text>
          </View>

          {/* Section 1: Personal Details */}
          <View className="bg-surface border border-border rounded-2xl p-4 mb-5 gap-4">
            <Text className="font-inter-bold text-h3 text-text-primary mb-1">
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
          <View className="bg-surface border border-border rounded-2xl p-4 mb-5">
            <BloodGroupSelector
              selectedGroup={selectedBloodGroup}
              onSelect={(group) => setValue('bloodGroup', group)}
              error={errors.bloodGroup?.message}
            />
          </View>

          {/* Section 3: Location */}
          <View className="bg-surface border border-border rounded-2xl p-4 mb-6 gap-3.5">
            <Text className="font-inter-bold text-h3 text-text-primary mb-1">
              Location Details
            </Text>

            <LocationSelector
              division={selectedDivision}
              district={selectedDistrict}
              area={selectedArea}
              onLocationChange={({ division, district, area }) => {
                setValue('division', division);
                setValue('district', district);
                setValue('area', area);
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
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  leftIcon={<Feather name="home" size={18} color="#9CA3AF" />}
                />
              )}
            />
          </View>

          {/* Submit */}
          <AppButton
            title="Save Profile Changes"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            className="mb-4"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
