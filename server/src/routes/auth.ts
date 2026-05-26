import bcrypt from "bcryptjs";
import { Router } from "express";
import { cookieName, isProduction } from "../env.js";
import { requireAuth, signAdminToken, type AdminRequest } from "../middleware/auth.js";
import { AdminUser } from "../models/AdminUser.js";
import { loginSchema } from "../validation.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Enter a valid email and password." });
      return;
    }

    const email = parsed.data.email.toLowerCase();
    const admin = await AdminUser.findOne({ email });
    const passwordMatches = admin
      ? await bcrypt.compare(parsed.data.password, admin.passwordHash)
      : false;

    if (!admin || !passwordMatches) {
      res.status(401).json({ error: "Invalid admin credentials." });
      return;
    }

    const token = signAdminToken({
      sub: admin.id,
      email: admin.email,
      role: admin.role
    });

    res.cookie(cookieName, token, {
      httpOnly: true,
      sameSite: isProduction() ? "none" : "lax",
      secure: isProduction(),
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.json({
      admin: {
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ admin: (req as AdminRequest).admin });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: isProduction() ? "none" : "lax",
    secure: isProduction()
  });
  res.json({ ok: true });
});
