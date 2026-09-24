import React, { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 8,
  value,
  onChange,
  error = false,
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const handleChangeText = (text: string, index: number) => {
    // Handle paste of multiple characters
    if (text.length > 1) {
      const cleanText = text.replace(/[^0-9]/g, "").slice(0, length);
      onChange(cleanText);
      const nextIndex = Math.min(cleanText.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const cleanChar = text.replace(/[^0-9]/g, "");
    const newDigits = [...digits];
    newDigits[index] = cleanChar;
    const newOtp = newDigits.join("");
    onChange(newOtp);

    if (cleanChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      }
    }
  };

  return (
    <View className="flex-row justify-between w-full gap-1.5 my-2">
      {Array.from({ length }).map((_, index) => {
        const isFocused = focusedIndex === index;
        const digit = digits[index] || "";

        let borderClass = "border-border bg-surface";
        if (error) {
          borderClass = "border-critical bg-primary-surface";
        } else if (isFocused) {
          borderClass = "border-primary bg-background";
        } else if (digit) {
          borderClass = "border-text-secondary bg-surface";
        }

        return (
          <View
            key={index}
            className={`flex-1 h-12 items-center justify-center border-2 rounded-lg ${borderClass}`}
          >
            <TextInput
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              keyboardType="number-pad"
              maxLength={index === 0 ? length : 1}
              textAlign="center"
              className="font-inter-bold text-h3 text-text-primary w-full h-full text-center p-0"
              selectTextOnFocus
              contextMenuHidden
            />
          </View>
        );
      })}
    </View>
  );
};
