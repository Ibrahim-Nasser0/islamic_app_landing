import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { getGitHubReleasesAggregate } from "@/lib/github-release";
import {
  AdminLogItem,
  AdminUserItem,
  AppReleaseItem,
  DownloadEventItem,
  FeedbackItem,
  SiteNoticeItem,
  hasServiceSupabaseEnv,
} from "@/lib/supabase/config";
import { getAdminAuthStatus } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authResult = await getAdminAuthStatus();
  if (authResult.status === "unauthenticated") {
    redirect("/admin/login");
  }
  if (authResult.status === "not_admin") {
    redirect("/admin/login?error=not_admin");
  }
  const auth = authResult;

  const isOwner = auth.admin.role === "owner";

  const [
    feedbackRes,
    releasesRes,
    noticesRes,
    downloadsRes,
    downloadsCountRes,
    githubAggregate,
    logsRes,
    adminsRes,
  ] = await Promise.all([
    auth.supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
    auth.supabase
      .from("app_releases")
      .select("*")
      .order("released_at", { ascending: false })
      .limit(100),
    auth.supabase
      .from("site_notices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
    auth.supabase
      .from("download_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000),
    auth.supabase
      .from("download_events")
      .select("*", { count: "exact", head: true }),
    getGitHubReleasesAggregate(),
    auth.supabase
      .from("admin_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
    isOwner
      ? auth.supabase
          .from("admin_users")
          .select("user_id, email, role, created_at")
          .order("created_at", { ascending: true })
      : Promise.resolve({ data: [auth.admin] }),
  ]);

  const feedbackItems = (feedbackRes.data ?? []) as FeedbackItem[];
  const releases = (releasesRes.data ?? []) as AppReleaseItem[];
  const notices = (noticesRes.data ?? []) as SiteNoticeItem[];
  const downloadEvents = (downloadsRes.data ?? []) as DownloadEventItem[];
  const totalSiteDownloads =
    typeof downloadsCountRes.count === "number"
      ? downloadsCountRes.count
      : downloadEvents.length;
  const adminLogs = (logsRes.data ?? []) as AdminLogItem[];
  const adminUsers = (adminsRes.data ?? [auth.admin]) as AdminUserItem[];

  return (
    <AdminDashboardClient
      serverRenderedAt={new Date().toISOString()}
      currentUserId={auth.admin.user_id}
      adminEmail={auth.admin.email}
      adminRole={auth.admin.role}
      hasServiceKey={hasServiceSupabaseEnv()}
      feedbackItems={feedbackItems}
      releases={releases}
      notices={notices}
      downloadEvents={downloadEvents}
      totalSiteDownloads={totalSiteDownloads}
      githubReleases={githubAggregate.releases}
      githubTotalDownloads={githubAggregate.totalApkDownloads}
      adminLogs={adminLogs}
      adminUsers={adminUsers}
    />
  );
}
