import { PortfolioPage } from "@/components/PortfolioPage";
import { getPublishedSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const result = await getPublishedSiteContent();
  const fallbackWarning =
    process.env.NODE_ENV !== "production" && result.source === "fallback"
      ? `Using static fallback because the backend API is unavailable${
          result.apiBaseUrl ? ` at ${result.apiBaseUrl}` : ""
        }. ${result.error ?? ""}`.trim()
      : undefined;

  return <PortfolioPage content={result.content} fallbackWarning={fallbackWarning} />;
}
