import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { AppButton } from '@/components/ui/AppButton';
import { AppDatePicker } from '@/components/ui/AppDatePicker';
import { AppInput } from '@/components/ui/AppInput';
import { BloodGroupSelector } from '@/components/ui/BloodGroupSelector';
import { LocationSelector } from '@/components/ui/LocationSelector';
import { ErrorBanner } from '@/components/feedback/ErrorBanner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authService } from '@/features/auth/services/authService';
import { showAppAlert, showAppConfirm } from '@/features/dialog/useDialogStore';
import { BloodGroupType } from '@/types/database.types';

export default function OnboardingScreen() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '+8801');
  const [bloodGroup, setBloodGroup] = useState<BloodGroupType | null>(
    profile?.blood_group || null
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    profile?.date_of_birth || '2000-01-01'
  );
  const [division, setDivision] = useState(profile?.division || 'Dhaka');
  const [district, setDistrict] = useState(profile?.district || 'Dhaka');
  const [area, setArea] = useState(profile?.area || 'Dhanmondi');
  const [isAvailableToDonate, setIsAvailableToDonate] = useState(
    profile?.is_available_to_donate ?? true
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const userAge = useMemo(() => {
    if (!dateOfBirth) return 0;
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  }, [dateOfBirth]);

  const isUnderage = userAge < 18;

  const handleCompleteOnboarding = async () => {
    if (!fullName.trim()) {
      setErrorMessage('Full name is required');
      return;
    }
    if (!phone.trim() || phone.length < 11) {
      setErrorMessage('Please enter a valid Bangladesh phone number (+8801...)');
      return;
    }
    if (!bloodGroup) {
      setErrorMessage('Please select your blood group');
      return;
    }
    if (!dateOfBirth) {
      setErrorMessage('Please select your date of birth');
      return;
    }
    if (!division.trim() || !district.trim() || !area.trim()) {
      setErrorMessage('Please complete all location fields');
      return;
    }

    if (!user?.id) {
      setErrorMessage('User session not found');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await authService.updateProfile(user.id, {
        full_name: fullName.trim(),
        phone: phone.trim(),
        blood_group: bloodGroup,
        date_of_birth: dateOfBirth,
        division: division.trim(),
        district: district.trim(),
        area: area.trim(),
        is_available_to_donate: isUnderage ? false : isAvailableToDonate,
        onboarding_completed: true,
      });

      await refreshProfile();
      // RootNavigationGuard in _layout.tsx will route automatically to (main)
    } catch (err: any) {
      console.error('Onboarding update error:', err);
      setErrorMessage(err?.message || 'Failed to save profile. Please try again.');
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
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 180,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Header */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between">
              <Text className="font-inter-bold text-h1 text-text-primary">
                Complete Your Profile
              </Text>
              <View className="bg-primary-surface border border-primary px-2.5 py-1 rounded-full">
                <Text className="font-inter-semibold text-caption text-primary">
                  Step 1 of 1
                </Text>
              </View>
            </View>
            <Text className="font-inter text-body text-text-secondary mt-1.5">
              Set up your donor profile to coordinate emergency blood requests in your community.
            </Text>
          </View>

          {/* Error Banner */}
          <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

          {/* SECTION 1: Personal Details */}
          <View className="bg-surface border border-border rounded-2xl p-4 mb-5">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full bg-primary-surface items-center justify-center mr-2.5">
                <Feather name="user" size={16} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary">
                Personal Information
              </Text>
            </View>

            <View className="gap-4">
              <AppInput
                label="Full Name *"
                placeholder="e.g. Abrar Ahmed"
                value={fullName}
                onChangeText={setFullName}
                leftIcon={<Feather name="user" size={18} color="#9CA3AF" />}
              />

              <AppInput
                label="Phone Number *"
                placeholder="+8801XXXXXXXXX"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                leftIcon={<Feather name="phone" size={18} color="#9CA3AF" />}
              />

              <AppDatePicker
                label="Date of Birth *"
                value={dateOfBirth}
                onChange={setDateOfBirth}
              />
            </View>
          </View>

          {/* SECTION 2: Blood Group */}
          <View className="bg-surface border border-border rounded-2xl p-4 mb-5">
            <BloodGroupSelector
              selectedGroup={bloodGroup}
              onSelect={setBloodGroup}
            />
          </View>

          {/* SECTION 3: Location Selection */}
          <View className="bg-surface border border-border rounded-2xl p-4 mb-5">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full bg-primary-surface items-center justify-center mr-2.5">
                <Feather name="map-pin" size={16} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary">
                Your Location
              </Text>
            </View>

            <LocationSelector
              division={division}
              district={district}
              area={area}
              onLocationChange={({ division, district, area }) => {
                setDivision(division);
                setDistrict(district);
                setArea(area);
              }}
            />
          </View>

          {/* SECTION 4: Donor Availability */}
          <View className="bg-surface border border-border rounded-2xl p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center flex-wrap gap-2">
                  <Text className="font-inter-bold text-body-large text-text-primary">
                    Available to Donate Blood
                  </Text>
                  {isUnderage ? (
                    <View className="bg-primary-surface border border-critical px-2 py-0.5 rounded-full">
                      <Text className="font-inter-semibold text-[10px] text-critical">
                        Ineligible (Under 18)
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text className="font-inter text-caption text-text-secondary mt-1">
                  {isUnderage
                    ? `You are ${userAge} years old. Donors must be at least 18 years old to be listed as an active donor.`
                    : 'List your profile so patients in your area can discover you during blood emergencies.'}
                </Text>
              </View>
              <Switch
                value={isUnderage ? false : isAvailableToDonate}
                onValueChange={(val) => {
                  if (val && isUnderage) {
                    showAppAlert(
                      'Underage Donor Ineligible',
                      `You are ${userAge} years old. Donors must be at least 18 years old to be listed as an active blood donor.`,
                      'warning'
                    );
                    return;
                  }
                  setIsAvailableToDonate(val);
                }}
                disabled={isUnderage}
                trackColor={{ false: '#E5E7EB', true: '#DC2626' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Submit */}
          <AppButton
            title="Complete Setup & Enter App"
            onPress={handleCompleteOnboarding}
            loading={isSubmitting}
            className="mb-4"
          />

          <AppButton
            title="Sign Out"
            variant="ghost"
            onPress={() => {
              showAppConfirm(
                'Sign Out',
                'Are you sure you want to sign out?',
                signOut,
                undefined,
                'Sign Out',
                'Cancel',
                'warning'
              );
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
