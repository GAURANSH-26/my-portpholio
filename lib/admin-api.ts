import type { SiteContent } from "@/data/site";

export type AdminSession = {
  admin: {
    sub?: string;
    email: string;
    role: "owner";
  };
};

export type DraftResponse = {
  content: SiteContent;
  draftUpdatedAt?: string;
  publishedAt?: string;
  publishedUpdatedAt?: string;
};

export type MediaAsset = {
  _id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  folder?: string;
  originalName?: string;
  createdAt?: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const isFormData = init.body instanceof FormData;

  if (!isFormData && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    credentials: "include"
  });
  const payload = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload as T;
}

export function loginAdmin(email: string, password: string) {
  return apiFetch<AdminSession>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function logoutAdmin() {
  return apiFetch<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

export function getAdminSession() {
  return apiFetch<AdminSession>("/api/auth/me");
}

export function getDraftSite() {
  return apiFetch<DraftResponse>("/api/admin/site/draft");
}

export function saveDraftSite(content: SiteContent) {
  return apiFetch<DraftResponse>("/api/admin/site/draft", {
    method: "PUT",
    body: JSON.stringify({ content })
  });
}

export function publishSite() {
  return apiFetch<DraftResponse>("/api/admin/site/publish", { method: "POST" });
}

export function resetDraftSite() {
  return apiFetch<DraftResponse>("/api/admin/site/reset-draft", { method: "POST" });
}

export function listMedia() {
  return apiFetch<{ assets: MediaAsset[] }>("/api/admin/media");
}

export function uploadMedia(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<{ asset: MediaAsset }>("/api/admin/media", {
    method: "POST",
    body: formData
  });
}

export function deleteMedia(id: string) {
  return apiFetch<{ ok: true }>(`/api/admin/media/${id}`, { method: "DELETE" });
}
