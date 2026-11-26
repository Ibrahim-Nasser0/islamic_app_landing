import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { recordAdminLog } from "@/lib/supabase/audit";
import {
  ReleaseHighlight,
  ReleaseHighlightType,
  ReleaseType,
} from "@/lib/supabase/config";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

const VALID_RELEASE_TYPES = new Set<ReleaseType>([
  "major",
  "minor",
  "patch",
  "hotfix",
]);

const VALID_HIGHLIGHT_TYPES = new Set<ReleaseHighlightType>([
  "feature",
  "improvement",
  "fix",
]);

function sanitizeHighlights(raw: unknown): ReleaseHighlight[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const obj = item as { type?: unknown; text?: unknown };
      const text = typeof obj.text === "string" ? obj.text.trim().slice(0, 500) : "";
      if (!text) return null;
      const type: ReleaseHighlightType = VALID_HIGHLIGHT_TYPES.has(
        obj.type as ReleaseHighlightType
      )
        ? (obj.type as ReleaseHighlightType)
        : "feature";
      return { type, text };
    })
    .filter((item): item is ReleaseHighlight => item !== null);
}

function sanitizeOptionalHttpsUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().slice(0, 400);
  if (!trimmed) return null;
  return trimmed.startsWith("https://") ? trimmed : null;
}

export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const version = typeof body.version === "string" ? body.version.trim().slice(0, 40) : "";
  const titleAr = typeof body.title_ar === "string" ? body.title_ar.trim().slice(0, 160) : "";
  if (!version || !titleAr) {
    return NextResponse.json(
      { ok: false, error: "Version and Arabic title are required" },
      { status: 400 }
    );
  }

  const releaseType: ReleaseType = VALID_RELEASE_TYPES.has(
    body.release_type as ReleaseType
  )
    ? (body.release_type as ReleaseType)
    : "minor";

  const releasedAt =
    typeof body.released_at === "string" && !Number.isNaN(Date.parse(body.released_at))
      ? new Date(body.released_at).toISOString()
      : new Date().toISOString();

  const payload = {
    version,
    release_type: releaseType,
    title_ar: titleAr,
    title_en:
      typeof body.title_en === "string"
        ? body.title_en.trim().slice(0, 160) || null
        : null,
    summary_ar:
      typeof body.summary_ar === "string"
        ? body.summary_ar.trim().slice(0, 1500) || null
        : null,
    summary_en:
      typeof body.summary_en === "string"
        ? body.summary_en.trim().slice(0, 1500) || null
        : null,
    highlights_ar: sanitizeHighlights(body.highlights_ar),
    highlights_en: sanitizeHighlights(body.highlights_en),
    apk_url: sanitizeOptionalHttpsUrl(body.apk_url),
    github_release_url: sanitizeOptionalHttpsUrl(body.github_release_url),
    is_featured: Boolean(body.is_featured),
    is_published: Boolean(body.is_published),
    released_at: releasedAt,
  };

  const { data, error } = await auth.supabase
    .from("app_releases")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "release.create",
    entityType: "app_releases",
    entityId: data.id,
    summary: `إضافة إصدار ${data.version} (${data.is_published ? "منشور" : "مسودة"})`,
    metadata: { version: data.version, is_published: data.is_published },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true, item: data }, { status: 201 });
}
