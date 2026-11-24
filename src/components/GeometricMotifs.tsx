export function OctagramPatternOverlay() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.045]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="islamic-octagram"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="30"
            y="30"
            width="60"
            height="60"
            rx="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect
            x="30"
            y="30"
            width="60"
            height="60"
            rx="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            transform="rotate(45 60 60)"
          />
          <circle
            cx="60"
            cy="60"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-octagram)" />
    </svg>
  );
}

export function ManuscriptCorners({ color = "#C5A059" }: { color?: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        style={{ borderColor: color }}
        className="pointer-events-none absolute top-3 left-3 h-4 w-4 rounded-tl-md border-t-2 border-l-2 opacity-60"
      />
      <span
        aria-hidden="true"
        style={{ borderColor: color }}
        className="pointer-events-none absolute top-3 right-3 h-4 w-4 rounded-tr-md border-t-2 border-r-2 opacity-60"
      />
      <span
        aria-hidden="true"
        style={{ borderColor: color }}
        className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 rounded-bl-md border-b-2 border-l-2 opacity-60"
      />
      <span
        aria-hidden="true"
        style={{ borderColor: color }}
        className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 rounded-br-md border-b-2 border-r-2 opacity-60"
      />
    </>
  );
}

export function GoldHairlineDivider() {
  return (
    <div aria-hidden="true" className="mx-auto flex max-w-6xl items-center px-5 sm:px-8">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/45" />
      <div className="mx-4 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rotate-45 bg-[#C5A059]/60" />
        <span className="h-2.5 w-2.5 rotate-45 border border-[#C5A059] bg-[#C5A059]/15" />
        <span className="h-1.5 w-1.5 rotate-45 bg-[#C5A059]/60" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/45" />
    </div>
  );
}

export function BreathingRosette({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      {isPlaying && (
        <>
          <span className="animate-rosette-ring absolute h-24 w-24 rounded-full border border-[#E0B866]/50" />
          <span className="animate-rosette-ring-delayed absolute h-24 w-24 rounded-full border border-[#E0B866]/40" />
        </>
      )}
      <div
        className={`relative flex h-24 w-24 items-center justify-center ${
          isPlaying ? "animate-gentle-breathe" : ""
        }`}
      >
        <div className="absolute h-20 w-20 rounded-2xl border border-[#E0B866]/45 bg-white/5" />
        <div className="absolute h-20 w-20 rotate-45 rounded-2xl border border-[#E0B866]/45 bg-white/5" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#E0B866] bg-[#E0B866]/15">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6 fill-[#E0B866]"
          >
            <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function EqualizerBars({ active }: { active: boolean }) {
  return (
    <span aria-hidden="true" className="inline-flex h-4 items-end gap-0.5">
      <span
        className={`h-full w-0.5 origin-bottom rounded-full bg-[#E0B866] ${
          active ? "animate-eq-1" : "scale-y-50 opacity-50"
        }`}
      />
      <span
        className={`h-full w-0.5 origin-bottom rounded-full bg-[#E0B866] ${
          active ? "animate-eq-2" : "scale-y-75 opacity-50"
        }`}
      />
      <span
        className={`h-full w-0.5 origin-bottom rounded-full bg-[#E0B866] ${
          active ? "animate-eq-3" : "scale-y-50 opacity-50"
        }`}
      />
      <span
        className={`h-full w-0.5 origin-bottom rounded-full bg-[#E0B866] ${
          active ? "animate-eq-4" : "scale-y-75 opacity-50"
        }`}
      />
    </span>
  );
}

export function RubElHizbMark({
  className = "h-3.5 w-3.5 text-[#D8B467]",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(45 12 12)"
      />
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
    </svg>
  );
}

export const SANCTUARY_PRIMARY_CTA =
  "border border-[#D8B467]/45 bg-gradient-to-b from-[#216E5C] to-[#13473B] text-[#FBF7ED] shadow-[inset_0_1px_0_rgba(245,223,164,0.22)] transition-all hover:brightness-110 active:scale-[0.98]";

export const SANCTUARY_SECONDARY_BTN =
  "border border-[#D8B467]/25 bg-[#0B1813] text-[#F2EFE9] transition-colors hover:border-[#D8B467]/55 hover:bg-[#10221C]";

export function SectionSanctuaryHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  onSky = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  onSky?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div
        className={`inline-flex items-center gap-2 text-xs font-bold tracking-wider ${
          onSky ? "text-[#E0B866]" : "text-[#D8B467]"
        }`}
      >
        <RubElHizbMark className="h-3.5 w-3.5 shrink-0" />
        <span>{eyebrow}</span>
        {centered && <RubElHizbMark className="h-3.5 w-3.5 shrink-0" />}
      </div>
      <h2
        className={`font-sacred mt-2.5 text-2xl leading-[1.35] font-bold sm:text-4xl sm:leading-[1.3] ${
          onSky ? "text-[#FBF7EE]" : "text-[#F4EFE4]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-sm leading-relaxed sm:text-base ${
            onSky ? "text-white/80" : "text-[#92A49B]"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function OctagonalIconFrame({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
      <span
        aria-hidden="true"
        className={`absolute inset-0.5 rotate-45 rounded-lg border transition-colors ${
          active
            ? "border-[#D8B467]/55 bg-[#1B5E4F]/25"
            : "border-[#D8B467]/25 bg-[#0A1713]"
        }`}
      />
      <div
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
          active
            ? "border-[#D8B467]/60 bg-gradient-to-b from-[#1F6A59] to-[#134539] text-[#F5DFA4]"
            : "border-[#D8B467]/25 bg-[#091410] text-[#D8B467]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
