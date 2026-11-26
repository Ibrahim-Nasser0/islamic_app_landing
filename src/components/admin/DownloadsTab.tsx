"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { downloadCsv } from "@/lib/admin-csv";
import { GitHubReleaseSummaryItem } from "@/lib/github-release";
import { DownloadEventItem, DownloadPlacement } from "@/lib/supabase/config";
import { DailyDownloadsChart, ToastType } from "./AdminUi";

interface DownloadsTabProps {
  totalSiteDownloads: number;
  events: DownloadEventItem[];
  githubReleases: GitHubReleaseSummaryItem[];
  githubTotalDownloads: number;
  onNotify: (type: ToastType, message: string) => void;
}

type RangeFilter = "today" | "7d" | "30d" | "all";

const RANGE_LABELS: Record<RangeFilter, string> = {
  today: "اليوم",
  "7d": "آخر 7 أيام",
  "30d": "آخر 30 يوم",
  all: "الكل",
};

const PLACEMENT_LABELS: Record<DownloadPlacement, string> = {
  hero: "قسم البداية (Hero)",
  download_section: "مركز التحميل السفلي",
  sticky_cta: "الشريط العائم للجوال",
  qr: "مسح رمز QR",
  timeline: "Timeline الإصدارات",
  unknown: "غير محدد",
};

