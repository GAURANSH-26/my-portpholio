import multer from "multer";
import { Router } from "express";
import { deleteCloudinaryAsset, uploadImageBuffer } from "../cloudinary.js";
import { requireAuth } from "../middleware/auth.js";
import { MediaAsset } from "../models/MediaAsset.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Only image uploads are supported."));
      return;
    }

    callback(null, true);
  }
});

export const mediaRouter = Router();

mediaRouter.use(requireAuth);

mediaRouter.get("/", async (_req, res, next) => {
  try {
    const assets = await MediaAsset.find().sort({ createdAt: -1 }).lean();
    res.json({ assets });
  } catch (error) {
    next(error);
  }
});

mediaRouter.post("/", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Select an image to upload." });
      return;
    }

    const uploaded = await uploadImageBuffer(req.file);
    const asset = await MediaAsset.create({
      publicId: uploaded.public_id,
      url: uploaded.url,
      secureUrl: uploaded.secure_url,
      format: uploaded.format,
      width: uploaded.width,
      height: uploaded.height,
      bytes: uploaded.bytes,
      folder: uploaded.folder,
      originalName: req.file.originalname
    });

    res.status(201).json({ asset });
  } catch (error) {
    next(error);
  }
});

mediaRouter.delete("/:id", async (req, res, next) => {
  try {
    const asset = await MediaAsset.findById(req.params.id);

    if (!asset) {
      res.status(404).json({ error: "Media asset not found." });
      return;
    }

    await deleteCloudinaryAsset(asset.publicId);
    await asset.deleteOne();

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});
