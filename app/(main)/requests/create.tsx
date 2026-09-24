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
import { AppDateTimePicker } from "@/components/ui/AppDateTimePicker";
import { AppInput } from "@/components/ui/AppInput";
import { BloodGroupSelector } from "@/components/ui/BloodGroupSelector";
import { HospitalSearchInput } from "@/components/ui/HospitalSearchInput";
import { LocationDetector } from "@/components/ui/LocationDetector";
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
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
      neededTime: "12:00",
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
  const selectedNeededDate = watch("neededDate");
  const selectedNeededTime = watch("neededTime");

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
        }
      }

      // 2. Compute exact Needed Date & Time ISO
      let neededDateTimeIso: string;
      try {
        const [hh, mm] = (data.neededTime || "12:00").split(":");
        const combined = new Date(
          `${data.neededDate}T${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00`,
        );
        neededDateTimeIso = isNaN(combined.getTime())
          ? new Date(data.neededDate).toISOString()
          : combined.toISOString();
      } catch {
        neededDateTimeIso = new Date(data.neededDate).toISOString();
      }

      // 3. Create Blood Request in Supabase
      await requestService.createRequest(user.id, {
        patient_name: data.patientName.trim(),
        blood_group: data.bloodGroup,
        hospital_name: data.hospitalName.trim(),
        division: data.division,
        district: data.district,
        area: data.area,
        needed_date_time: neededDateTimeIso,
        urgency: data.urgency,
        contact_number: data.contactNumber.trim(),
        document_image_url: documentUrl,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      });

      // 4. Invalidate TanStack Query requests cache
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
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* Top Header */}
        <View className="px-5 pt-3 pb-3 border-b border-border dark:border-border-dark flex-row items-center justify-between bg-surface dark:bg-surface-dark">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-background dark:bg-background-dark border border-border dark:border-border-dark items-center justify-center mr-3"
          >
            <Feather name="arrow-left" size={20} color="#DC2626" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="font-inter-bold text-h2 text-text-primary dark:text-text-dark-primary">
              Post Blood Request
            </Text>
            <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary">
              Reach emergency donors across Bangladesh
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 60,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {formError ? (
            <ErrorBanner
              message={formError}
              onDismiss={() => setFormError(null)}
              className="mb-5"
            />
          ) : null}

          {/* Section 1: Patient & Medical Info */}
          <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 mb-5 gap-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-surface dark:bg-primary-dark/20 items-center justify-center mr-2.5">
                <Feather name="user" size={16} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary">
                Patient & Hospital Details
              </Text>
            </View>

            <Controller
              control={control}
              name="patientName"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Patient Full Name *"
                  placeholder="e.g. Rahim Uddin"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.patientName?.message}
                />
              )}
            />

            {/* Smart Hospital Search via OpenStreetMap REST API */}
            <Controller
              control={control}
              name="hospitalName"
              render={({ field: { onChange, value } }) => (
                <HospitalSearchInput
                  label="Hospital / Clinic Name *"
                  placeholder="Search e.g. Dhaka Medical, Square, Apollo..."
                  value={value}
                  onChangeText={onChange}
                  error={errors.hospitalName?.message}
                  filterDivision={selectedDivision}
                  onHospitalSelected={(hospital) => {
                    setValue("hospitalName", hospital.name, {
                      shouldValidate: true,
                    });
                    setValue("division", hospital.division);
                    setValue("district", hospital.district);
                    setValue("area", hospital.area);
                    setCoords({
                      latitude: hospital.latitude,
                      longitude: hospital.longitude,
                    });
                  }}
                />
              )}
            />
          </View>

          {/* Section 2: Blood Group & Urgency */}
          <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 mb-5 gap-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-surface dark:bg-primary-dark/20 items-center justify-center mr-2.5">
                <Feather name="activity" size={16} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary">
                Blood Group & Urgency
              </Text>
            </View>

            <BloodGroupSelector
              label="Required Blood Group *"
              selectedGroup={selectedBloodGroup}
              onSelect={(bg) => setValue("bloodGroup", bg)}
              error={errors.bloodGroup?.message}
            />

            <UrgencySelector
              selectedUrgency={selectedUrgency}
              onSelect={(urgency) => setValue("urgency", urgency)}
              error={errors.urgency?.message}
            />
          </View>

          {/* Section 3: Location & Needed Date/Time */}
          <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 mb-5 gap-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-surface dark:bg-primary-dark/20 items-center justify-center mr-2.5">
                <Feather name="map-pin" size={16} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary">
                Location & Schedule
              </Text>
            </View>

            {/* GPS Location Auto-Detector */}
            <LocationDetector
              currentDivision={selectedDivision}
              currentDistrict={selectedDistrict}
              onLocationDetected={(detected) => {
                setValue("division", detected.division);
                setValue("district", detected.district);
                setValue("area", detected.area);
                setCoords({
                  latitude: detected.latitude,
                  longitude: detected.longitude,
                });
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

            <AppDateTimePicker
              label="Needed By Date & Time *"
              dateValue={selectedNeededDate}
              timeValue={selectedNeededTime}
              onDateChange={(d) =>
                setValue("neededDate", d, { shouldValidate: true })
              }
              onTimeChange={(t) =>
                setValue("neededTime", t, { shouldValidate: true })
              }
              dateError={errors.neededDate?.message}
              timeError={errors.neededTime?.message}
              minDate={new Date()}
            />
          </View>

          {/* Section 4: Contact & Medical Document */}
          <View className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 mb-6 gap-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-surface dark:bg-primary-dark/20 items-center justify-center mr-2.5">
                <Feather name="phone" size={16} color="#DC2626" />
              </View>
              <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary">
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
                />
              )}
            />

            <DocumentUploadPicker
              imageUri={selectedDocumentUri}
              onImageSelected={(uri) => setValue("documentImageUri", uri)}
            />
          </View>

          {/* Submit Action Button */}
          <AppButton
            title="Publish Emergency Request"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            className="mb-4"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
