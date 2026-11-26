"use client";

import { useMemo, useState } from "react";
import {
  Check,
  CheckSquare,
  Download,
  ExternalLink,
  GitPullRequest,
  Loader2,
  Search,
  Square,
  Trash2,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { downloadCsv } from "@/lib/admin-csv";
import {
  FeedbackCategory,
  FeedbackItem,
  FeedbackPriority,
  FeedbackStatus,
} from "@/lib/supabase/config";
import { ToastType } from "./AdminUi";

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  new: "جديد",
  reviewing: "قيد المراجعة",
  resolved: "تم الحل",
  archived: "مؤرشف",
};

const STATUS_BADGE: Record<FeedbackStatus, string> = {
  new: "border-[#F59E0B]/40 bg-[#F59E0B]/12 text-[#FCD34D]",
  reviewing: "border-[#38BDF8]/40 bg-[#38BDF8]/12 text-[#7DD3FC]",
  resolved: "border-[#10B981]/40 bg-[#10B981]/12 text-[#6EE7B7]",
  archived: "border-white/15 bg-white/5 text-[#92A49B]",
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

function buildPrefilledGithubIssueUrl(item: FeedbackItem): string {
  const prefixMap: Record<FeedbackCategory, string> = {
    bug: "[Bug]",
    suggestion: "[Suggestion]",
    adhan_times: "[Adhan / Prayer Times]",
    other: "[Feedback]",
  };
  const labelMap: Record<FeedbackCategory, string> = {
    bug: "bug",
    suggestion: "enhancement",
    adhan_times: "bug",
    other: "feedback",
  };
  const title = `${prefixMap[item.category]} ${item.message
    .replace(/\s+/g, " ")
    .slice(0, 65)}`;
  const body = [
    item.message,
    "",
    item.app_version ? `**App Version:** ${item.app_version}` : "",
    item.device_info ? `**Device:** ${item.device_info}` : "",
    `**Locale:** ${item.locale}`,
    `_Triaged from Zad Al-Muslim Admin Panel_`,
  ]
    .filter(Boolean)
    .join("\n");

  const query = new URLSearchParams({
    title,
    body,
    labels: labelMap[item.category],
  });
  return `${siteConfig.githubRepoUrl}/issues/new?${query.toString()}`;
}

export function FeedbackTab({
  items,
  onItemsChange,
  onNotify,
}: {
  items: FeedbackItem[];
  onItemsChange: (next: FeedbackItem[]) => void;
  onNotify: (type: ToastType, message: string) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<FeedbackCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
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

  const isDirty = (item: FeedbackItem) => {
    const d = drafts[item.id];
    if (!d) return false;
    return (
      d.status !== item.status ||
      d.priority !== item.priority ||
      d.admin_notes !== (item.admin_notes ?? "") ||
      d.github_issue_url !== (item.github_issue_url ?? "")
    );
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
        (item.admin_notes ?? "").toLowerCase().includes(q) ||
        (item.app_version ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, statusFilter, categoryFilter, search]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((item) => selectedIds.has(item.id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((i) => next.delete(i.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((i) => next.add(i.id));
        return next;
      });
    }
  };

  const handleBulkStatus = async (status: FeedbackStatus) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0 || bulkLoading) return;
    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/feedback/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        items?: FeedbackItem[];
        error?: string;
      };
      if (!res.ok || !data.ok) {
        onNotify("error", data.error ?? "تعذر التحديث الجماعي.");
        return;
      }
      const updatedMap = new Map((data.items ?? []).map((u) => [u.id, u]));
      onItemsChange(items.map((row) => updatedMap.get(row.id) ?? row));
      setSelectedIds(new Set());
      onNotify("success", `تم تحديث ${ids.length} بلاغ إلى "${STATUS_LABELS[status]}".`);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0 || bulkLoading) return;
    if (!window.confirm(`حذف ${ids.length} بلاغ محددة نهائياً؟`)) return;
    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/feedback/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        onNotify("error", data.error ?? "تعذر الحذف الجماعي.");
        return;
      }
      const deletedSet = new Set(ids);
      onItemsChange(items.filter((row) => !deletedSet.has(row.id)));
      setSelectedIds(new Set());
      onNotify("success", `تم حذف ${ids.length} بلاغ.`);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleSave = async (item: FeedbackItem) => {
    const draft = getDraft(item);
    setSavingId(item.id);
    try {
      const res = await fetch(`/api/admin/feedback/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        item?: FeedbackItem;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.item) {
        onNotify("error", data.error ?? "تعذر حفظ التعديلات.");
        return;
      }
      onItemsChange(
        items.map((row) => (row.id === item.id ? (data.item as FeedbackItem) : row))
      );
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      setSavedId(item.id);
      setTimeout(() => setSavedId((curr) => (curr === item.id ? null : curr)), 2000);
      onNotify("success", "تم حفظ حالة البلاغ وملاحظاتك.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("حذف هذا البلاغ نهائياً؟")) return;
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, { method: "DELETE" });
      if (!res.ok) {
        onNotify("error", "تعذر حذف البلاغ.");
        return;
      }
      onItemsChange(items.filter((row) => row.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      onNotify("success", "تم حذف البلاغ.");
    } finally {
      setSavingId(null);
    }
  };

  const handleExportCsv = () => {
    downloadCsv(
      `zad-feedback-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        "ID",
        "Category",
        "Status",
        "Priority",
        "App Version",
        "Locale",
        "Device",
        "Contact",
        "Message",
        "Admin Notes",
        "GitHub Issue",
        "Created At",
      ],
      filtered.map((f) => [
        f.id,
        f.category,
        f.status,
        f.priority,
        f.app_version,
        f.locale,
        f.device_info,
        f.contact,
        f.message,
        f.admin_notes,
        f.github_issue_url,
        f.created_at,
      ])
    );
    onNotify("info", `تم تصدير ${filtered.length} بلاغ إلى CSV.`);
  };

  return (
    <div className="space-y-5">
      {/* Filters & Export */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-4 xl:flex-row xl:items-center xl:justify-between">
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
              placeholder="بحث في الرسائل أو الإصدار..."
              className="h-9 w-56 rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] ps-8 pe-3 text-xs text-[#F2EFE9] placeholder:text-[#5F7068] focus:border-[#D8B467] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filtered.length === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#D8B467]/30 bg-[#07100D] px-3 text-xs font-semibold text-[#E5C67E] transition-colors hover:bg-[#132922] disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D8B467]/20 bg-[#0A1511] px-4 py-2.5 text-xs">
          <button
            type="button"
            onClick={toggleSelectAllVisible}
            className="inline-flex items-center gap-2 font-semibold text-[#D7E0DC] hover:text-[#F6E2A8]"
          >
            {allVisibleSelected ? (
              <CheckSquare className="h-4 w-4 text-[#D8B467]" />
            ) : (
              <Square className="h-4 w-4 text-[#92A49B]" />
            )}
            <span>
              {allVisibleSelected
                ? "إلغاء تحديد الظاهر"
                : `تحديد الظاهر (${filtered.length})`}
            </span>
          </button>

          {selectedIds.size > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#E5C67E]">
                محدد: <strong className="font-latin">{selectedIds.size}</strong>
              </span>
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => void handleBulkStatus("reviewing")}
                className="rounded-lg border border-[#38BDF8]/35 bg-[#38BDF8]/10 px-2.5 py-1 text-[11px] font-semibold text-[#7DD3FC] hover:bg-[#38BDF8]/20"
              >
                قيد المراجعة
              </button>
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => void handleBulkStatus("resolved")}
                className="rounded-lg border border-[#10B981]/35 bg-[#10B981]/10 px-2.5 py-1 text-[11px] font-semibold text-[#6EE7B7] hover:bg-[#10B981]/20"
              >
                تم الحل
              </button>
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => void handleBulkStatus("archived")}
                className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-[#D7E0DC] hover:bg-white/10"
              >
                أرشفة
              </button>
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => void handleBulkDelete()}
                className="rounded-lg border border-[#EF4444]/35 bg-[#EF4444]/10 px-2.5 py-1 text-[11px] font-semibold text-[#FCA5A5] hover:bg-[#EF4444]/20"
              >
                حذف المحدد
              </button>
            </div>
          )}
        </div>
      )}

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-10 text-center text-sm text-[#92A49B]">
          لا توجد بلاغات مطابقة للفلاتر الحالية.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const draft = getDraft(item);
            const dirty = isDirty(item);
            const selected = selectedIds.has(item.id);
            const isSaving = savingId === item.id;
            const isSaved = savedId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 transition-colors ${
                  dirty
                    ? "border-[#D8B467]/55 bg-[#10201A]"
                    : selected
                      ? "border-[#10B981]/45 bg-[#0E1E18]"
                      : "border-[var(--sanctuary-border)] bg-[#0D1915]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => toggleSelect(item.id)}
                      aria-label="تحديد البلاغ"
                      className="rounded-md p-0.5 text-[#92A49B] hover:text-[#D8B467]"
                    >
                      {selected ? (
                        <CheckSquare className="h-4 w-4 text-[#10B981]" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                    <span className="rounded-lg border border-[#D8B467]/35 bg-[#132922] px-2.5 py-0.5 font-bold text-[#F2D184]">
                      {CATEGORY_LABELS[item.category]}
                    </span>
                    <span
                      className={`rounded-lg border px-2 py-0.5 font-bold ${STATUS_BADGE[item.status]}`}
                    >
                      {STATUS_LABELS[item.status]}
                    </span>
                    <span className="rounded-lg border border-white/10 bg-[#07100D] px-2 py-0.5 text-[#92A49B]">
                      {item.locale.toUpperCase()}
                    </span>
                    {item.app_version && (
                      <span className="font-latin rounded-lg border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-0.5 text-[#6EE7B7]">
                        {item.app_version}
                      </span>
                    )}
                    {dirty && (
                      <span className="rounded-lg border border-[#F59E0B]/45 bg-[#F59E0B]/15 px-2 py-0.5 font-bold text-[#FCD34D]">
                        تعديلات غير محفوظة
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
                          title="فتح الرابط"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] text-[#D8B467]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={buildPrefilledGithubIssueUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#D8B467]/30 bg-[#07100D] px-3 text-xs font-semibold text-[#E5C67E] transition-colors hover:bg-[#132922]"
                  >
                    <GitPullRequest className="h-3.5 w-3.5" />
                    <span>فتح كـ GitHub Issue</span>
                  </a>

                  <div className="flex items-center gap-2">
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
                      className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-4 text-xs font-bold transition-all disabled:opacity-50 ${
                        dirty
                          ? "border-[#D8B467] bg-gradient-to-b from-[#216E5C] to-[#13473B] text-[#FBF7ED]"
                          : "border-[#D8B467]/40 bg-[#1B5E4F]/75 text-[#FBF7ED] hover:brightness-110"
                      }`}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
