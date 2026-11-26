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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = {};

  if (typeof body.version === "string" && body.version.trim()) {
    updatePayload.version = body.version.trim().slice(0, 40);
  }
  if (typeof body.release_type === "string" && VALID_RELEASE_TYPES.has(body.release_type as ReleaseType)) {
    updatePayload.release_type = body.release_type;
  }
  if (typeof body.title_ar === "string" && body.title_ar.trim()) {
    updatePayload.title_ar = body.title_ar.trim().slice(0, 160);
  }
  if (body.title_en !== undefined) {
    updatePayload.title_en =
      typeof body.title_en === "string" ? body.title_en.trim().slice(0, 160) || null : null;
  }
  if (body.summary_ar !== undefined) {
    updatePayload.summary_ar =
      typeof body.summary_ar === "string" ? body.summary_ar.trim().slice(0, 1500) || null : null;
  }
  if (body.summary_en !== undefined) {
    updatePayload.summary_en =
      typeof body.summary_en === "string" ? body.summary_en.trim().slice(0, 1500) || null : null;
  }
  if (body.highlights_ar !== undefined) {
    updatePayload.highlights_ar = sanitizeHighlights(body.highlights_ar);
  }
  if (body.highlights_en !== undefined) {
    updatePayload.highlights_en = sanitizeHighlights(body.highlights_en);
  }
  if (body.apk_url !== undefined) {
    updatePayload.apk_url = sanitizeOptionalHttpsUrl(body.apk_url);
  }
  if (body.github_release_url !== undefined) {
    updatePayload.github_release_url = sanitizeOptionalHttpsUrl(body.github_release_url);
  }
  if (body.is_featured !== undefined) {
    updatePayload.is_featured = Boolean(body.is_featured);
  }
  if (body.is_published !== undefined) {
    updatePayload.is_published = Boolean(body.is_published);
  }
  if (typeof body.released_at === "string" && !Number.isNaN(Date.parse(body.released_at))) {
    updatePayload.released_at = new Date(body.released_at).toISOString();
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ ok: false, error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("app_releases")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "release.update",
    entityType: "app_releases",
    entityId: id,
    summary: `تعديل الإصدار ${data.version} (${data.is_published ? "منشور" : "مسودة"})`,
    metadata: { version: data.version, fields: Object.keys(updatePayload) },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true, item: data });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { error } = await auth.supabase.from("app_releases").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "release.delete",
    entityType: "app_releases",
    entityId: id,
    summary: `حذف إصدار من الـ Timeline (${id.slice(0, 8)})`,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
