import { AppDialog } from "@/components/ui/AppDialog";
import { useAuthStore } from "@/features/auth/hooks/useAuth";
import { useThemeStore } from "@/features/theme/useThemeStore";
import { queryClient } from "@/lib/queryClient";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import "../global.css";

// Configure Reanimated Logger: disable strict mode to suppress internal library
// warnings when reading/writing shared values during render in NativeWind & React Navigation
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Keep the native splash screen visible while fonts are loading
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const isDark = useThemeStore((s) => s.isDark);

  // Initialize Zustand Auth store listener, Theme store, & Android Navigation Bar
  useEffect(() => {
    const unsubscribeAuth = useAuthStore.getState().initializeAuth();
    useThemeStore.getState().initializeTheme();

    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden").catch(() => {});
    }

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const backgroundColor = isDark ? "#0F172A" : "#FFFFFF";

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack>
      <AppDialog />
    </QueryClientProvider>
  );
}
