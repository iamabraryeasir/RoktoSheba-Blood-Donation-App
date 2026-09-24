import { Stack } from "expo-router";
import React from "react";

export default function RequestsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="my-requests" />
    </Stack>
  );
}
