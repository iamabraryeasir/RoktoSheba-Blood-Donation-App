import { useTheme } from "@/features/theme/useThemeStore";
import { Feather } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CustomFloatingTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const handlePress = (route: any, isFocused: boolean) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  // Find routes by target name
  const homeRoute = state.routes.find((r) => r.name === "index");
  const requestsRoute = state.routes.find((r) => r.name === "requests");
  const donorsRoute = state.routes.find((r) => r.name === "donors");
  const profileRoute = state.routes.find((r) => r.name === "profile");

  const bottomInset = Math.max(insets.bottom, Platform.OS === "ios" ? 12 : 16);
  const inactiveColor = isDark ? "#64748B" : "#9CA3AF";

  return (
    <View
      style={{ bottom: bottomInset }}
      className="absolute left-4 right-4 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-full h-16 flex-row items-center justify-around px-2 shadow-lg"
    >
      {/* 1. Home Tab */}
      {homeRoute ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handlePress(
              homeRoute,
              state.routes[state.index].key === homeRoute.key,
            )
          }
          className="flex-1 items-center justify-center py-1"
        >
          <Feather
            name="home"
            size={22}
            color={
              state.routes[state.index].key === homeRoute.key
                ? "#DC2626"
                : inactiveColor
            }
          />
          <Text
            className={`font-inter-medium text-[11px] mt-0.5 ${
              state.routes[state.index].key === homeRoute.key
                ? "text-primary font-inter-semibold"
                : "text-text-tertiary dark:text-text-dark-tertiary"
            }`}
          >
            Home
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* 2. Requests Tab */}
      {requestsRoute ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handlePress(
              requestsRoute,
              state.routes[state.index].key === requestsRoute.key,
            )
          }
          className="flex-1 items-center justify-center py-1"
        >
          <Feather
            name="list"
            size={22}
            color={
              state.routes[state.index].key === requestsRoute.key
                ? "#DC2626"
                : inactiveColor
            }
          />
          <Text
            className={`font-inter-medium text-[11px] mt-0.5 ${
              state.routes[state.index].key === requestsRoute.key
                ? "text-primary font-inter-semibold"
                : "text-text-tertiary dark:text-text-dark-tertiary"
            }`}
          >
            Requests
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* 3. Center Elevated Floating FAB (Create Request) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch {}
          navigation.navigate("requests" as any, { screen: "create" });
        }}
        className="w-14 h-14 rounded-full bg-primary items-center justify-center -mt-7 border-4 border-background dark:border-background-dark shadow-md"
      >
        <Feather name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* 4. Donors Tab */}
      {donorsRoute ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handlePress(
              donorsRoute,
              state.routes[state.index].key === donorsRoute.key,
            )
          }
          className="flex-1 items-center justify-center py-1"
        >
          <Feather
            name="search"
            size={22}
            color={
              state.routes[state.index].key === donorsRoute.key
                ? "#DC2626"
                : inactiveColor
            }
          />
          <Text
            className={`font-inter-medium text-[11px] mt-0.5 ${
              state.routes[state.index].key === donorsRoute.key
                ? "text-primary font-inter-semibold"
                : "text-text-tertiary dark:text-text-dark-tertiary"
            }`}
          >
            Donors
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* 5. Profile Tab */}
      {profileRoute ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handlePress(
              profileRoute,
              state.routes[state.index].key === profileRoute.key,
            )
          }
          className="flex-1 items-center justify-center py-1"
        >
          <Feather
            name="user"
            size={22}
            color={
              state.routes[state.index].key === profileRoute.key
                ? "#DC2626"
                : inactiveColor
            }
          />
          <Text
            className={`font-inter-medium text-[11px] mt-0.5 ${
              state.routes[state.index].key === profileRoute.key
                ? "text-primary font-inter-semibold"
                : "text-text-tertiary dark:text-text-dark-tertiary"
            }`}
          >
            Profile
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
