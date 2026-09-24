import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

export interface AppDatePickerProps {
  label?: string;
  value: string; // 'YYYY-MM-DD'
  onChange: (date: string) => void;
  error?: string;
  maxYear?: number;
  minYear?: number;
  maxDate?: Date;
  minDate?: Date;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const AppDatePicker: React.FC<AppDatePickerProps> = ({
  label = "Date of Birth",
  value,
  onChange,
  error,
  maxYear,
  minYear,
  maxDate,
  minDate,
}) => {
  const effectiveMaxYear = maxDate
    ? maxDate.getFullYear()
    : maxYear !== undefined
      ? maxYear
      : new Date().getFullYear();

  const effectiveMinYear = minDate
    ? minDate.getFullYear()
    : minYear !== undefined
      ? minYear
      : new Date().getFullYear() - 80;
  const [showModal, setShowModal] = useState(false);

  // Parse YYYY-MM-DD
  const parsed = useMemo(() => {
    if (value && value.includes("-")) {
      const parts = value.split("-");
      if (parts.length === 3) {
        return {
          year: parseInt(parts[0], 10) || 2000,
          month: parseInt(parts[1], 10) || 1, // 1-12
          day: parseInt(parts[2], 10) || 1,
        };
      }
    }
    return { year: 2000, month: 1, day: 1 };
  }, [value]);

  const [tempYear, setTempYear] = useState(parsed.year);
  const [tempMonth, setTempMonth] = useState(parsed.month);
  const [tempDay, setTempDay] = useState(parsed.day);
  const [activeTab, setActiveTab] = useState<"year" | "month" | "day">("year");

  const handleOpen = () => {
    setTempYear(parsed.year);
    setTempMonth(parsed.month);
    setTempDay(parsed.day);
    setActiveTab("year");
    setShowModal(true);
  };

  // Generate Year Array from effectiveMaxYear down to effectiveMinYear
  const years = useMemo(() => {
    const arr = [];
    for (let y = effectiveMaxYear; y >= effectiveMinYear; y--) {
      arr.push(y);
    }
    return arr;
  }, [effectiveMaxYear, effectiveMinYear]);

  // Days in selected Month & Year
  const daysInMonth = useMemo(() => {
    return new Date(tempYear, tempMonth, 0).getDate();
  }, [tempYear, tempMonth]);

  const days = useMemo(() => {
    const arr = [];
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push(d);
    }
    return arr;
  }, [daysInMonth]);

  const handleConfirm = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const validDay = Math.min(tempDay, daysInMonth);
    const mStr = String(tempMonth).padStart(2, "0");
    const dStr = String(validDay).padStart(2, "0");
    const isoStr = `${tempYear}-${mStr}-${dStr}`;

