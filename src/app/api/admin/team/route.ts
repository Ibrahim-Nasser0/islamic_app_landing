import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { recordAdminLog } from "@/lib/supabase/audit";
import {
  createSupabaseServiceClient,
  getAuthenticatedAdmin,
} from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
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

  let body: { email?: string; password?: string };
  try {
    body = (await req.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "أدخل بريداً إلكترونياً صحيحاً." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل." },
      { status: 400 }
    );
  }

  const { data: existingAdmin } = await serviceClient
    .from("admin_users")
    .select("user_id")
    .ilike("email", email)
    .maybeSingle();

  if (existingAdmin) {
    return NextResponse.json(
      { ok: false, error: "هذا البريد مضاف بالفعل في فريق الإدارة." },
      { status: 409 }
    );
  }

  let targetUserId: string | null = null;
  const { data: created, error: createError } =
    await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError) {
    const msg = createError.message.toLowerCase();
    if (msg.includes("already") || msg.includes("exists") || msg.includes("registered")) {
      const { data: listData } = await serviceClient.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      const existingAuthUser = listData?.users?.find(
        (u) => u.email?.toLowerCase() === email
      );
      if (existingAuthUser) {
        await serviceClient.auth.admin.updateUserById(existingAuthUser.id, {
          password,
          email_confirm: true,
        });
        targetUserId = existingAuthUser.id;
      } else {
        return NextResponse.json(
          { ok: false, error: createError.message },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { ok: false, error: createError.message },
        { status: 400 }
      );
    }
  } else {
    targetUserId = created.user?.id ?? null;
  }

  if (!targetUserId) {
    return NextResponse.json(
      { ok: false, error: "تعذر إنشاء حساب المشرف." },
      { status: 500 }
    );
  }

  const { data: adminRow, error: insertError } = await serviceClient
    .from("admin_users")
    .insert({
      user_id: targetUserId,
      email,
      role: "admin",
    })
    .select("*")
    .single();

  if (insertError) {
    return NextResponse.json(
      { ok: false, error: insertError.message },
      { status: 400 }
    );
  }

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "admin.create",
    entityType: "admin_users",
    entityId: targetUserId,
    summary: `إضافة مشرف جديد (${email}) بدور admin`,
    metadata: { email, role: "admin" },
  });

  revalidatePath("/admin");
  return NextResponse.json({ ok: true, item: adminRow }, { status: 201 });
}
