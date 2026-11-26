import { Locale } from "./landing-content";
import { DownloadPlacement } from "./supabase/config";

export function buildTrackedDownloadPath(params: {
  source: DownloadPlacement;
  locale: Locale;
  version?: string;
  target?: string | null;
}): string {
  const query = new URLSearchParams({
    source: params.source,
    locale: params.locale,
  });
  if (params.version) {
    query.set("version", params.version);
  }
  if (params.target) {
    query.set("target", params.target);
  }
  return `/api/download?${query.toString()}`;
}
