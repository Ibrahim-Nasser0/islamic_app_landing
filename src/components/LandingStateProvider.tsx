"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import dynamic from "next/dynamic";
import {
  ApkArch,
  ApkVariant,
  DeviceDetectionResult,
  detectDeviceApkArchClient,
  resolveApkVariant,
} from "@/lib/device-apk";
import { Locale, HomeMessages } from "@/lib/i18n";
import { ReleaseDownloadInfo } from "@/lib/github-release";

const ReleaseNotesModal = dynamic(
  () => import("./ReleaseNotesModal").then((m) => m.ReleaseNotesModal),
  { ssr: false }
);

interface LandingStateContextValue {
  detection: DeviceDetectionResult | null;
  detectedArch: ApkArch | null;
  matchedVariant: ApkVariant | null;
  downloadCount: number;
  incrementDownloadCount: () => void;
  openReleaseNotes: () => void;
}

const LandingStateContext = createContext<LandingStateContextValue | null>(null);

export function useLandingState() {
  return useContext(LandingStateContext);
}

interface LandingStateProviderProps {
  locale: Locale;
  release: ReleaseDownloadInfo;
  initialDownloadCount: number;
  modalMessages: HomeMessages["releaseModal"];
  children: React.ReactNode;
}

export function LandingStateProvider({
  locale,
  release,
  initialDownloadCount,
  modalMessages,
  children,
}: LandingStateProviderProps) {
  const [detection, setDetection] = useState<DeviceDetectionResult | null>(null);
  const [localDelta, setLocalDelta] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void detectDeviceApkArchClient().then((result) => {
      if (!cancelled) {
        setDetection(result);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const detectedArch = detection?.arch ?? null;
  const matchedVariant = useMemo(
    () => (detectedArch ? resolveApkVariant(release.variants, detectedArch) : null),
    [release.variants, detectedArch]
  );

  const incrementDownloadCount = useCallback(() => {
    setLocalDelta((prev) => prev + 1);
  }, []);

  const openReleaseNotes = useCallback(() => {
    setNotesOpen(true);
  }, []);

  const value = useMemo<LandingStateContextValue>(
    () => ({
      detection,
      detectedArch,
      matchedVariant,
      downloadCount: initialDownloadCount + localDelta,
      incrementDownloadCount,
      openReleaseNotes,
    }),
    [
      detection,
      detectedArch,
      matchedVariant,
      initialDownloadCount,
      localDelta,
      incrementDownloadCount,
      openReleaseNotes,
    ]
  );

  return (
    <LandingStateContext.Provider value={value}>
      {children}
      <ReleaseNotesModal
        open={notesOpen}
        locale={locale}
        messages={modalMessages}
        release={release}
        detectedArch={detectedArch}
        matchedVariant={matchedVariant}
        onDownloadClick={incrementDownloadCount}
        onClose={() => setNotesOpen(false)}
      />
    </LandingStateContext.Provider>
  );
}

export function LiveDownloadNumber({
  initialCount,
  locale,
}: {
  initialCount: number;
  locale: Locale;
}) {
  const ctx = useLandingState();
  const count = ctx ? ctx.downloadCount : initialCount;
  return <>{count.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}</>;
}
