import { ErrorBanner } from "@/components/feedback/ErrorBanner";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoginFormData, loginSchema } from "@/features/auth/schemas/authSchema";
import { authService } from "@/features/auth/services/authService";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithEmail, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    try {
      await signInWithEmail(data.email, data.password);
      // Navigation will be automatically handled by the root route guard
    } catch (err: any) {
      console.error("Login error:", err);
      const message = err?.message || "";

      // If email is not confirmed, dispatch fresh OTP and redirect to verification
      if (
        message.toLowerCase().includes("email not confirmed") ||
        err?.code === "email_not_confirmed"
      ) {
        try {
          await authService.resendOtp(data.email, "signup");
        } catch (resendErr) {
          console.warn("Auto-resend OTP error:", resendErr);
        }
        router.push(
          `/(auth)/verify-email?email=${encodeURIComponent(data.email)}` as any,
        );
        return;
      }

      setAuthError(message || "Invalid email or password. Please try again.");
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
            paddingVertical: 24,
            paddingBottom: 48,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Logo & Brand Header */}
          <View className="items-center mb-8">
            <Image
              source={require("@/assets/images/rokto-sheba-app-logo.png")}
              className="w-32 h-32 mb-3"
              resizeMode="contain"
            />
            <Text className="font-inter-bold text-display text-text-primary">
              RoktoSheba
            </Text>
            <Text className="font-inter text-body text-text-secondary mt-1 text-center">
              Every Drop Saves a Life
            </Text>
          </View>

          {/* Error Banner */}
          <ErrorBanner
            message={authError}
            onDismiss={() => setAuthError(null)}
          />

          {/* Form Fields */}
          <View className="gap-4 mb-3">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Email Address"
                  placeholder="Enter your email"
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

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Password"
                  placeholder="Enter your password"
                  isPassword
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  leftIcon={<Feather name="lock" size={18} color="#9CA3AF" />}
                />
              )}
            />
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(auth)/forgot-password")}
            className="self-end mb-6 py-1"
          >
            <Text className="font-inter-medium text-caption-medium text-info">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <AppButton
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            className="mb-8"
          />

          {/* Create Account Link */}
          <View className="flex-row justify-center items-center">
            <Text className="font-inter text-body text-text-secondary">
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text className="font-inter-semibold text-body text-primary">
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
