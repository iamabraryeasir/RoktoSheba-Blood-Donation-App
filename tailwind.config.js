/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Brand
        primary: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
          DEFAULT: "#DC2626", // red-600
          hover: "#B91C1C", // red-700
          light: "#FEF2F2", // red-50
          surface: "#FEE2E2", // red-100
          dark: "#EF4444", // red-500
        },
        // Secondary & Accent
        secondary: {
          DEFAULT: "#FB7185", // rose-400
          light: "#FFF1F2", // rose-50
          dark: "#F43F5E", // rose-500
        },
        // Status Colors
        success: {
          DEFAULT: "#16A34A", // green-600
          light: "#F0FDF4", // green-50
          surface: "#DCFCE7", // green-100
        },
        warning: {
          DEFAULT: "#F59E0B", // amber-500
          light: "#FFFBEB", // amber-50
          surface: "#FEF3C7", // amber-100
        },
        critical: {
          DEFAULT: "#DC2626", // red-600
          light: "#FEF2F2", // red-50
          surface: "#FEE2E2", // red-100
        },
        info: {
          DEFAULT: "#2563EB", // blue-600
          light: "#EFF6FF", // blue-50
          surface: "#DBEAFE", // blue-100
        },
        // Background & Surface
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#0F172A", // slate-900
        },
        surface: {
          DEFAULT: "#F9FAFB", // gray-50
          elevated: "#FFFFFF",
          dark: "#1E293B", // slate-800
          "dark-elevated": "#334155", // slate-700
        },
        // Borders
        border: {
          DEFAULT: "#E5E7EB", // gray-200
          focus: "#DC2626", // red-600
          dark: "#334155", // slate-700
          "dark-focus": "#EF4444", // red-500
        },
        // Text & Typography
        "text-primary": "#111827", // gray-900
        "text-secondary": "#6B7280", // gray-500
        "text-tertiary": "#9CA3AF", // gray-400
        "text-on-primary": "#FFFFFF",
        "text-dark-primary": "#F1F5F9", // slate-100
        "text-dark-secondary": "#94A3B8", // slate-400
        "text-dark-tertiary": "#64748B", // slate-500
        // Overlay
        overlay: {
          DEFAULT: "rgba(0, 0, 0, 0.4)", // #00000066
          dark: "rgba(0, 0, 0, 0.7)", // #000000B3
        },
      },
      fontFamily: {
        inter: ["Inter_400Regular", "sans-serif"],
        "inter-regular": ["Inter_400Regular", "sans-serif"],
        "inter-medium": ["Inter_500Medium", "sans-serif"],
        "inter-semibold": ["Inter_600SemiBold", "sans-serif"],
        "inter-bold": ["Inter_700Bold", "sans-serif"],
      },
      fontSize: {
        display: ["28px", { lineHeight: "34px", letterSpacing: "-0.5px" }],
        h1: ["24px", { lineHeight: "30px", letterSpacing: "-0.3px" }],
        h2: ["20px", { lineHeight: "26px", letterSpacing: "-0.2px" }],
        h3: ["17px", { lineHeight: "22px", letterSpacing: "0px" }],
        body: ["15px", { lineHeight: "22px", letterSpacing: "0px" }],
        "body-medium": ["15px", { lineHeight: "22px", letterSpacing: "0px" }],
        caption: ["13px", { lineHeight: "18px", letterSpacing: "0.1px" }],
        "caption-medium": [
          "13px",
          { lineHeight: "18px", letterSpacing: "0.1px" },
        ],
        overline: ["11px", { lineHeight: "16px", letterSpacing: "0.8px" }],
        button: ["15px", { lineHeight: "20px", letterSpacing: "0.3px" }],
        "button-small": [
          "13px",
          { lineHeight: "18px", letterSpacing: "0.3px" },
        ],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        base: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "40px",
        "4xl": "48px",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        full: "9999px",
      },
      boxShadow: {
        low: "0 1px 3px rgba(0, 0, 0, 0.08)",
        medium: "0 2px 8px rgba(0, 0, 0, 0.12)",
        high: "0 4px 16px rgba(0, 0, 0, 0.16)",
      },
    },
  },
  plugins: [],
};
