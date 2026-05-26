import mongoose, { Schema, type Model } from "mongoose";
import type { SiteContent } from "../../../data/site.js";

export type SiteContentKind = "draft" | "published";

export type SiteContentRecord = {
  kind: SiteContentKind;
  content: SiteContent;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

const siteContentSchema = new Schema<SiteContentRecord>(
  {
    kind: {
      type: String,
      enum: ["draft", "published"],
      required: true,
      unique: true
    },
    content: {
      type: Schema.Types.Mixed,
      required: true
    },
    publishedAt: Date
  },
  { minimize: false, timestamps: true }
);

export const SiteContentModel =
  (mongoose.models.SiteContent as Model<SiteContentRecord> | undefined) ??
  mongoose.model<SiteContentRecord>("SiteContent", siteContentSchema);
