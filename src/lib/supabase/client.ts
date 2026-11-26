import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl } from "./config";

export function createSupabaseBrowserClient() {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  if (!url || !key) {
    const missing: string[] = [];
    if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!key) {
      missing.push(
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (أو NEXT_PUBLIC_SUPABASE_ANON_KEY)"
      );
    }
    throw new Error(
      `لم يتم العثور على متغيرات البيئة في المتصفح: ${missing.join(" و ")}. تأكد من إضافتها في إعدادات الاستضافة وعمل Redeploy.`
    );
  }
  return createBrowserClient(url, key);
}
