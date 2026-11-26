import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  getSupabasePublishableKey,
  getSupabaseServiceKey,
  getSupabaseUrl,
} from "./config";

export async function createSupabaseServerClient() {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies; middleware or route handlers handle refresh.
        }
      },
    },
  });
}

export function createSupabasePublicClient() {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createSupabaseServiceClient() {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export type AdminAuthResult =
  | { status: "unauthenticated" }
  | { status: "not_admin"; email: string | null }
  | {
      status: "authorized";
      supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
      user: NonNullable<
        Awaited<
          ReturnType<
            NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>["auth"]["getUser"]
          >
        >["data"]["user"]
      >;
      admin: {
        user_id: string;
        email: string;
        role: "owner" | "admin";
        created_at: string;
      };
    };

export async function getAdminAuthStatus(): Promise<AdminAuthResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { status: "unauthenticated" };

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { status: "unauthenticated" };

  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id, email, role, created_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminRecord) {
    return { status: "not_admin", email: user.email ?? null };
  }

  return {
    status: "authorized",
    supabase,
    user,
    admin: adminRecord as {
      user_id: string;
      email: string;
      role: "owner" | "admin";
      created_at: string;
    },
  };
}

export async function getAuthenticatedAdmin() {
  const result = await getAdminAuthStatus();
  if (result.status !== "authorized") return null;
  return {
    supabase: result.supabase,
    user: result.user,
    admin: result.admin,
  };
}
