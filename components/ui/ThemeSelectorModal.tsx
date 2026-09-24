import { ThemeMode, useTheme } from "@/features/theme/useThemeStore";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ThemeSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ThemeOption {
  mode: ThemeMode;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    mode: "light",
    title: "Light Mode",
    description: "Classic bright theme with crisp red accents",
    icon: "sun",
  },
  {
    mode: "dark",
    title: "Dark Mode",
    description: "Deep slate theme designed for low-light comfort",
    icon: "moon",
  },
  {
    mode: "system",
    title: "System Default",
    description: "Automatically matches your device display settings",
    icon: "smartphone",
  },
];

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const { themeMode, isDark, setThemeMode } = useTheme();

  const handleSelectMode = async (mode: ThemeMode) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    await setThemeMode(mode);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end sm:justify-center items-center px-0 sm:px-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="absolute inset-0"
        />

        <View className="w-full sm:max-w-md bg-surface dark:bg-surface-dark rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border border-border dark:border-border-dark shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-border dark:border-border-dark">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-primary-surface dark:bg-primary-dark/30 items-center justify-center mr-3">
                <Feather
                  name={isDark ? "moon" : "sun"}
                  size={20}
                  color="#DC2626"
                />
              </View>
              <View>
                <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary">
                  Appearance
                </Text>
                <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary">
                  Choose your preferred theme mode
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              className="p-2 rounded-full bg-background dark:bg-background-dark border border-border dark:border-border-dark"
            >
              <Feather
                name="x"
                size={18}
                color={isDark ? "#94A3B8" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View className="gap-3">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = themeMode === opt.mode;

              return (
                <TouchableOpacity
                  key={opt.mode}
                  activeOpacity={0.7}
                  onPress={() => handleSelectMode(opt.mode)}
                  className={`flex-row items-center justify-between p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-primary-light dark:bg-primary/10 border-primary"
                      : "bg-background dark:bg-background-dark border-border dark:border-border-dark"
                  }`}
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <View
                      className={`w-10 h-10 rounded-xl items-center justify-center mr-3.5 ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-surface dark:bg-surface-elevated border border-border dark:border-border-dark"
                      }`}
                    >
                      <Feather
                        name={opt.icon}
                        size={20}
                        color={
                          isSelected ? "#FFFFFF" : isDark ? "#F1F5F9" : "#4B5563"
                        }
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`font-inter-bold text-body ${
                          isSelected
                            ? "text-primary dark:text-primary-dark"
                            : "text-text-primary dark:text-text-dark-primary"
                        }`}
                      >
                        {opt.title}
                      </Text>
                      <Text className="font-inter text-caption text-text-secondary dark:text-text-dark-secondary mt-0.5">
                        {opt.description}
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center border ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-border dark:border-border-dark bg-transparent"
                    }`}
                  >
                    {isSelected && (
                      <Feather name="check" size={14} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Close button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="mt-6 py-3.5 rounded-xl bg-surface dark:bg-surface-elevated border border-border dark:border-border-dark items-center justify-center"
          >
            <Text className="font-inter-semibold text-body text-text-primary dark:text-text-dark-primary">
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

