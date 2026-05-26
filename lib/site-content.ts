import { siteContent } from "@/data/site";
import type { SiteContent } from "@/data/site";

export type PublishedSiteContentResult = {
  content: SiteContent;
  source: "api" | "fallback";
  apiBaseUrl?: string;
  error?: string;
};

const apiBaseUrl =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : undefined);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeSiteContent(content: Partial<SiteContent> | undefined): SiteContent {
  if (!content || !isRecord(content)) {
    return siteContent;
  }

  return {
    ...siteContent,
    ...content,
    profile: { ...siteContent.profile, ...content.profile },
    contact: {
      ...siteContent.contact,
      ...content.contact,
      socials: Array.isArray(content.contact?.socials)
        ? content.contact.socials
        : siteContent.contact.socials
    },
    cta: { ...siteContent.cta, ...content.cta },
    services: Array.isArray(content.services) ? content.services : siteContent.services,
    capabilities: Array.isArray(content.capabilities) ? content.capabilities : siteContent.capabilities,
    projects: Array.isArray(content.projects) ? content.projects : siteContent.projects,
    process: Array.isArray(content.process) ? content.process : siteContent.process,
    skills: Array.isArray(content.skills) ? content.skills : siteContent.skills,
    stackHighlights: Array.isArray(content.stackHighlights)
      ? content.stackHighlights
      : siteContent.stackHighlights,
    seo: { ...siteContent.seo, ...content.seo },
    theme: {
      ...siteContent.theme,
      ...content.theme,
      visibleSections: {
        ...siteContent.theme.visibleSections,
        ...content.theme?.visibleSections
      }
    }
  };
}

export async function getPublishedSiteContent(): Promise<PublishedSiteContentResult> {
  if (!apiBaseUrl) {
    return {
      content: siteContent,
      source: "fallback",
      error: "API base URL is not configured."
    };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/public/site`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return {
        content: siteContent,
        source: "fallback",
        apiBaseUrl,
        error: `API returned ${response.status}.`
      };
    }

    const payload = (await response.json()) as unknown;
    const content =
      isRecord(payload) && "content" in payload
        ? (payload.content as Partial<SiteContent> | undefined)
        : (payload as Partial<SiteContent> | undefined);

    return {
      content: mergeSiteContent(content),
      source: "api",
      apiBaseUrl
    };
  } catch (error) {
    return {
      content: siteContent,
      source: "fallback",
      apiBaseUrl,
      error: error instanceof Error ? error.message : "API request failed."
    };
  }
}
