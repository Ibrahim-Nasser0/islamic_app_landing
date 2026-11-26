"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  GitBranch,
  KeyRound,
  LogOut,
  Menu,
  MessageSquare,
  Shield,
  Users,
  X,
} from "lucide-react";
import { RubElHizbMark } from "@/components/GeometricMotifs";
import { GitHubReleaseSummaryItem } from "@/lib/github-release";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  AdminLogItem,
  AdminRole,
  AdminUserItem,
  AppReleaseItem,
  DownloadEventItem,
  FeedbackItem,
  SiteNoticeItem,
} from "@/lib/supabase/config";
import { DownloadsTab } from "./DownloadsTab";
import { FeedbackTab } from "./FeedbackTab";
import { LogsTab } from "./LogsTab";
import { NoticesTab } from "./NoticesTab";
import { ReleasesTab } from "./ReleasesTab";
import { TeamAccountTab } from "./TeamAccountTab";

type AdminSectionId =
  | "feedback"
  | "releases"
  | "downloads"
  | "notices"
  | "logs"
  | "team";

interface AdminDashboardClientProps {
  currentUserId: string;
  adminEmail: string;
  adminRole: AdminRole;
  feedbackItems: FeedbackItem[];
  releases: AppReleaseItem[];
  notices: SiteNoticeItem[];
  downloadEvents: DownloadEventItem[];
  totalSiteDownloads: number;
  githubReleases: GitHubReleaseSummaryItem[];
  githubTotalDownloads: number;
  adminLogs: AdminLogItem[];
  adminUsers: AdminUserItem[];
}

