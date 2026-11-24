import { siteConfig } from "@/config/site";

export interface ReleaseDownloadInfo {
  downloadUrl: string;
  releasesPageUrl: string;
  version: string;
  fileName: string | null;
  fileSizeMb: string | null;
  hasDirectApk: boolean;
}

interface GitHubAsset {
  name?: string;
  size?: number;
  browser_download_url?: string;
}

interface GitHubReleaseResponse {
  tag_name?: string;
  html_url?: string;
  assets?: GitHubAsset[];
}

export async function getLatestReleaseInfo(): Promise<ReleaseDownloadInfo> {
  const fallback: ReleaseDownloadInfo = {
    downloadUrl: siteConfig.githubReleasesUrl,
    releasesPageUrl: siteConfig.githubAllReleasesUrl,
    version: siteConfig.defaultVersion,
    fileName: null,
    fileSizeMb: null,
    hasDirectApk: false,
  };

  try {
    const res = await fetch(
      `https://api.github.com/repos/${siteConfig.githubOwner}/${siteConfig.githubRepo}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 600 },
      }
    );

    if (!res.ok) return fallback;
    const data = (await res.json()) as GitHubReleaseResponse;
    const apkAsset = data.assets?.find(
      (a) =>
        typeof a.name === "string" &&
        a.name.toLowerCase().endsWith(".apk") &&
        typeof a.browser_download_url === "string"
    );

    const sizeMb =
      apkAsset?.size && apkAsset.size > 0
        ? (apkAsset.size / (1024 * 1024)).toFixed(1)
        : null;

    return {
      downloadUrl: apkAsset?.browser_download_url ?? data.html_url ?? fallback.downloadUrl,
      releasesPageUrl: data.html_url ?? fallback.releasesPageUrl,
      version: data.tag_name ?? siteConfig.defaultVersion,
      fileName: apkAsset?.name ?? null,
      fileSizeMb: sizeMb,
      hasDirectApk: Boolean(apkAsset?.browser_download_url),
    };
  } catch {
    return fallback;
  }
}
