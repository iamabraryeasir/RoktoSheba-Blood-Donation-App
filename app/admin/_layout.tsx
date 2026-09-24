import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTheme } from "@/features/theme/useThemeStore";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function AdminLayout() {
  const { session, profile, isAdmin, isLoading, isInitialized } = useAuth();
  const { isDark } = useTheme();

  if (isLoading || !isInitialized) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!isAdmin || profile?.role !== "admin") {
    return <Redirect href="/(main)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? "#0F172A" : "#FFFFFF" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="users" />
      <Stack.Screen name="requests" />
      <Stack.Screen name="reports" />
    </Stack>
  );
}
