import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { recordAdminLog } from "@/lib/supabase/audit";
import {
  createSupabaseServiceClient,
  getAuthenticatedAdmin,
} from "@/lib/supabase/server";

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

  // Also remove auth user so the account cannot authenticate and the email can be re-invited cleanly later
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
