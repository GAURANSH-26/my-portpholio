import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env, hasCloudinaryConfig } from "./env.js";

export function configureCloudinary() {
  if (!hasCloudinaryConfig()) {
    return;
  }

  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true
  });
}

export async function uploadImageBuffer(
  file: Express.Multer.File
): Promise<UploadApiResponse> {
  if (!hasCloudinaryConfig()) {
    throw new Error("Cloudinary credentials are required for media uploads.");
  }

  configureCloudinary();

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        cloud_name: env.cloudinaryCloudName,
        api_key: env.cloudinaryApiKey,
        api_secret: env.cloudinaryApiSecret,
        folder: "gauransh-portfolio",
        resource_type: "image"
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }

        resolve(result);
      }
    );

    upload.end(file.buffer);
  });
}

export async function deleteCloudinaryAsset(publicId: string) {
  if (!hasCloudinaryConfig()) {
    return;
  }

  configureCloudinary();

  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
