"use client";

import { useMemo, useState } from "react";
import { Activity, Search, Shield, UserCheck } from "lucide-react";
import { AdminLogItem, AdminRole } from "@/lib/supabase/config";

interface LogsTabProps {
  logs: AdminLogItem[];
  currentRole: AdminRole;
}

const ACTION_GROUP_LABELS: Record<string, string> = {
  all: "كل النشاطات",
  feedback: "البلاغات",
  release: "الإصدارات",
  notice: "التنبيهات",
  admin: "الإدارة والحساب",
};

export function LogsTab({ logs, currentRole }: LogsTabProps) {
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [actorFilter, setActorFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const actors = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.actor_email));
    return Array.from(set);
  }, [logs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((log) => {
      if (groupFilter !== "all" && !log.action.startsWith(`${groupFilter}.`)) {
        return false;
      }
      if (actorFilter !== "all" && log.actor_email !== actorFilter) {
        return false;
      }
      if (!q) return true;
      return (
        log.summary.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.actor_email.toLowerCase().includes(q)
      );
    });
  }, [logs, groupFilter, actorFilter, search]);

  return (
    <div className="space-y-5">
      {/* Scope Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D8B467]/25 bg-[#0D1915] px-4 py-3 text-xs">
        <div className="flex items-center gap-2 text-[#E5C67E]">
          {currentRole === "owner" ? (
            <Shield className="h-4 w-4 text-[#D8B467]" />
          ) : (
            <UserCheck className="h-4 w-4 text-[#6EE7B7]" />
          )}
          <span>
            {currentRole === "owner"
              ? "وضع المالك (Owner): يظهر لك سجل جميع النشاطات لكل المشرفين."
              : "وضع المشرف (Admin): يظهر لك سجل نشاطاتك الشخصية فقط."}
          </span>
        </div>
        <span className="font-latin text-[11px] text-[#92A49B]">
          {filtered.length} / {logs.length} سجل
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {Object.entries(ACTION_GROUP_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setGroupFilter(key)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                groupFilter === key
                  ? "border-[#D8B467]/55 bg-[#1B5E4F]/60 text-[#F6E2A8]"
                  : "border-[var(--sanctuary-border)] bg-[#07100D] text-[#92A49B] hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentRole === "owner" && actors.length > 1 && (
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              dir="ltr"
              className="h-9 rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-3 text-xs text-[#F2EFE9]"
            >
              <option value="all">All admins</option>
              {actors.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          )}

          <div className="relative">
            <Search className="pointer-events-none absolute top-2.5 start-3 h-3.5 w-3.5 text-[#92A49B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في السجل..."
              className="h-9 w-52 rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] ps-8 pe-3 text-xs text-[#F2EFE9] placeholder:text-[#5F7068] focus:border-[#D8B467] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Logs Timeline / Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-10 text-center text-sm text-[#92A49B]">
          لا توجد نشاطات مسجلة تطابق الفلتر الحالي.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--sanctuary-border)] bg-[#0D1915]">
          <div className="divide-y divide-white/5">
            {filtered.map((log) => (
              <div
                key={log.id}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#D8B467]/35 bg-[#132922] px-2 py-0.5 font-latin font-semibold text-[#F2D184]">
                      <Activity className="h-3 w-3" />
                      {log.action}
                    </span>
                    <span
                      dir="ltr"
                      className="font-latin font-medium text-[#E2E8E5]"
                    >
                      {log.actor_email}
                    </span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 font-latin text-[10px] font-bold uppercase ${
                        log.actor_role === "owner"
                          ? "bg-[#D8B467]/20 text-[#F5DFA4]"
                          : "bg-[#10B981]/15 text-[#6EE7B7]"
                      }`}
                    >
                      {log.actor_role}
                    </span>
                  </div>
                  <p className="text-sm text-[#F2EFE9]">{log.summary}</p>
                </div>

                <div className="shrink-0 text-xs text-[#92A49B]">
                  {new Date(log.created_at).toLocaleString("ar-EG")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
