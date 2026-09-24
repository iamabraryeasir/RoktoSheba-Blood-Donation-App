import { ErrorBanner } from "@/components/feedback/ErrorBanner";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  RegisterFormData,
  registerSchema,
} from "@/features/auth/schemas/authSchema";
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

export default function RegisterScreen() {
  const router = useRouter();
  const { signUpWithEmail, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
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

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    try {
      const res = await signUpWithEmail(data.email, data.password);
      if (res?.user?.identities?.length === 0) {
        setAuthError("An account with this email already exists.");
        return;
      }
      router.push(
        `/(auth)/verify-email?email=${encodeURIComponent(data.email)}`,
      );
    } catch (err: any) {
      console.error("Registration error:", err);
      setAuthError(
        err?.message || "Failed to create account. Please try again.",
      );
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
            paddingBottom: 48,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Header Navigation & Brand */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              className="p-1 -ml-1"
            >
              <Feather name="arrow-left" size={24} color="#111827" />
            </TouchableOpacity>

            <Image
              source={require("@/assets/images/rokto-sheba-app-logo.png")}
              className="w-10 h-10"
              resizeMode="contain"
            />
          </View>

          <Text className="font-inter-bold text-display text-text-primary mb-1">
            Create Account
          </Text>
          <Text className="font-inter text-body text-text-secondary mb-6">
            Join RoktoSheba and help coordinate blood donations in your
            community.
          </Text>

          {/* Error Banner */}
          <ErrorBanner
            message={authError}
            onDismiss={() => setAuthError(null)}
          />

          {/* Inputs */}
          <View className="gap-4 mb-6">
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

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <AppInput
                    label="Password"
                    placeholder="At least 6 characters"
                    isPassword
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    leftIcon={<Feather name="lock" size={18} color="#9CA3AF" />}
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
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  isPassword
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  leftIcon={<Feather name="lock" size={18} color="#9CA3AF" />}
                />
              )}
            />
          </View>

          {/* Submit Button */}
          <AppButton
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            className="mb-8"
          />

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center mt-auto pb-4">
            <Text className="font-inter text-body text-text-secondary">
              Already have an account?{" "}
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
