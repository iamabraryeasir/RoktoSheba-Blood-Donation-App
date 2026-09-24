import { useAuthStore } from "../stores/useAuthStore";

export const useAuth = () => {
  const session = useAuthStore((s) => s.session);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isPasswordRecovery = useAuthStore((s) => s.isPasswordRecovery);

  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail);
  const signOut = useAuthStore((s) => s.signOut);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const clearPasswordRecovery = useAuthStore((s) => s.clearPasswordRecovery);

  return {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    isInitialized,
    isPasswordRecovery,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    refreshProfile,
    clearPasswordRecovery,
  };
};

export { useAuthStore };
