"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { DownloadEventItem } from "@/lib/supabase/config";

export type ToastType = "success" | "error" | "info";

export interface AdminToast {
  id: string;
  type: ToastType;
  message: string;
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: AdminToast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 start-4 z-50 flex max-w-sm flex-col gap-2 sm:bottom-6 sm:start-6"
    >
      {toasts.map((toast) => {
        const styles =
          toast.type === "error"
            ? "border-[#EF4444]/45 bg-[#1C0D0F]/95 text-[#FECACA]"
            : toast.type === "info"
              ? "border-[#D8B467]/45 bg-[#12221C]/95 text-[#F6E2A8]"
              : "border-[#10B981]/45 bg-[#0B2219]/95 text-[#A7F3D0]";
        const Icon =
          toast.type === "error"
            ? AlertCircle
            : toast.type === "info"
              ? Info
              : CheckCircle2;

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-md ${styles}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 leading-relaxed">{toast.message}</span>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="إغلاق"
              className="rounded-lg p-1 opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function DailyDownloadsChart({
  events,
  days = 14,
  title,
}: {
  events: DownloadEventItem[];
  days?: number;
  title?: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const buckets: { key: string; label: string; count: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countMap = new Map<string, number>();
  events.forEach((ev) => {
    const d = new Date(ev.created_at);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    countMap.set(key, (countMap.get(key) ?? 0) + 1);
  });

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    const label = d.toLocaleDateString("ar-EG", {
      month: "numeric",
      day: "numeric",
    });
    buckets.push({
      key,
      label,
      count: countMap.get(key) ?? 0,
    });
  }

  const maxCount = Math.max(1, ...buckets.map((b) => b.count));
  const totalInRange = buckets.reduce((sum, b) => sum + b.count, 0);
  const activeBucket = hoveredIdx !== null ? buckets[hoveredIdx] : null;

  return (
    <div className="rounded-2xl border border-[#D8B467]/25 bg-gradient-to-b from-[#0E1E18] to-[#0A1410] p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-[#F4EFE4]">
            {title ?? `معدل التحميل اليومي (آخر ${days} يوم)`}
          </h3>
          <p className="mt-0.5 text-[11px] text-[#92A49B]">
            إجمالي الفترة:{" "}
            <strong className="font-latin text-[#E5C67E]">
              {totalInRange.toLocaleString("en-US")}
            </strong>{" "}
            تحميل من الموقع
          </p>
        </div>
        {activeBucket && (
          <div className="rounded-xl border border-[#D8B467]/40 bg-[#07100D] px-3 py-1 text-xs">
            <span className="text-[#92A49B]">{activeBucket.label}: </span>
            <strong className="font-latin text-[#F2D184]">
              {activeBucket.count}
            </strong>
          </div>
        )}
      </div>

      <div className="mt-5 flex h-36 items-end gap-1.5 sm:gap-2">
        {buckets.map((b, idx) => {
          const heightPct = b.count === 0 ? 4 : Math.max(10, Math.round((b.count / maxCount) * 100));
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={b.key}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="group flex flex-1 flex-col items-center gap-1.5"
            >
              <span
                className={`font-latin text-[10px] font-bold transition-opacity ${
                  isHovered || b.count > 0
                    ? "text-[#F2D184] opacity-100"
                    : "opacity-0"
                }`}
              >
                {b.count}
              </span>
              <div className="flex h-24 w-full items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-200 ${
                    b.count === 0
                      ? "bg-[#14261F]/60"
                      : isHovered
                        ? "bg-gradient-to-t from-[#2A8772] to-[#F2D184] shadow-[0_0_12px_rgba(216,180,103,0.35)]"
                        : "bg-gradient-to-t from-[#1B5E4F] to-[#D8B467]/90"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="font-latin text-[9px] text-[#7D8F87]">
                {days <= 14 || idx % 3 === 0 || idx === buckets.length - 1
                  ? b.label
                  : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
