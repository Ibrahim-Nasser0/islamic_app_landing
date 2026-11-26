import { AdminRole } from "./config";
import { createSupabaseServerClient } from "./server";

type ServerClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

export async function recordAdminLog(params: {
  supabase: ServerClient;
  admin: {
    user_id: string;
    email: string;
    role: AdminRole;
  };
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await params.supabase.from("admin_logs").insert({
      actor_user_id: params.admin.user_id,
      actor_email: params.admin.email,
      actor_role: params.admin.role,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId ?? null,
      summary: params.summary,
      metadata: params.metadata ?? {},
    });
  } catch {
    // Audit log failures should not crash a completed admin action
  }
}
