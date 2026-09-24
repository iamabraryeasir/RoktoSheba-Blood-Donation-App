import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { AppDatePicker } from "./AppDatePicker";
import { AppTimePicker } from "./AppTimePicker";

export interface AppDateTimePickerProps {
  label?: string;
  dateValue: string; // 'YYYY-MM-DD'
  timeValue: string; // 'HH:mm' (24-hour format)
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  dateError?: string;
  timeError?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const MONTHS_SHORT = [
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

export const AppDateTimePicker: React.FC<AppDateTimePickerProps> = ({
  label = "Needed By Date & Time",
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
  minDate,
  maxDate,
  className = "",
}) => {
  // Format formatted summary, e.g. "Tomorrow at 02:30 PM" or "Sep 26, 2026 at 02:30 PM"
  const formattedSummary = useMemo(() => {
    if (!dateValue) return null;

    let dateText = dateValue;
    try {
      const parts = dateValue.split("-");
      if (parts.length === 3) {
        const y = parts[0];
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        dateText = `${MONTHS_SHORT[m]} ${d}, ${y}`;
      }
    } catch {}

    let timeText = "";
    if (timeValue && timeValue.includes(":")) {
      const [hStr, mStr] = timeValue.split(":");
      let h = parseInt(hStr, 10) || 0;
      const m = parseInt(mStr, 10) || 0;
      const period = h >= 12 ? "PM" : "AM";
      let h12 = h % 12;
      if (h12 === 0) h12 = 12;
      timeText = ` at ${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
    }

    return `${dateText}${timeText}`;
  }, [dateValue, timeValue]);

  return (
    <View className={`w-full ${className}`}>
      {label ? (
        <Text className="font-inter-medium text-caption text-text-secondary dark:text-text-dark-secondary mb-1.5">
          {label}
        </Text>
      ) : null}

      {/* Side-by-Side Date and Time Picker Row */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <AppDatePicker
            label="Date *"
            value={dateValue}
            onChange={onDateChange}
            error={dateError}
            minDate={minDate}
            maxDate={maxDate}
          />
        </View>

        <View className="flex-1">
          <AppTimePicker
            label="Time *"
            value={timeValue}
            onChange={onTimeChange}
            error={timeError}
          />
        </View>
      </View>

      {/* Combined Preview Badge */}
      {formattedSummary ? (
        <View className="flex-row items-center mt-2.5 bg-primary-surface dark:bg-primary-dark/20 border border-primary/20 rounded-xl px-3 py-2">
          <Feather name="clock" size={13} color="#DC2626" />
          <Text className="font-inter-medium text-[11px] text-text-primary dark:text-text-dark-primary ml-1.5 flex-1">
            Required by:{" "}
            <Text className="font-inter-bold text-primary">
              {formattedSummary}
            </Text>
          </Text>
        </View>
      ) : null}
    </View>
  );
};

