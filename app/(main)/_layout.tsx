import { CustomFloatingTabBar } from "@/components/navigation/CustomFloatingTabBar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Redirect, Tabs } from "expo-router";
import React from "react";

export default function MainTabLayout() {
  const { session, profile, isInitialized, isLoading } = useAuth();

  if (!isInitialized || isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!profile?.onboarding_completed) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomFloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: "Requests",
        }}
      />
      <Tabs.Screen
        name="donors"
        options={{
          title: "Donors",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
