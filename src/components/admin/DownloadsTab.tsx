"use client";

import { GitHubReleaseSummaryItem } from "@/lib/github-release";
import { DownloadEventItem, DownloadPlacement } from "@/lib/supabase/config";

interface DownloadsTabProps {
  totalSiteDownloads: number;
  events: DownloadEventItem[];
  githubReleases: GitHubReleaseSummaryItem[];
  githubTotalDownloads: number;
}

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
}: DownloadsTabProps) {
  const byPlacement = events.reduce<Record<string, number>>((acc, ev) => {
    acc[ev.placement] = (acc[ev.placement] ?? 0) + 1;
    return acc;
  }, {});

  const byVersion = events.reduce<Record<string, number>>((acc, ev) => {
    acc[ev.version] = (acc[ev.version] ?? 0) + 1;
    return acc;
  }, {});

  const maxPlacement = Math.max(1, ...Object.values(byPlacement));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#D8B467]/30 bg-[#0D1915] p-5">
          <p className="text-xs text-[#92A49B]">تحميلات مسجلة من الموقع</p>
          <p className="font-latin mt-1 text-3xl font-extrabold text-[#F2D184]">
            {totalSiteDownloads.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-[11px] text-[#7D8F87]">
            عبر <code className="font-latin">/api/download</code> بدون تتبع IP أو Cookies
          </p>
        </div>

        <div className="rounded-2xl border border-[#10B981]/30 bg-[#0D1915] p-5">
          <p className="text-xs text-[#92A49B]">إجمالي تحميلات GitHub APK</p>
          <p className="font-latin mt-1 text-3xl font-extrabold text-[#6EE7B7]">
            {githubTotalDownloads.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-[11px] text-[#7D8F87]">
            الرقم الفعلي المجمع من GitHub Releases API
          </p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Placement Breakdown */}
        <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-5">
          <h3 className="text-sm font-bold text-[#F4EFE4]">
            توزيع التحميلات حسب مكان الزر في الصفحة
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
            أحدث عمليات التحميل عبر الموقع
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
              {events.slice(0, 30).map((ev) => (
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
              {events.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-[#92A49B]"
                  >
                    لم يتم تسجيل تحميلات عبر الموقع بعد.
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
