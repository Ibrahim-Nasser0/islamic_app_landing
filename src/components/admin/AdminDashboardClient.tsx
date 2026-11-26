"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  GitBranch,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  RefreshCw,
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
import { AdminToast, ToastType, ToastViewport } from "./AdminUi";
import { DownloadsTab } from "./DownloadsTab";
import { FeedbackTab } from "./FeedbackTab";
import { LogsTab } from "./LogsTab";
import { NoticesTab } from "./NoticesTab";
import { AdminSectionId, OverviewTab } from "./OverviewTab";
import { ReleasesTab } from "./ReleasesTab";
import { TeamAccountTab } from "./TeamAccountTab";

interface AdminDashboardClientProps {
  serverRenderedAt: string;
  currentUserId: string;
  adminEmail: string;
  adminRole: AdminRole;
  hasServiceKey: boolean;
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

function AdminWorkspace({
  activeTab,
  onSelectTab,
  onNotify,
  onRefresh,
  refreshing,
  currentUserId,
  adminEmail,
  adminRole,
  hasServiceKey,
  initialFeedback,
  initialReleases,
  initialNotices,
  downloadEvents,
  totalSiteDownloads,
  githubReleases,
  githubTotalDownloads,
  adminLogs,
  initialAdmins,
}: {
  activeTab: AdminSectionId;
  onSelectTab: (tab: AdminSectionId) => void;
  onNotify: (type: ToastType, message: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
  currentUserId: string;
  adminEmail: string;
  adminRole: AdminRole;
  hasServiceKey: boolean;
  initialFeedback: FeedbackItem[];
  initialReleases: AppReleaseItem[];
  initialNotices: SiteNoticeItem[];
  downloadEvents: DownloadEventItem[];
  totalSiteDownloads: number;
  githubReleases: GitHubReleaseSummaryItem[];
  githubTotalDownloads: number;
  adminLogs: AdminLogItem[];
  initialAdmins: AdminUserItem[];
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(initialFeedback);
  const [releases, setReleases] = useState<AppReleaseItem[]>(initialReleases);
  const [notices, setNotices] = useState<SiteNoticeItem[]>(initialNotices);
  const [admins, setAdmins] = useState<AdminUserItem[]>(initialAdmins);

  const isOwner = adminRole === "owner";
  const newFeedbackCount = feedbackItems.filter((f) => f.status === "new").length;
  const activeNoticesCount = notices.filter((n) => n.is_active).length;

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
      id: "overview",
      label: "نظرة عامة",
      icon: LayoutDashboard,
    },
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
      badge: activeNoticesCount > 0 ? activeNoticesCount : undefined,
    },
    {
      id: "logs",
      label: "سجل النشاطات",
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
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[#D8B467]/50 bg-[#0D1E18] p-0.5 shadow-[inset_0_1px_0_rgba(245,223,164,0.2)]">
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
              <p className="text-[11px] text-[#D8B467]">لوحة القيادة</p>
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
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
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
            <span className="h-2 w-2 rounded-full bg-[#10B981]" title="متصل" />
          </div>
          <p
            dir="ltr"
            className="font-latin mt-1.5 truncate text-xs font-medium text-[#E2E8E5]"
          >
            {adminEmail}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? "border-[#D8B467]/50 bg-gradient-to-b from-[#216E5C] to-[#13473B] text-[#F6E2A8] shadow-[inset_0_1px_0_rgba(245,223,164,0.2)]"
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
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#D8B467]/15 bg-[#07100D]/92 px-5 py-3.5 backdrop-blur-md sm:px-8">
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

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#D8B467]/30 bg-[#0D1915] px-3 text-xs font-semibold text-[#E5C67E] transition-colors hover:bg-[#132922] disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">تحديث</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
          {activeTab === "overview" && (
            <OverviewTab
              adminEmail={adminEmail}
              feedbackItems={feedbackItems}
              releases={releases}
              notices={notices}
              downloadEvents={downloadEvents}
              totalSiteDownloads={totalSiteDownloads}
              githubReleases={githubReleases}
              githubTotalDownloads={githubTotalDownloads}
              adminLogs={adminLogs}
              onNavigate={onSelectTab}
            />
          )}
          {activeTab === "feedback" && (
            <FeedbackTab
              items={feedbackItems}
              onItemsChange={setFeedbackItems}
              onNotify={onNotify}
            />
          )}
          {activeTab === "releases" && (
            <ReleasesTab
              releases={releases}
              githubReleases={githubReleases}
              onReleasesChange={setReleases}
              onNotify={onNotify}
            />
          )}
          {activeTab === "downloads" && (
            <DownloadsTab
              totalSiteDownloads={totalSiteDownloads}
              events={downloadEvents}
              githubReleases={githubReleases}
              githubTotalDownloads={githubTotalDownloads}
              onNotify={onNotify}
            />
          )}
          {activeTab === "notices" && (
            <NoticesTab
              notices={notices}
              onNoticesChange={setNotices}
              onNotify={onNotify}
            />
          )}
          {activeTab === "logs" && (
            <LogsTab logs={adminLogs} currentRole={adminRole} />
          )}
          {activeTab === "team" && (
            <TeamAccountTab
              currentUserId={currentUserId}
              currentEmail={adminEmail}
              currentRole={adminRole}
              admins={admins}
              hasServiceKey={hasServiceKey}
              onAdminsChange={setAdmins}
              onNotify={onNotify}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export function AdminDashboardClient(props: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminSectionId>("overview");
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setRefreshing(false);
      notify("info", "تم تحديث بيانات اللوحة.");
    }, 600);
  }, [router, notify]);

  return (
    <>
      <AdminWorkspace
        key={props.serverRenderedAt}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNotify={notify}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        currentUserId={props.currentUserId}
        adminEmail={props.adminEmail}
        adminRole={props.adminRole}
        hasServiceKey={props.hasServiceKey}
        initialFeedback={props.feedbackItems}
        initialReleases={props.releases}
        initialNotices={props.notices}
        downloadEvents={props.downloadEvents}
        totalSiteDownloads={props.totalSiteDownloads}
        githubReleases={props.githubReleases}
        githubTotalDownloads={props.githubTotalDownloads}
        adminLogs={props.adminLogs}
        initialAdmins={props.adminUsers}
      />
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
