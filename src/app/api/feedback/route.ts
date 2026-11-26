import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getSupabaseServiceKey, getSupabaseUrl } from "@/lib/supabase/config";

type FeedbackCategory = "bug" | "suggestion" | "adhan_times" | "other";

interface FeedbackPayload {
  category?: string;
  message?: string;
  deviceInfo?: string;
  contact?: string;
  locale?: string;
  appVersion?: string;
  idempotencyKey?: string;
  website?: string; // Honeypot anti-spam field
}

const VALID_CATEGORIES = new Set<FeedbackCategory>([
  "bug",
  "suggestion",
  "adhan_times",
  "other",
]);

function buildGithubIssueUrl(params: {
  category: FeedbackCategory;
  message: string;
  deviceInfo?: string;
}): string {
  const titlePrefix: Record<FeedbackCategory, string> = {
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
  const shortTitle = `${titlePrefix[params.category]} ${params.message
    .replace(/\s+/g, " ")
    .slice(0, 60)}`;
  const bodyLines = [
    params.message,
    "",
    params.deviceInfo ? `**Device:** ${params.deviceInfo}` : "",
    `_Submitted via Zad Al-Muslim Landing Page_`,
  ].filter(Boolean);

  const query = new URLSearchParams({
    title: shortTitle,
    body: bodyLines.join("\n"),
    labels: labelMap[params.category],
  });
  return `${siteConfig.githubRepoUrl}/issues/new?${query.toString()}`;
}

export async function POST(req: NextRequest) {
  let body: FeedbackPayload;
  try {
    body = (await req.json()) as FeedbackPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }

  // Silently accept honeypot traps without forwarding spam
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true, mode: "ignored" });
  }

  const rawCategory = body.category ?? "other";
  const category: FeedbackCategory = VALID_CATEGORIES.has(
    rawCategory as FeedbackCategory
  )
    ? (rawCategory as FeedbackCategory)
    : "other";

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length < 8 || message.length > 2000) {
    return NextResponse.json(
      {
        ok: false,
        error: "Message must be between 8 and 2000 characters",
      },
      { status: 400 }
    );
  }

  const deviceInfo =
    typeof body.deviceInfo === "string" ? body.deviceInfo.trim().slice(0, 120) : "";
  const contact =
    typeof body.contact === "string" ? body.contact.trim().slice(0, 120) : "";
  const locale = body.locale === "en" ? "en" : "ar";
  const appVersion =
    typeof body.appVersion === "string" ? body.appVersion.trim().slice(0, 40) : "";
  const idempotencyKey =
    typeof body.idempotencyKey === "string"
      ? body.idempotencyKey.trim().slice(0, 80)
      : undefined;

  const githubIssueUrl = buildGithubIssueUrl({
    category,
    message,
    deviceInfo: deviceInfo || undefined,
  });

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseServiceKey();
  const tableName = process.env.SUPABASE_FEEDBACK_TABLE || "feedback";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      ok: true,
      mode: "pending_supabase",
      githubIssueUrl,
    });
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal,resolution=ignore-duplicates",
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey ?? null,
        category,
        message,
        device_info: deviceInfo || null,
        contact: contact || null,
        locale,
        app_version: appVersion || null,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Database temporarily unavailable",
          githubIssueUrl,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      mode: "supabase",
      githubIssueUrl,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Network failure forwarding feedback",
        githubIssueUrl,
      },
      { status: 502 }
    );
  }
}
