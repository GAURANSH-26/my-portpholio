"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { loginAdmin } from "@/lib/admin-api";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginAdmin(email, password);
      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-auth">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-mark">
          <ShieldCheck aria-hidden="true" />
        </div>
        <div>
          <p className="admin-eyebrow">Portfolio control room</p>
          <h1>Admin login</h1>
          <p>Sign in to edit profile, projects, images, links, theme, SEO, and publish status.</p>
        </div>

        <label className="admin-field">
          <span>Email</span>
          <span className="admin-input-icon">
            <Mail aria-hidden="true" />
            <input
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </span>
        </label>

        <label className="admin-field">
          <span>Password</span>
          <span className="admin-input-icon">
            <LockKeyhole aria-hidden="true" />
            <input
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </span>
        </label>

        {error ? <p className="admin-error">{error}</p> : null}

        <button className="admin-button admin-button--primary" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Open admin panel"}
        </button>
      </form>
    </main>
  );
}
