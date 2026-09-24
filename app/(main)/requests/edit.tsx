import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
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
import { LocationSelector } from "@/components/ui/LocationSelector";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { showAppAlert } from "@/features/dialog/useDialogStore";
import {
  DocumentUploadPicker,
  UrgencySelector,
} from "@/features/requests/components";
import {
  useRequestDetail,
  useUpdateRequest,
} from "@/features/requests/hooks/useRequests";
import {
  CreateRequestFormData,
  createRequestSchema,
} from "@/features/requests/schemas/requestSchema";
import { requestService } from "@/features/requests/services/requestService";

export default function EditRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: request, isLoading: isFetchingRequest } = useRequestDetail(
    id as string,
  );
  const updateRequestMutation = useUpdateRequest();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateRequestFormData>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      patientName: "",
      bloodGroup: "O+",
      hospitalName: "",
      division: "Dhaka",
      district: "Dhaka",
      area: "Dhanmondi",
      neededDate: new Date().toISOString().split("T")[0],
      neededTime: "12:00",
      urgency: "urgent",
      contactNumber: "+8801",
      documentImageUri: null,
    },
  });

  // Populate form with existing request data
  useEffect(() => {
    if (request) {
      let formattedNeededDate = new Date().toISOString().split("T")[0];
      let formattedNeededTime = "12:00";

      if (request.needed_date_time) {
        try {
          const d = new Date(request.needed_date_time);
          formattedNeededDate = d.toISOString().split("T")[0];
          const hh = String(d.getHours()).padStart(2, "0");
          const mm = String(d.getMinutes()).padStart(2, "0");
          formattedNeededTime = `${hh}:${mm}`;
        } catch {}
      }

      reset({
        patientName: request.patient_name,
        bloodGroup: request.blood_group,
        hospitalName: request.hospital_name,
        division: request.division,
        district: request.district,
        area: request.area,
        neededDate: formattedNeededDate,
        neededTime: formattedNeededTime,
        urgency: request.urgency,
        contactNumber: request.contact_number,
        documentImageUri: request.document_image_url || null,
      });
    }
  }, [request, reset]);

  const selectedBloodGroup = watch("bloodGroup");
  const selectedUrgency = watch("urgency");
  const selectedDivision = watch("division");
  const selectedDistrict = watch("district");
  const selectedArea = watch("area");
  const selectedDocumentUri = watch("documentImageUri");
  const selectedNeededDate = watch("neededDate");
  const selectedNeededTime = watch("neededTime");

  if (isFetchingRequest) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="font-inter text-body text-text-secondary dark:text-text-dark-secondary mt-3">
          Loading request details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!request || (user?.id && request.created_by !== user.id)) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark items-center justify-center p-6">
        <View className="w-16 h-16 rounded-full bg-primary-surface dark:bg-primary-dark/20 items-center justify-center mb-4">
          <Feather name="shield" size={32} color="#DC2626" />
        </View>
        <Text className="font-inter-bold text-h2 text-text-primary dark:text-text-dark-primary mb-2 text-center">
          Unauthorized
        </Text>
        <Text className="font-inter text-body text-text-secondary dark:text-text-dark-secondary text-center mb-6">
          Only the creator of this blood request can make updates.
        </Text>
        <AppButton title="Go Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const onSubmit = async (data: CreateRequestFormData) => {
    if (!user?.id || !request?.id) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      let documentUrl = request.document_image_url;

      // If document uri changed and is a local file uri (starts with file:// or ph://)
      if (
        data.documentImageUri &&
        data.documentImageUri !== request.document_image_url &&
        !data.documentImageUri.startsWith("http")
      ) {
        try {
          documentUrl = await requestService.uploadRequestDocument(
            user.id,
            data.documentImageUri,
          );
        } catch (uploadErr) {
          console.warn("Document re-upload failed:", uploadErr);
        }
      } else if (!data.documentImageUri) {
        documentUrl = null;
      }

      // Compute combined date and time ISO
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

      await updateRequestMutation.mutateAsync({
        id: request.id,
        input: {
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
        },
      });

      showAppAlert(
        "Request Updated",
        "Your blood request details have been updated successfully.",
        "success",
        () => router.back(),
      );
    } catch (err: any) {
      console.error("Update request error:", err);
      setFormError(
        err?.message || "Failed to update blood request. Please try again.",
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
              Edit Blood Request
            </Text>
            <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary">
              Update request details and schedule
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
                  label="Patient Name *"
                  placeholder="e.g. Mohammad Rahman"
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
                    <Feather name="plus-square" size={18} color="#9CA3AF" />
                  }
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
            title="Save Request Changes"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            className="mb-4"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
