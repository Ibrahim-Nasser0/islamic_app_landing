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

  const titleAr = typeof body.title_ar === "string" ? body.title_ar.trim().slice(0, 240) : "";
  if (!titleAr) {
    return NextResponse.json(
      { ok: false, error: "Arabic notice text is required" },
      { status: 400 }
    );
  }

  const variant: SiteNoticeVariant = VALID_VARIANTS.has(body.variant as SiteNoticeVariant)
    ? (body.variant as SiteNoticeVariant)
    : "info";

  const isActive = Boolean(body.is_active);
  if (isActive) {
    await auth.supabase
      .from("site_notices")
      .update({ is_active: false })
      .eq("is_active", true);
  }

  const { data, error } = await auth.supabase
    .from("site_notices")
    .insert({
      title_ar: titleAr,
      title_en:
        typeof body.title_en === "string"
          ? body.title_en.trim().slice(0, 240) || null
          : null,
      cta_label_ar:
        typeof body.cta_label_ar === "string"
          ? body.cta_label_ar.trim().slice(0, 60) || null
          : null,
      cta_label_en:
        typeof body.cta_label_en === "string"
          ? body.cta_label_en.trim().slice(0, 60) || null
          : null,
      cta_url: sanitizeCtaUrl(body.cta_url),
      variant,
      is_active: isActive,
      starts_at: parseOptionalDate(body.starts_at),
      ends_at: parseOptionalDate(body.ends_at),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "notice.create",
    entityType: "site_notices",
    entityId: data.id,
    summary: `إنشاء تنبيه: "${data.title_ar.slice(0, 50)}" (${data.is_active ? "مفعّل" : "متوقف"})`,
    metadata: { variant: data.variant, is_active: data.is_active },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true, item: data }, { status: 201 });
}
