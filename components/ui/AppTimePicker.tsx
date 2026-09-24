import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

export interface AppTimePickerProps {
  label?: string;
  value: string; // 'HH:mm' in 24h format, e.g. '14:30' or '09:00'
  onChange: (time24h: string) => void;
  error?: string;
  className?: string;
}

const HOURS_12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES_5 = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const TIME_PRESETS = [
  { label: "Morning", time: "09:00", subtitle: "09:00 AM" },
  { label: "Noon", time: "12:00", subtitle: "12:00 PM" },
  { label: "Afternoon", time: "15:00", subtitle: "03:00 PM" },
  { label: "Evening", time: "18:00", subtitle: "06:00 PM" },
  { label: "Night", time: "21:00", subtitle: "09:00 PM" },
];

export const AppTimePicker: React.FC<AppTimePickerProps> = ({
  label = "Select Time",
  value,
  onChange,
  error,
  className = "",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"hour" | "minute">("hour");

  // Parse 24h 'HH:mm' into 12h hour, minute, and period (AM/PM)
  const parsed = useMemo(() => {
    let hour24 = 12;
    let min = 0;

    if (value && value.includes(":")) {
      const parts = value.split(":");
      hour24 = parseInt(parts[0], 10) || 12;
      min = parseInt(parts[1], 10) || 0;
    }

    const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;

    return { hour12, minute: min, period };
  }, [value]);

  const [tempHour, setTempHour] = useState(parsed.hour12);
  const [tempMinute, setTempMinute] = useState(parsed.minute);
  const [tempPeriod, setTempPeriod] = useState<"AM" | "PM">(parsed.period);

  const handleOpen = () => {
    setTempHour(parsed.hour12);
    setTempMinute(parsed.minute);
    setTempPeriod(parsed.period);
    setActiveTab("hour");
    setShowModal(true);
  };

  // Convert 12h + AM/PM back to 24h 'HH:mm'
  const to24hString = (h12: number, m: number, p: "AM" | "PM"): string => {
    let h24 = h12;
    if (p === "AM") {
      if (h24 === 12) h24 = 0;
    } else {
      if (h24 < 12) h24 += 12;
    }
    const hh = String(h24).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const handleConfirm = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const time24 = to24hString(tempHour, tempMinute, tempPeriod);
    onChange(time24);
    setShowModal(false);
  };

  const handleSelectPreset = (time24: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onChange(time24);
    setShowModal(false);
  };

  // Formatted display text (e.g. '02:30 PM')
  const formattedDisplay = useMemo(() => {
    if (!value) return "Select Time";
    const { hour12, minute, period } = parsed;
    const hh = String(hour12).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    return `${hh}:${mm} ${period}`;
  }, [value, parsed]);

  const tempDisplay = useMemo(() => {
    const hh = String(tempHour).padStart(2, "0");
    const mm = String(tempMinute).padStart(2, "0");
    return `${hh}:${mm} ${tempPeriod}`;
  }, [tempHour, tempMinute, tempPeriod]);

  return (
    <View className={`w-full ${className}`}>
      {label ? (
        <Text className="font-inter-medium text-caption text-text-secondary dark:text-text-dark-secondary mb-1">
          {label}
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleOpen}
        className={`flex-row items-center justify-between bg-surface dark:bg-surface-dark border ${
          error
            ? "border-critical"
            : "border-border dark:border-border-dark"
        } rounded-xl px-3.5 h-12 w-full shadow-sm`}
      >
        <View className="flex-row items-center flex-1">
          <Feather name="clock" size={18} color="#DC2626" />
          <Text
            className={`font-inter text-body ml-2.5 ${
              value
                ? "text-text-primary dark:text-text-dark-primary"
                : "text-text-tertiary dark:text-text-dark-tertiary"
            }`}
          >
            {formattedDisplay}
          </Text>
        </View>
        <Feather name="chevron-down" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      {error ? (
        <Text className="font-inter text-caption text-critical mt-1">
          {error}
        </Text>
      ) : null}

      {/* Modern Time Picker Modal Sheet */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="bg-surface dark:bg-surface-dark rounded-t-3xl p-5 pb-8 max-h-[85%] border-t border-border dark:border-border-dark">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-border dark:border-border-dark">
              <View className="flex-row items-center">
                <Feather name="clock" size={18} color="#DC2626" />
                <Text className="font-inter-bold text-h3 text-text-primary dark:text-text-dark-primary ml-2">
                  {label || "Select Time"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="p-1"
              >
                <Feather name="x" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Selected Time Digital Clock Badge */}
            <View className="bg-primary-surface dark:bg-primary-dark/20 border border-primary rounded-2xl p-4 mb-4 flex-row items-center justify-between">
              <View>
                <Text className="font-inter-semibold text-[11px] text-primary uppercase tracking-wider">
                  Target Time
                </Text>
                <Text className="font-inter-bold text-h1 text-text-primary dark:text-text-dark-primary mt-0.5 tracking-tight">
                  {String(tempHour).padStart(2, "0")} : {String(tempMinute).padStart(2, "0")}
                </Text>
              </View>

              {/* AM / PM Segment Switcher */}
              <View className="flex-row bg-background dark:bg-background-dark p-1 rounded-xl border border-border dark:border-border-dark">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setTempPeriod("AM");
                  }}
                  className={`px-3 py-1.5 rounded-lg ${
                    tempPeriod === "AM" ? "bg-primary" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`font-inter-bold text-caption ${
                      tempPeriod === "AM"
                        ? "text-white"
                        : "text-text-secondary dark:text-text-dark-secondary"
                    }`}
                  >
                    AM
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setTempPeriod("PM");
                  }}
                  className={`px-3 py-1.5 rounded-lg ${
                    tempPeriod === "PM" ? "bg-primary" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`font-inter-bold text-caption ${
                      tempPeriod === "PM"
                        ? "text-white"
                        : "text-text-secondary dark:text-text-dark-secondary"
                    }`}
                  >
                    PM
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Presets Horizontal Scroll */}
            <View className="mb-3">
              <Text className="font-inter-medium text-[11px] text-text-tertiary dark:text-text-dark-tertiary mb-1.5">
                Quick Presets
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {TIME_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset.time}
                    activeOpacity={0.7}
                    onPress={() => handleSelectPreset(preset.time)}
                    className="bg-background dark:bg-background-dark border border-border dark:border-border-dark px-3 py-1.5 rounded-xl items-center"
                  >
                    <Text className="font-inter-semibold text-caption text-text-primary dark:text-text-dark-primary">
                      {preset.label}
                    </Text>
                    <Text className="font-inter text-[10px] text-primary mt-0.5">
                      {preset.subtitle}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Segment Tabs: Hour | Minute */}
            <View className="flex-row bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-xl p-1 mb-3">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveTab("hour")}
                className={`flex-1 py-2 items-center rounded-lg ${
                  activeTab === "hour" ? "bg-primary" : "bg-transparent"
                }`}
              >
                <Text
                  className={`font-inter-semibold text-caption ${
                    activeTab === "hour"
                      ? "text-white"
                      : "text-text-secondary dark:text-text-dark-secondary"
                  }`}
                >
                  Hour ({tempHour})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveTab("minute")}
                className={`flex-1 py-2 items-center rounded-lg ${
                  activeTab === "minute" ? "bg-primary" : "bg-transparent"
                }`}
              >
                <Text
                  className={`font-inter-semibold text-caption ${
                    activeTab === "minute"
                      ? "text-white"
                      : "text-text-secondary dark:text-text-dark-secondary"
                  }`}
                >
                  Minute ({String(tempMinute).padStart(2, "0")})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab 1: 12-Hour Grid */}
            {activeTab === "hour" ? (
              <View className="flex-row flex-wrap gap-2 justify-between py-1">
                {HOURS_12.map((h) => {
                  const isSelected = tempHour === h;
                  return (
                    <TouchableOpacity
                      key={h}
                      activeOpacity={0.7}
                      onPress={() => {
                        try {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        } catch {}
                        setTempHour(h);
                        setActiveTab("minute");
                      }}
                      className={`w-[23%] py-3 rounded-xl border items-center justify-center ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-background dark:bg-background-dark border-border dark:border-border-dark"
                      }`}
                    >
                      <Text
                        className={`font-inter-bold text-body ${
                          isSelected
                            ? "text-white"
                            : "text-text-primary dark:text-text-dark-primary"
                        }`}
                      >
                        {String(h).padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}

            {/* Tab 2: Minute Grid (in 5-min intervals) */}
            {activeTab === "minute" ? (
              <View className="flex-row flex-wrap gap-2 justify-between py-1">
                {MINUTES_5.map((m) => {
                  const isSelected = tempMinute === m;
                  return (
                    <TouchableOpacity
                      key={m}
                      activeOpacity={0.7}
                      onPress={() => {
                        try {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        } catch {}
                        setTempMinute(m);
                      }}
                      className={`w-[23%] py-3 rounded-xl border items-center justify-center ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-background dark:bg-background-dark border-border dark:border-border-dark"
                      }`}
                    >
                      <Text
                        className={`font-inter-bold text-body ${
                          isSelected
                            ? "text-white"
                            : "text-text-primary dark:text-text-dark-primary"
                        }`}
                      >
                        :{String(m).padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}

            {/* Confirm Action Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleConfirm}
              className="bg-primary rounded-xl py-3.5 items-center justify-center mt-4 shadow-sm"
            >
              <Text className="font-inter-bold text-body-large text-white">
                Set Time ({tempDisplay})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

