import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { recordAdminLog } from "@/lib/supabase/audit";
import { FeedbackPriority, FeedbackStatus } from "@/lib/supabase/config";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

const VALID_STATUSES = new Set<FeedbackStatus>([
  "new",
  "reviewing",
  "resolved",
  "archived",
]);

const VALID_PRIORITIES = new Set<FeedbackPriority>([
  "low",
  "medium",
  "high",
  "critical",
]);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: {
    status?: string;
    priority?: string;
    admin_notes?: string | null;
    github_issue_url?: string | null;
  };

  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!VALID_STATUSES.has(body.status as FeedbackStatus)) {
      return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
    }
    updatePayload.status = body.status;
    updatePayload.resolved_at =
      body.status === "resolved" ? new Date().toISOString() : null;
  }

  if (body.priority !== undefined) {
    if (!VALID_PRIORITIES.has(body.priority as FeedbackPriority)) {
      return NextResponse.json({ ok: false, error: "Invalid priority" }, { status: 400 });
    }
    updatePayload.priority = body.priority;
  }

  if (body.admin_notes !== undefined) {
    updatePayload.admin_notes =
      typeof body.admin_notes === "string"
        ? body.admin_notes.trim().slice(0, 2000) || null
        : null;
  }

  if (body.github_issue_url !== undefined) {
    const trimmed =
      typeof body.github_issue_url === "string"
        ? body.github_issue_url.trim().slice(0, 300)
        : "";
    if (trimmed && !trimmed.startsWith("https://")) {
      return NextResponse.json(
        { ok: false, error: "GitHub URL must start with https://" },
        { status: 400 }
      );
    }
    updatePayload.github_issue_url = trimmed || null;
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json(
      { ok: false, error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const { data, error } = await auth.supabase
    .from("feedback")
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
    action: "feedback.update",
    entityType: "feedback",
    entityId: id,
    summary: `تحديث بلاغ (${data.category}) إلى حالة: ${data.status}`,
    metadata: updatePayload,
  });

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
  const { error } = await auth.supabase.from("feedback").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "feedback.delete",
    entityType: "feedback",
    entityId: id,
    summary: `حذف بلاغ رقم ${id.slice(0, 8)}`,
  });

  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
