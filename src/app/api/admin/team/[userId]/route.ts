import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { recordAdminLog } from "@/lib/supabase/audit";
import {
  createSupabaseServiceClient,
  getAuthenticatedAdmin,
} from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (auth.admin.role !== "owner") {
    return NextResponse.json(
      { ok: false, error: "هذه الصلاحية مقتصرة على المالك (Owner) فقط." },
      { status: 403 }
    );
  }

  const { userId } = await context.params;
  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل." },
      { status: 400 }
    );
  }

  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return NextResponse.json(
      {
        ok: false,
        error: "مفتاح SUPABASE_SERVICE_ROLE_KEY غير مضبوط في متغيرات البيئة.",
      },
      { status: 503 }
    );
  }

  const { data: targetRow } = await serviceClient
    .from("admin_users")
    .select("user_id, email, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (!targetRow) {
    return NextResponse.json(
      { ok: false, error: "المشرف غير موجود." },
      { status: 404 }
    );
  }
  if (targetRow.role === "owner" && targetRow.user_id !== auth.admin.user_id) {
    return NextResponse.json(
      { ok: false, error: "لا يمكن تعديل كلمة مرور Owner آخر." },
      { status: 403 }
    );
  }

  const { error: resetError } = await serviceClient.auth.admin.updateUserById(
    userId,
    { password }
  );

  if (resetError) {
    return NextResponse.json(
      { ok: false, error: resetError.message },
      { status: 400 }
    );
  }

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "admin.password_reset",
    entityType: "admin_users",
    entityId: userId,
    summary: `إعادة تعيين كلمة مرور المشرف (${targetRow.email})`,
    metadata: { targetEmail: targetRow.email },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (auth.admin.role !== "owner") {
    return NextResponse.json(
      { ok: false, error: "هذه الصلاحية مقتصرة على المالك (Owner) فقط." },
      { status: 403 }
    );
  }

  const { userId } = await context.params;
  if (userId === auth.admin.user_id) {
    return NextResponse.json(
      { ok: false, error: "لا يمكنك حذف حساب المالك الحالي." },
      { status: 400 }
    );
  }

  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return NextResponse.json(
      {
        ok: false,
        error: "مفتاح SUPABASE_SERVICE_ROLE_KEY غير مضبوط في متغيرات البيئة.",
      },
      { status: 503 }
    );
  }

  const { data: targetRow } = await serviceClient
    .from("admin_users")
    .select("user_id, email, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (!targetRow) {
    return NextResponse.json(
      { ok: false, error: "المشرف غير موجود." },
      { status: 404 }
    );
  }
  if (targetRow.role === "owner") {
    return NextResponse.json(
      { ok: false, error: "لا يمكن حذف حساب Owner آخر من اللوحة." },
      { status: 400 }
    );
  }

  const { error: deleteAdminError } = await serviceClient
    .from("admin_users")
    .delete()
    .eq("user_id", userId);

  if (deleteAdminError) {
    return NextResponse.json(
      { ok: false, error: deleteAdminError.message },
      { status: 400 }
    );
  }

  await serviceClient.auth.admin.deleteUser(userId);

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "admin.delete",
    entityType: "admin_users",
    entityId: userId,
    summary: `حذف المشرف (${targetRow.email})`,
    metadata: { email: targetRow.email },
  });

  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
