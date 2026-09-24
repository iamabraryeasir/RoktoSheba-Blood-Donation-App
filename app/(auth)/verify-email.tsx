import { ErrorBanner } from "@/components/feedback/ErrorBanner";
import { AppButton } from "@/components/ui/AppButton";
import { OtpInput } from "@/components/ui/OtpInput";
import { authService } from "@/features/auth/services/authService";
import { showAppAlert } from "@/features/dialog/useDialogStore";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 30-second countdown for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerifyOtp = async () => {
    if (!email) {
      setErrorMessage("Email address missing. Please return to registration.");
      return;
    }
    const cleanCode = otpCode.trim();
    if (cleanCode.length < 8) {
      setErrorMessage("Please enter the full 8-digit code.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);
    try {
      await authService.verifyOtp(email, cleanCode, "signup");
      // RootNavigationGuard in root _layout.tsx will detect session change and route smoothly to (onboarding)
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      setErrorMessage(
        err?.message || "Invalid or expired 8-digit code. Please try again.",
      );
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || resendTimer > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage(null);
    try {
      await authService.resendOtp(email, "signup");
      setResendTimer(45);
      showAppAlert("Code Resent", "success");
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setErrorMessage(
        err?.message || "Failed to resend verification code. Please try again.",
      );
    } finally {
      setIsResending(false);
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
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 32,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Header Icon */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 rounded-full bg-primary-surface items-center justify-center mb-4">
              <Feather name="shield" size={40} color="#DC2626" />
            </View>

            <Text className="font-inter-bold text-display text-text-primary text-center">
              Enter Verification Code
            </Text>

            <Text className="font-inter text-body text-text-secondary text-center mt-2 px-2">
              We sent an 8-digit verification code to{" "}
              <Text className="font-inter-semibold text-text-primary">
                {email || "your email address"}
              </Text>
              .
            </Text>
          </View>

          {/* Error Banner */}
          <ErrorBanner
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />

          {/* 8-box OTP Input */}
          <View className="mb-8 items-center">
            <OtpInput
              length={8}
              value={otpCode}
              onChange={setOtpCode}
              error={!!errorMessage}
            />
            <Text className="font-inter text-caption text-text-tertiary mt-2">
              Type or paste the 8-digit code from your email
            </Text>
          </View>

          {/* Verify Button */}
          <AppButton
            title="Verify & Continue"
            onPress={handleVerifyOtp}
            loading={isVerifying}
            disabled={otpCode.length < 8}
            className="mb-4"
          />

          {/* Resend Timer & Link */}
          <View className="items-center gap-3 mt-4">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleResendCode}
              disabled={resendTimer > 0 || isResending}
              className="py-1"
            >
              <Text
                className={`font-inter-semibold text-caption-medium ${
                  resendTimer > 0 ? "text-text-tertiary" : "text-primary"
                }`}
              >
                {isResending
                  ? "Sending..."
                  : resendTimer > 0
                    ? `Resend Code in ${resendTimer}s`
                    : "Resend Code"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(auth)/login")}
              className="py-1"
            >
              <Text className="font-inter text-caption text-text-secondary">
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
