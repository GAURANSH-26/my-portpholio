import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { cookieName, env } from "../env.js";

type AdminTokenPayload = {
  sub: string;
  email: string;
  role: "owner";
};

export type AdminRequest = Request & {
  admin?: AdminTokenPayload;
};

export function signAdminToken(payload: AdminTokenPayload) {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is required for admin authentication.");
  }

  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[cookieName] as string | undefined;

  if (!token) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    if (!env.jwtSecret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    (req as AdminRequest).admin = jwt.verify(token, env.jwtSecret) as AdminTokenPayload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session." });
  }
}
