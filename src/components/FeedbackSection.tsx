"use client";

import { FormEvent, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MessageSquarePlus,
  Send,
} from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";
import { ManuscriptCorners } from "./GeometricMotifs";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string; fallbackUrl?: string }
  | { status: "success"; mode: "supabase" | "pending_supabase" | "ignored"; fallbackUrl?: string };

export function FeedbackSection({ locale }: { locale: Locale }) {
  const t = landingCopy[locale].feedbackSection;

  const [category, setCategory] = useState<string>(t.categories[0].id);
  const [message, setMessage] = useState("");
  const [deviceInfo, setDeviceInfo] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot anti-spam
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitState.status === "submitting") return;

    const trimmed = message.trim();
    if (trimmed.length < 8) {
      setSubmitState({ status: "error", message: t.minCharError });
      return;
    }

    setSubmitState({ status: "submitting" });
    const idempotencyKey =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          message: trimmed,
          deviceInfo,
          contact,
          locale,
          idempotencyKey,
          website,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        mode?: "supabase" | "pending_supabase" | "ignored";
        error?: string;
        githubIssueUrl?: string;
      };

      if (!res.ok || !data.ok) {
        setSubmitState({
          status: "error",
          message: t.networkError,
          fallbackUrl: data.githubIssueUrl,
        });
        return;
      }

      setSubmitState({
        status: "success",
        mode: data.mode ?? "pending_supabase",
        fallbackUrl: data.githubIssueUrl,
      });
    } catch {
      setSubmitState({ status: "error", message: t.networkError });
    }
  };

  const resetForm = () => {
    setMessage("");
    setDeviceInfo("");
    setContact("");
    setSubmitState({ status: "idle" });
  };

  return (
    <section id="feedback" className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D8B467]/30 bg-[#0D1915] px-4 py-1 text-xs font-semibold text-[#E0B866]">
          <MessageSquarePlus className="h-3.5 w-3.5" />
          <span>{t.eyebrow}</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#F2EFE9] sm:text-4xl">
          {t.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#92A49B] sm:text-base">
          {t.subtitle}
        </p>
      </div>

      <div className="relative mt-10 overflow-hidden rounded-[32px] border border-[#D8B467]/30 bg-[#0D1915] p-6 shadow-lg sm:p-9">
        <ManuscriptCorners />

        {submitState.status === "success" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#10B981]/40 bg-[#10B981]/15">
              <CheckCircle2 className="h-7 w-7 text-[#10B981]" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#F2EFE9]">
              {submitState.mode === "supabase"
                ? t.successSupabaseTitle
                : t.successFallbackTitle}
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#92A49B]">
              {submitState.mode === "supabase"
                ? t.successSupabaseDesc
                : t.successFallbackDesc}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {submitState.fallbackUrl && submitState.mode !== "supabase" && (
                <a
                  href={submitState.fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#1B5E4F] px-6 text-sm font-bold text-white transition-all hover:brightness-110"
                >
                  <ExternalLink className="h-4 w-4 text-[#E0B866]" />
                  <span>{t.openGithubIssue}</span>
                </a>
              )}
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-12 items-center rounded-2xl border border-[var(--sanctuary-border)] bg-[#12231D] px-5 text-sm font-semibold text-[#F2EFE9] hover:border-[#D8B467]"
              >
                {t.sendAnother}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
            {/* Hidden anti-spam honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            <div className="flex flex-wrap gap-2">
              {t.categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`min-h-11 rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                    category === cat.id
                      ? "border-[#D8B467] bg-[#1B5E4F] text-white"
                      : "border-[var(--sanctuary-border)] bg-[#07100D] text-[#92A49B] hover:text-[#F2EFE9]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div>
              <label
                htmlFor="feedback-message"
                className="mb-2 block text-xs font-semibold text-[#F2EFE9]"
              >
                {t.messageLabel}
              </label>
              <textarea
                id="feedback-message"
                required
                rows={4}
                maxLength={2000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.messagePlaceholder}
                className="w-full rounded-2xl border border-[var(--sanctuary-border)] bg-[#07100D] px-4 py-3 text-sm text-[#F2EFE9] placeholder:text-[#5F7068] focus:border-[#D8B467] focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="feedback-device"
                  className="mb-1.5 block text-xs font-medium text-[#92A49B]"
                >
                  {t.deviceLabel}
                </label>
                <input
                  id="feedback-device"
                  type="text"
                  maxLength={120}
                  value={deviceInfo}
                  onChange={(e) => setDeviceInfo(e.target.value)}
                  placeholder={t.devicePlaceholder}
                  className="h-11 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-4 text-sm text-[#F2EFE9] placeholder:text-[#5F7068] focus:border-[#D8B467] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="feedback-contact"
                  className="mb-1.5 block text-xs font-medium text-[#92A49B]"
                >
                  {t.contactLabel}
                </label>
                <input
                  id="feedback-contact"
                  type="text"
                  maxLength={120}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={t.contactPlaceholder}
                  className="h-11 w-full rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] px-4 text-sm text-[#F2EFE9] placeholder:text-[#5F7068] focus:border-[#D8B467] focus:outline-none"
                />
              </div>
            </div>

            {submitState.status === "error" && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-xs text-[#FCA5A5]">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitState.message}</span>
                </div>
                {submitState.fallbackUrl && (
                  <a
                    href={submitState.fallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline"
                  >
                    {t.openGithubIssue}
                  </a>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitState.status === "submitting"}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#1B5E4F] text-sm font-bold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitState.status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#E0B866]" />
                  <span>{t.submittingBtn}</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 text-[#E0B866]" />
                  <span>{t.submitBtn}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
