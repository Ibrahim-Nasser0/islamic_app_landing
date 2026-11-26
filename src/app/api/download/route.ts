import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getLatestReleaseInfo } from "@/lib/github-release";
import { DownloadPlacement } from "@/lib/supabase/config";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

const VALID_PLACEMENTS = new Set<DownloadPlacement>([
  "hero",
  "download_section",
  "sticky_cta",
  "qr",
  "timeline",
  "unknown",
]);

function isAllowedGithubTarget(candidate: string): boolean {
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "https:") return false;
    const allowedPrefix = `/${siteConfig.githubOwner}/${siteConfig.githubRepo}/`;
    const isGithubWeb =
      parsed.hostname === "github.com" &&
      parsed.pathname.toLowerCase().startsWith(allowedPrefix.toLowerCase());
    const isGithubAssets =
      parsed.hostname === "objects.githubusercontent.com" ||
      parsed.hostname === "release-assets.githubusercontent.com";
    return isGithubWeb || isGithubAssets;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const rawSource = searchParams.get("source") ?? "unknown";
  const placement: DownloadPlacement = VALID_PLACEMENTS.has(rawSource as DownloadPlacement)
    ? (rawSource as DownloadPlacement)
    : "unknown";

  const locale = searchParams.get("locale") === "en" ? "en" : "ar";
  const requestedVersion = searchParams.get("version")?.trim().slice(0, 40) || null;
  const requestedTarget = searchParams.get("target")?.trim() || null;

  const latest = await getLatestReleaseInfo();
  const targetUrl =
    requestedTarget && isAllowedGithubTarget(requestedTarget)
      ? requestedTarget
      : latest.downloadUrl;

  const version = requestedVersion || latest.version;
  let fileName = latest.fileName;
  if (requestedTarget && isAllowedGithubTarget(requestedTarget)) {
    const lastSegment = requestedTarget.split("/").pop()?.split("?")[0] ?? null;
    if (lastSegment && lastSegment.toLowerCase().endsWith(".apk")) {
      fileName = lastSegment;
    }
  }

  const supabase = createSupabaseServiceClient();
  if (supabase) {
    try {
      await supabase.from("download_events").insert({
        version,
        file_name: fileName,
        placement,
        locale,
      });
    } catch {
      // Never block APK download if analytics insert fails
    }
  }

  const res = NextResponse.redirect(targetUrl, { status: 302 });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}
