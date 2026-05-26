import bcrypt from "bcryptjs";
import { env } from "../env.js";
import { AdminUser } from "../models/AdminUser.js";

export async function ensureAdminUser() {
  if (!env.adminEmail || !env.adminPassword) {
    console.warn("ADMIN_EMAIL and ADMIN_PASSWORD are not set; admin user was not seeded.");
    return;
  }

  const existing = await AdminUser.findOne({ email: env.adminEmail.toLowerCase() });

  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);

  await AdminUser.create({
    email: env.adminEmail.toLowerCase(),
    passwordHash,
    role: "owner"
  });
}
