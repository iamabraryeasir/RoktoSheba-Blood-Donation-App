import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Linking, Platform } from "react-native";
import {
  AppPermissionStatus,
  AppPermissionType,
} from "../types/permission.types";

export interface PermissionCheckResult {
  status: AppPermissionStatus;
  canAskAgain: boolean;
  isServiceEnabled?: boolean;
}

export const permissionService = {
  /**
   * Check current status for a given permission type without triggering an OS dialog.
   */
  async checkPermission(
    type: AppPermissionType,
  ): Promise<PermissionCheckResult> {
    try {
      if (type === "camera") {
        const res = await ImagePicker.getCameraPermissionsAsync();
        return {
          status: this.mapStatus(res.status, res.canAskAgain),
          canAskAgain: res.canAskAgain,
        };
      }

      if (type === "mediaLibrary") {
        const res = await ImagePicker.getMediaLibraryPermissionsAsync();
        return {
          status: this.mapStatus(res.status, res.canAskAgain),
          canAskAgain: res.canAskAgain,
        };
      }

      if (type === "location") {
        const isEnabled = await Location.hasServicesEnabledAsync().catch(
          () => false,
        );
        const res = await Location.getForegroundPermissionsAsync();
        return {
          status: this.mapStatus(res.status, res.canAskAgain),
          canAskAgain: res.canAskAgain,
          isServiceEnabled: isEnabled,
        };
      }

      return { status: "undetermined", canAskAgain: true };
    } catch (err) {
      console.warn(`[PermissionService] Check failed for ${type}:`, err);
      return { status: "undetermined", canAskAgain: true };
    }
  },

  /**
   * Request permission from the system.
   */
  async requestPermission(
    type: AppPermissionType,
  ): Promise<PermissionCheckResult> {
    try {
      if (type === "camera") {
        const res = await ImagePicker.requestCameraPermissionsAsync();
        return {
          status: this.mapStatus(res.status, res.canAskAgain),
          canAskAgain: res.canAskAgain,
        };
      }

      if (type === "mediaLibrary") {
        const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
        return {
          status: this.mapStatus(res.status, res.canAskAgain),
          canAskAgain: res.canAskAgain,
        };
      }

      if (type === "location") {
        const isEnabled = await Location.hasServicesEnabledAsync().catch(
          () => false,
        );
        const res = await Location.requestForegroundPermissionsAsync();
        return {
          status: this.mapStatus(res.status, res.canAskAgain),
          canAskAgain: res.canAskAgain,
          isServiceEnabled: isEnabled,
        };
      }

      return { status: "undetermined", canAskAgain: true };
    } catch (err) {
      console.error(`[PermissionService] Request failed for ${type}:`, err);
      return { status: "denied", canAskAgain: false };
    }
  },

  /**
   * Open the app's system settings page.
   */
  async openAppSettings(): Promise<void> {
    try {
      if (Platform.OS === "ios") {
        await Linking.openURL("app-settings:");
      } else {
        await Linking.openSettings();
      }
    } catch (err) {
      console.warn("[PermissionService] Failed to open app settings:", err);
      await Linking.openSettings();
    }
  },

  /**
   * Maps Expo PermissionStatus to unified AppPermissionStatus.
   */
  mapStatus(
    status: ImagePicker.PermissionStatus | Location.PermissionStatus,
    canAskAgain: boolean,
  ): AppPermissionStatus {
    if (status === "granted") {
      return "granted";
    }
    if (status === "undetermined") {
      return "undetermined";
    }
    // If status is 'denied' and OS won't allow asking again (user selected "Never ask again" or iOS blocked)
    if (!canAskAgain) {
      return "blocked";
    }
    return "denied";
  },
};
