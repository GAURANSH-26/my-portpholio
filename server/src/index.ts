import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { configureCloudinary } from "./cloudinary.js";
import { connectDatabase } from "./db.js";
import { env, hasCloudinaryConfig } from "./env.js";
import { authRouter } from "./routes/auth.js";
import { mediaRouter } from "./routes/media.js";
import { siteRouter } from "./routes/site.js";
import { ensureAdminUser } from "./services/adminSeed.js";
import { ensureSiteDocuments } from "./services/siteStore.js";

const app = express();
const allowedOrigins = env.clientOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function corsOrigin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
  if (!origin) {
    callback(null, true);
    return;
  }

  const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

  if (allowedOrigins.includes(origin) || (env.nodeEnv !== "production" && isLocalhost)) {
    callback(null, true);
    return;
  }

  callback(new Error(`Origin ${origin} is not allowed by CORS.`));
}

app.set("trust proxy", 1);
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    cloudinary: hasCloudinaryConfig(),
    service: "gauransh-portfolio-api",
    version: "2026-05-26-cloudinary-upload-fix"
  });
});

app.use("/api/auth", authRouter);
app.use("/api", siteRouter);
app.use("/api/admin/media", mediaRouter);

app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
  void next;
  console.error(error);
  res.status(500).json({
    error: error.message || "Server error."
  });
});

async function start() {
  configureCloudinary();
  await connectDatabase();
  await ensureSiteDocuments();
  await ensureAdminUser();

  app.listen(env.port, () => {
    console.log(`Portfolio API listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
