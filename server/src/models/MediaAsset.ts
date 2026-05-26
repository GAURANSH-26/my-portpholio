import mongoose, { Schema, type Model } from "mongoose";

export type MediaAssetShape = {
  publicId: string;
  url: string;
  secureUrl: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  folder?: string;
  originalName?: string;
};

const mediaAssetSchema = new Schema<MediaAssetShape>(
  {
    publicId: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    folder: String,
    originalName: String
  },
  { timestamps: true }
);

export const MediaAsset =
  (mongoose.models.MediaAsset as Model<MediaAssetShape> | undefined) ??
  mongoose.model<MediaAssetShape>("MediaAsset", mediaAssetSchema);
