import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ErrorBanner } from "@/components/feedback/ErrorBanner";
import { AppButton } from "@/components/ui/AppButton";
import { AppDatePicker } from "@/components/ui/AppDatePicker";
import { AppInput } from "@/components/ui/AppInput";
import { BloodGroupSelector } from "@/components/ui/BloodGroupSelector";
import { LocationSelector } from "@/components/ui/LocationSelector";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { showAppAlert } from "@/features/dialog/useDialogStore";
import {
  DocumentUploadPicker,
  UrgencySelector,
} from "@/features/requests/components";
import { requestKeys } from "@/features/requests/hooks/useRequests";
import {
  CreateRequestFormData,
  createRequestSchema,
} from "@/features/requests/schemas/requestSchema";
import { requestService } from "@/features/requests/services/requestService";
import { queryClient } from "@/lib/queryClient";

export default function CreateRequestScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const defaultDate = new Date().toISOString().split("T")[0];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRequestFormData>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      patientName: "",
      bloodGroup: "O+",
      hospitalName: "",
      division: profile?.division || "Dhaka",
      district: profile?.district || "Dhaka",
      area: profile?.area || "Dhanmondi",
      neededDate: defaultDate,
      urgency: "urgent",
      contactNumber: profile?.phone || "+8801",
      documentImageUri: null,
    },
  });

  const selectedBloodGroup = watch("bloodGroup");
  const selectedUrgency = watch("urgency");
  const selectedDivision = watch("division");
  const selectedDistrict = watch("district");
  const selectedArea = watch("area");
  const selectedDocumentUri = watch("documentImageUri");

  const onSubmit = async (data: CreateRequestFormData) => {
    if (!user?.id) {
      setFormError("You must be logged in to create a blood request.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      let documentUrl: string | null = null;

      // 1. Upload prescription/document image if selected
      if (data.documentImageUri) {
        try {
          documentUrl = await requestService.uploadRequestDocument(
            user.id,
            data.documentImageUri,
          );
        } catch (uploadErr: any) {
          console.warn("Prescription image upload failed:", uploadErr);
          // Non-blocking: proceed with request creation even if optional photo fails
        }
      }

      // 2. Create Blood Request in Supabase
      await requestService.createRequest(user.id, {
        patient_name: data.patientName.trim(),
        blood_group: data.bloodGroup,
        hospital_name: data.hospitalName.trim(),
        division: data.division,
        district: data.district,
        area: data.area,
        needed_date_time: new Date(data.neededDate).toISOString(),
        urgency: data.urgency,
        contact_number: data.contactNumber.trim(),
        document_image_url: documentUrl,
      });

      // 3. Invalidate TanStack Query requests cache
      queryClient.invalidateQueries({ queryKey: requestKeys.all });

      showAppAlert(
        "Request Published",
        "Your emergency blood request is now live. Donors in your area will be notified.",
        "success",
        () => router.replace("/(main)/requests" as any),
      );
    } catch (err: any) {
      console.error("Create request error:", err);
      setFormError(
        err?.message || "Failed to publish blood request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
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
            Create Blood Request
          </Text>
          <View className="w-8" />
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Intro Card */}
          <View className="bg-primary-surface border border-primary rounded-2xl p-4 mb-5 flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-primary items-center justify-center mr-3">
              <Feather name="heart" size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="font-inter-bold text-body-medium text-primary">
                Post an Emergency Request
              </Text>
              <Text className="font-inter text-caption text-text-secondary mt-0.5">
                Reach eligible donors in your district within minutes.
              </Text>
            </View>
          </View>

          {/* Error Banner */}
          <ErrorBanner
            message={formError}
            onDismiss={() => setFormError(null)}
          />

          {/* Section 1: Patient & Hospital */}
          <View className="bg-surface border border-border rounded-2xl p-4 mb-5 gap-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-surface items-center justify-center mr-2.5">
                <Feather name="user" size={16} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary">
                Patient & Hospital Details
              </Text>
            </View>

            <Controller
              control={control}
              name="patientName"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Patient Name *"
                  placeholder="e.g. Rahima Begum"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.patientName?.message}
                  leftIcon={<Feather name="user" size={18} color="#9CA3AF" />}
                />
              )}
            />

            <Controller
              control={control}
              name="hospitalName"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Hospital / Clinic Name *"
                  placeholder="e.g. Dhaka Medical College Hospital"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.hospitalName?.message}
                  leftIcon={
                    <Feather name="activity" size={18} color="#9CA3AF" />
                  }
                />
              )}
            />
          </View>

          {/* Section 2: Blood Group & Urgency */}
          <View className="bg-surface border border-border rounded-2xl p-4 mb-5 gap-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-surface items-center justify-center mr-2.5">
                <Feather name="droplet" size={16} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary">
                Blood Group & Urgency
              </Text>
            </View>

            <BloodGroupSelector
              label="Required Blood Group *"
              selectedGroup={selectedBloodGroup}
              onSelect={(group) => setValue("bloodGroup", group)}
              error={errors.bloodGroup?.message}
            />

            <UrgencySelector
              selectedUrgency={selectedUrgency}
              onSelect={(urgency) => setValue("urgency", urgency)}
              error={errors.urgency?.message}
            />
          </View>

          {/* Section 3: Location & Needed Date */}
          <View className="bg-surface border border-border rounded-2xl p-4 mb-5 gap-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-surface items-center justify-center mr-2.5">
                <Feather name="map-pin" size={16} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary">
                Location & Schedule
              </Text>
            </View>

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
              name="neededDate"
              render={({ field: { onChange, value } }) => (
                <AppDatePicker
                  label="Needed By Date *"
                  value={value}
                  onChange={onChange}
                  minDate={new Date()}
                  error={errors.neededDate?.message}
                />
              )}
            />
          </View>

          {/* Section 4: Contact & Medical Document */}
          <View className="bg-surface border border-border rounded-2xl p-4 mb-6 gap-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-surface items-center justify-center mr-2.5">
                <Feather name="phone" size={16} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary">
                Contact & Verification
              </Text>
            </View>

            <Controller
              control={control}
              name="contactNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Emergency Contact Phone *"
                  placeholder="+8801XXXXXXXXX"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.contactNumber?.message}
                  leftIcon={
                    <Feather name="phone-call" size={18} color="#9CA3AF" />
                  }
                />
              )}
            />

            <DocumentUploadPicker
              imageUri={selectedDocumentUri}
              onImageSelected={(uri) => setValue("documentImageUri", uri)}
            />
          </View>

          {/* Submit Action */}
          <AppButton
            title="Publish Blood Request"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            className="mb-4"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
