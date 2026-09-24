import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  containerClassName?: string;
  helperText?: string;
}

export const AppInput = React.forwardRef<TextInput, AppInputProps>(
  (
    {
      label,
      error,
      leftIcon,
      isPassword = false,
      containerClassName = "",
      className = "",
      helperText,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    let borderClass = "border-border";
    if (error) {
      borderClass = "border-critical";
    } else if (isFocused) {
      borderClass = "border-primary";
    }

    return (
      <View className={`w-full ${containerClassName}`}>
        {label ? (
          <Text className="font-inter-medium text-caption text-text-secondary mb-xs">
            {label}
          </Text>
        ) : null}

        <View
          className={`flex-row items-center bg-surface border ${borderClass} rounded-md px-md h-12 w-full`}
        >
          {leftIcon ? <View className="mr-xs">{leftIcon}</View> : null}

          <TextInput
            ref={ref}
            className={`flex-1 font-inter text-body text-text-primary py-0 ${className}`}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={isPassword && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />

          {isPassword ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPassword((prev) => !prev)}
              className="p-xs"
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color="#6B7280"
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {error ? (
          <Text className="font-inter text-caption text-critical mt-xs">
            {error}
          </Text>
        ) : helperText ? (
          <Text className="font-inter text-caption text-text-tertiary mt-xs">
            {helperText}
          </Text>
        ) : null}
      </View>
    );
  },
);

AppInput.displayName = "AppInput";
