"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  FileText,
  Gauge,
  Image as ImageIcon,
  Layers3,
  Link2,
  Loader2,
  LogOut,
  MessageCircle,
  Palette,
  Plus,
  Save,
  Search,
  Send,
  Sparkles,
  Trash2,
  Upload,
  UserRound
} from "lucide-react";
import { siteContent } from "@/data/site";
import type {
  Capability,
  Metric,
  ProcessStep,
  Project,
  Service,
  SiteContent,
  SocialLink,
  StackHighlight
} from "@/data/site";
import {
  deleteMedia,
  getAdminSession,
  getDraftSite,
  listMedia,
  logoutAdmin,
  publishSite,
  resetDraftSite,
  saveDraftSite,
  uploadMedia,
  type MediaAsset
} from "@/lib/admin-api";

const tabs = [
  { id: "dashboard", label: "Dashboard", Icon: Gauge },
  { id: "profile", label: "Profile", Icon: UserRound },
  { id: "hero", label: "Hero / CTA", Icon: Sparkles },
  { id: "services", label: "Services", Icon: Layers3 },
  { id: "projects", label: "Projects", Icon: ImageIcon },
  { id: "process", label: "Process", Icon: Activity },
  { id: "about", label: "About / Stack", Icon: FileText },
  { id: "contact", label: "Contact", Icon: MessageCircle },
  { id: "seo", label: "SEO", Icon: Search },
  { id: "theme", label: "Theme", Icon: Palette },
  { id: "media", label: "Media", Icon: Upload }
] as const;

type TabId = (typeof tabs)[number]["id"];
type UploadHandler = (file: File) => Promise<string>;

const emptyService: Service = {
  code: "S00",
  title: "New service",
  description: "Describe the client outcome and scope.",
  tech: ["Next.js"],
  deliverable: "Deliverable summary"
};

const emptyCapability: Capability = {
  label: "00 / Capability",
  title: "New capability title",
  description: "Describe this capability in one or two sentences.",
  signal: "Signal"
};

const emptyMetric: Metric = {
  value: "00",
  label: "metric label"
};

const emptyProject: Project = {
  title: "New project",
  category: "Category",
  description: "Describe the project, result, and client value.",
  image: "/projects/pulse-launch.svg",
  url: "#contact",
  placeholder: true,
  metrics: [emptyMetric]
};

const emptyProcessStep: ProcessStep = {
  title: "New step",
  description: "Describe what happens in this step."
};

const emptyStackHighlight: StackHighlight = {
  label: "Stack",
  title: "New highlight",
  description: "Describe this stack strength."
};

const emptySocial: SocialLink = {
  label: "New social",
  url: "https://"
};

