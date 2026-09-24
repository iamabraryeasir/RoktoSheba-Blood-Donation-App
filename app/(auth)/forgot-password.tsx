import { ErrorBanner } from "@/components/feedback/ErrorBanner";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/features/auth/schemas/authSchema";
import { authService } from "@/features/auth/services/authService";
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await authService.resetPassword(data.email);
      // Navigate directly to the reset-password OTP entry screen
      router.push(
        `/(auth)/reset-password?email=${encodeURIComponent(data.email)}` as any,
      );
    } catch (err: any) {
      console.error("Password reset error:", err);
      setErrorMessage(
        err?.message || "Failed to send reset code. Please try again.",
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
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 20,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Back Header */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            className="flex-row items-center mb-6 self-start p-1 -ml-1"
          >
            <Feather name="arrow-left" size={22} color="#111827" />
            <Text className="font-inter-semibold text-h3 text-text-primary ml-2">
              Forgot Password
            </Text>
          </TouchableOpacity>

          <Text className="font-inter text-body text-text-secondary mb-6">
            Enter the email address linked to your account. We will send you an
            8-digit recovery code to reset your password.
          </Text>

          <ErrorBanner
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />

          <View className="mb-6">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Email Address"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  leftIcon={<Feather name="mail" size={18} color="#9CA3AF" />}
                />
              )}
            />
          </View>

          <AppButton
            title="Send Recovery Code"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            className="mb-8"
          />

          <View className="flex-row justify-center items-center mt-auto pb-4">
            <Text className="font-inter text-body text-text-secondary">
              Remember your password?{" "}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text className="font-inter-semibold text-body text-primary">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
