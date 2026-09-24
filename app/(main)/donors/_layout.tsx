import { Stack } from "expo-router";
import React from "react";

export default function DonorsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