function replaceAt<T>(items: T[], index: number, value: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

function removeAt<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(targetIndex, 0, item);
  return next;
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value?: string) {
  if (!value) {
    return "Not published yet";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function StringListField({
  label,
  values,
  onChange
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <Field
      label={label}
      multiline
      value={values.join("\n")}
      onChange={(value) => onChange(splitLines(value))}
    />
  );
}

function ImageField({
  label,
  value,
  onChange,
  onUpload
}: {
  label: string;
  value: string;
  onChange: (value: string, persist?: boolean) => void;
  onUpload: UploadHandler;
}) {
  return (
    <div className="admin-image-field">
      <div className="admin-image-field__control">
        <Field label={label} value={value} onChange={onChange} />
        <div className="admin-image-preview">
          {value ? <img src={value} alt="" /> : <ImageIcon aria-hidden="true" />}
          <span>{value || "No image selected"}</span>
        </div>
      </div>
      <label className="admin-upload-button">
        <Upload aria-hidden="true" />
        Upload
        <input
          accept="image/*"
          type="file"
          onChange={async (event) => {
            const input = event.currentTarget;
            const file = event.target.files?.[0];
            try {
              if (file) {
                const url = await onUpload(file);
                onChange(url, true);
              }
            } catch {
              // The upload handler surfaces a visible admin error.
            } finally {
              input.value = "";
            }
          }}
        />
      </label>
    </div>
  );
}

function AdminSection({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-section">
      <div className="admin-section__heading">
        <div>
          <p className="admin-eyebrow">Edit content</p>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

function ItemActions({
  onMoveUp,
  onMoveDown,
  onDelete
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="admin-item-actions">
      <button type="button" onClick={onMoveUp}>
        Up
      </button>
      <button type="button" onClick={onMoveDown}>
        Down
      </button>
      <button type="button" onClick={onDelete}>
        <Trash2 aria-hidden="true" />
        Delete
      </button>
    </div>
  );
}

export function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [draft, setDraft] = useState<SiteContent>(siteContent);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [autosaveToken, setAutosaveToken] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [draftUpdatedAt, setDraftUpdatedAt] = useState<string | undefined>();
  const [publishedAt, setPublishedAt] = useState<string | undefined>();
  const latestChangeRef = useRef(0);

  const readiness = useMemo(
    () => [
      { label: "Profile photo", complete: Boolean(draft.profile.photo) },
      { label: "WhatsApp link", complete: draft.contact.whatsappUrl.includes("wa.me") },
      { label: "Email", complete: draft.contact.email.includes("@") },
      { label: "Real projects", complete: draft.projects.every((project) => !project.placeholder) },
      { label: "SEO title", complete: draft.seo.title.length > 12 }
    ],
    [draft]
  );

  useEffect(() => {
    let mounted = true;

    async function loadAdmin() {
      try {
        await getAdminSession();
        const [draftResponse, mediaResponse] = await Promise.all([
          getDraftSite(),
          listMedia().catch(() => ({ assets: [] }))
        ]);

        if (!mounted) {
          return;
        }

        setDraft(draftResponse.content);
        setDraftUpdatedAt(draftResponse.draftUpdatedAt);
        setPublishedAt(draftResponse.publishedAt ?? draftResponse.publishedUpdatedAt);
        setAssets(mediaResponse.assets);
      } catch {
        router.replace("/admin/login");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadAdmin();

    return () => {
      mounted = false;
    };
  }, [router]);

  const syncLive = useCallback(async (snapshot: SiteContent, token: number, successMessage = "Live.") => {
    setSaving(true);
    setError("");
    setStatus("Saving...");

    try {
      if (token !== latestChangeRef.current) {
        return;
      }

      const saved = await saveDraftSite(snapshot);

      if (token === latestChangeRef.current) {
        setDraft(saved.content);
        setDraftUpdatedAt(saved.draftUpdatedAt);
        setStatus("Publishing live...");
      }

      if (token !== latestChangeRef.current) {
        return;
      }

      const published = await publishSite();

      if (token === latestChangeRef.current) {
        if (published.content) {
          setDraft(published.content);
        }
        setPublishedAt(published.publishedAt ?? published.publishedUpdatedAt);
        setDirty(false);
        setStatus(successMessage);
      }
    } catch (saveError) {
      if (token === latestChangeRef.current) {
        setDirty(true);
        setError(saveError instanceof Error ? saveError.message : "Live sync failed.");
      }
    } finally {
      if (token === latestChangeRef.current) {
        setSaving(false);
      }
    }
  }, []);

  useEffect(() => {
    if (loading || uploading || autosaveToken === 0) {
      return undefined;
    }

    const token = autosaveToken;
    const snapshot = draft;
    const timer = window.setTimeout(() => {
      void syncLive(snapshot, token);
    }, 800);

    return () => window.clearTimeout(timer);
  }, [autosaveToken, draft, loading, syncLive, uploading]);

  function commit(
    next: SiteContent,
    options: { immediate?: boolean; successMessage?: string } = {}
  ) {
    latestChangeRef.current += 1;
    const token = latestChangeRef.current;

    setDraft(next);
    setDirty(true);
    setError("");

    if (options.immediate) {
      setAutosaveToken(0);
      void syncLive(next, token, options.successMessage);
      return;
    }

    setStatus("Queued live update...");
    setAutosaveToken(token);
  }

  async function persistDraftSnapshot(next: SiteContent, successMessage = "Live.") {
    latestChangeRef.current += 1;
    setAutosaveToken(0);
    await syncLive(next, latestChangeRef.current, successMessage);
  }

  function updateContent<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    commit({ ...draft, [key]: value });
  }

  async function handleSave() {
    await persistDraftSnapshot(draft);
  }

  async function handlePublish() {
    await persistDraftSnapshot(draft, "Published site content is live.");
  }

  async function handleResetDraft() {
    if (!window.confirm("Reset draft from the current published content?")) {
      return;
    }

    setSaving(true);
    setError("");
    latestChangeRef.current += 1;
    setAutosaveToken(0);

    try {
      const response = await resetDraftSite();
      setDraft(response.content);
      setDraftUpdatedAt(response.draftUpdatedAt);
      setDirty(false);
      setStatus("Draft reset from published content.");
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Reset failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logoutAdmin().catch(() => undefined);
    router.replace("/admin/login");
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");

    try {
      const response = await uploadMedia(file);
      setAssets((current) => [response.asset, ...current]);
      setStatus("Image uploaded. Publishing live...");
      return response.asset.secureUrl;
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
      throw uploadError;
    } finally {
      setUploading(false);
    }
  }

  function updateProfilePhoto(photo: string, persist = false) {
    const next = {
      ...draft,
      profile: { ...draft.profile, photo }
    };

    if (persist) {
      commit(next, {
        immediate: true,
        successMessage: "Profile image uploaded and live."
      });
      return;
    }

    commit(next);
  }

  function updateProjectImage(index: number, project: Project, image: string, persist = false) {
    const next = {
      ...draft,
      projects: replaceAt(draft.projects, index, { ...project, image })
    };

    if (persist) {
      commit(next, {
        immediate: true,
        successMessage: "Project image uploaded and live."
      });
      return;
    }

    commit(next);
  }

  async function handleDeleteMedia(asset: MediaAsset) {
    if (!window.confirm(`Delete ${asset.originalName ?? asset.publicId}?`)) {
      return;
    }

    try {
      await deleteMedia(asset._id);
      setAssets((current) => current.filter((item) => item._id !== asset._id));
      setStatus("Media asset deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed.");
    }
  }

  function copyMediaUrl(asset: MediaAsset) {
    void navigator.clipboard?.writeText(asset.secureUrl);
    setStatus("Media URL copied.");
  }

  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const ActiveTabIcon = activeTabMeta.Icon;

  if (loading) {
    return (
      <main className="admin-shell admin-shell--loading">
        <Loader2 className="admin-spinner" aria-hidden="true" />
        <p>Loading admin panel...</p>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/">
          <span>{draft.profile.name.charAt(0) || "G"}</span>
          <div>
            <strong>{draft.profile.name}</strong>
            <p>Portfolio admin</p>
          </div>
        </Link>
        <nav className="admin-tabs" aria-label="Admin sections">
          {tabs.map(({ id, label, Icon }) => (
            <button
              className={id === activeTab ? "admin-tab admin-tab--active" : "admin-tab"}
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
            >
              <Icon aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">Draft workspace</p>
            <h1>
              <ActiveTabIcon aria-hidden="true" />
              {activeTabMeta.label}
            </h1>
          </div>
          <div className="admin-actions">
            <Link className="admin-button" href="/" target="_blank" rel="noreferrer">
              <ArrowUpRight aria-hidden="true" />
              Preview
            </Link>
            <button className="admin-button" type="button" onClick={handleResetDraft} disabled={saving}>
              Reset draft
            </button>
            <button className="admin-button" type="button" onClick={handleSave} disabled={saving || !dirty}>
              <Save aria-hidden="true" />
              {saving ? "Syncing..." : "Sync now"}
            </button>
            <button className="admin-button admin-button--primary" type="button" onClick={handlePublish}>
              <Send aria-hidden="true" />
              Publish
            </button>
            <button className="admin-icon-button" type="button" onClick={handleLogout} aria-label="Logout">
              <LogOut aria-hidden="true" />
            </button>
          </div>
        </header>

        {(status || error || dirty || uploading) && (
          <div className={error ? "admin-notice admin-notice--error" : "admin-notice"}>
            {error || (uploading ? "Uploading image..." : status || "Draft has unsaved changes.")}
          </div>
        )}

        {activeTab === "dashboard" ? (
          <AdminSection
            title="Publishing status"
            description="Edits now save and publish automatically. Use this control room to confirm live status, media, and readiness."
          >
            <div className="admin-stat-grid">
              <article>
                <span>Draft</span>
                <strong>{dirty ? "Sync pending" : "Synced"}</strong>
                <p>Last draft save: {formatDate(draftUpdatedAt)}</p>
              </article>
              <article>
                <span>Published</span>
                <strong>{formatDate(publishedAt)}</strong>
                <p>The public page reads this published content from the Express API.</p>
              </article>
              <article>
                <span>Media library</span>
                <strong>{assets.length} assets</strong>
                <p>Images upload to Cloudinary and can be pasted into profile or project fields.</p>
              </article>
            </div>
            <div className="admin-readiness">
              {readiness.map((item) => (
                <span key={item.label} className={item.complete ? "is-complete" : ""}>
                  <CheckCircle2 aria-hidden="true" />
                  {item.label}
                </span>
              ))}
            </div>
          </AdminSection>
        ) : null}

        {activeTab === "profile" ? (
          <AdminSection
            title="Profile"
            description="Update identity, positioning, profile image, availability, and site URL."
          >
            <div className="admin-grid">
              <Field
                label="Name"
                value={draft.profile.name}
                onChange={(name) => updateContent("profile", { ...draft.profile, name })}
              />
              <Field
                label="Role"
                value={draft.profile.role}
                onChange={(role) => updateContent("profile", { ...draft.profile, role })}
              />
              <Field
                label="Location"
                value={draft.profile.location}
                onChange={(location) => updateContent("profile", { ...draft.profile, location })}
              />
              <Field
                label="Availability"
                value={draft.profile.availability}
                onChange={(availability) => updateContent("profile", { ...draft.profile, availability })}
              />
              <Field
                label="Site URL"
                value={draft.profile.siteUrl}
                onChange={(siteUrl) => updateContent("profile", { ...draft.profile, siteUrl })}
              />
              <ImageField
                label="Profile photo URL"
                value={draft.profile.photo}
                onChange={updateProfilePhoto}
                onUpload={handleUpload}
              />
              <Field
                label="Fallback photo URL"
                value={draft.profile.fallbackPhoto}
                onChange={(fallbackPhoto) => updateContent("profile", { ...draft.profile, fallbackPhoto })}
              />
              <Field
                label="Hero tagline"
                multiline
                value={draft.profile.tagline}
                onChange={(tagline) => updateContent("profile", { ...draft.profile, tagline })}
              />
              <Field
                label="Bio"
                multiline
                value={draft.profile.bio}
                onChange={(bio) => updateContent("profile", { ...draft.profile, bio })}
              />
            </div>
          </AdminSection>
        ) : null}

        {activeTab === "hero" ? (
          <AdminSection
            title="Hero and conversion copy"
            description="Edit CTA labels, hero secondary link, contact copy, and footer CTA language."
          >
            <div className="admin-grid">
              <Field
                label="Hero primary CTA"
                value={draft.cta.primaryLabel}
                onChange={(primaryLabel) => updateContent("cta", { ...draft.cta, primaryLabel })}
              />
              <Field
                label="Hero secondary CTA"
                value={draft.cta.secondaryLabel}
                onChange={(secondaryLabel) => updateContent("cta", { ...draft.cta, secondaryLabel })}
              />
              <Field
                label="Hero secondary href"
                value={draft.cta.secondaryHref}
                onChange={(secondaryHref) => updateContent("cta", { ...draft.cta, secondaryHref })}
              />
              <Field
                label="Contact eyebrow"
                value={draft.cta.contactEyebrow}
                onChange={(contactEyebrow) => updateContent("cta", { ...draft.cta, contactEyebrow })}
              />
              <Field
                label="Contact heading"
                multiline
                value={draft.cta.contactHeading}
                onChange={(contactHeading) => updateContent("cta", { ...draft.cta, contactHeading })}
              />
              <Field
                label="Contact WhatsApp label"
                value={draft.cta.contactWhatsappLabel}
                onChange={(contactWhatsappLabel) =>
                  updateContent("cta", { ...draft.cta, contactWhatsappLabel })
                }
              />
              <Field
                label="Footer eyebrow"
                value={draft.cta.footerEyebrow}
                onChange={(footerEyebrow) => updateContent("cta", { ...draft.cta, footerEyebrow })}
              />
              <Field
                label="Footer heading"
                multiline
                value={draft.cta.footerHeading}
                onChange={(footerHeading) => updateContent("cta", { ...draft.cta, footerHeading })}
              />
              <Field
                label="Footer primary title"
                value={draft.cta.footerPrimaryTitle}
                onChange={(footerPrimaryTitle) => updateContent("cta", { ...draft.cta, footerPrimaryTitle })}
              />
              <Field
                label="Footer primary subtitle"
                value={draft.cta.footerPrimarySubtitle}
                onChange={(footerPrimarySubtitle) =>
                  updateContent("cta", { ...draft.cta, footerPrimarySubtitle })
                }
              />
              <Field
                label="Footer email title"
                value={draft.cta.footerEmailTitle}
                onChange={(footerEmailTitle) => updateContent("cta", { ...draft.cta, footerEmailTitle })}
              />
            </div>
          </AdminSection>
        ) : null}

        {activeTab === "services" ? (
          <AdminSection
            title="Services and capabilities"
            description="Add, remove, reorder, and edit service cards plus the sticky capability runway."
          >
            <div className="admin-list-heading">
              <h3>Services</h3>
              <button
                className="admin-button"
                type="button"
                onClick={() => updateContent("services", [...draft.services, emptyService])}
              >
                <Plus aria-hidden="true" />
                Add service
              </button>
            </div>
            <div className="admin-card-list">
              {draft.services.map((service, index) => (
                <article className="admin-edit-card" key={`${service.title}-${index}`}>
                  <ItemActions
                    onMoveUp={() => updateContent("services", moveItem(draft.services, index, -1))}
                    onMoveDown={() => updateContent("services", moveItem(draft.services, index, 1))}
                    onDelete={() => updateContent("services", removeAt(draft.services, index))}
                  />
                  <div className="admin-grid">
                    <Field
                      label="Code"
                      value={service.code}
                      onChange={(code) =>
                        updateContent("services", replaceAt(draft.services, index, { ...service, code }))
                      }
                    />
                    <Field
                      label="Title"
                      value={service.title}
                      onChange={(title) =>
                        updateContent("services", replaceAt(draft.services, index, { ...service, title }))
                      }
                    />
                    <Field
                      label="Deliverable"
                      value={service.deliverable}
                      onChange={(deliverable) =>
                        updateContent("services", replaceAt(draft.services, index, { ...service, deliverable }))
                      }
                    />
                    <StringListField
                      label="Technologies"
                      values={service.tech}
                      onChange={(tech) =>
                        updateContent("services", replaceAt(draft.services, index, { ...service, tech }))
                      }
                    />
                    <Field
                      label="Description"
                      multiline
                      value={service.description}
                      onChange={(description) =>
                        updateContent("services", replaceAt(draft.services, index, { ...service, description }))
                      }
                    />
                  </div>
                </article>
              ))}
            </div>

            <div className="admin-list-heading">
              <h3>Capability runway</h3>
              <button
                className="admin-button"
                type="button"
                onClick={() => updateContent("capabilities", [...draft.capabilities, emptyCapability])}
              >
                <Plus aria-hidden="true" />
                Add capability
              </button>
            </div>
            <div className="admin-card-list">
              {draft.capabilities.map((capability, index) => (
                <article className="admin-edit-card" key={`${capability.title}-${index}`}>
                  <ItemActions
                    onMoveUp={() =>
                      updateContent("capabilities", moveItem(draft.capabilities, index, -1))
                    }
                    onMoveDown={() =>
                      updateContent("capabilities", moveItem(draft.capabilities, index, 1))
                    }
                    onDelete={() => updateContent("capabilities", removeAt(draft.capabilities, index))}
                  />
                  <div className="admin-grid">
                    {(["label", "title", "signal"] as const).map((field) => (
                      <Field
                        key={field}
                        label={field}
                        value={capability[field]}
                        onChange={(value) =>
                          updateContent(
                            "capabilities",
                            replaceAt(draft.capabilities, index, { ...capability, [field]: value })
                          )
                        }
                      />
                    ))}
                    <Field
                      label="Description"
                      multiline
                      value={capability.description}
                      onChange={(description) =>
                        updateContent(
                          "capabilities",
                          replaceAt(draft.capabilities, index, { ...capability, description })
                        )
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </AdminSection>
        ) : null}

        {activeTab === "projects" ? (
          <AdminSection
            title="Projects"
            description="Replace placeholder studies with real projects, links, screenshots, and proof metrics."
          >
            <div className="admin-list-heading">
              <h3>Case studies</h3>
              <button
                className="admin-button"
                type="button"
                onClick={() => updateContent("projects", [...draft.projects, emptyProject])}
              >
                <Plus aria-hidden="true" />
                Add project
              </button>
            </div>
            <div className="admin-card-list">
              {draft.projects.map((project, index) => (
                <article className="admin-edit-card" key={`${project.title}-${index}`}>
                  <ItemActions
                    onMoveUp={() => updateContent("projects", moveItem(draft.projects, index, -1))}
                    onMoveDown={() => updateContent("projects", moveItem(draft.projects, index, 1))}
                    onDelete={() => updateContent("projects", removeAt(draft.projects, index))}
                  />
                  <div className="admin-grid">
                    <Field
                      label="Title"
                      value={project.title}
                      onChange={(title) =>
                        updateContent("projects", replaceAt(draft.projects, index, { ...project, title }))
                      }
                    />
                    <Field
                      label="Category"
                      value={project.category}
                      onChange={(category) =>
                        updateContent("projects", replaceAt(draft.projects, index, { ...project, category }))
                      }
                    />
                    <Field
                      label="Project link"
                      value={project.url}
                      onChange={(url) =>
                        updateContent("projects", replaceAt(draft.projects, index, { ...project, url }))
                      }
                    />
                    <ImageField
                      label="Project image"
                      value={project.image}
                      onChange={(image, persist) => updateProjectImage(index, project, image, persist)}
                      onUpload={handleUpload}
                    />
                    <label className="admin-check">
                      <input
                        checked={project.placeholder}
                        type="checkbox"
                        onChange={(event) =>
                          updateContent(
                            "projects",
                            replaceAt(draft.projects, index, {
                              ...project,
                              placeholder: event.target.checked
                            })
                          )
                        }
                      />
                      Show placeholder warning
                    </label>
                    <Field
                      label="Description"
                      multiline
                      value={project.description}
                      onChange={(description) =>
                        updateContent("projects", replaceAt(draft.projects, index, { ...project, description }))
                      }
                    />
                  </div>
                  <div className="admin-list-heading admin-list-heading--compact">
                    <h4>Metrics</h4>
                    <button
                      className="admin-button"
                      type="button"
                      onClick={() =>
                        updateContent("projects", replaceAt(draft.projects, index, {
                          ...project,
                          metrics: [...project.metrics, emptyMetric]
                        }))
                      }
                    >
                      <Plus aria-hidden="true" />
                      Add metric
                    </button>
                  </div>
                  <div className="admin-metric-grid">
                    {project.metrics.map((metric, metricIndex) => (
                      <div className="admin-metric-edit" key={`${metric.label}-${metricIndex}`}>
                        <Field
                          label="Value"
                          value={metric.value}
                          onChange={(value) => {
                            const metrics = replaceAt(project.metrics, metricIndex, { ...metric, value });
                            updateContent("projects", replaceAt(draft.projects, index, { ...project, metrics }));
                          }}
                        />
                        <Field
                          label="Label"
                          value={metric.label}
                          onChange={(label) => {
                            const metrics = replaceAt(project.metrics, metricIndex, { ...metric, label });
                            updateContent("projects", replaceAt(draft.projects, index, { ...project, metrics }));
                          }}
                        />
                        <button
                          className="admin-icon-button"
                          type="button"
                          onClick={() => {
                            const metrics = removeAt(project.metrics, metricIndex);
                            updateContent("projects", replaceAt(draft.projects, index, { ...project, metrics }));
                          }}
                          aria-label="Delete metric"
                        >
                          <Trash2 aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </AdminSection>
        ) : null}

        {activeTab === "process" ? (
          <AdminSection
            title="Process"
            description="Customize the client workflow shown in the timeline."
          >
            <div className="admin-list-heading">
              <h3>Timeline steps</h3>
              <button
                className="admin-button"
                type="button"
                onClick={() => updateContent("process", [...draft.process, emptyProcessStep])}
              >
                <Plus aria-hidden="true" />
                Add step
              </button>
            </div>
            <div className="admin-card-list">
              {draft.process.map((step, index) => (
                <article className="admin-edit-card" key={`${step.title}-${index}`}>
                  <ItemActions
                    onMoveUp={() => updateContent("process", moveItem(draft.process, index, -1))}
                    onMoveDown={() => updateContent("process", moveItem(draft.process, index, 1))}
                    onDelete={() => updateContent("process", removeAt(draft.process, index))}
                  />
                  <div className="admin-grid">
                    <Field
                      label="Title"
                      value={step.title}
                      onChange={(title) =>
                        updateContent("process", replaceAt(draft.process, index, { ...step, title }))
                      }
                    />
                    <Field
                      label="Description"
                      multiline
                      value={step.description}
                      onChange={(description) =>
                        updateContent("process", replaceAt(draft.process, index, { ...step, description }))
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </AdminSection>
        ) : null}

        {activeTab === "about" ? (
          <AdminSection
            title="About, skills, and stack"
            description="Fine-tune your profile story, marquee skills, and stack highlight panels."
          >
            <Field
              label="About bio"
              multiline
              value={draft.profile.bio}
              onChange={(bio) => updateContent("profile", { ...draft.profile, bio })}
            />
            <StringListField
              label="Skills, one per line"
              values={draft.skills}
              onChange={(skills) => updateContent("skills", skills)}
            />
            <div className="admin-list-heading">
              <h3>Stack highlights</h3>
              <button
                className="admin-button"
                type="button"
                onClick={() => updateContent("stackHighlights", [...draft.stackHighlights, emptyStackHighlight])}
              >
                <Plus aria-hidden="true" />
                Add highlight
              </button>
            </div>
            <div className="admin-card-list">
              {draft.stackHighlights.map((item, index) => (
                <article className="admin-edit-card" key={`${item.title}-${index}`}>
                  <ItemActions
                    onMoveUp={() =>
                      updateContent("stackHighlights", moveItem(draft.stackHighlights, index, -1))
                    }
                    onMoveDown={() =>
                      updateContent("stackHighlights", moveItem(draft.stackHighlights, index, 1))
                    }
                    onDelete={() => updateContent("stackHighlights", removeAt(draft.stackHighlights, index))}
                  />
                  <div className="admin-grid">
                    <Field
                      label="Label"
                      value={item.label}
                      onChange={(label) =>
                        updateContent("stackHighlights", replaceAt(draft.stackHighlights, index, { ...item, label }))
                      }
                    />
                    <Field
                      label="Title"
                      value={item.title}
                      onChange={(title) =>
                        updateContent("stackHighlights", replaceAt(draft.stackHighlights, index, { ...item, title }))
                      }
                    />
                    <Field
                      label="Description"
                      multiline
                      value={item.description}
                      onChange={(description) =>
                        updateContent(
                          "stackHighlights",
                          replaceAt(draft.stackHighlights, index, { ...item, description })
                        )
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </AdminSection>
        ) : null}

        {activeTab === "contact" ? (
          <AdminSection
            title="Contact and social links"
            description="Manage WhatsApp, email, and all footer social links."
          >
            <div className="admin-grid">
              <Field
                label="WhatsApp URL"
                value={draft.contact.whatsappUrl}
                onChange={(whatsappUrl) => updateContent("contact", { ...draft.contact, whatsappUrl })}
              />
              <Field
                label="Email"
                type="email"
                value={draft.contact.email}
                onChange={(email) => updateContent("contact", { ...draft.contact, email })}
              />
            </div>
            <div className="admin-list-heading">
              <h3>Social links</h3>
              <button
                className="admin-button"
                type="button"
                onClick={() =>
                  updateContent("contact", {
                    ...draft.contact,
                    socials: [...draft.contact.socials, emptySocial]
                  })
                }
              >
                <Plus aria-hidden="true" />
                Add social
              </button>
            </div>
            <div className="admin-card-list">
              {draft.contact.socials.map((social, index) => (
                <article className="admin-edit-card" key={`${social.label}-${index}`}>
                  <ItemActions
                    onMoveUp={() =>
                      updateContent("contact", {
                        ...draft.contact,
                        socials: moveItem(draft.contact.socials, index, -1)
                      })
                    }
                    onMoveDown={() =>
                      updateContent("contact", {
                        ...draft.contact,
                        socials: moveItem(draft.contact.socials, index, 1)
                      })
                    }
                    onDelete={() =>
                      updateContent("contact", {
                        ...draft.contact,
                        socials: removeAt(draft.contact.socials, index)
                      })
                    }
                  />
                  <div className="admin-grid">
                    <Field
                      label="Label"
                      value={social.label}
                      onChange={(label) =>
                        updateContent("contact", {
                          ...draft.contact,
                          socials: replaceAt(draft.contact.socials, index, { ...social, label })
                        })
                      }
                    />
                    <Field
                      label="URL"
                      value={social.url}
                      onChange={(url) =>
                        updateContent("contact", {
                          ...draft.contact,
                          socials: replaceAt(draft.contact.socials, index, { ...social, url })
                        })
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </AdminSection>
        ) : null}

        {activeTab === "seo" ? (
          <AdminSection
            title="SEO"
            description="Control search title, metadata, keywords, and canonical site URL."
          >
            <div className="admin-grid">
              <Field
                label="Meta title"
                value={draft.seo.title}
                onChange={(title) => updateContent("seo", { ...draft.seo, title })}
              />
              <Field
                label="Site URL"
                value={draft.seo.siteUrl ?? draft.profile.siteUrl}
                onChange={(siteUrl) => updateContent("seo", { ...draft.seo, siteUrl })}
              />
              <Field
                label="Meta description"
                multiline
                value={draft.seo.description}
                onChange={(description) => updateContent("seo", { ...draft.seo, description })}
              />
              <StringListField
                label="Keywords, one per line"
                values={draft.seo.keywords}
                onChange={(keywords) => updateContent("seo", { ...draft.seo, keywords })}
              />
            </div>
          </AdminSection>
        ) : null}

        {activeTab === "theme" ? (
          <AdminSection
            title="Theme and section visibility"
            description="Tune accent colors, motion intensity, object intensity, footer style, and visible sections."
          >
            <div className="admin-grid">
              <Field
                label="Cyan accent"
                type="color"
                value={draft.theme.accentCyan}
                onChange={(accentCyan) => updateContent("theme", { ...draft.theme, accentCyan })}
              />
              <Field
                label="Magenta accent"
                type="color"
                value={draft.theme.accentMagenta}
                onChange={(accentMagenta) => updateContent("theme", { ...draft.theme, accentMagenta })}
              />
              <Field
                label="Green accent"
                type="color"
                value={draft.theme.accentGreen}
                onChange={(accentGreen) => updateContent("theme", { ...draft.theme, accentGreen })}
              />
              <label className="admin-field">
                <span>Motion intensity</span>
                <select
                  value={draft.theme.motionIntensity}
                  onChange={(event) =>
                    updateContent("theme", {
                      ...draft.theme,
                      motionIntensity: event.target.value as SiteContent["theme"]["motionIntensity"]
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="balanced">Balanced</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="admin-field">
                <span>Object intensity</span>
                <select
                  value={draft.theme.objectIntensity}
                  onChange={(event) =>
                    updateContent("theme", {
                      ...draft.theme,
                      objectIntensity: event.target.value as SiteContent["theme"]["objectIntensity"]
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="balanced">Balanced</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="admin-field">
                <span>Footer style</span>
                <select
                  value={draft.theme.footerStyle}
                  onChange={(event) =>
                    updateContent("theme", {
                      ...draft.theme,
                      footerStyle: event.target.value as SiteContent["theme"]["footerStyle"]
                    })
                  }
                >
                  <option value="icon-tiles">Icon tiles</option>
                  <option value="compact">Compact</option>
                  <option value="dramatic">Dramatic</option>
                </select>
              </label>
            </div>
            <div className="admin-toggle-grid">
              <label className="admin-check">
                <input
                  checked={draft.theme.showGlassObjects}
                  type="checkbox"
                  onChange={(event) =>
                    updateContent("theme", { ...draft.theme, showGlassObjects: event.target.checked })
                  }
                />
                Show floating glass objects
              </label>
              {Object.entries(draft.theme.visibleSections).map(([key, value]) => (
                <label className="admin-check" key={key}>
                  <input
                    checked={value}
                    type="checkbox"
                    onChange={(event) =>
                      updateContent("theme", {
                        ...draft.theme,
                        visibleSections: {
                          ...draft.theme.visibleSections,
                          [key]: event.target.checked
                        }
                      })
                    }
                  />
                  Show {key}
                </label>
              ))}
            </div>
          </AdminSection>
        ) : null}

        {activeTab === "media" ? (
          <AdminSection
            title="Media library"
            description="Upload Cloudinary images, copy URLs, and remove assets that are no longer used."
          >
            <div className="admin-media-upload">
              <label className="admin-upload-drop">
                <Upload aria-hidden="true" />
                <strong>{uploading ? "Uploading..." : "Upload image"}</strong>
                <span>Profile images, project covers, thumbnails, and supporting media.</span>
                <input
                  accept="image/*"
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleUpload(file);
                    }
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
            <div className="admin-media-grid">
              {assets.map((asset) => (
                <article className="admin-media-card" key={asset._id}>
                  <img src={asset.secureUrl} alt={asset.originalName ?? asset.publicId} loading="lazy" />
                  <div>
                    <strong>{asset.originalName ?? asset.publicId}</strong>
                    <p>
                      {asset.width ?? 0}x{asset.height ?? 0} / {asset.format ?? "image"}
                    </p>
                  </div>
                  <div className="admin-media-actions">
                    <a href={asset.secureUrl} target="_blank" rel="noreferrer" aria-label="Open media">
                      <Link2 aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={() => updateProfilePhoto(asset.secureUrl, true)}
                      aria-label="Use as profile photo"
                    >
                      <UserRound aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => copyMediaUrl(asset)} aria-label="Copy media URL">
                      <Copy aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => void handleDeleteMedia(asset)} aria-label="Delete media">
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </AdminSection>
        ) : null}
      </div>
    </main>
  );
}
