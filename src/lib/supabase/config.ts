export type ReleaseHighlightType = "feature" | "improvement" | "fix";

export interface ReleaseHighlight {
  type: ReleaseHighlightType;
  text: string;
}

export type ReleaseType = "major" | "minor" | "patch" | "hotfix";

export interface AppReleaseItem {
  id: string;
  version: string;
  release_type: ReleaseType;
  title_ar: string;
  title_en: string | null;
  summary_ar: string | null;
  summary_en: string | null;
  highlights_ar: ReleaseHighlight[];
  highlights_en: ReleaseHighlight[];
  apk_url: string | null;
  github_release_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  released_at: string;
  created_at: string;
  updated_at: string;
}

export type SiteNoticeVariant = "info" | "release" | "warning";

export interface SiteNoticeItem {
  id: string;
  title_ar: string;
  title_en: string | null;
  cta_label_ar: string | null;
  cta_label_en: string | null;
  cta_url: string | null;
  variant: SiteNoticeVariant;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export type FeedbackCategory = "bug" | "suggestion" | "adhan_times" | "other";
export type FeedbackStatus = "new" | "reviewing" | "resolved" | "archived";
export type FeedbackPriority = "low" | "medium" | "high" | "critical";

export interface FeedbackItem {
  id: string;
  idempotency_key: string | null;
  category: FeedbackCategory;
  message: string;
  device_info: string | null;
  contact: string | null;
  locale: "ar" | "en";
  app_version: string | null;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  admin_notes: string | null;
  github_issue_url: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export type DownloadPlacement =
  | "hero"
  | "download_section"
  | "sticky_cta"
  | "qr"
  | "timeline"
  | "unknown";

export interface DownloadEventItem {
  id: number;
  version: string;
  file_name: string | null;
  placement: DownloadPlacement;
  locale: "ar" | "en";
  created_at: string;
}

export type AdminRole = "owner" | "admin";

export interface AdminUserItem {
  user_id: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

export interface AdminLogItem {
  id: number;
  actor_user_id: string | null;
  actor_email: string;
  actor_role: AdminRole;
  action: string;
  entity_type: string;
  entity_id: string | null;
  summary: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ""
  ).replace(/\/+$/, "");
}

export function getSupabasePublishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  );
}

export function getSupabaseServiceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function hasPublicSupabaseEnv(): boolean {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}

export function hasServiceSupabaseEnv(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}
