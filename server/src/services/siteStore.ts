import { siteContent } from "../../../data/site.js";
import type { SiteContent } from "../../../data/site.js";
import { SiteContentModel, type SiteContentKind } from "../models/SiteContent.js";

export const defaultSiteContent = siteContent;

export async function ensureSiteDocuments() {
  await Promise.all([
    SiteContentModel.updateOne(
      { kind: "draft" },
      { $setOnInsert: { kind: "draft", content: defaultSiteContent } },
      { upsert: true }
    ),
    SiteContentModel.updateOne(
      { kind: "published" },
      {
        $setOnInsert: {
          kind: "published",
          content: defaultSiteContent,
          publishedAt: new Date()
        }
      },
      { upsert: true }
    )
  ]);
}

export async function getSiteDocument(kind: SiteContentKind) {
  const document = await SiteContentModel.findOne({ kind }).lean();

  if (document) {
    return document;
  }

  const created = await SiteContentModel.create({
    kind,
    content: defaultSiteContent,
    publishedAt: kind === "published" ? new Date() : undefined
  });

  return created.toObject();
}

export async function saveDraftContent(content: SiteContent) {
  return SiteContentModel.findOneAndUpdate(
    { kind: "draft" },
    { $set: { kind: "draft", content } },
    { new: true, upsert: true }
  ).lean();
}

export async function publishDraftContent() {
  const draft = await getSiteDocument("draft");
  const publishedAt = new Date();

  return SiteContentModel.findOneAndUpdate(
    { kind: "published" },
    {
      $set: {
        kind: "published",
        content: draft.content,
        publishedAt
      }
    },
    { new: true, upsert: true }
  ).lean();
}

export async function resetDraftFromPublished() {
  const published = await getSiteDocument("published");

  return SiteContentModel.findOneAndUpdate(
    { kind: "draft" },
    {
      $set: {
        kind: "draft",
        content: published.content
      }
    },
    { new: true, upsert: true }
  ).lean();
}
