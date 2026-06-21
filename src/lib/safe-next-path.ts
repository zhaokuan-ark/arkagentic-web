export function getSafeNextPath(value: string | null | undefined, fallback = "/apps") {
  if (!value) return fallback;

  try {
    const decoded = decodeURIComponent(value).trim();

    if (!decoded.startsWith("/")) return fallback;
    if (decoded.startsWith("//")) return fallback;
    if (decoded.includes("\\")) return fallback;

    return decoded || fallback;
  } catch {
    return fallback;
  }
}
