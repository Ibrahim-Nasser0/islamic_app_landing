export const siteConfig = {
  appNameAr: "زاد المسلم",
  appNameEn: "Zad Al-Muslim",
  githubOwner: "Ibrahim-Nasser0",
  githubRepo: "islamic_app",
  get githubRepoUrl() {
    return `https://github.com/${this.githubOwner}/${this.githubRepo}`;
  },
  get githubReleasesUrl() {
    return `https://github.com/${this.githubOwner}/${this.githubRepo}/releases/latest`;
  },
  get githubAllReleasesUrl() {
    return `https://github.com/${this.githubOwner}/${this.githubRepo}/releases`;
  },
  defaultVersion: "v1.0.0",
  minAndroidVersion: "Android 8.0+",
  get siteUrl() {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (explicit) return explicit.replace(/\/+$/, "");
    const vercel =
      process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
      process.env.VERCEL_URL?.trim();
    if (vercel) {
      return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
    }
    return "http://localhost:3000";
  },
} as const;