export function AdminDashboardClient({
  currentUserId,
  adminEmail,
  adminRole,
  feedbackItems,
  releases,
  notices,
  downloadEvents,
  totalSiteDownloads,
  githubReleases,
  githubTotalDownloads,
  adminLogs,
  adminUsers,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminSectionId>("feedback");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isOwner = adminRole === "owner";
  const newFeedbackCount = feedbackItems.filter((f) => f.status === "new").length;
  const publishedReleasesCount = releases.filter((r) => r.is_published).length;

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  const navItems: {
    id: AdminSectionId;
    label: string;
    icon: typeof MessageSquare;
    badge?: number;
  }[] = [
    {
      id: "feedback",
      label: "البلاغات والشكاوى",
      icon: MessageSquare,
      badge: newFeedbackCount > 0 ? newFeedbackCount : undefined,
    },
    {
      id: "releases",
      label: "Timeline الإصدارات",
      icon: GitBranch,
      badge: releases.length > 0 ? releases.length : undefined,
    },
    {
      id: "downloads",
      label: "إحصائيات التحميل",
      icon: BarChart3,
    },
    {
      id: "notices",
      label: "شريط التنبيهات",
      icon: Bell,
    },
    {
      id: "logs",
      label: "سجل النشاطات (Logs)",
      icon: Activity,
      badge: adminLogs.length > 0 ? adminLogs.length : undefined,
    },
    {
      id: "team",
      label: isOwner ? "فريق الإدارة والحساب" : "تغيير كلمة المرور",
      icon: isOwner ? Users : KeyRound,
    },
  ];

  const activeNav = navItems.find((item) => item.id === activeTab)!;

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div>
        {/* Brand */}
        <div className="flex items-center justify-between gap-2 border-b border-[#D8B467]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[#D8B467]/45 bg-[#0D1E18] p-0.5">
              <Image
                src="/images/app_logo.png"
                alt="زاد المسلم"
                width={40}
                height={40}
                className="h-full w-full rounded-[9px] object-cover"
              />
            </div>
            <div>
              <p className="font-sacred text-base font-bold text-[#F4EFE4]">
                زاد المسلم
              </p>
              <p className="text-[11px] text-[#D8B467]">لوحة الإدارة</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#92A49B] hover:bg-white/5 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="mt-4 rounded-2xl border border-[#D8B467]/20 bg-[#07100D] p-3">
          <div className="flex items-center gap-2">
            <Shield
              className={`h-4 w-4 shrink-0 ${
                isOwner ? "text-[#D8B467]" : "text-[#6EE7B7]"
              }`}
            />
            <span
              className={`rounded-md px-1.5 py-0.5 font-latin text-[10px] font-bold uppercase ${
                isOwner
                  ? "bg-[#D8B467]/20 text-[#F5DFA4]"
                  : "bg-[#10B981]/15 text-[#6EE7B7]"
              }`}
            >
              {adminRole}
            </span>
          </div>
          <p
            dir="ltr"
            className="font-latin mt-1.5 truncate text-xs font-medium text-[#E2E8E5]"
          >
            {adminEmail}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-5 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? "border-[#D8B467]/50 bg-gradient-to-b from-[#216E5C] to-[#13473B] text-[#F6E2A8] shadow-sm"
                    : "border-transparent text-[#9FB0A8] hover:border-[#D8B467]/20 hover:bg-white/[0.03] hover:text-[#F2EFE9]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span
                    className={`font-latin rounded-lg px-2 py-0.5 text-[10px] font-extrabold ${
                      active
                        ? "bg-black/25 text-[#F6E2A8]"
                        : "bg-[#07100D] text-[#D8B467]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom Actions */}
      <div className="space-y-2 border-t border-[#D8B467]/15 pt-4">
        <Link
          href="/"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#D8B467]/30 bg-[#07100D] text-xs font-semibold text-[#E5C67E] transition-colors hover:bg-[#132922]"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          <span>العودة للموقع الرئيسي</span>
        </Link>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#EF4444]/35 bg-[#EF4444]/10 text-xs font-semibold text-[#FCA5A5] transition-colors hover:bg-[#EF4444]/20"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#07100D] text-[#F2EFE9] lg:flex">
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden w-72 shrink-0 border-e border-[#D8B467]/20 bg-[#08130F] lg:sticky lg:top-0 lg:block lg:h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Backdrop & Drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="h-full w-72 border-e border-[#D8B467]/25 bg-[#08130F]"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="min-w-0 flex-1">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#D8B467]/15 bg-[#07100D]/92 px-5 py-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="فتح قائمة الإدارة"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8B467]/30 bg-[#0D1915] text-[#E5C67E] lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <RubElHizbMark className="h-3.5 w-3.5 text-[#D8B467]" />
              <h1 className="font-sacred text-xl font-bold text-[#F4EFE4]">
                {activeNav.label}
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-3 text-xs text-[#92A49B] sm:flex">
            <span>
              إصدارات منشورة:{" "}
              <strong className="font-latin text-[#F2EFE9]">
                {publishedReleasesCount}
              </strong>
            </span>
            <span className="text-[#D8B467]/40">•</span>
            <span>
              GitHub:{" "}
              <strong className="font-latin text-[#6EE7B7]">
                {githubTotalDownloads.toLocaleString("en-US")}
              </strong>
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
          {/* Quick KPI Strip */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-4">
              <p className="text-xs text-[#92A49B]">بلاغات جديدة</p>
              <p className="font-latin mt-1 text-2xl font-extrabold text-[#F2D184]">
                {newFeedbackCount}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-4">
              <p className="text-xs text-[#92A49B]">إجمالي التحميلات (GitHub)</p>
              <p className="font-latin mt-1 text-2xl font-extrabold text-[#6EE7B7]">
                {githubTotalDownloads.toLocaleString("en-US")}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-4">
              <p className="text-xs text-[#92A49B]">ضغطات التحميل من الموقع</p>
              <p className="font-latin mt-1 text-2xl font-extrabold text-[#E5C67E]">
                {totalSiteDownloads.toLocaleString("en-US")}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-4">
              <p className="text-xs text-[#92A49B]">سجلات النشاط المرئية لك</p>
              <p className="font-latin mt-1 text-2xl font-extrabold text-[#F4EFE4]">
                {adminLogs.length}
              </p>
            </div>
          </div>

          {activeTab === "feedback" && (
            <FeedbackTab initialItems={feedbackItems} />
          )}
          {activeTab === "releases" && (
            <ReleasesTab
              initialReleases={releases}
              githubReleases={githubReleases}
            />
          )}
          {activeTab === "downloads" && (
            <DownloadsTab
              totalSiteDownloads={totalSiteDownloads}
              events={downloadEvents}
              githubReleases={githubReleases}
              githubTotalDownloads={githubTotalDownloads}
            />
          )}
          {activeTab === "notices" && <NoticesTab initialNotices={notices} />}
          {activeTab === "logs" && (
            <LogsTab logs={adminLogs} currentRole={adminRole} />
          )}
          {activeTab === "team" && (
            <TeamAccountTab
              currentUserId={currentUserId}
              currentEmail={adminEmail}
              currentRole={adminRole}
              initialAdmins={adminUsers}
            />
          )}
        </main>
      </div>
    </div>
  );
}
