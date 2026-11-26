"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Power, Trash2 } from "lucide-react";
import { SANCTUARY_PRIMARY_CTA } from "@/components/GeometricMotifs";
import { SiteNoticeItem, SiteNoticeVariant } from "@/lib/supabase/config";

export function NoticesTab({
  initialNotices,
}: {
  initialNotices: SiteNoticeItem[];
}) {
  const [notices, setNotices] = useState<SiteNoticeItem[]>(initialNotices);
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [ctaLabelAr, setCtaLabelAr] = useState("");
  const [ctaLabelEn, setCtaLabelEn] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [variant, setVariant] = useState<SiteNoticeVariant>("release");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSavedMsg(null);

    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
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

      const data = (await res.json()) as { ok?: boolean; item?: SiteNoticeItem };
      if (res.ok && data.ok && data.item) {
        setNotices((prev) => [
          data.item!,
          ...(isActive ? prev.map((n) => ({ ...n, is_active: false })) : prev),
        ]);
        setTitleAr("");
        setTitleEn("");
        setCtaLabelAr("");
        setCtaLabelEn("");
        setCtaUrl("");
        setSavedMsg("تم حفظ التنبيه وتحديث الصفحة الرئيسية.");
      }
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
      setNotices((prev) =>
        prev.map((n) => {
          if (n.id === item.id) return data.item!;
          return nextActive ? { ...n, is_active: false } : n;
        })
      );
    }
  };

  const deleteNotice = async (id: string) => {
    if (!window.confirm("حذف هذا التنبيه؟")) return;
    const res = await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotices((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-4 rounded-2xl border border-[#D8B467]/30 bg-[#0D1915] p-5 lg:col-span-6"
      >
        <h2 className="text-base font-bold text-[#F4EFE4]">
          إنشاء تنبيه أعلى الصفحة (Site Notice)
        </h2>

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

        {savedMsg && (
          <p className="flex items-center gap-1.5 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 px-3 py-2 text-xs text-[#6EE7B7]">
            <CheckCircle2 className="h-4 w-4" />
            <span>{savedMsg}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold ${SANCTUARY_PRIMARY_CTA}`}
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>حفظ التنبيه</span>
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
              className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-4"
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
