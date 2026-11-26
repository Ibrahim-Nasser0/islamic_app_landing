"use client";

import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  KeyRound,
  Loader2,
  Shield,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { SANCTUARY_PRIMARY_CTA } from "@/components/GeometricMotifs";
import { AdminRole, AdminUserItem } from "@/lib/supabase/config";
import { ToastType } from "./AdminUi";

interface TeamAccountTabProps {
  currentUserId: string;
  currentEmail: string;
  currentRole: AdminRole;
  admins: AdminUserItem[];
  hasServiceKey: boolean;
  onAdminsChange: (next: AdminUserItem[]) => void;
  onNotify: (type: ToastType, message: string) => void;
}

export function TeamAccountTab({
  currentUserId,
  currentEmail,
  currentRole,
  admins,
  hasServiceKey,
  onAdminsChange,
  onNotify,
}: TeamAccountTabProps) {
  const isOwner = currentRole === "owner";

  // Owner-only: Add & manage admins
  const [newEmail, setNewEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resetTargetId, setResetTargetId] = useState<string | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [resettingPass, setResettingPass] = useState(false);

  // All admins/owner: Change own password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPass, setUpdatingPass] = useState(false);

  const handleAddAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (!isOwner || addingAdmin) return;
    setAddingAdmin(true);

    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim(),
          password: newAdminPassword,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        item?: AdminUserItem;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.item) {
        onNotify("error", data.error ?? "تعذر إضافة المشرف.");
        return;
      }

      onAdminsChange([...admins, data.item!]);
      onNotify("success", `تمت إضافة ${data.item.email} كمشرف بنجاح.`);
      setNewEmail("");
      setNewAdminPassword("");
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleResetAdminPassword = async (member: AdminUserItem) => {
    if (!isOwner || resettingPass) return;
    if (resetPasswordValue.length < 8) {
      onNotify("error", "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.");
      return;
    }

    setResettingPass(true);
    try {
      const res = await fetch(`/api/admin/team/${member.user_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPasswordValue }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        onNotify("error", data.error ?? "تعذر تعيين كلمة المرور.");
        return;
      }
      setResetTargetId(null);
      setResetPasswordValue("");
      onNotify("success", `تم تحديث كلمة مرور المشرف ${member.email}.`);
    } finally {
      setResettingPass(false);
    }
  };

  const handleDeleteAdmin = async (member: AdminUserItem) => {
    if (!isOwner || member.role === "owner" || member.user_id === currentUserId) {
      return;
    }
    if (!window.confirm(`حذف المشرف ${member.email} وإلغاء دخوله للوحة؟`)) {
      return;
    }

    setDeletingId(member.user_id);
    try {
      const res = await fetch(`/api/admin/team/${member.user_id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        onNotify("error", data.error ?? "تعذر حذف المشرف.");
        return;
      }
      onAdminsChange(admins.filter((a) => a.user_id !== member.user_id));
      onNotify("success", `تم حذف المشرف ${member.email}.`);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (updatingPass) return;

    if (nextPassword.length < 8) {
      onNotify("error", "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.");
      return;
    }
    if (nextPassword !== confirmPassword) {
      onNotify("error", "تأكيد كلمة المرور غير متطابق.");
      return;
    }

    setUpdatingPass(true);
    try {
      const res = await fetch("/api/admin/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword: nextPassword,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        onNotify("error", data.error ?? "تعذر تحديث كلمة المرور.");
        return;
      }

      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      onNotify("success", "تم تغيير كلمة المرور الخاصة بك بنجاح.");
    } finally {
      setUpdatingPass(false);
    }
  };

  return (
    <div className="space-y-5">
      {isOwner && !hasServiceKey && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-4 py-3 text-xs text-[#FDE68A]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#FBBF24]" />
          <span>
            تنبيه: متغير <code className="font-latin font-bold">SUPABASE_SERVICE_ROLE_KEY</code> غير
            مضاف في البيئة الحالية؛ لذا لن تعمل أزرار إضافة أو حذف المشرفين أو إعادة تعيين كلمات مرورهم
            حتى تضيف المفتاح السري في <code className="font-latin">.env.local</code> أو Vercel.
          </span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Owner-only Team Management */}
        {isOwner && (
          <div className="space-y-5 lg:col-span-7">
            <form
              onSubmit={(e) => void handleAddAdmin(e)}
              className="space-y-4 rounded-2xl border border-[#D8B467]/30 bg-[#0D1915] p-5"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-[#D8B467]" />
                <h2 className="text-base font-bold text-[#F4EFE4]">
                  إضافة مشرف جديد (Admin)
                </h2>
              </div>
              <p className="text-xs text-[#92A49B]">
                أنت المالك (Owner)؛ يمكنك إنشاء حسابات مشرفين ببريد إلكتروني وكلمة مرور
                مباشرة، وإعادة تعيين كلمة مرورهم أو حذفهم في أي وقت.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-[#92A49B]">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="moderator@example.com"
                    className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[#92A49B]">
                    كلمة المرور المبدئية (8+ أحرف) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    dir="ltr"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addingAdmin}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold ${SANCTUARY_PRIMARY_CTA}`}
              >
                {addingAdmin ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                <span>إضافة المشرف</span>
              </button>
            </form>

            {/* Admins List */}
            <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-5">
              <h3 className="text-sm font-bold text-[#F4EFE4]">
                قائمة المشرفين الحاليين ({admins.length})
              </h3>
              <div className="mt-3 space-y-2.5">
                {admins.map((member) => {
                  const isResettingThis = resetTargetId === member.user_id;
                  return (
                    <div
                      key={member.user_id}
                      className="rounded-xl border border-white/5 bg-[#07100D] p-3.5 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Shield
                            className={`h-4 w-4 ${
                              member.role === "owner"
                                ? "text-[#D8B467]"
                                : "text-[#6EE7B7]"
                            }`}
                          />
                          <div>
                            <p dir="ltr" className="font-latin font-semibold text-[#F2EFE9]">
                              {member.email}
                            </p>
                            <p className="text-[10px] text-[#92A49B]">
                              أُضيف في{" "}
                              {new Date(member.created_at).toLocaleDateString("ar-EG")}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-lg px-2 py-0.5 font-latin text-[10px] font-bold uppercase ${
                              member.role === "owner"
                                ? "bg-[#D8B467]/20 text-[#F5DFA4]"
                                : "bg-[#10B981]/15 text-[#6EE7B7]"
                            }`}
                          >
                            {member.role}
                          </span>

                          {member.role !== "owner" && member.user_id !== currentUserId && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  if (isResettingThis) {
                                    setResetTargetId(null);
                                    setResetPasswordValue("");
                                  } else {
                                    setResetTargetId(member.user_id);
                                    setResetPasswordValue("");
                                  }
                                }}
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D8B467]/30 bg-[#132922] px-2.5 text-[11px] font-semibold text-[#E5C67E] hover:brightness-110"
                              >
                                <KeyRound className="h-3 w-3" />
                                <span>تعيين كلمة مرور</span>
                              </button>

                              <button
                                type="button"
                                disabled={deletingId === member.user_id}
                                onClick={() => void handleDeleteAdmin(member)}
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-2.5 text-[11px] font-semibold text-[#FCA5A5] hover:bg-[#EF4444]/20 disabled:opacity-50"
                              >
                                {deletingId === member.user_id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                                <span>حذف</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {isResettingThis && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                          <input
                            type="password"
                            minLength={8}
                            dir="ltr"
                            value={resetPasswordValue}
                            onChange={(e) => setResetPasswordValue(e.target.value)}
                            placeholder="كلمة مرور جديدة (8+ أحرف)"
                            className="h-9 flex-1 rounded-lg border border-[var(--sanctuary-border)] bg-[#0D1915] px-3 text-xs text-[#F2EFE9]"
                          />
                          <button
                            type="button"
                            disabled={resettingPass}
                            onClick={() => void handleResetAdminPassword(member)}
                            className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#D8B467]/45 bg-[#1B5E4F] px-3 text-[11px] font-bold text-[#FBF7ED]"
                          >
                            {resettingPass && <Loader2 className="h-3 w-3 animate-spin" />}
                            <span>حفظ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setResetTargetId(null);
                              setResetPasswordValue("");
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#92A49B] hover:text-white"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Password Change Card (Available for both Owner and Admin) */}
        <form
          onSubmit={(e) => void handlePasswordChange(e)}
          className={`space-y-4 rounded-2xl border border-[#D8B467]/30 bg-[#0D1915] p-5 ${
            isOwner ? "lg:col-span-5" : "lg:col-span-6"
          }`}
        >
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[#D8B467]" />
            <h2 className="text-base font-bold text-[#F4EFE4]">
              تغيير كلمة المرور الخاصة بي
            </h2>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#07100D] px-3.5 py-2.5 text-xs text-[#92A49B]">
            الحساب الحالي:{" "}
            <span dir="ltr" className="font-latin font-semibold text-[#E5C67E]">
              {currentEmail}
            </span>
          </div>

          <div>
            <label className="mb-1 block text-xs text-[#92A49B]">
              كلمة المرور الحالية *
            </label>
            <input
              type="password"
              required
              dir="ltr"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-[#92A49B]">
              كلمة المرور الجديدة (8+ أحرف) *
            </label>
            <input
              type="password"
              required
              minLength={8}
              dir="ltr"
              value={nextPassword}
              onChange={(e) => setNextPassword(e.target.value)}
              className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-[#92A49B]">
              تأكيد كلمة المرور الجديدة *
            </label>
            <input
              type="password"
              required
              minLength={8}
              dir="ltr"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
            />
          </div>

          <button
            type="submit"
            disabled={updatingPass}
            className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold ${SANCTUARY_PRIMARY_CTA}`}
          >
            {updatingPass ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            <span>تحديث كلمة المرور</span>
          </button>
        </form>
      </div>
    </div>
  );
}
