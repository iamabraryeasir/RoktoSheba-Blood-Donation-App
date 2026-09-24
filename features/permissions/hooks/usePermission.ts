import { useCallback, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { permissionService } from "../services/permissionService";
import {
  AppPermissionStatus,
  AppPermissionType,
} from "../types/permission.types";

export function usePermission(type: AppPermissionType) {
  const [status, setStatus] = useState<AppPermissionStatus>("undetermined");
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [isServiceEnabled, setIsServiceEnabled] = useState<boolean | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);

  const check = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await permissionService.checkPermission(type);
      setStatus(res.status);
      setCanAskAgain(res.canAskAgain);
      if (res.isServiceEnabled !== undefined) {
        setIsServiceEnabled(res.isServiceEnabled);
      }
    } catch (err) {
      console.warn(`[usePermission] Failed to check ${type}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  const request = useCallback(async (): Promise<AppPermissionStatus> => {
    setIsLoading(true);
    try {
      const res = await permissionService.requestPermission(type);
      setStatus(res.status);
      setCanAskAgain(res.canAskAgain);
      if (res.isServiceEnabled !== undefined) {
        setIsServiceEnabled(res.isServiceEnabled);
      }
      return res.status;
    } catch (err) {
      console.error(`[usePermission] Failed to request ${type}:`, err);
      return "denied";
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  const openSettings = useCallback(async () => {
    await permissionService.openAppSettings();
  }, []);

  // Listen to AppState changes so returning from Settings updates status automatically
  useEffect(() => {
    check();

    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "active") {
          check();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [check]);

  return {
    status,
    isGranted: status === "granted",
    isBlocked: status === "blocked",
    isDenied: status === "denied",
    canAskAgain,
    isServiceEnabled,
    isLoading,
    check,
    request,
    openSettings,
  };
}
