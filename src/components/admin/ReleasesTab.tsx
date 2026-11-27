"use client";

import { FormEvent, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Trash2,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import {
  ManuscriptCorners,
  RubElHizbMark,
  SANCTUARY_PRIMARY_CTA,
} from "@/components/GeometricMotifs";
import { GitHubReleaseSummaryItem } from "@/lib/github-release";
import {
  AppReleaseItem,
  ReleaseHighlight,
  ReleaseHighlightType,
  ReleaseType,
} from "@/lib/supabase/config";
import { ToastType } from "./AdminUi";

interface ReleasesTabProps {
  releases: AppReleaseItem[];
  githubReleases: GitHubReleaseSummaryItem[];
  onReleasesChange: (next: AppReleaseItem[]) => void;
  onNotify: (type: ToastType, message: string) => void;
}

interface ReleaseFormState {
  editingId: string | null;
  version: string;
  release_type: ReleaseType;
  released_at: string;
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
  apk_url: string;
  github_release_url: string;
  is_published: boolean;
  is_featured: boolean;
  highlights_ar: ReleaseHighlight[];
  highlights_en: ReleaseHighlight[];
}

function toLocalDateInput(iso: string | null | undefined): string {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function createEmptyForm(): ReleaseFormState {
  return {
    editingId: null,
    version: "",
    release_type: "minor",
    released_at: new Date().toISOString().slice(0, 10),
    title_ar: "",
    title_en: "",
    summary_ar: "",
    summary_en: "",
    apk_url: "",
    github_release_url: "",
    is_published: true,
    is_featured: false,
    highlights_ar: [{ type: "feature", text: "" }],
    highlights_en: [],
  };
}

export function ReleasesTab({
  releases,
  githubReleases,
  onReleasesChange,
  onNotify,
}: ReleasesTabProps) {
  const [form, setForm] = useState<ReleaseFormState>(createEmptyForm);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLang, setPreviewLang] = useState<"ar" | "en">("ar");

  const existingVersions = new Set(
    releases.map((r) => r.version.trim().toLowerCase())
  );
  const missingGithubReleases = githubReleases.filter(
    (gh) => !existingVersions.has(gh.version.trim().toLowerCase())
  );

  const importFromGithub = (tagName: string) => {
    const gh = githubReleases.find((r) => r.version === tagName);
    if (!gh) return;

    const noteLines = (gh.notes ?? "")
      .split(/\r?\n/)
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter((line) => line.length > 2)
      .slice(0, 8);

    setForm((prev) => ({
      ...prev,
      editingId: null,
      version: gh.version,
      released_at: toLocalDateInput(gh.publishedAt),
      title_ar: `إصدار ${gh.version}`,
      title_en: gh.name,
      apk_url: gh.apkUrl ?? "",
      github_release_url: gh.htmlUrl,
      highlights_ar:
        noteLines.length > 0
          ? noteLines.map((text) => ({ type: "feature" as const, text }))
          : [{ type: "feature" as const, text: "" }],
    }));
    onNotify("info", `تم استيراد مسودة الإصدار ${gh.version} من GitHub.`);
  };

  const loadForEdit = (item: AppReleaseItem) => {
    setForm({
      editingId: item.id,
      version: item.version,
      release_type: item.release_type,
      released_at: toLocalDateInput(item.released_at),
      title_ar: item.title_ar,
      title_en: item.title_en ?? "",
      summary_ar: item.summary_ar ?? "",
      summary_en: item.summary_en ?? "",
      apk_url: item.apk_url ?? "",
      github_release_url: item.github_release_url ?? "",
      is_published: item.is_published,
      is_featured: item.is_featured,
      highlights_ar:
        item.highlights_ar.length > 0
          ? item.highlights_ar
          : [{ type: "feature", text: "" }],
      highlights_en: item.highlights_en,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateHighlight = (
    lang: "ar" | "en",
    idx: number,
    patch: Partial<ReleaseHighlight>
  ) => {
    const key = lang === "ar" ? "highlights_ar" : "highlights_en";
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].map((row, i) => (i === idx ? { ...row, ...patch } : row)),
    }));
  };

  const moveHighlight = (lang: "ar" | "en", idx: number, dir: -1 | 1) => {
    const key = lang === "ar" ? "highlights_ar" : "highlights_en";
    setForm((prev) => {
      const list = [...prev[key]];
      const target = idx + dir;
      if (target < 0 || target >= list.length) return prev;
      [list[idx], list[target]] = [list[target], list[idx]];
      return { ...prev, [key]: list };
    });
  };

  const addHighlightRow = (lang: "ar" | "en") => {
    const key = lang === "ar" ? "highlights_ar" : "highlights_en";
    setForm((prev) => ({
      ...prev,
      [key]: [...prev[key], { type: "feature", text: "" }],
    }));
  };

  const removeHighlightRow = (lang: "ar" | "en", idx: number) => {
    const key = lang === "ar" ? "highlights_ar" : "highlights_en";
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    const payload = {
      version: form.version.trim(),
      release_type: form.release_type,
      released_at: form.released_at,
      title_ar: form.title_ar.trim(),
      title_en: form.title_en.trim() || null,
      summary_ar: form.summary_ar.trim() || null,
      summary_en: form.summary_en.trim() || null,
      apk_url: form.apk_url.trim() || null,
      github_release_url: form.github_release_url.trim() || null,
      is_published: form.is_published,
      is_featured: form.is_featured,
      highlights_ar: form.highlights_ar.filter((h) => h.text.trim().length > 0),
      highlights_en: form.highlights_en.filter((h) => h.text.trim().length > 0),
    };

    try {
      const endpoint = form.editingId
        ? `/api/admin/releases/${form.editingId}`
        : "/api/admin/releases";
      const method = form.editingId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        item?: AppReleaseItem;
        error?: string;
      };

      if (!res.ok || !data.ok || !data.item) {
        onNotify("error", data.error ?? "تعذر حفظ الإصدار.");
        return;
      }

      if (form.editingId) {
        onReleasesChange(
          releases.map((r) => (r.id === data.item!.id ? data.item! : r))
        );
        onNotify("success", `تم تحديث الإصدار ${data.item.version}.`);
      } else {
        onReleasesChange([data.item!, ...releases]);
        onNotify("success", `تمت إضافة الإصدار ${data.item.version} للـ Timeline.`);
      }
      setForm(createEmptyForm());
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (item: AppReleaseItem) => {
    const res = await fetch(`/api/admin/releases/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !item.is_published }),
    });
    const data = (await res.json()) as { ok?: boolean; item?: AppReleaseItem };
    if (res.ok && data.ok && data.item) {
      onReleasesChange(
        releases.map((r) => (r.id === item.id ? data.item! : r))
      );
      onNotify(
        "success",
        data.item.is_published
          ? `تم نشر الإصدار ${data.item.version} على الموقع.`
          : `تم إخفاء الإصدار ${data.item.version} كمسودة.`
      );
    } else {
      onNotify("error", "تعذر تغيير حالة النشر.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("حذف هذا الإصدار من الـ Timeline؟")) return;
    const res = await fetch(`/api/admin/releases/${id}`, { method: "DELETE" });
    if (res.ok) {
      onReleasesChange(releases.filter((r) => r.id !== id));
      if (form.editingId === id) setForm(createEmptyForm());
      onNotify("success", "تم حذف الإصدار.");
    } else {
      onNotify("error", "تعذر حذف الإصدار.");
    }
  };

  const previewHighlights =
    previewLang === "ar"
      ? form.highlights_ar.filter((h) => h.text.trim())
      : form.highlights_en.filter((h) => h.text.trim()).length > 0
        ? form.highlights_en.filter((h) => h.text.trim())
        : form.highlights_ar.filter((h) => h.text.trim());

  return (
    <div className="space-y-5">
      {/* Missing from GitHub quick banner */}
      {missingGithubReleases.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D8B467]/35 bg-[#12221C] px-4 py-3 text-xs">
          <div className="flex items-center gap-2 text-[#F5DFA4]">
            <RubElHizbMark className="h-4 w-4 text-[#D8B467]" />
            <span>
              توجد إصدارات على GitHub غير مضافة بعد للـ Timeline:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingGithubReleases.slice(0, 5).map((gh) => (
              <button
                key={gh.version}
                type="button"
                onClick={() => importFromGithub(gh.version)}
                className="font-latin rounded-lg border border-[#D8B467]/45 bg-[#07100D] px-2.5 py-1 text-[11px] font-bold text-[#F2D184] transition-colors hover:bg-[#1B5E4F]/50"
              >
                + استيراد {gh.version}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Form */}
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="space-y-4 rounded-2xl border border-[#D8B467]/30 bg-[#0D1915] p-5 lg:col-span-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[#F4EFE4]">
              {form.editingId
                ? `تعديل الإصدار ${form.version}`
                : "إضافة إصدار جديد للـ Timeline"}
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreview((p) => !p)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#D8B467]/35 bg-[#07100D] px-3 text-xs font-semibold text-[#E5C67E] hover:bg-[#132922]"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>{showPreview ? "إخفاء المعاينة" : "معاينة البطاقة"}</span>
              </button>

              {githubReleases.length > 0 && !form.editingId && (
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) importFromGithub(e.target.value);
                    e.target.value = "";
                  }}
                  className="h-9 rounded-xl border border-[#D8B467]/35 bg-[#07100D] px-3 text-xs text-[#E5C67E]"
                >
                  <option value="" disabled>
                    استيراد من GitHub...
                  </option>
                  {githubReleases.map((gh) => (
                    <option key={gh.version} value={gh.version}>
                      {gh.version} ({gh.downloadCount} تحميل)
                    </option>
                  ))}
                </select>
              )}

              {form.editingId && (
                <button
                  type="button"
                  onClick={() => setForm(createEmptyForm())}
                  className="inline-flex h-9 items-center gap-1 rounded-xl border border-white/15 bg-[#07100D] px-3 text-xs text-[#92A49B] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>إلغاء التعديل</span>
                </button>
              )}
            </div>
          </div>

          {showPreview && (
            <div
              dir={previewLang === "ar" ? "rtl" : "ltr"}
              className="relative overflow-hidden rounded-2xl border border-[#D8B467]/45 bg-gradient-to-br from-[#0F211B] via-[#0D1915] to-[#091310] p-5"
            >
              <ManuscriptCorners />
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#D8B467]">
                  معاينة حية للبطاقة في الصفحة الرئيسية
                </span>
                <div className="flex gap-1">
                  {(["ar", "en"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setPreviewLang(lang)}
                      className={`rounded-lg px-2 py-0.5 font-latin text-[10px] font-bold uppercase ${
                        previewLang === lang
                          ? "bg-[#D8B467]/25 text-[#F6E2A8]"
                          : "bg-black/25 text-[#92A49B]"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-latin rounded-lg border border-[#D8B467]/45 bg-[#132922] px-2.5 py-0.5 text-xs font-extrabold text-[#F5DFA4]">
                    {form.version || "v1.0.0"}
                  </span>
                  <span className="rounded-lg border border-[#D8B467]/20 bg-[#07100D] px-2 py-0.5 text-[10px] font-semibold text-[#D8B467]">
                    {form.release_type}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#92A49B]">
                  <Calendar className="h-3 w-3 text-[#D8B467]" />
                  {form.released_at}
                </span>
              </div>

              <h4 className="font-sacred mt-3 text-lg font-bold text-[#F4EFE4]">
                {previewLang === "ar"
                  ? form.title_ar || "عنوان الإصدار بالعربية"
                  : form.title_en || form.title_ar || "Release Title"}
              </h4>

              {(previewLang === "ar" ? form.summary_ar : form.summary_en || form.summary_ar) && (
                <p className="mt-1.5 text-xs leading-relaxed text-[#9FB0A8]">
                  {previewLang === "ar"
                    ? form.summary_ar
                    : form.summary_en || form.summary_ar}
                </p>
              )}

              {previewHighlights.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-[#D8B467]/15 pt-3">
                  {previewHighlights.map((h, i) => {
                    const Icon =
                      h.type === "fix" ? Wrench : h.type === "improvement" ? Zap : CheckCircle2;
                    const color =
                      h.type === "fix"
                        ? "border-[#38BDF8]/35 bg-[#38BDF8]/10 text-[#7DD3FC]"
                        : h.type === "improvement"
                          ? "border-[#D8B467]/40 bg-[#D8B467]/12 text-[#F2D184]"
                          : "border-[#10B981]/40 bg-[#10B981]/12 text-[#6EE7B7]";
                    return (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#E2E8E5]">
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${color}`}
                        >
                          <Icon className="h-2.5 w-2.5" />
                          {h.type}
                        </span>
                        <span>{h.text}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-[#92A49B]">رقم الإصدار *</label>
              <input
                type="text"
                required
                dir="ltr"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="v1.2.0"
                className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#92A49B]">نوع التحديث</label>
              <select
                value={form.release_type}
                onChange={(e) =>
                  setForm({ ...form, release_type: e.target.value as ReleaseType })
                }
                className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
              >
                <option value="major">رئيسي (Major)</option>
                <option value="minor">ميزات (Minor)</option>
                <option value="patch">تحسينات (Patch)</option>
                <option value="hotfix">إصلاح عاجل (Hotfix)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#92A49B]">تاريخ الإصدار</label>
              <input
                type="date"
                dir="ltr"
                value={form.released_at}
                onChange={(e) => setForm({ ...form, released_at: e.target.value })}
                className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-[#92A49B]">العنوان بالعربية *</label>
              <input
                type="text"
                required
                value={form.title_ar}
                onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                placeholder="تحديث دقة الأذان والمصحف..."
                className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#92A49B]">العنوان بالإنجليزية</label>
              <input
                type="text"
                dir="ltr"
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                placeholder="Adhan reliability & Quran update..."
                className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-[#92A49B]">نبذة مختصرة (عربي)</label>
              <textarea
                rows={2}
                value={form.summary_ar}
                onChange={(e) => setForm({ ...form, summary_ar: e.target.value })}
                className="w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] p-3 text-xs text-[#F2EFE9]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#92A49B]">Summary (English)</label>
              <textarea
                rows={2}
                dir="ltr"
                value={form.summary_en}
                onChange={(e) => setForm({ ...form, summary_en: e.target.value })}
                className="w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] p-3 text-xs text-[#F2EFE9]"
              />
            </div>
          </div>

          {/* Arabic Highlights Builder with Reorder */}
          <div className="rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-[#E5C67E]">
                ما الجديد في هذا الإصدار (عربي)
              </span>
              <button
                type="button"
                onClick={() => addHighlightRow("ar")}
                className="inline-flex items-center gap-1 rounded-lg border border-[#D8B467]/30 px-2.5 py-1 text-[11px] font-semibold text-[#E5C67E] hover:bg-[#132922]"
              >
                <Plus className="h-3 w-3" />
                <span>إضافة نقطة</span>
              </button>
            </div>
            <div className="space-y-2">
              {form.highlights_ar.map((row, idx) => (
                <div key={`ar-${idx}`} className="flex items-center gap-1.5">
                  <select
                    value={row.type}
                    onChange={(e) =>
                      updateHighlight("ar", idx, {
                        type: e.target.value as ReleaseHighlightType,
                      })
                    }
                    className="h-9 rounded-lg border border-[var(--sanctuary-border)] bg-[#0D1915] px-2 text-[11px] text-[#F2EFE9]"
                  >
                    <option value="feature">جديد</option>
                    <option value="improvement">تحسين</option>
                    <option value="fix">إصلاح</option>
                  </select>
                  <input
                    type="text"
                    value={row.text}
                    onChange={(e) =>
                      updateHighlight("ar", idx, { text: e.target.value })
                    }
                    placeholder="اكتب التغيير هنا..."
                    className="h-9 flex-1 rounded-lg border border-[var(--sanctuary-border)] bg-[#0D1915] px-3 text-xs text-[#F2EFE9]"
                  />
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveHighlight("ar", idx, -1)}
                    title="تحريك لأعلى"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#92A49B] hover:text-white disabled:opacity-25"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === form.highlights_ar.length - 1}
                    onClick={() => moveHighlight("ar", idx, 1)}
                    title="تحريك لأسفل"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#92A49B] hover:text-white disabled:opacity-25"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHighlightRow("ar", idx)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#92A49B] hover:text-[#FCA5A5]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* English Highlights Builder with Reorder */}
          <div className="rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-[#92A49B]">
                Highlights (English — اختياري)
              </span>
              <button
                type="button"
                onClick={() => addHighlightRow("en")}
                className="inline-flex items-center gap-1 rounded-lg border border-[#D8B467]/30 px-2.5 py-1 text-[11px] font-semibold text-[#E5C67E] hover:bg-[#132922]"
              >
                <Plus className="h-3 w-3" />
                <span>Add item</span>
              </button>
            </div>
            {form.highlights_en.length === 0 ? (
              <p className="text-[11px] text-[#5F7068]">
                لو تُركت فارغة، هتظهر النقاط العربية كبديل تلقائي.
              </p>
            ) : (
              <div className="space-y-2">
                {form.highlights_en.map((row, idx) => (
                  <div key={`en-${idx}`} className="flex items-center gap-1.5">
                    <select
                      value={row.type}
                      onChange={(e) =>
                        updateHighlight("en", idx, {
                          type: e.target.value as ReleaseHighlightType,
                        })
                      }
                      className="h-9 rounded-lg border border-[var(--sanctuary-border)] bg-[#0D1915] px-2 text-[11px] text-[#F2EFE9]"
                    >
                      <option value="feature">New</option>
                      <option value="improvement">Improved</option>
                      <option value="fix">Fix</option>
                    </select>
                    <input
                      type="text"
                      dir="ltr"
                      value={row.text}
                      onChange={(e) =>
                        updateHighlight("en", idx, { text: e.target.value })
                      }
                      placeholder="Describe change in English..."
                      className="h-9 flex-1 rounded-lg border border-[var(--sanctuary-border)] bg-[#0D1915] px-3 text-xs text-[#F2EFE9]"
                    />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveHighlight("en", idx, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#92A49B] hover:text-white disabled:opacity-25"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === form.highlights_en.length - 1}
                      onClick={() => moveHighlight("en", idx, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#92A49B] hover:text-white disabled:opacity-25"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeHighlightRow("en", idx)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#92A49B] hover:text-[#FCA5A5]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-[#92A49B]">رابط APK مباشر (اختياري)</label>
              <input
                type="url"
                dir="ltr"
                value={form.apk_url}
                onChange={(e) => setForm({ ...form, apk_url: e.target.value })}
                placeholder="https://github.com/.../releases/download/..."
                className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#92A49B]">رابط Release على GitHub</label>
              <input
                type="url"
                dir="ltr"
                value={form.github_release_url}
                onChange={(e) =>
                  setForm({ ...form, github_release_url: e.target.value })
                }
                placeholder="https://github.com/.../releases/tag/..."
                className="h-10 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-[#F2EFE9]">
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="h-4 w-4 accent-[#10B981]"
              />
              <span>نشر على الصفحة الرئيسية فوراً</span>
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="h-4 w-4 accent-[#D8B467]"
              />
              <span>تمييز كإصدار بارز</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold ${SANCTUARY_PRIMARY_CTA}`}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{form.editingId ? "حفظ تعديلات الإصدار" : "نشر / حفظ في الـ Timeline"}</span>
          </button>
        </form>

        {/* Releases List */}
        <div className="space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F4EFE4]">
              الإصدارات المسجلة ({releases.length})
            </h3>
            <RubElHizbMark className="h-3.5 w-3.5 text-[#D8B467]/60" />
          </div>
          {releases.length === 0 ? (
            <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-6 text-center text-xs text-[#92A49B]">
              لم تُضف إصدارات بعد. يمكنك الاستيراد من GitHub Releases بضغطة واحدة.
            </div>
          ) : (
            releases.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 transition-colors ${
                  form.editingId === item.id
                    ? "border-[#D8B467] bg-[#12241D]"
                    : "border-[var(--sanctuary-border)] bg-[#0D1915]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-latin rounded-lg border border-[#D8B467]/40 bg-[#132922] px-2.5 py-0.5 text-xs font-bold text-[#F2D184]">
                        {item.version}
                      </span>
                      <span
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                          item.is_published
                            ? "bg-[#10B981]/15 text-[#6EE7B7]"
                            : "bg-white/10 text-[#92A49B]"
                        }`}
                      >
                        {item.is_published ? "منشور" : "مسودة"}
                      </span>
                      {item.is_featured && (
                        <span className="rounded-lg bg-[#D8B467]/15 px-2 py-0.5 text-[10px] font-bold text-[#F2D184]">
                          بارز
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-bold text-[#F2EFE9]">
                      {item.title_ar}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#92A49B]">
                      {new Date(item.released_at).toLocaleDateString("ar-EG")} •{" "}
                      {item.highlights_ar.length} نقاط
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title={item.is_published ? "إخفاء" : "نشر"}
                      onClick={() => void togglePublish(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#07100D] text-[#D8B467] hover:bg-[#132922]"
                    >
                      {item.is_published ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      title="تعديل"
                      onClick={() => loadForEdit(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#07100D] text-[#E5C67E] hover:bg-[#132922]"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      title="حذف"
                      onClick={() => void handleDelete(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 text-[#FCA5A5] hover:bg-[#EF4444]/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {item.apk_url && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#6EE7B7]">
                    <Download className="h-3 w-3" />
                    <span>مربوط بملف APK مباشر</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
