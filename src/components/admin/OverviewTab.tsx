"use client";

import {
  Activity,
  ArrowUpLeft,
  Bell,
  Download,
  GitBranch,
  MessageSquare,
} from "lucide-react";
import { ManuscriptCorners, RubElHizbMark } from "@/components/GeometricMotifs";
import { GitHubReleaseSummaryItem } from "@/lib/github-release";
import {
  AdminLogItem,
  AppReleaseItem,
  DownloadEventItem,
  FeedbackItem,
  SiteNoticeItem,
} from "@/lib/supabase/config";
import { DailyDownloadsChart } from "./AdminUi";

export type AdminSectionId =
  | "overview"
  | "feedback"
  | "releases"
  | "downloads"
  | "notices"
  | "logs"
  | "team";

interface OverviewTabProps {
  adminEmail: string;
  feedbackItems: FeedbackItem[];
  releases: AppReleaseItem[];
  notices: SiteNoticeItem[];
  downloadEvents: DownloadEventItem[];
  totalSiteDownloads: number;
  githubReleases: GitHubReleaseSummaryItem[];
  githubTotalDownloads: number;
  adminLogs: AdminLogItem[];
  onNavigate: (tab: AdminSectionId) => void;
}

export function OverviewTab({
  adminEmail,
  feedbackItems,
  releases,
  notices,
  downloadEvents,
  totalSiteDownloads,
  githubReleases,
  githubTotalDownloads,
  adminLogs,
  onNavigate,
}: OverviewTabProps) {
  const newFeedback = feedbackItems.filter((f) => f.status === "new");
  const resolvedCount = feedbackItems.filter((f) => f.status === "resolved").length;
  const publishedReleases = releases.filter((r) => r.is_published);
  const activeNotice = notices.find((n) => n.is_active) ?? null;

  const existingVersions = new Set(
    releases.map((r) => r.version.trim().toLowerCase())
  );
  const missingGithubReleases = githubReleases.filter(
    (gh) => !existingVersions.has(gh.version.trim().toLowerCase())
  );

  const recentFeedback = [...feedbackItems]
    .sort((a, b) => (a.status === "new" && b.status !== "new" ? -1 : 0))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Sanctuary Welcome Strip */}
      <div className="relative overflow-hidden rounded-[26px] border border-[#D8B467]/35 bg-gradient-to-br from-[#0F231C] via-[#0C1A15] to-[#08120E] p-6 shadow-md">
        <ManuscriptCorners />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B467]/30 bg-[#07100D]/70 px-3 py-1 text-[11px] font-semibold text-[#E5C67E]">
              <RubElHizbMark className="h-3 w-3" />
              <span>مركز قيادة زاد المسلم</span>
            </div>
            <h2 className="font-sacred mt-3 text-2xl font-bold text-[#F4EFE4] sm:text-3xl">
              مرحباً بك في لوحة الإدارة
            </h2>
            <p className="mt-1 text-xs text-[#92A49B]">
              مسجّل الدخول كـ{" "}
              <span dir="ltr" className="font-latin text-[#E5C67E]">
                {adminEmail}
              </span>
              {activeNotice ? (
                <span>
                  {" "}
                  • يوجد تنبيه مفعّل حالياً:{" "}
                  <strong className="text-[#6EE7B7]">
                    {activeNotice.title_ar.slice(0, 45)}
                    {activeNotice.title_ar.length > 45 ? "..." : ""}
                  </strong>
                </span>
              ) : (
                <span> • لا يوجد تنبيه نشط أعلى الموقع حالياً</span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate("releases")}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D8B467]/45 bg-gradient-to-b from-[#216E5C] to-[#13473B] px-4 text-xs font-bold text-[#FBF7ED] transition-all hover:brightness-110"
            >
              <GitBranch className="h-3.5 w-3.5 text-[#F2D184]" />
              <span>إدارة الـ Timeline</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("notices")}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D8B467]/30 bg-[#07100D] px-4 text-xs font-semibold text-[#E5C67E] transition-colors hover:bg-[#132922]"
            >
              <Bell className="h-3.5 w-3.5" />
              <span>{activeNotice ? "تعديل التنبيه النشط" : "إضافة تنبيه"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => onNavigate("downloads")}
          className="group rounded-2xl border border-[#10B981]/30 bg-gradient-to-b from-[#0E2019] to-[#0A1410] p-4 text-start transition-colors hover:border-[#10B981]/55"
        >
          <div className="flex items-center justify-between text-xs text-[#92A49B]">
            <span>إجمالي تحميلات GitHub</span>
            <Download className="h-4 w-4 text-[#6EE7B7]" />
          </div>
          <p className="font-latin mt-2 text-3xl font-extrabold text-[#6EE7B7]">
            {githubTotalDownloads.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-[11px] text-[#7D8F87]">
            ضغطات الموقع:{" "}
            <strong className="font-latin text-[#E5C67E]">
              {totalSiteDownloads.toLocaleString("en-US")}
            </strong>
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("feedback")}
          className="group rounded-2xl border border-[#D8B467]/30 bg-gradient-to-b from-[#111E19] to-[#0A1410] p-4 text-start transition-colors hover:border-[#D8B467]/55"
        >
          <div className="flex items-center justify-between text-xs text-[#92A49B]">
            <span>بلاغات جديدة بانتظار المراجعة</span>
            <MessageSquare className="h-4 w-4 text-[#F2D184]" />
          </div>
          <p className="font-latin mt-2 text-3xl font-extrabold text-[#F2D184]">
            {newFeedback.length}
          </p>
          <p className="mt-1 text-[11px] text-[#7D8F87]">
            تم حل {resolvedCount} من إجمالي {feedbackItems.length} بلاغ
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("releases")}
          className="group rounded-2xl border border-[var(--sanctuary-border)] bg-gradient-to-b from-[#0F1C17] to-[#0A1410] p-4 text-start transition-colors hover:border-[#D8B467]/40"
        >
          <div className="flex items-center justify-between text-xs text-[#92A49B]">
            <span>إصدارات الـ Timeline المنشورة</span>
            <RubElHizbMark className="h-4 w-4 text-[#D8B467]" />
          </div>
          <p className="font-latin mt-2 text-3xl font-extrabold text-[#F4EFE4]">
            {publishedReleases.length}
          </p>
          <p className="mt-1 text-[11px] text-[#7D8F87]">
            {missingGithubReleases.length > 0
              ? `${missingGithubReleases.length} إصدار على GitHub غير مضاف`
              : "متزامن بالكامل مع GitHub"}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("logs")}
          className="group rounded-2xl border border-[var(--sanctuary-border)] bg-gradient-to-b from-[#0F1C17] to-[#0A1410] p-4 text-start transition-colors hover:border-[#D8B467]/40"
        >
          <div className="flex items-center justify-between text-xs text-[#92A49B]">
            <span>سجلات النشاط المرئية</span>
            <Activity className="h-4 w-4 text-[#E5C67E]" />
          </div>
          <p className="font-latin mt-2 text-3xl font-extrabold text-[#E5C67E]">
            {adminLogs.length}
          </p>
          <p className="mt-1 truncate text-[11px] text-[#7D8F87]">
            {adminLogs[0]?.summary ?? "لا توجد نشاطات مسجلة بعد"}
          </p>
        </button>
      </div>

      {/* Daily Chart */}
      <DailyDownloadsChart events={downloadEvents} days={14} />

      {/* 3 Operational Panels */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Recent Feedback */}
        <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F4EFE4]">أحدث البلاغات</h3>
            <button
              type="button"
              onClick={() => onNavigate("feedback")}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D8B467] hover:underline"
            >
              <span>عرض الكل</span>
              <ArrowUpLeft className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-3.5 space-y-2.5">
            {recentFeedback.length === 0 ? (
              <p className="text-xs text-[#92A49B]">لا توجد بلاغات بعد.</p>
            ) : (
              recentFeedback.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/5 bg-[#07100D] p-3"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#E5C67E]">
                      {item.category}
                    </span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 font-bold ${
                        item.status === "new"
                          ? "bg-[#F59E0B]/15 text-[#FCD34D]"
                          : "bg-[#10B981]/15 text-[#6EE7B7]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs text-[#D7E0DC]">
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Missing GitHub Releases */}
        <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F4EFE4]">
              إصدارات GitHub غير المضافة
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("releases")}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D8B467] hover:underline"
            >
              <span>فتح المحرر</span>
              <ArrowUpLeft className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-3.5 space-y-2.5">
            {missingGithubReleases.length === 0 ? (
              <div className="rounded-xl border border-[#10B981]/25 bg-[#10B981]/10 p-3.5 text-xs text-[#6EE7B7]">
                جميع إصدارات GitHub الأخيرة موجودة بالفعل في Timeline الموقع.
              </div>
            ) : (
              missingGithubReleases.slice(0, 4).map((gh) => (
                <div
                  key={gh.version}
                  className="flex items-center justify-between rounded-xl border border-[#D8B467]/20 bg-[#07100D] px-3.5 py-2.5 text-xs"
                >
                  <div>
                    <span className="font-latin font-bold text-[#F2D184]">
                      {gh.version}
                    </span>
                    <p className="text-[10px] text-[#92A49B]">
                      {gh.downloadCount} تحميل على GitHub
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("releases")}
                    className="rounded-lg border border-[#D8B467]/35 bg-[#132922] px-2.5 py-1 text-[11px] font-semibold text-[#F6E2A8] hover:brightness-110"
                  >
                    إضافة للـ Timeline
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F4EFE4]">أحدث النشاطات</h3>
            <button
              type="button"
              onClick={() => onNavigate("logs")}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D8B467] hover:underline"
            >
              <span>السجل الكامل</span>
              <ArrowUpLeft className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-3.5 space-y-2.5">
            {adminLogs.length === 0 ? (
              <p className="text-xs text-[#92A49B]">لا توجد نشاطات مسجلة بعد.</p>
            ) : (
              adminLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-white/5 bg-[#07100D] p-3"
                >
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="font-latin font-semibold text-[#D8B467]">
                      {log.action}
                    </span>
                    <span className="text-[#7D8F87]">
                      {new Date(log.created_at).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-[#D7E0DC]">
                    {log.summary}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
