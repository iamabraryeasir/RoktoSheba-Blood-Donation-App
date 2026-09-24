import { useAuth } from "@/features/auth/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function OnboardingLayout() {
  const { session, profile, isInitialized, isLoading } = useAuth();

  if (!isInitialized || isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (profile?.onboarding_completed) {
    return <Redirect href="/(main)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
        animation: "slide_from_right",
      }}
    />
  );
}
