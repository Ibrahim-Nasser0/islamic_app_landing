"use client";

import { FormEvent, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Shield,
  Trash2,
  UserPlus,
} from "lucide-react";
import { SANCTUARY_PRIMARY_CTA } from "@/components/GeometricMotifs";
import { AdminRole, AdminUserItem } from "@/lib/supabase/config";

interface TeamAccountTabProps {
  currentUserId: string;
  currentEmail: string;
  currentRole: AdminRole;
  initialAdmins: AdminUserItem[];
}

export function TeamAccountTab({
  currentUserId,
  currentEmail,
  currentRole,
  initialAdmins,
}: TeamAccountTabProps) {
  const isOwner = currentRole === "owner";

  // Owner-only: Add admin state
  const [admins, setAdmins] = useState<AdminUserItem[]>(initialAdmins);
  const [newEmail, setNewEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [teamSuccess, setTeamSuccess] = useState<string | null>(null);

  // All admins/owner: Change own password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPass, setUpdatingPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  const handleAddAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (!isOwner || addingAdmin) return;
    setTeamError(null);
    setTeamSuccess(null);
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
        setTeamError(data.error ?? "تعذر إضافة المشرف.");
        return;
      }

      setAdmins((prev) => [...prev, data.item!]);
      setTeamSuccess(`تمت إضافة ${data.item.email} كمشرف بنجاح.`);
      setNewEmail("");
      setNewAdminPassword("");
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (member: AdminUserItem) => {
    if (!isOwner || member.role === "owner" || member.user_id === currentUserId) {
      return;
    }
    if (!window.confirm(`حذف المشرف ${member.email} وإلغاء دخوله للوحة؟`)) {
      return;
    }

    setTeamError(null);
    setTeamSuccess(null);
    setDeletingId(member.user_id);

    try {
      const res = await fetch(`/api/admin/team/${member.user_id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setTeamError(data.error ?? "تعذر حذف المشرف.");
        return;
      }
      setAdmins((prev) => prev.filter((a) => a.user_id !== member.user_id));
      setTeamSuccess(`تم حذف المشرف ${member.email}.`);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (updatingPass) return;
    setPassError(null);
    setPassSuccess(null);

    if (nextPassword.length < 8) {
      setPassError("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.");
      return;
    }
    if (nextPassword !== confirmPassword) {
      setPassError("تأكيد كلمة المرور غير متطابق.");
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
        setPassError(data.error ?? "تعذر تحديث كلمة المرور.");
        return;
      }

      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      setPassSuccess("تم تغيير كلمة المرور الخاصة بك بنجاح.");
    } finally {
      setUpdatingPass(false);
    }
  };

  return (
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
              مباشرة، ولن يتمكن المشرف من إضافة أو حذف مشرفين آخرين.
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

            {teamError && (
              <div className="flex items-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-xs text-[#FCA5A5]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{teamError}</span>
              </div>
            )}
            {teamSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 px-3 py-2 text-xs text-[#6EE7B7]">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{teamSuccess}</span>
              </div>
            )}

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
              {admins.map((member) => (
                <div
                  key={member.user_id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-[#07100D] px-4 py-3 text-xs"
                >
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

                  <div className="flex items-center gap-2">
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
                    )}
                  </div>
                </div>
              ))}
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

        {passError && (
          <div className="flex items-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-xs text-[#FCA5A5]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{passError}</span>
          </div>
        )}
        {passSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 px-3 py-2 text-xs text-[#6EE7B7]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{passSuccess}</span>
          </div>
        )}

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
  );
}
