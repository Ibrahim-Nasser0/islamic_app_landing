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
