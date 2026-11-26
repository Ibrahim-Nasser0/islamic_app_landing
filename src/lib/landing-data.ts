import { getGitHubReleasesAggregate } from "./github-release";
import {
  AppReleaseItem,
  ReleaseHighlight,
  SiteNoticeItem,
} from "./supabase/config";
import { createSupabasePublicClient } from "./supabase/server";

export interface LandingDynamicData {
  downloadCount: number;
  siteDownloadCount: number;
  githubDownloadCount: number;
  activeNotice: SiteNoticeItem | null;
  releasesTimeline: AppReleaseItem[];
}

function normalizeHighlights(raw: unknown): ReleaseHighlight[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string") {
        return { type: "feature" as const, text: item };
      }
      if (item && typeof item === "object") {
        const obj = item as { type?: unknown; text?: unknown };
        const text = typeof obj.text === "string" ? obj.text.trim() : "";
        if (!text) return null;
        const type =
          obj.type === "fix" || obj.type === "improvement" || obj.type === "feature"
            ? obj.type
            : "feature";
        return { type, text };
      }
      return null;
    })
    .filter((item): item is ReleaseHighlight => item !== null);
}

export async function getLandingDynamicData(): Promise<LandingDynamicData> {
  const supabase = createSupabasePublicClient();

  const [githubAggregate, supabaseData] = await Promise.all([
    getGitHubReleasesAggregate(),
    (async () => {
      if (!supabase) {
        return {
          siteDownloadCount: 0,
          downloadsBaseline: null as number | null,
          activeNotice: null as SiteNoticeItem | null,
          releasesTimeline: [] as AppReleaseItem[],
        };
      }

      try {
        const [countRes, baselineRes, noticeRes, releasesRes] = await Promise.all([
          supabase.rpc("get_public_download_count"),
          supabase
            .from("site_counters")
            .select("value")
            .eq("key", "downloads_baseline")
            .maybeSingle(),
          supabase
            .from("site_notices")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("app_releases")
            .select("*")
            .eq("is_published", true)
            .order("released_at", { ascending: false })
            .limit(12),
        ]);

        const rawCount =
          typeof countRes.data === "number"
            ? countRes.data
            : Number(countRes.data ?? 0);
        const siteDownloadCount =
          Number.isFinite(rawCount) && rawCount > 0 ? rawCount : 0;

        const downloadsBaseline =
          baselineRes.data && typeof baselineRes.data.value === "number"
            ? baselineRes.data.value
            : null;

        const now = Date.now();
        let activeNotice: SiteNoticeItem | null = null;
        if (noticeRes.data) {
          const candidate = noticeRes.data as SiteNoticeItem;
          const startsOk =
            !candidate.starts_at || new Date(candidate.starts_at).getTime() <= now;
          const endsOk =
            !candidate.ends_at || new Date(candidate.ends_at).getTime() >= now;
          if (startsOk && endsOk) {
            activeNotice = candidate;
          }
        }

        const releasesTimeline: AppReleaseItem[] = Array.isArray(releasesRes.data)
          ? (releasesRes.data as AppReleaseItem[]).map((item) => ({
              ...item,
              highlights_ar: normalizeHighlights(item.highlights_ar),
              highlights_en: normalizeHighlights(item.highlights_en),
            }))
          : [];

        return {
          siteDownloadCount,
          downloadsBaseline,
          activeNotice,
          releasesTimeline,
        };
      } catch {
        return {
          siteDownloadCount: 0,
          downloadsBaseline: null as number | null,
          activeNotice: null as SiteNoticeItem | null,
          releasesTimeline: [] as AppReleaseItem[],
        };
      }
    })(),
  ]);

  const githubDownloadCount = githubAggregate.totalApkDownloads;
  const siteDownloadCount = supabaseData.siteDownloadCount;
  const baseline = supabaseData.downloadsBaseline;

  // When baseline is initialized, every new click through /api/download immediately
  // increases the total without waiting for GitHub cache and without double-counting.
  const downloadCount =
    baseline !== null
      ? Math.max(githubDownloadCount, baseline + siteDownloadCount)
      : Math.max(githubDownloadCount, siteDownloadCount);

  return {
    downloadCount,
    siteDownloadCount,
    githubDownloadCount,
    activeNotice: supabaseData.activeNotice,
    releasesTimeline: supabaseData.releasesTimeline,
  };
}
