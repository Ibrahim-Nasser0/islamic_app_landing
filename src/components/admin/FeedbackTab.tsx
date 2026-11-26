"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ExternalLink,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import {
  FeedbackCategory,
  FeedbackItem,
  FeedbackPriority,
  FeedbackStatus,
} from "@/lib/supabase/config";

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  new: "جديد",
  reviewing: "قيد المراجعة",
  resolved: "تم الحل",
  archived: "مؤرشف",
};

const PRIORITY_LABELS: Record<FeedbackPriority, string> = {
  low: "منخفضة",
  medium: "متوسطة",
  high: "عالية",
  critical: "حرجة",
};

const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  bug: "مشكلة / عطل",
  suggestion: "اقتراح ميزة",
  adhan_times: "مواقيت الأذان",
  other: "أخرى",
};

export function FeedbackTab({
  initialItems,
}: {
  initialItems: FeedbackItem[];
}) {
  const [items, setItems] = useState<FeedbackItem[]>(initialItems);
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<FeedbackCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<
    Record<
      string,
      {
        status: FeedbackStatus;
        priority: FeedbackPriority;
        admin_notes: string;
        github_issue_url: string;
      }
    >
  >({});

  const getDraft = (item: FeedbackItem) =>
    drafts[item.id] ?? {
      status: item.status,
      priority: item.priority,
      admin_notes: item.admin_notes ?? "",
      github_issue_url: item.github_issue_url ?? "",
    };

  const setDraftField = (
    item: FeedbackItem,
    patch: Partial<{
      status: FeedbackStatus;
      priority: FeedbackPriority;
      admin_notes: string;
      github_issue_url: string;
    }>
  ) => {
    const current = getDraft(item);
    setDrafts((prev) => ({
      ...prev,
      [item.id]: { ...current, ...patch },
    }));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.message.toLowerCase().includes(q) ||
        (item.device_info ?? "").toLowerCase().includes(q) ||
        (item.contact ?? "").toLowerCase().includes(q) ||
        (item.admin_notes ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, statusFilter, categoryFilter, search]);

  const handleSave = async (item: FeedbackItem) => {
    const draft = getDraft(item);
    setSavingId(item.id);
    try {
      const res = await fetch(`/api/admin/feedback/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await res.json()) as { ok?: boolean; item?: FeedbackItem };
      if (res.ok && data.ok && data.item) {
        setItems((prev) =>
          prev.map((row) => (row.id === item.id ? (data.item as FeedbackItem) : row))
        );
        setSavedId(item.id);
        setTimeout(() => setSavedId((curr) => (curr === item.id ? null : curr)), 2000);
      }
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("حذف هذا البلاغ نهائياً؟")) return;
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((row) => row.id !== id));
      }
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "new", "reviewing", "resolved", "archived"] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  statusFilter === st
                    ? "border-[#D8B467]/55 bg-[#1B5E4F]/60 text-[#F6E2A8]"
                    : "border-[var(--sanctuary-border)] bg-[#07100D] text-[#92A49B] hover:text-white"
                }`}
              >
                {st === "all" ? `الكل (${items.length})` : STATUS_LABELS[st]}
              </button>
            )
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as FeedbackCategory | "all")
            }
            className="h-9 rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9] focus:border-[#D8B467] focus:outline-none"
          >
            <option value="all">كل التصنيفات</option>
            {(Object.keys(CATEGORY_LABELS) as FeedbackCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="pointer-events-none absolute top-2.5 start-3 h-3.5 w-3.5 text-[#92A49B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في الرسائل..."
              className="h-9 w-52 rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] ps-8 pe-3 text-xs text-[#F2EFE9] placeholder:text-[#5F7068] focus:border-[#D8B467] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-10 text-center text-sm text-[#92A49B]">
          لا توجد بلاغات مطابقة للفلاتر الحالية.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const draft = getDraft(item);
            const isSaving = savingId === item.id;
            const isSaved = savedId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded-lg border border-[#D8B467]/35 bg-[#132922] px-2.5 py-0.5 font-bold text-[#F2D184]">
                      {CATEGORY_LABELS[item.category]}
                    </span>
                    <span className="rounded-lg border border-white/10 bg-[#07100D] px-2 py-0.5 text-[#92A49B]">
                      {item.locale.toUpperCase()}
                    </span>
                    {item.app_version && (
                      <span className="font-latin rounded-lg border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-0.5 text-[#6EE7B7]">
                        {item.app_version}
                      </span>
                    )}
                    {item.device_info && (
                      <span className="text-[#92A49B]">📱 {item.device_info}</span>
                    )}
                    {item.contact && (
                      <span className="text-[#E5C67E]">✉️ {item.contact}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#7D8F87]">
                    {new Date(item.created_at).toLocaleString("ar-EG")}
                  </span>
                </div>

                <p className="mt-3 whitespace-pre-wrap rounded-xl border border-white/5 bg-[#07100D] p-3.5 text-sm leading-relaxed text-[#F2EFE9]">
                  {item.message}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-[11px] text-[#92A49B]">
                      الحالة
                    </label>
                    <select
                      value={draft.status}
                      onChange={(e) =>
                        setDraftField(item, {
                          status: e.target.value as FeedbackStatus,
                        })
                      }
                      className="h-9 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-2.5 text-xs text-[#F2EFE9]"
                    >
                      {(Object.keys(STATUS_LABELS) as FeedbackStatus[]).map((st) => (
                        <option key={st} value={st}>
                          {STATUS_LABELS[st]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-[11px] text-[#92A49B]">
                      الأولوية
                    </label>
                    <select
                      value={draft.priority}
                      onChange={(e) =>
                        setDraftField(item, {
                          priority: e.target.value as FeedbackPriority,
                        })
                      }
                      className="h-9 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-2.5 text-xs text-[#F2EFE9]"
                    >
                      {(Object.keys(PRIORITY_LABELS) as FeedbackPriority[]).map(
                        (pr) => (
                          <option key={pr} value={pr}>
                            {PRIORITY_LABELS[pr]}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="mb-1 block text-[11px] text-[#92A49B]">
                      ملاحظات الإدارة
                    </label>
                    <input
                      type="text"
                      value={draft.admin_notes}
                      onChange={(e) =>
                        setDraftField(item, { admin_notes: e.target.value })
                      }
                      placeholder="ملاحظة داخلية..."
                      className="h-9 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="mb-1 block text-[11px] text-[#92A49B]">
                      رابط GitHub Issue (اختياري)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="url"
                        dir="ltr"
                        value={draft.github_issue_url}
                        onChange={(e) =>
                          setDraftField(item, { github_issue_url: e.target.value })
                        }
                        placeholder="https://github.com/..."
                        className="h-9 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
                      />
                      {draft.github_issue_url.startsWith("https://") && (
                        <a
                          href={draft.github_issue_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] text-[#D8B467]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => void handleDelete(item.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#EF4444]/35 bg-[#EF4444]/10 px-3 text-xs font-semibold text-[#FCA5A5] transition-colors hover:bg-[#EF4444]/20 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>حذف</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => void handleSave(item)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#D8B467]/45 bg-[#1B5E4F] px-4 text-xs font-bold text-[#FBF7ED] transition-colors hover:brightness-110 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : isSaved ? (
                      <Check className="h-3.5 w-3.5 text-[#6EE7B7]" />
                    ) : null}
                    <span>{isSaved ? "تم الحفظ" : "حفظ التغييرات"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
