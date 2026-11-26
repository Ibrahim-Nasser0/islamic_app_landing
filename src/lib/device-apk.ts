export type ApkArch = "arm64-v8a" | "armeabi-v7a" | "x86_64" | "universal";

export interface ApkVariant {
  arch: ApkArch;
  url: string;
  fileName: string;
  sizeMb: string | null;
  downloadCount: number;
}

export interface DeviceDetectionResult {
  arch: ApkArch;
  isAndroid: boolean;
  source: "client_hints" | "user_agent" | "platform" | "fallback";
}

export const APK_ARCH_ORDER: ApkArch[] = [
  "arm64-v8a",
  "armeabi-v7a",
  "x86_64",
  "universal",
];

export function isValidApkArch(value: string | null | undefined): value is ApkArch {
  return (
    value === "arm64-v8a" ||
    value === "armeabi-v7a" ||
    value === "x86_64" ||
    value === "universal"
  );
}

export function inferArchFromAssetName(fileName: string): ApkArch {
  const lower = fileName.toLowerCase();
  if (lower.includes("arm64-v8a") || lower.includes("arm64") || lower.includes("aarch64")) {
    return "arm64-v8a";
  }
  if (lower.includes("armeabi-v7a") || lower.includes("armeabi") || lower.includes("armv7")) {
    return "armeabi-v7a";
  }
  if (lower.includes("x86_64") || lower.includes("x64") || lower.includes("amd64")) {
    return "x86_64";
  }
  return "universal";
}

export function resolveApkVariant(
  variants: ApkVariant[],
  preferredArch: ApkArch
): ApkVariant | null {
  if (variants.length === 0) return null;
  return (
    variants.find((v) => v.arch === preferredArch) ??
    variants.find((v) => v.arch === "universal") ??
    variants.find((v) => v.arch === "arm64-v8a") ??
    variants[0]
  );
}

function matchArchFromStrings(
  ua: string,
  platform: string,
  hintArch: string,
  hintBitness: string
): { arch: ApkArch; source: DeviceDetectionResult["source"] } | null {
  const cleanArch = hintArch.replace(/["']/g, "").trim().toLowerCase();
  const cleanBits = hintBitness.replace(/["']/g, "").trim().toLowerCase();

  if (cleanArch.includes("arm")) {
    if (cleanBits === "32") return { arch: "armeabi-v7a", source: "client_hints" };
    if (cleanBits === "64") return { arch: "arm64-v8a", source: "client_hints" };
  }
  if (cleanArch.includes("x86")) {
    if (cleanBits === "64") return { arch: "x86_64", source: "client_hints" };
  }

  const lowerPlatform = platform.toLowerCase();
  if (lowerPlatform.includes("aarch64") || lowerPlatform.includes("arm64") || lowerPlatform.includes("armv8")) {
    return { arch: "arm64-v8a", source: "platform" };
  }
  if (lowerPlatform.includes("armv7")) {
    return { arch: "armeabi-v7a", source: "platform" };
  }
  if (lowerPlatform.includes("x86_64") || lowerPlatform.includes("amd64")) {
    return { arch: "x86_64", source: "platform" };
  }

  const lowerUa = ua.toLowerCase();
  if (lowerUa.includes("aarch64") || lowerUa.includes("arm64") || lowerUa.includes("armv8")) {
    return { arch: "arm64-v8a", source: "user_agent" };
  }
  if (lowerUa.includes("armeabi-v7a") || lowerUa.includes("armeabi") || lowerUa.includes("armv7")) {
    return { arch: "armeabi-v7a", source: "user_agent" };
  }
  if (lowerUa.includes("x86_64") || lowerUa.includes("x64") || lowerUa.includes("amd64")) {
    return { arch: "x86_64", source: "user_agent" };
  }

  return null;
}

/**
 * Ephemeral in-memory header inspection for server requests (e.g. QR scans / direct /api/download).
 * Never persisted or stored.
 */
export function detectDeviceApkArchFromHeaders(headers: Headers): DeviceDetectionResult {
  const ua = headers.get("user-agent") ?? "";
  const chPlatform = (headers.get("sec-ch-ua-platform") ?? "").replace(/["']/g, "").toLowerCase();
  const chArch = headers.get("sec-ch-ua-arch") ?? "";
  const chBitness = headers.get("sec-ch-ua-bitness") ?? "";

  const isAndroid = chPlatform.includes("android") || ua.toLowerCase().includes("android");
  if (!isAndroid) {
    return { arch: "universal", isAndroid: false, source: "fallback" };
  }

  const matched = matchArchFromStrings(ua, "", chArch, chBitness);
  if (matched) {
    return { arch: matched.arch, isAndroid: true, source: matched.source };
  }

  return { arch: "universal", isAndroid: true, source: "fallback" };
}

interface NavigatorUAData {
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{
    architecture?: string;
    bitness?: string;
    platform?: string;
  }>;
}

/**
 * Browser-side architecture detection using High-Entropy Client Hints with User-Agent fallback.
 * Runs strictly on-device in memory.
 */
export async function detectDeviceApkArchClient(): Promise<DeviceDetectionResult> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { arch: "universal", isAndroid: false, source: "fallback" };
  }

  const ua = navigator.userAgent || "";
  const navPlatform = navigator.platform || "";
  const uaData = (navigator as Navigator & { userAgentData?: NavigatorUAData }).userAgentData;

  let chPlatform = uaData?.platform ?? "";
  let chArch = "";
  let chBitness = "";

  if (uaData?.getHighEntropyValues) {
    try {
      const highEntropy = await uaData.getHighEntropyValues([
        "architecture",
        "bitness",
        "platform",
      ]);
      chArch = highEntropy.architecture ?? "";
      chBitness = highEntropy.bitness ?? "";
      chPlatform = highEntropy.platform ?? chPlatform;
    } catch {
      // High-entropy hints may be restricted by permissions policy
    }
  }

  const isAndroid =
    chPlatform.toLowerCase().includes("android") || ua.toLowerCase().includes("android");

  if (!isAndroid) {
    return { arch: "universal", isAndroid: false, source: "fallback" };
  }

  const matched = matchArchFromStrings(ua, navPlatform, chArch, chBitness);
  if (matched) {
    return { arch: matched.arch, isAndroid: true, source: matched.source };
  }

  return { arch: "universal", isAndroid: true, source: "fallback" };
}
