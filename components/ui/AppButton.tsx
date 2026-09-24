import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "standard" | "small";
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = "primary",
  size = "standard",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  textClassName = "",
  onPress,
  ...rest
}) => {
  const handlePress = (e: any) => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onPress?.(e);
  };

  // Base container styles
  let containerStyles = "flex-row items-center justify-center rounded-full ";

  if (size === "standard") {
    containerStyles += "h-12 px-base ";
  } else {
    containerStyles += "h-10 px-md ";
  }

  // Variant container styles
  if (disabled) {
    containerStyles += "bg-border ";
  } else {
    switch (variant) {
      case "primary":
        containerStyles += "bg-primary ";
        break;
      case "outline":
        containerStyles += "bg-background border border-primary ";
        break;
      case "ghost":
        containerStyles += "bg-transparent ";
        break;
      case "danger":
        containerStyles += "bg-critical ";
        break;
    }
  }

  // Text styles
  let labelStyles = "font-inter-semibold text-center ";
  if (size === "standard") {
    labelStyles += "text-button ";
  } else {
    labelStyles += "text-button-small ";
  }

  if (disabled) {
    labelStyles += "text-text-tertiary ";
  } else {
    switch (variant) {
      case "primary":
      case "danger":
        labelStyles += "text-text-on-primary ";
        break;
      case "outline":
      case "ghost":
        labelStyles += "text-primary ";
        break;
    }
  }

  const spinnerColor =
    variant === "primary" || variant === "danger" ? "#FFFFFF" : "#DC2626";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={handlePress}
      className={`${containerStyles} ${className}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <>
          {leftIcon ? <>{leftIcon}</> : null}
          <Text
            className={`${labelStyles} ${leftIcon ? "ml-xs" : ""} ${
              rightIcon ? "mr-xs" : ""
            } ${textClassName}`}
          >
            {title}
          </Text>
          {rightIcon ? <>{rightIcon}</> : null}
        </>
      )}
    </TouchableOpacity>
  );
};
