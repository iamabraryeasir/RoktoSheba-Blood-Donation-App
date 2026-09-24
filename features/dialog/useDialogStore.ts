import { create } from "zustand";

export type DialogVariant = "info" | "warning" | "error" | "success";

export interface DialogOptions {
  title: string;
  message: string;
  variant?: DialogVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogState {
  isOpen: boolean;
  title: string;
  message: string;
  variant: DialogVariant;
  confirmText: string;
  cancelText: string | null;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  showAlert: (options: DialogOptions) => void;
  showConfirm: (options: DialogOptions) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  title: "",
  message: "",
  variant: "info",
  confirmText: "OK",
  cancelText: null,
  onConfirm: null,
  onCancel: null,

  showAlert: (options) =>
    set({
      isOpen: true,
      title: options.title,
      message: options.message,
      variant: options.variant || "info",
      confirmText: options.confirmText || "OK",
      cancelText: null,
      onConfirm: options.onConfirm || null,
      onCancel: null,
    }),

  showConfirm: (options) =>
    set({
      isOpen: true,
      title: options.title,
      message: options.message,
      variant: options.variant || "warning",
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null,
    }),

  closeDialog: () =>
    set({
      isOpen: false,
      title: "",
      message: "",
      variant: "info",
      confirmText: "OK",
      cancelText: null,
      onConfirm: null,
      onCancel: null,
    }),
}));

// Quick helper functions for procedural usage anywhere
export const showAppAlert = (
  title: string,
  message: string,
  variant: DialogVariant = "info",
  onConfirm?: () => void,
) => {
  useDialogStore.getState().showAlert({ title, message, variant, onConfirm });
};

export const showAppConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant: DialogVariant = "warning",
) => {
  useDialogStore.getState().showConfirm({
    title,
    message,
    variant,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
  });
};
