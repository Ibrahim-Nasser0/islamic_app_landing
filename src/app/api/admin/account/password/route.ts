import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { recordAdminLog } from "@/lib/supabase/audit";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/config";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = (await req.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword =
    typeof body.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword) {
    return NextResponse.json(
      { ok: false, error: "أدخل كلمة المرور الحالية." },
      { status: 400 }
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { ok: false, error: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل." },
      { status: 400 }
    );
  }
  if (currentPassword === newPassword) {
    return NextResponse.json(
      { ok: false, error: "كلمة المرور الجديدة يجب أن تختلف عن الحالية." },
      { status: 400 }
    );
  }

  // Verify current password against Supabase Auth before updating
  const verifier = createClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: verifyError } = await verifier.auth.signInWithPassword({
    email: auth.admin.email,
    password: currentPassword,
  });

  if (verifyError) {
    return NextResponse.json(
      { ok: false, error: "كلمة المرور الحالية غير صحيحة." },
      { status: 400 }
    );
  }

  const { error: updateError } = await auth.supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: updateError.message },
      { status: 400 }
    );
  }

  await recordAdminLog({
    supabase: auth.supabase,
    admin: auth.admin,
    action: "admin.password_change",
    entityType: "auth.users",
    entityId: auth.admin.user_id,
    summary: `تغيير كلمة مرور الحساب (${auth.admin.email})`,
  });

  return NextResponse.json({ ok: true });
}
