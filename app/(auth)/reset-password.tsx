import { ErrorBanner } from "@/components/feedback/ErrorBanner";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { OtpInput } from "@/components/ui/OtpInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/features/auth/schemas/authSchema";
import { authService } from "@/features/auth/services/authService";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const { session, refreshProfile, clearPasswordRecovery } = useAuth();

  const [emailInput] = useState(params.email || "");
  const [otpToken, setOtpToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strengthScore = getPasswordStrength(passwordValue);
  const strengthColors = [
    "bg-border",
    "bg-critical",
    "bg-warning",
    "bg-info",
    "bg-success",
  ];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      if (!session) {
        if (!emailInput.trim()) {
          setErrorMessage("Account email is required.");
          setIsSubmitting(false);
          return;
        }
        if (otpToken.trim().length < 8) {
          setErrorMessage("Please enter the full 8-digit recovery code.");
          setIsSubmitting(false);
          return;
        }

        // Verify the 8-digit recovery OTP
        await authService.verifyOtp(
          emailInput.trim(),
          otpToken.trim(),
          "recovery",
        );
      }

      // Update password with authenticated session
      await authService.updatePassword(data.password);
      clearPasswordRecovery();
      await refreshProfile();
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Update password error:", err);
      setErrorMessage(
        err?.message ||
          "Invalid 8-digit code or failed to update password. Please check and try again.",
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
            paddingVertical: 24,
            paddingBottom: 48,
            justifyContent: isSuccess ? "center" : "flex-start",
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {isSuccess ? (
            <View className="items-center justify-center py-8">
              <View className="w-16 h-16 rounded-full bg-success-surface items-center justify-center mb-4">
                <Feather name="check-circle" size={32} color="#16A34A" />
              </View>
              <Text className="font-inter-bold text-h2 text-text-primary mb-2 text-center">
                Password Reset Successfully!
              </Text>
              <Text className="font-inter text-body text-text-secondary text-center mb-8 px-4">
                Your password has been updated. You can now continue into
                RoktoSheba.
              </Text>
              <AppButton
                title="Continue to App"
                onPress={() => router.replace("/(main)" as any)}
                className="w-full"
              />
            </View>
          ) : (
            <>
              {/* Header */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.back()}
                className="flex-row items-center mb-6 self-start p-1 -ml-1"
              >
                <Feather name="arrow-left" size={22} color="#111827" />
                <Text className="font-inter-semibold text-h3 text-text-primary ml-2">
                  Reset Password
                </Text>
              </TouchableOpacity>

              <Text className="font-inter text-body text-text-secondary mb-6">
                Enter the 8-digit recovery code sent to your email and choose a
                new password.
              </Text>

              {/* Error Banner */}
              <ErrorBanner
                message={errorMessage}
                onDismiss={() => setErrorMessage(null)}
              />

              {/* Disabled Email Display & 8-digit OTP Input */}
              {!session ? (
                <View className="gap-4 mb-6">
                  <AppInput
                    label="Account Email"
                    value={emailInput}
                    editable={false}
                    className="text-text-secondary"
                    leftIcon={<Feather name="mail" size={18} color="#9CA3AF" />}
                  />

                  <View className="items-center mt-1">
                    <Text className="font-inter-medium text-caption text-text-secondary self-start mb-2">
                      8-Digit Recovery Code *
                    </Text>
                    <OtpInput
                      length={8}
                      value={otpToken}
                      onChange={setOtpToken}
                      error={!!errorMessage}
                    />
                  </View>
                </View>
              ) : null}

              {/* New Password Form */}
              <View className="gap-4 mb-8">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <AppInput
                        label="New Password *"
                        placeholder="At least 6 characters"
                        isPassword
                        autoCapitalize="none"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.password?.message}
                        leftIcon={
                          <Feather name="lock" size={18} color="#9CA3AF" />
                        }
                      />

                      {/* Password Strength Indicator */}
                      {passwordValue.length > 0 ? (
                        <View className="mt-2">
                          <View className="flex-row gap-1 h-1 rounded-full overflow-hidden">
                            {[1, 2, 3, 4].map((level) => (
                              <View
                                key={level}
                                className={`flex-1 ${
                                  strengthScore >= level
                                    ? strengthColors[strengthScore]
                                    : "bg-border"
                                }`}
                              />
                            ))}
                          </View>
                          <Text className="font-inter text-caption text-text-secondary mt-1">
                            Strength: {strengthLabels[strengthScore]}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      label="Confirm New Password *"
                      placeholder="Re-enter your new password"
                      isPassword
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.confirmPassword?.message}
                      leftIcon={
                        <Feather name="lock" size={18} color="#9CA3AF" />
                      }
                    />
                  )}
                />
              </View>

              <AppButton
                title="Update Password"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                className="mb-4"
              />

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/(auth)/login")}
                className="py-2 items-center"
              >
                <Text className="font-inter text-caption text-text-secondary">
                  Back to Sign In
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
