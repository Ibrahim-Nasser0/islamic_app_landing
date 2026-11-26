import { LandingClient } from "@/components/LandingClient";
import { getLatestReleaseInfo } from "@/lib/github-release";
import { getLandingDynamicData } from "@/lib/landing-data";

export const revalidate = 60;

export default async function HomePage() {
  const [release, dynamicData] = await Promise.all([
    getLatestReleaseInfo(),
    getLandingDynamicData(),
  ]);

  return <LandingClient release={release} dynamicData={dynamicData} />;
}
