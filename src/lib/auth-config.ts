const demoAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === "true";

export function isDemoAuthEnabled() {
  return demoAuthEnabled;
}
