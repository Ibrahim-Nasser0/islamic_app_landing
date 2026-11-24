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
} as const;
