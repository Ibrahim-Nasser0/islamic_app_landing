import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { recordAdminLog } from "@/lib/supabase/audit";
import { FeedbackStatus } from "@/lib/supabase/config";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

const VALID_STATUSES = new Set<FeedbackStatus>([
  "new",
  "reviewing",
  "resolved",
  "archived",
]);

function parseIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((id): id is string => typeof id === "string" && id.trim().length > 0)
    .slice(0, 100);
}

export async function PATCH(req: NextRequest) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { ids?: unknown; status?: string };
  try {
    body = (await req.json()) as { ids?: unknown; status?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const ids = parseIds(body.ids);
  if (ids.length === 0) {
    return NextResponse.json({ ok: false, error: "No items selected" }, { status: 400 });
  }
  if (!body.status || !VALID_STATUSES.has(body.status as FeedbackStatus)) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  const nextStatus = body.status as FeedbackStatus;
  const resolvedAt = nextStatus === "resolved" ? new Date().toISOString() : null;

  const { data, error } = await auth.supabase
    .from("feedback")
    .update({ status: nextStatus, resolved_at: resolvedAt })
    .in("id", ids)
    .select("*");

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "feedback.bulk_update",
    entityType: "feedback",
    entityId: null,
    summary: `تحديث جماعي لـ ${ids.length} بلاغ إلى حالة: ${nextStatus}`,
    metadata: { count: ids.length, status: nextStatus },
  });

  revalidatePath("/admin");
  return NextResponse.json({ ok: true, items: data ?? [] });
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { ids?: unknown };
  try {
    body = (await req.json()) as { ids?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const ids = parseIds(body.ids);
  if (ids.length === 0) {
    return NextResponse.json({ ok: false, error: "No items selected" }, { status: 400 });
  }

  const { error } = await auth.supabase.from("feedback").delete().in("id", ids);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "feedback.bulk_delete",
    entityType: "feedback",
    entityId: null,
    summary: `حذف جماعي لـ ${ids.length} بلاغ`,
    metadata: { count: ids.length },
  });

  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
