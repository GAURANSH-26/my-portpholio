import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getSiteDocument,
  publishDraftContent,
  resetDraftFromPublished,
  saveDraftContent
} from "../services/siteStore.js";
import { siteContentSchema } from "../validation.js";

export const siteRouter = Router();

siteRouter.get("/public/site", async (_req, res, next) => {
  try {
    const published = await getSiteDocument("published");

    res.json({
      content: published.content,
      publishedAt: published.publishedAt,
      updatedAt: published.updatedAt
    });
  } catch (error) {
    next(error);
  }
});

siteRouter.get("/admin/site/draft", requireAuth, async (_req, res, next) => {
  try {
    const draft = await getSiteDocument("draft");
    const published = await getSiteDocument("published");

    res.json({
      content: draft.content,
      draftUpdatedAt: draft.updatedAt,
      publishedAt: published.publishedAt,
      publishedUpdatedAt: published.updatedAt
    });
  } catch (error) {
    next(error);
  }
});

siteRouter.put("/admin/site/draft", requireAuth, async (req, res, next) => {
  try {
    const payload = req.body?.content ?? req.body;
    const parsed = siteContentSchema.safeParse(payload);

    if (!parsed.success) {
      res.status(400).json({
        error: "Portfolio content is invalid.",
        details: parsed.error.flatten()
      });
      return;
    }

    const draft = await saveDraftContent(parsed.data);

    res.json({
      content: draft?.content ?? parsed.data,
      draftUpdatedAt: draft?.updatedAt
    });
  } catch (error) {
    next(error);
  }
});

siteRouter.post("/admin/site/publish", requireAuth, async (_req, res, next) => {
  try {
    const published = await publishDraftContent();

    res.json({
      content: published?.content,
      publishedAt: published?.publishedAt,
      publishedUpdatedAt: published?.updatedAt
    });
  } catch (error) {
    next(error);
  }
});

siteRouter.post("/admin/site/reset-draft", requireAuth, async (_req, res, next) => {
  try {
    const draft = await resetDraftFromPublished();

    res.json({
      content: draft?.content,
      draftUpdatedAt: draft?.updatedAt
    });
  } catch (error) {
    next(error);
  }
});
