"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { isDemoAuthEnabled } from "@/lib/auth-config";
import { getDemoUser, signOutDemoUser, type DemoAuthUser } from "@/lib/demo-auth";

type AuthSessionContextValue = {
  isConfigured: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  demoUser: DemoAuthUser | null;
  authNotice: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | undefined>(undefined);

function mapDemoUserToAuthUser(demoUser: DemoAuthUser | null): User | null {
  if (!demoUser) return null;

  return {
    id: demoUser.id,
    email: demoUser.email,
    app_metadata: {},
    user_metadata: { mode: "demo" },
    aud: "authenticated",
    created_at: demoUser.createdAt,
  } as User;
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const demoMode = !supabase && isDemoAuthEnabled();
  const [session, setSession] = useState<Session | null>(null);
  const [demoUser, setDemoUser] = useState<DemoAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase) || demoMode);
  const [authNotice, setAuthNotice] = useState<string | null>(demoMode ? "Demo auth mode is enabled until Supabase is configured." : null);

  async function refreshSession() {
    if (demoMode) {
      setDemoUser(getDemoUser());
      setSession(null);
      setIsLoading(false);
      return;
    }

    if (!supabase) {
      setSession(null);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      setAuthNotice(error.message);
      setSession(null);
      setIsLoading(false);
      return;
    }

    setSession(data.session ?? null);
    setIsLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (demoMode) {
        if (cancelled) return;
        setDemoUser(getDemoUser());
        setSession(null);
        setIsLoading(false);
        return;
      }

      if (!supabase) {
        if (cancelled) return;
        setSession(null);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();

      if (cancelled) return;

      if (error) {
        setAuthNotice(error.message);
        setSession(null);
        setIsLoading(false);
        return;
      }

      setSession(data.session ?? null);
      setIsLoading(false);
    }

    init();

    if (!supabase || demoMode) {
      return () => {
        cancelled = true;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (cancelled) return;

      setSession(nextSession ?? null);
      setIsLoading(false);

      if (event === "SIGNED_IN") {
        setAuthNotice("You are signed in. Your ArkAgentic account session is now active.");
      } else if (event === "SIGNED_OUT") {
        setAuthNotice("You have been signed out.");
      } else if (event === "TOKEN_REFRESHED") {
        setAuthNotice(null);
      }
    });

    const fallback = window.setTimeout(() => {
      if (!cancelled) {
        setIsLoading(false);
      }
    }, 1500);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      subscription.unsubscribe();
    };
  }, [demoMode, supabase]);

  const resolvedUser = demoMode ? mapDemoUserToAuthUser(demoUser) : session?.user ?? null;

  const value: AuthSessionContextValue = {
    isConfigured: Boolean(supabase),
    isDemoMode: demoMode,
    isLoading,
    session,
    user: resolvedUser,
    demoUser,
    authNotice,
    refreshSession,
    signOut: async () => {
      if (demoMode) {
        signOutDemoUser();
        setDemoUser(null);
        setAuthNotice("You have been signed out of demo auth mode.");
        setIsLoading(false);
        return;
      }

      if (!supabase) return;
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthNotice(error.message);
      }
      setSession(null);
      setIsLoading(false);
    },
  };

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return context;
}
