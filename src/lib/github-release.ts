import { siteConfig } from "@/config/site";
import {
  APK_ARCH_ORDER,
  ApkVariant,
  inferArchFromAssetName,
} from "./device-apk";

export interface ReleaseDownloadInfo {
  downloadUrl: string;
  releasesPageUrl: string;
  version: string;
  fileName: string | null;
  fileSizeMb: string | null;
  publishedAt: string | null;
  releaseNotes: string | null;
  hasDirectApk: boolean;
  variants: ApkVariant[];
}

export interface GitHubReleaseSummaryItem {
  version: string;
  name: string;
  publishedAt: string | null;
  htmlUrl: string;
  apkUrl: string | null;
  fileName: string | null;
  downloadCount: number;
  notes: string | null;
  variants: ApkVariant[];
}

export interface GitHubReleasesAggregate {
  totalApkDownloads: number;
  releases: GitHubReleaseSummaryItem[];
}

interface GitHubAsset {
  name?: string;
  size?: number;
  download_count?: number;
  browser_download_url?: string;
}

interface GitHubReleaseResponse {
  tag_name?: string;
  name?: string;
  html_url?: string;
  published_at?: string;
  body?: string;
  assets?: GitHubAsset[];
}

function pickPrimaryApkAsset(assets: GitHubAsset[] | undefined) {
  const apkAssets = (assets ?? []).filter(
    (a): a is GitHubAsset & { name: string; browser_download_url: string } =>
      typeof a.name === "string" &&
      a.name.toLowerCase().endsWith(".apk") &&
      typeof a.browser_download_url === "string"
  );

  const variantMap = new Map<string, ApkVariant>();
  for (const asset of apkAssets) {
    const arch = inferArchFromAssetName(asset.name);
    if (!variantMap.has(arch)) {
      variantMap.set(arch, {
        arch,
        url: asset.browser_download_url,
        fileName: asset.name,
        sizeMb:
          asset.size && asset.size > 0
            ? (asset.size / (1024 * 1024)).toFixed(1)
            : null,
        downloadCount:
          typeof asset.download_count === "number" ? asset.download_count : 0,
      });
    }
  }

  const variants: ApkVariant[] = [];
  for (const arch of APK_ARCH_ORDER) {
    const found = variantMap.get(arch);
    if (found) variants.push(found);
  }

  const primary =
    apkAssets.find((a) => a.name.toLowerCase().includes("universal")) ??
    apkAssets.find((a) => a.name.toLowerCase().includes("arm64")) ??
    apkAssets[0];

  const totalDownloadCount = apkAssets.reduce(
    (sum, a) => sum + (typeof a.download_count === "number" ? a.download_count : 0),
    0
  );

  return { primary, variants, totalDownloadCount };
}

export async function getLatestReleaseInfo(): Promise<ReleaseDownloadInfo> {
  const fallback: ReleaseDownloadInfo = {
    downloadUrl: siteConfig.githubReleasesUrl,
    releasesPageUrl: siteConfig.githubAllReleasesUrl,
    version: siteConfig.defaultVersion,
    fileName: null,
    fileSizeMb: null,
    publishedAt: null,
    releaseNotes: null,
    hasDirectApk: false,
    variants: [],
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
    const { primary: apkAsset, variants } = pickPrimaryApkAsset(data.assets);

    const sizeMb =
      apkAsset?.size && apkAsset.size > 0
        ? (apkAsset.size / (1024 * 1024)).toFixed(1)
        : null;

    const cleanNotes =
      typeof data.body === "string" && data.body.trim().length > 0
        ? data.body.trim()
        : null;

    return {
      downloadUrl: apkAsset?.browser_download_url ?? data.html_url ?? fallback.downloadUrl,
      releasesPageUrl: data.html_url ?? fallback.releasesPageUrl,
      version: data.tag_name ?? siteConfig.defaultVersion,
      fileName: apkAsset?.name ?? null,
      fileSizeMb: sizeMb,
      publishedAt: data.published_at ?? null,
      releaseNotes: cleanNotes,
      hasDirectApk: Boolean(apkAsset?.browser_download_url),
      variants,
    };
  } catch {
    return fallback;
  }
}

export async function getGitHubReleasesAggregate(): Promise<GitHubReleasesAggregate> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${siteConfig.githubOwner}/${siteConfig.githubRepo}/releases?per_page=20`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return { totalApkDownloads: 0, releases: [] };
    }

    const list = (await res.json()) as GitHubReleaseResponse[];
    if (!Array.isArray(list)) {
      return { totalApkDownloads: 0, releases: [] };
    }

    let totalApkDownloads = 0;
    const releases: GitHubReleaseSummaryItem[] = list
      .filter((item) => typeof item.tag_name === "string")
      .map((item) => {
        const { primary, variants, totalDownloadCount } = pickPrimaryApkAsset(item.assets);
        totalApkDownloads += totalDownloadCount;
        return {
          version: item.tag_name as string,
          name: (item.name || item.tag_name) as string,
          publishedAt: item.published_at ?? null,
          htmlUrl: item.html_url ?? siteConfig.githubAllReleasesUrl,
          apkUrl: primary?.browser_download_url ?? null,
          fileName: primary?.name ?? null,
          downloadCount: totalDownloadCount,
          notes:
            typeof item.body === "string" && item.body.trim().length > 0
              ? item.body.trim()
              : null,
          variants,
        };
      });

    return { totalApkDownloads, releases };
  } catch {
    return { totalApkDownloads: 0, releases: [] };
  }
}
