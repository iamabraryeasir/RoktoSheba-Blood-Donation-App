import { supabase } from "@/lib/supabase/client";
import { Profile } from "@/types/database.types";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { authService } from "../services/authService";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  isPasswordRecovery: boolean;

  // Actions
  initializeAuth: () => () => void;
  loadUserProfile: (userId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  clearPasswordRecovery: () => void;
  setProfile: (profile: Profile | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isAdmin: false,
  isLoading: true,
  isInitialized: false,
  isPasswordRecovery: false,

  loadUserProfile: async (userId: string) => {
    try {
      const userProfile = await authService.fetchProfile(userId);
      set({
        profile: userProfile,
        isAdmin: userProfile?.role === "admin",
      });
    } catch (err) {
      console.warn("Failed to load user profile in store:", userId, err);
    }
  },

  refreshProfile: async () => {
    const user = get().user;
    if (user?.id) {
      await get().loadUserProfile(user.id);
    }
  },

  setProfile: (profile: Profile | null) => {
    set({
      profile,
      isAdmin: profile?.role === "admin",
    });
  },

  clearPasswordRecovery: () => {
    set({ isPasswordRecovery: false });
  },

  initializeAuth: () => {
    let profileChannel: ReturnType<typeof supabase.channel> | null = null;

    const setupProfileRealtime = (userId: string) => {
      if (profileChannel) {
        supabase.removeChannel(profileChannel);
      }
      profileChannel = supabase
        .channel(`profile:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${userId}`,
          },
          (payload) => {
            if (payload.new) {
              get().setProfile(payload.new as Profile);
            }
          },
        )
        .subscribe();
    };

    // 1. Fetch initial session
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        set({
          session,
          user: session?.user ?? null,
        });

        if (session?.user?.id) {
          setupProfileRealtime(session.user.id);
          await get().loadUserProfile(session.user.id);
        } else {
          set({ profile: null, isAdmin: false });
        }
      })
      .catch((err) => {
        console.error("Error fetching initial session:", err);
      })
      .finally(() => {
        set({ isLoading: false, isInitialized: true });
      });

    // 2. Auth State Change Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      set({
        session: currentSession,
        user: currentSession?.user ?? null,
        isPasswordRecovery: event === "PASSWORD_RECOVERY",
      });

      if (currentSession?.user?.id) {
        setupProfileRealtime(currentSession.user.id);
        await get().loadUserProfile(currentSession.user.id);
      } else {
        if (profileChannel) {
          supabase.removeChannel(profileChannel);
          profileChannel = null;
        }
        set({ profile: null, isAdmin: false });
      }

      set({ isLoading: false });
    });

    // Cleanup function
    return () => {
      if (profileChannel) {
        supabase.removeChannel(profileChannel);
      }
      subscription.unsubscribe();
    };
  },

  signInWithEmail: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const data = await authService.signInWithEmail(email, password);
      set({
        session: data.session,
        user: data.user,
      });
      if (data.user?.id) {
        await get().loadUserProfile(data.user.id);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const data = await authService.signUpWithEmail(email, password);
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      set({
        session: null,
        user: null,
        profile: null,
        isAdmin: false,
        isPasswordRecovery: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
