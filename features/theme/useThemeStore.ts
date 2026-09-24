import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorScheme } from "nativewind";
import { Appearance, ColorSchemeName } from "react-native";
import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "@roktosheba_theme_preference";

interface ThemeState {
  themeMode: ThemeMode;
  isDark: boolean;
  isInitialized: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  initializeTheme: () => Promise<void>;
}

const resolveIsDark = (
  mode: ThemeMode,
  systemScheme: ColorSchemeName,
): boolean => {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return systemScheme === "dark";
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: "light",
  isDark: false,
  isInitialized: false,

  initializeTheme: async () => {
    try {
      const savedMode = (await AsyncStorage.getItem(
        THEME_STORAGE_KEY,
      )) as ThemeMode | null;
      const initialMode: ThemeMode =
        savedMode && ["light", "dark", "system"].includes(savedMode)
          ? savedMode
          : "light";

      const systemScheme = Appearance.getColorScheme();
      const isDark = resolveIsDark(initialMode, systemScheme);

      // Sync NativeWind colorScheme
      colorScheme.set(initialMode);

      set({
        themeMode: initialMode,
        isDark,
        isInitialized: true,
      });

      // Listen to OS appearance changes if system mode
      Appearance.addChangeListener(({ colorScheme: newSystemScheme }) => {
        const currentMode = get().themeMode;
        if (currentMode === "system") {
          const updatedIsDark = newSystemScheme === "dark";
          set({ isDark: updatedIsDark });
        }
      });
    } catch (err) {
      console.warn("Failed to initialize theme preference:", err);
      set({ isInitialized: true });
    }
  },

  setThemeMode: async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      const systemScheme = Appearance.getColorScheme();
      const isDark = resolveIsDark(mode, systemScheme);

      // Set NativeWind
      colorScheme.set(mode);

      set({
        themeMode: mode,
        isDark,
      });
    } catch (err) {
      console.error("Failed to persist theme mode:", err);
    }
  },

  toggleTheme: async () => {
    const current = get().themeMode;
    const next: ThemeMode = current === "dark" ? "light" : "dark";
    await get().setThemeMode(next);
  },
}));

export const useTheme = () => {
  const themeMode = useThemeStore((s) => s.themeMode);
  const isDark = useThemeStore((s) => s.isDark);
  const isInitialized = useThemeStore((s) => s.isInitialized);
  const setThemeMode = useThemeStore((s) => s.setThemeMode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const colors = {
    background: isDark ? "#0F172A" : "#FFFFFF",
    surface: isDark ? "#1E293B" : "#F9FAFB",
    surfaceElevated: isDark ? "#334155" : "#FFFFFF",
    border: isDark ? "#334155" : "#E5E7EB",
    textPrimary: isDark ? "#F1F5F9" : "#111827",
    textSecondary: isDark ? "#94A3B8" : "#6B7280",
    textTertiary: isDark ? "#64748B" : "#9CA3AF",
    primary: "#DC2626",
    primaryLight: isDark ? "#450A0A" : "#FEF2F2",
    primarySurface: isDark ? "#7F1D1D" : "#FEE2E2",
  };

  return {
    themeMode,
    isDark,
    isInitialized,
    setThemeMode,
    toggleTheme,
    colors,
  };
};

