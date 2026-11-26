"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Loader2, Lock, ShieldAlert } from "lucide-react";
import {
  ManuscriptCorners,
  RubElHizbMark,
  SANCTUARY_PRIMARY_CTA,
} from "@/components/GeometricMotifs";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasPublicSupabaseEnv } from "@/lib/supabase/config";

const NOT_ADMIN_MESSAGE =
  "هذا الحساب غير مصرّح له بالدخول إلى لوحة الإدارة. يجب أن يكون البريد مضافاً في جدول admin_users.";

export function AdminLoginForm({
  initialNotAdmin,
}: {
  initialNotAdmin?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    initialNotAdmin ? NOT_ADMIN_MESSAGE : null
  );
  const [isNotAdminError, setIsNotAdminError] = useState(Boolean(initialNotAdmin));
  const isEnvConfigured = hasPublicSupabaseEnv();

  useEffect(() => {
    if (!initialNotAdmin) return;
    // Clear any lingering non-admin session so the user can sign in with an admin account cleanly
    try {
      const supabase = createSupabaseBrowserClient();
      void supabase.auth.signOut();
    } catch {
      // Ignore if env is missing
    }
  }, [initialNotAdmin]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setIsNotAdminError(false);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError || !signInData?.user) {
        let msg = "بيانات الدخول غير صحيحة.";
        const rawErr = (signInError?.message || "").toLowerCase();
        if (rawErr.includes("email not confirmed")) {
          msg = "البريد الإلكتروني غير مفعّل في Supabase Auth. يرجى تفعيله من لوحة التحكم (Authentication -> Users).";
        } else if (rawErr.includes("invalid login credentials")) {
          msg = "بيانات الدخول (البريد الإلكتروني أو كلمة المرور) غير صحيحة.";
        } else if (signInError?.message) {
          msg = `خطأ أثناء تسجيل الدخول: ${signInError.message}`;
        }
        setError(msg);
        setLoading(false);
        return;
      }

      const { data: adminRecord, error: adminCheckError } = await supabase
        .from("admin_users")
        .select("user_id, role")
        .eq("user_id", signInData.user.id)
        .maybeSingle();

      if (adminCheckError || !adminRecord) {
        await supabase.auth.signOut();
        setIsNotAdminError(true);
        setError(
          `الحساب (${signInData.user.email ?? email.trim()}) ليس من مشرفي الموقع (غير مسجّل كـ Admin في admin_users).`
        );
        setLoading(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (err: unknown) {
      console.error("Admin login error:", err);
      const rawMsg = err instanceof Error ? err.message : String(err);
      if (
        rawMsg.includes("متغيرات البيئة") ||
        rawMsg.includes("NEXT_PUBLIC") ||
        rawMsg.includes("Missing environment variables")
      ) {
        setError(
          "تعذر الاتصال بـ Supabase: متغيرات البيئة غير مدمجة في هذا الـ Build على السيرفر. تأكد من إضافة NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY في إعدادات الاستضافة (Vercel) ثم عمل Redeploy للمشروع."
        );
      } else {
        setError(`تعذر الاتصال بـ Supabase: ${rawMsg}`);
      }
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07100D] px-5 py-12">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-[#D8B467]/35 bg-[#0D1915] p-7 shadow-2xl sm:p-9">
        <ManuscriptCorners />

        <div className="flex flex-col items-center text-center">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[#D8B467]/50 bg-[#07100D] p-1">
            <Image
              src="/images/app_logo.png"
              alt="زاد المسلم"
              width={56}
              height={56}
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#D8B467]">
            <RubElHizbMark className="h-3 w-3" />
            <span>لوحة إدارة زاد المسلم</span>
          </div>
          <h1 className="font-sacred mt-1.5 text-2xl font-bold text-[#F4EFE4]">
            تسجيل دخول المشرف
          </h1>
          <p className="mt-1 text-xs text-[#92A49B]">
            الدخول مقصور على الحسابات المسجلة في جدول{" "}
            <code className="font-latin text-[#E5C67E]">admin_users</code>
          </p>
        </div>

        {!isEnvConfigured && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <div className="space-y-1 text-right">
              <p className="font-bold text-amber-300">
                تنبيه: مفاتيح Supabase غير متوفرة في هذا الـ Build
              </p>
              <p className="text-[11px] leading-relaxed text-amber-200/90">
                في منصة الاستضافة (Vercel)، يجب إضافة{" "}
                <code className="font-mono text-amber-300">NEXT_PUBLIC_SUPABASE_URL</code> و{" "}
                <code className="font-mono text-amber-300">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>{" "}
                ثم الضغط على <strong>Redeploy</strong> لتضمينها في كود المتصفح.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-7 space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-xs font-semibold text-[#F2EFE9]"
            >
              البريد الإلكتروني
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="h-11 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-4 text-sm text-[#F2EFE9] placeholder:text-[#5F7068] focus:border-[#D8B467] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-semibold text-[#F2EFE9]"
            >
              كلمة المرور
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-4 text-sm text-[#F2EFE9] placeholder:text-[#5F7068] focus:border-[#D8B467] focus:outline-none"
            />
          </div>

          {error && (
            <div
              role="alert"
              className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed ${
                isNotAdminError
                  ? "border-[#F59E0B]/45 bg-[#F59E0B]/10 text-[#FDE68A]"
                  : "border-[#EF4444]/40 bg-[#EF4444]/10 text-[#FCA5A5]"
              }`}
            >
              {isNotAdminError ? (
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#FBBF24]" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold disabled:opacity-60 ${SANCTUARY_PRIMARY_CTA}`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#F2D184]" />
            ) : (
              <Lock className="h-4 w-4 text-[#F2D184]" />
            )}
            <span>{loading ? "جاري التحقق..." : "دخول لوحة التحكم"}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#92A49B] transition-colors hover:text-[#E5C67E]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
