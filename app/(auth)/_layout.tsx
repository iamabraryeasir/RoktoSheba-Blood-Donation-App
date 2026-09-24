import { useAuth } from "@/features/auth/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const { session, profile, isInitialized, isLoading, isPasswordRecovery } =
    useAuth();

  if (!isInitialized || isLoading) {
    return null;
  }

  // If user is undergoing password recovery, allow auth screens
  if (!isPasswordRecovery && session) {
    if (profile?.onboarding_completed) {
      return <Redirect href="/(main)" />;
    } else {
      return <Redirect href="/(onboarding)" />;
    }
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
