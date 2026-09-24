export type AppPermissionType = "camera" | "mediaLibrary" | "location";

export type AppPermissionStatus =
  | "granted"
  | "denied"
  | "blocked"
  | "undetermined";

export interface PermissionRationaleConfig {
  type: AppPermissionType;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  benefits: string[];
}

export const PERMISSION_CONFIGS: Record<
  AppPermissionType,
  PermissionRationaleConfig
> = {
  camera: {
    type: "camera",
    title: "Camera Access Needed",
    subtitle: "Take photos directly in RoktoSheba",
    description:
      "RoktoSheba requires camera access so you can take a live donor profile photo or capture hospital medical prescriptions / blood requisition documents.",
    icon: "camera",
    benefits: [
      "Capture and upload medical prescription proofs instantly",
      "Take a fresh donor profile avatar",
      "Ensure verified emergency blood requests",
    ],
  },
  mediaLibrary: {
    type: "mediaLibrary",
    title: "Photo Library Access Needed",
    subtitle: "Select existing photos from your device",
    description:
      "RoktoSheba needs access to your photo library to let you select existing images for profile pictures or hospital requisition slips.",
    icon: "image",
    benefits: [
      "Select hospital documents from your gallery",
      "Choose photos for your donor profile",
      "No unnecessary file access — only selected media is read",
    ],
  },
  location: {
    type: "location",
    title: "Location Access Needed",
    subtitle: "Find emergency blood matches near you",
    description:
      "RoktoSheba uses your device GPS to pinpoint your division, district, and area to match you with nearby blood donors and emergency hospital requests.",
    icon: "map-pin",
    benefits: [
      "Auto-detect your division and district without manual typing",
      "Calculate distance to emergency patients or blood banks",
      "Receive relevant blood donation requests in your immediate vicinity",
    ],
  },
};
