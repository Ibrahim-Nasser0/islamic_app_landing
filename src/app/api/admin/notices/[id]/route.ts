import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { recordAdminLog } from "@/lib/supabase/audit";
import { SiteNoticeVariant } from "@/lib/supabase/config";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

const VALID_VARIANTS = new Set<SiteNoticeVariant>(["info", "release", "warning"]);

function sanitizeCtaUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().slice(0, 300);
  if (!trimmed) return null;
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }
  return null;
}

function parseOptionalDate(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const ms = Date.parse(raw);
  return Number.isNaN(ms) ? null : new Date(ms).toISOString();
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

  if (typeof body.title_ar === "string" && body.title_ar.trim()) {
    updatePayload.title_ar = body.title_ar.trim().slice(0, 240);
  }
  if (body.title_en !== undefined) {
    updatePayload.title_en =
      typeof body.title_en === "string" ? body.title_en.trim().slice(0, 240) || null : null;
  }
  if (body.cta_label_ar !== undefined) {
    updatePayload.cta_label_ar =
      typeof body.cta_label_ar === "string"
        ? body.cta_label_ar.trim().slice(0, 60) || null
        : null;
  }
  if (body.cta_label_en !== undefined) {
    updatePayload.cta_label_en =
      typeof body.cta_label_en === "string"
        ? body.cta_label_en.trim().slice(0, 60) || null
        : null;
  }
  if (body.cta_url !== undefined) {
    updatePayload.cta_url = sanitizeCtaUrl(body.cta_url);
  }
  if (typeof body.variant === "string" && VALID_VARIANTS.has(body.variant as SiteNoticeVariant)) {
    updatePayload.variant = body.variant;
  }
  if (body.starts_at !== undefined) {
    updatePayload.starts_at = parseOptionalDate(body.starts_at);
  }
  if (body.ends_at !== undefined) {
    updatePayload.ends_at = parseOptionalDate(body.ends_at);
  }
  if (body.is_active !== undefined) {
    const nextActive = Boolean(body.is_active);
    if (nextActive) {
      await auth.supabase
        .from("site_notices")
        .update({ is_active: false })
        .neq("id", id)
        .eq("is_active", true);
    }
    updatePayload.is_active = nextActive;
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ ok: false, error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("site_notices")
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
    action: "notice.update",
    entityType: "site_notices",
    entityId: id,
    summary: `تحديث تنبيه: "${data.title_ar.slice(0, 50)}" (${data.is_active ? "مفعّل" : "متوقف"})`,
    metadata: { fields: Object.keys(updatePayload), is_active: data.is_active },
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
  const { error } = await auth.supabase.from("site_notices").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "notice.delete",
    entityType: "site_notices",
    entityId: id,
    summary: `حذف تنبيه (${id.slice(0, 8)})`,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
