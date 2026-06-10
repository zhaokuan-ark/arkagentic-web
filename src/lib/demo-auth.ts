export type DemoAuthUser = {
  id: string;
  email: string;
  createdAt: string;
};

const STORAGE_KEY = "arkagentic_demo_auth_user";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createDemoUser(email: string): DemoAuthUser {
  const normalized = normalizeEmail(email);
  return {
    id: `demo_${Buffer.from(normalized).toString("base64url")}`,
    email: normalized,
    createdAt: new Date().toISOString(),
  };
}

export function getDemoUser(): DemoAuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as DemoAuthUser;
  } catch {
    return null;
  }
}

export function signInDemoUser(email: string) {
  if (typeof window === "undefined") return null;
  const user = createDemoUser(email);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function signOutDemoUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
