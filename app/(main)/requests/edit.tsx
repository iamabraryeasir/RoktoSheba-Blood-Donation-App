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
      urgency: "urgent",
      contactNumber: "+8801",
      documentImageUri: null,
    },
  });

  // Populate form with existing request data
  useEffect(() => {
    if (request) {
      const formattedNeededDate = request.needed_date_time
        ? new Date(request.needed_date_time).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      reset({
        patientName: request.patient_name,
        bloodGroup: request.blood_group,
        hospitalName: request.hospital_name,
        division: request.division,
        district: request.district,
        area: request.area,
        neededDate: formattedNeededDate,
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

  if (isFetchingRequest) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="font-inter text-body text-text-secondary mt-3">
          Loading request details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!request || (user?.id && request.created_by !== user.id)) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
        <View className="w-16 h-16 rounded-full bg-primary-surface items-center justify-center mb-4">
          <Feather name="shield" size={32} color="#DC2626" />
        </View>
        <Text className="font-inter-bold text-h2 text-text-primary mb-2 text-center">
          Unauthorized
        </Text>
        <Text className="font-inter text-body text-text-secondary text-center mb-6">
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

      await updateRequestMutation.mutateAsync({
        id: request.id,
        input: {
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
        err?.message || "Failed to update request. Please try again.",
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
            Edit Blood Request
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

          {/* Save Action */}
          <AppButton
            title="Save Changes"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            className="mb-4"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