    onChange(isoStr);
    setShowModal(false);
  };

  // Format readable display text
  const formattedDisplay = useMemo(() => {
    if (!value) return "Select Date";
    try {
      const parts = value.split("-");
      if (parts.length === 3) {
        const d = parseInt(parts[2], 10);
        const mIndex = parseInt(parts[1], 10) - 1;
        const y = parts[0];
        return `${d} ${MONTHS[mIndex]} ${y}`;
      }
    } catch {}
    return value;
  }, [value]);

  return (
    <View className="w-full">
      {label ? (
        <Text className="font-inter-medium text-caption text-text-secondary mb-1">
          {label}
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleOpen}
        className={`flex-row items-center justify-between bg-surface border ${
          error ? "border-critical" : "border-border"
        } rounded-md px-3.5 h-12 w-full`}
      >
        <View className="flex-row items-center flex-1">
          <Feather name="calendar" size={18} color="#DC2626" />
          <Text
            className={`font-inter text-body ml-2.5 ${
              value ? "text-text-primary" : "text-text-tertiary"
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

      {/* Modern Date Picker Modal */}
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
          <View className="bg-surface rounded-t-3xl p-5 pb-8 max-h-[85%]">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-border">
              <Text className="font-inter-bold text-h3 text-text-primary">
                {label || "Select Date"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="p-1"
              >
                <Feather name="x" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Selected Preview Box */}
            <View className="bg-primary-surface border border-primary rounded-2xl p-4 mb-4 items-center flex-row justify-between">
              <View>
                <Text className="font-inter-semibold text-caption text-primary uppercase tracking-wider">
                  Selected Date
                </Text>
                <Text className="font-inter-bold text-h2 text-text-primary mt-0.5">
                  {tempDay} {MONTHS[tempMonth - 1]} {tempYear}
                </Text>
              </View>
              <View className="bg-primary px-3 py-1.5 rounded-full">
                <Text className="font-inter-bold text-caption text-white">
                  {tempYear}
                </Text>
              </View>
            </View>

            {/* Segment Tabs: Year | Month | Day */}
            <View className="flex-row bg-background border border-border rounded-xl p-1 mb-4">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveTab("year")}
                className={`flex-1 py-2 items-center rounded-lg ${
                  activeTab === "year" ? "bg-primary" : "bg-transparent"
                }`}
              >
                <Text
                  className={`font-inter-semibold text-caption ${
                    activeTab === "year" ? "text-white" : "text-text-secondary"
                  }`}
                >
                  Year ({tempYear})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveTab("month")}
                className={`flex-1 py-2 items-center rounded-lg ${
                  activeTab === "month" ? "bg-primary" : "bg-transparent"
                }`}
              >
                <Text
                  className={`font-inter-semibold text-caption ${
                    activeTab === "month" ? "text-white" : "text-text-secondary"
                  }`}
                >
                  Month ({MONTHS[tempMonth - 1]})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveTab("day")}
                className={`flex-1 py-2 items-center rounded-lg ${
                  activeTab === "day" ? "bg-primary" : "bg-transparent"
                }`}
              >
                <Text
                  className={`font-inter-semibold text-caption ${
                    activeTab === "day" ? "text-white" : "text-text-secondary"
                  }`}
                >
                  Day ({tempDay})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab 1: Year Grid Selection */}
            {activeTab === "year" ? (
              <ScrollView
                className="max-h-60"
                showsVerticalScrollIndicator={false}
              >
                <View className="flex-row flex-wrap gap-2 justify-between py-1">
                  {years.map((y) => (
                    <TouchableOpacity
                      key={y}
                      activeOpacity={0.7}
                      onPress={() => {
                        try {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light,
                          );
                        } catch {}
                        setTempYear(y);
                        setActiveTab("month");
                      }}
                      className={`w-[23%] py-2.5 rounded-xl border items-center justify-center ${
                        tempYear === y
                          ? "bg-primary border-primary"
                          : "bg-background border-border"
                      }`}
                    >
                      <Text
                        className={`font-inter-semibold text-body-small ${
                          tempYear === y ? "text-white" : "text-text-primary"
                        }`}
                      >
                        {y}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : null}

            {/* Tab 2: Month Grid Selection */}
            {activeTab === "month" ? (
              <View className="flex-row flex-wrap gap-2 justify-between py-1 max-h-60">
                {MONTHS.map((mName, idx) => {
                  const mNum = idx + 1;
                  const isSelected = tempMonth === mNum;
                  return (
                    <TouchableOpacity
                      key={mName}
                      activeOpacity={0.7}
                      onPress={() => {
                        try {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light,
                          );
                        } catch {}
                        setTempMonth(mNum);
                        setActiveTab("day");
                      }}
                      className={`w-[30%] py-3 rounded-xl border items-center justify-center ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-background border-border"
                      }`}
                    >
                      <Text
                        className={`font-inter-bold text-body ${
                          isSelected ? "text-white" : "text-text-primary"
                        }`}
                      >
                        {mName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}

            {/* Tab 3: Day Grid Selection */}
            {activeTab === "day" ? (
              <ScrollView
                className="max-h-60"
                showsVerticalScrollIndicator={false}
              >
                <View className="flex-row flex-wrap gap-2 justify-start py-1">
                  {days.map((d) => (
                    <TouchableOpacity
                      key={d}
                      activeOpacity={0.7}
                      onPress={() => {
                        try {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light,
                          );
                        } catch {}
                        setTempDay(d);
                      }}
                      className={`w-[18%] py-2.5 rounded-xl border items-center justify-center ${
                        tempDay === d
                          ? "bg-primary border-primary"
                          : "bg-background border-border"
                      }`}
                    >
                      <Text
                        className={`font-inter-semibold text-body-small ${
                          tempDay === d ? "text-white" : "text-text-primary"
                        }`}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : null}

            {/* Confirm Action Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleConfirm}
              className="bg-primary rounded-xl py-3.5 items-center justify-center mt-5 shadow-sm"
            >
              <Text className="font-inter-bold text-body-large text-white">
                Set Date ({tempDay} {MONTHS[tempMonth - 1]} {tempYear})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
