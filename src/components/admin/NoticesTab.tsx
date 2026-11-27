"use client";

import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  Edit3,
  Info,
  Loader2,
  Power,
  Trash2,
  X,
} from "lucide-react";
import { SANCTUARY_PRIMARY_CTA } from "@/components/GeometricMotifs";
import { SiteNoticeItem, SiteNoticeVariant } from "@/lib/supabase/config";
import { ToastType } from "./AdminUi";

export function NoticesTab({
  notices,
  onNoticesChange,
  onNotify,
}: {
  notices: SiteNoticeItem[];
  onNoticesChange: (next: SiteNoticeItem[]) => void;
  onNotify: (type: ToastType, message: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [ctaLabelAr, setCtaLabelAr] = useState("");
  const [ctaLabelEn, setCtaLabelEn] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [variant, setVariant] = useState<SiteNoticeVariant>("release");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setTitleAr("");
    setTitleEn("");
    setCtaLabelAr("");
    setCtaLabelEn("");
    setCtaUrl("");
    setVariant("release");
    setIsActive(true);
  };

  const loadForEdit = (item: SiteNoticeItem) => {
    setEditingId(item.id);
    setTitleAr(item.title_ar);
    setTitleEn(item.title_en ?? "");
    setCtaLabelAr(item.cta_label_ar ?? "");
    setCtaLabelEn(item.cta_label_en ?? "");
    setCtaUrl(item.cta_url ?? "");
    setVariant(item.variant);
    setIsActive(item.is_active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      const endpoint = editingId
        ? `/api/admin/notices/${editingId}`
        : "/api/admin/notices";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title_ar: titleAr,
          title_en: titleEn || null,
          cta_label_ar: ctaLabelAr || null,
          cta_label_en: ctaLabelEn || null,
          cta_url: ctaUrl || null,
          variant,
          is_active: isActive,
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        item?: SiteNoticeItem;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.item) {
        onNotify("error", data.error ?? "تعذر حفظ التنبيه.");
        return;
      }

      if (editingId) {
        onNoticesChange(
          notices.map((n) => {
            if (n.id === data.item!.id) return data.item!;
            return isActive ? { ...n, is_active: false } : n;
          })
        );
        onNotify("success", "تم تعديل التنبيه وتحديث الصفحة الرئيسية.");
      } else {
        onNoticesChange([
          data.item!,
          ...(isActive
            ? notices.map((n) => ({ ...n, is_active: false }))
            : notices),
        ]);
        onNotify("success", "تم إنشاء التنبيه وتحديث الصفحة الرئيسية.");
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const toggleNotice = async (item: SiteNoticeItem) => {
    const nextActive = !item.is_active;
    const res = await fetch(`/api/admin/notices/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: nextActive }),
    });
    const data = (await res.json()) as { ok?: boolean; item?: SiteNoticeItem };
    if (res.ok && data.ok && data.item) {
      onNoticesChange(
        notices.map((n) => {
          if (n.id === item.id) return data.item!;
          return nextActive ? { ...n, is_active: false } : n;
        })
      );
      onNotify(
        "success",
        nextActive ? "تم تفعيل التنبيه أعلى الموقع." : "تم إيقاف التنبيه."
      );
    } else {
      onNotify("error", "تعذر تغيير حالة التنبيه.");
    }
  };

  const deleteNotice = async (id: string) => {
    if (!window.confirm("حذف هذا التنبيه؟")) return;
    const res = await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
    if (res.ok) {
      onNoticesChange(notices.filter((n) => n.id !== id));
      if (editingId === id) resetForm();
      onNotify("success", "تم حذف التنبيه.");
    } else {
      onNotify("error", "تعذر حذف التنبيه.");
    }
  };

  const previewStyle =
    variant === "release"
      ? "border-[#D8B467]/35 bg-gradient-to-r from-[#1A2618] via-[#132922] to-[#1A2618] text-[#F6E2A8]"
      : variant === "warning"
        ? "border-[#F59E0B]/35 bg-gradient-to-r from-[#241B0D] via-[#1B160D] to-[#241B0D] text-[#FDE68A]"
        : "border-[#10B981]/30 bg-gradient-to-r from-[#0A1E18] via-[#0F2A22] to-[#0A1E18] text-[#D1FAE5]";

  const PreviewIcon =
    variant === "release"
      ? BellRing
      : variant === "warning"
        ? AlertTriangle
        : Info;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-4 rounded-2xl border border-[#D8B467]/30 bg-[#0D1915] p-5 lg:col-span-6"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-[#F4EFE4]">
            {editingId ? "تعديل التنبيه" : "إنشاء تنبيه أعلى الصفحة (Site Notice)"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/15 bg-[#07100D] px-2.5 text-xs text-[#92A49B] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
              <span>إلغاء</span>
            </button>
          )}
        </div>

        {/* Live Banner Preview */}
        <div className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${previewStyle}`}>
          <div className="flex min-w-0 items-center gap-2">
            <PreviewIcon className="h-4 w-4 shrink-0" />
            <span className="truncate font-medium">
              {titleAr.trim() || "معاينة شريط التنبيه كما سيظهر أعلى الصفحة"}
            </span>
          </div>
          {ctaLabelAr.trim() && (
            <span className="shrink-0 rounded-md border border-current/30 bg-black/25 px-2 py-0.5 text-[10px] font-bold">
              {ctaLabelAr}
            </span>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs text-[#92A49B]">نص التنبيه بالعربية *</label>
          <input
            type="text"
            required
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            placeholder="تم إطلاق الإصدار الجديد مع تحسين دقة أذان الفجر..."
            className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-[#92A49B]">النص بالإنجليزية (اختياري)</label>
          <input
            type="text"
            dir="ltr"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="New release is live with improved Fajr alarm reliability..."
            className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-[#92A49B]">نوع التنبيه</label>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as SiteNoticeVariant)}
              className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
            >
              <option value="release">إصدار جديد (ذهبي)</option>
              <option value="info">معلومة (زمردي)</option>
              <option value="warning">تنبيه مهم (كهرماني)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-[#92A49B]">رابط الزر (اختياري)</label>
            <input
              type="text"
              dir="ltr"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="#timeline أو https://..."
              className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-[#92A49B]">نص الزر (عربي)</label>
            <input
              type="text"
              value={ctaLabelAr}
              onChange={(e) => setCtaLabelAr(e.target.value)}
              placeholder="عرض التحديث"
              className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[#92A49B]">Button Label (EN)</label>
            <input
              type="text"
              dir="ltr"
              value={ctaLabelEn}
              onChange={(e) => setCtaLabelEn(e.target.value)}
              placeholder="View Release"
              className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
            />
          </div>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-[#F2EFE9]">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 accent-[#10B981]"
          />
          <span>تفعيل هذا التنبيه فوراً (ويتم إيقاف التنبيهات السابقة تلقائياً)</span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold ${SANCTUARY_PRIMARY_CTA}`}
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{editingId ? "حفظ تعديلات التنبيه" : "حفظ التنبيه"}</span>
        </button>
      </form>

      <div className="space-y-3 lg:col-span-6">
        <h3 className="text-sm font-bold text-[#F4EFE4]">
          سجل التنبيهات ({notices.length})
        </h3>
        {notices.length === 0 ? (
          <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-6 text-center text-xs text-[#92A49B]">
            لا توجد تنبيهات مضافة بعد.
          </div>
        ) : (
          notices.map((item) => (
            <div
              key={item.id}
              className={`flex items-start justify-between gap-3 rounded-2xl border p-4 transition-colors ${
                editingId === item.id
                  ? "border-[#D8B467] bg-[#12241D]"
                  : "border-[var(--sanctuary-border)] bg-[#0D1915]"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                      item.is_active
                        ? "bg-[#10B981]/15 text-[#6EE7B7]"
                        : "bg-white/10 text-[#92A49B]"
                    }`}
                  >
                    {item.is_active ? "مفعّل حالياً" : "متوقف"}
                  </span>
                  <span className="font-latin text-[10px] uppercase text-[#D8B467]">
                    {item.variant}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold text-[#F2EFE9]">
                  {item.title_ar}
                </p>
                {item.title_en && (
                  <p className="mt-1 text-[11px] text-[#92A49B]" dir="ltr">
                    {item.title_en}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => void toggleNotice(item)}
                  title={item.is_active ? "إيقاف" : "تفعيل"}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#07100D] text-[#D8B467] hover:bg-[#132922]"
                >
                  <Power className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => loadForEdit(item)}
                  title="تعديل"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#07100D] text-[#E5C67E] hover:bg-[#132922]"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => void deleteNotice(item.id)}
                  title="حذف"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 text-[#FCA5A5] hover:bg-[#EF4444]/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
