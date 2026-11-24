import { LandingClient } from "@/components/LandingClient";
import { getLatestReleaseInfo } from "@/lib/github-release";

export default async function HomePage() {
  const release = await getLatestReleaseInfo();
  return <LandingClient release={release} />;
}