export function DownloadsTab({
  totalSiteDownloads,
  events,
  githubReleases,
  githubTotalDownloads,
  onNotify,
}: DownloadsTabProps) {
  const [range, setRange] = useState<RangeFilter>("30d");

  const filteredEvents = useMemo(() => {
    if (range === "all") return events;
    const now = new Date();
    const start = new Date(now);
    if (range === "today") {
      start.setHours(0, 0, 0, 0);
    } else if (range === "7d") {
      start.setDate(now.getDate() - 7);
    } else if (range === "30d") {
      start.setDate(now.getDate() - 30);
    }
    const minMs = start.getTime();
    return events.filter((ev) => new Date(ev.created_at).getTime() >= minMs);
  }, [events, range]);

  const byPlacement = filteredEvents.reduce<Record<string, number>>((acc, ev) => {
    acc[ev.placement] = (acc[ev.placement] ?? 0) + 1;
    return acc;
  }, {});

  const byVersion = filteredEvents.reduce<Record<string, number>>((acc, ev) => {
    acc[ev.version] = (acc[ev.version] ?? 0) + 1;
    return acc;
  }, {});

  const arCount = filteredEvents.filter((ev) => ev.locale === "ar").length;
  const enCount = filteredEvents.filter((ev) => ev.locale === "en").length;
  const localeTotal = Math.max(1, arCount + enCount);
  const arPct = Math.round((arCount / localeTotal) * 100);

  const maxPlacement = Math.max(1, ...Object.values(byPlacement));

  const handleExportCsv = () => {
    downloadCsv(
      `zad-downloads-${range}-${new Date().toISOString().slice(0, 10)}.csv`,
      ["ID", "Version", "Placement", "Locale", "File Name", "Created At"],
      filteredEvents.map((ev) => [
        ev.id,
        ev.version,
        ev.placement,
        ev.locale,
        ev.file_name,
        ev.created_at,
      ])
    );
    onNotify("info", `تم تصدير ${filteredEvents.length} عملية تحميل إلى CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Range Filter + Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-4">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(RANGE_LABELS) as RangeFilter[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                range === r
                  ? "border-[#D8B467]/55 bg-[#1B5E4F]/60 text-[#F6E2A8]"
                  : "border-[var(--sanctuary-border)] bg-[#07100D] text-[#92A49B] hover:text-white"
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={filteredEvents.length === 0}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#D8B467]/30 bg-[#07100D] px-3 text-xs font-semibold text-[#E5C67E] transition-colors hover:bg-[#132922] disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          <span>تصدير CSV</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#D8B467]/30 bg-[#0D1915] p-5">
          <p className="text-xs text-[#92A49B]">التحميلات في النطاق المحدد</p>
          <p className="font-latin mt-1 text-3xl font-extrabold text-[#F2D184]">
            {filteredEvents.length.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-[11px] text-[#7D8F87]">
            الإجمالي الكلي بالموقع:{" "}
            <strong className="font-latin text-[#E5C67E]">
              {totalSiteDownloads.toLocaleString("en-US")}
            </strong>
          </p>
        </div>

        <div className="rounded-2xl border border-[#10B981]/30 bg-[#0D1915] p-5">
          <p className="text-xs text-[#92A49B]">إجمالي تحميلات GitHub APK</p>
          <p className="font-latin mt-1 text-3xl font-extrabold text-[#6EE7B7]">
            {githubTotalDownloads.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-[11px] text-[#7D8F87]">
            مجموع `download_count` من GitHub API
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-5">
          <p className="text-xs text-[#92A49B]">توزيع الواجهة (عربي / إنجليزي)</p>
          <div className="mt-2 flex items-baseline justify-between text-xs">
            <span className="font-bold text-[#F2D184]">
              عربي: <span className="font-latin">{arCount}</span> ({arPct}%)
            </span>
            <span className="font-bold text-[#7DD3FC]">
              EN: <span className="font-latin">{enCount}</span> ({100 - arPct}%)
            </span>
          </div>
          <div className="mt-2.5 flex h-2.5 overflow-hidden rounded-full bg-[#07100D]">
            <div
              className="bg-gradient-to-r from-[#1B5E4F] to-[#D8B467]"
              style={{ width: `${arPct}%` }}
            />
            <div
              className="bg-[#38BDF8]/65"
              style={{ width: `${100 - arPct}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-5">
          <p className="text-xs text-[#92A49B]">عدد الإصدارات على GitHub</p>
          <p className="font-latin mt-1 text-3xl font-extrabold text-[#F4EFE4]">
            {githubReleases.length}
          </p>
          <p className="mt-1 text-[11px] text-[#7D8F87]">
            آخر 20 إصدار متاح في المستودع
          </p>
        </div>
      </div>

      {/* Daily Chart */}
      <DailyDownloadsChart
        events={filteredEvents}
        days={range === "7d" ? 7 : range === "today" ? 7 : 14}
        title={
          range === "7d"
            ? "معدل التحميل اليومي (آخر 7 أيام)"
            : "معدل التحميل اليومي (آخر 14 يوم)"
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Placement Breakdown */}
        <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-5">
          <h3 className="text-sm font-bold text-[#F4EFE4]">
            توزيع التحميلات حسب مكان الزر ({RANGE_LABELS[range]})
          </h3>
          <div className="mt-4 space-y-3">
            {(Object.keys(PLACEMENT_LABELS) as DownloadPlacement[]).map((key) => {
              const count = byPlacement[key] ?? 0;
              const pct = Math.round((count / maxPlacement) * 100);
              return (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-[#D7E0DC]">{PLACEMENT_LABELS[key]}</span>
                    <span className="font-latin font-bold text-[#E5C67E]">
                      {count}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#07100D]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1B5E4F] to-[#D8B467]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Version Comparison */}
        <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-5">
          <h3 className="text-sm font-bold text-[#F4EFE4]">
            التحميلات حسب الإصدار (الموقع vs GitHub)
          </h3>
          <div className="mt-4 space-y-2.5">
            {githubReleases.length === 0 && Object.keys(byVersion).length === 0 ? (
              <p className="text-xs text-[#92A49B]">لا توجد بيانات تحميلات بعد.</p>
            ) : (
              githubReleases.map((gh) => (
                <div
                  key={gh.version}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-[#07100D] px-3.5 py-2.5 text-xs"
                >
                  <span className="font-latin font-bold text-[#F2D184]">
                    {gh.version}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-[#92A49B]">
                      الموقع:{" "}
                      <strong className="font-latin text-white">
                        {byVersion[gh.version] ?? 0}
                      </strong>
                    </span>
                    <span className="text-[#6EE7B7]">
                      GitHub:{" "}
                      <strong className="font-latin">{gh.downloadCount}</strong>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915]">
        <div className="border-b border-white/5 px-5 py-3.5">
          <h3 className="text-sm font-bold text-[#F4EFE4]">
            أحدث عمليات التحميل ({RANGE_LABELS[range]})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#07100D] text-[#92A49B]">
              <tr>
                <th className="px-4 py-2.5 text-start">الإصدار</th>
                <th className="px-4 py-2.5 text-start">الموضع</th>
                <th className="px-4 py-2.5 text-start">اللغة</th>
                <th className="px-4 py-2.5 text-start">الملف</th>
                <th className="px-4 py-2.5 text-start">الوقت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#D7E0DC]">
              {filteredEvents.slice(0, 30).map((ev) => (
                <tr key={ev.id}>
                  <td className="font-latin px-4 py-2.5 font-semibold text-[#F2D184]">
                    {ev.version}
                  </td>
                  <td className="px-4 py-2.5">
                    {PLACEMENT_LABELS[ev.placement] ?? ev.placement}
                  </td>
                  <td className="font-latin px-4 py-2.5 uppercase">{ev.locale}</td>
                  <td className="font-latin px-4 py-2.5 text-[#92A49B]">
                    {ev.file_name ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-[#92A49B]">
                    {new Date(ev.created_at).toLocaleString("ar-EG")}
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-[#92A49B]"
                  >
                    لا توجد تحميلات في هذا النطاق الزمني.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
