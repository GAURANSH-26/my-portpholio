export type Profile = {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  photo: string;
  fallbackPhoto: string;
  location: string;
  availability: string;
  siteUrl: string;
};

export type Contact = {
  whatsappUrl: string;
  email: string;
  socials: SocialLink[];
};

export type SocialLink = {
  label: string;
  url: string;
};

export type HeroCta = {
  primaryLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
  contactEyebrow: string;
  contactHeading: string;
  contactWhatsappLabel: string;
  footerEyebrow: string;
  footerHeading: string;
  footerPrimaryTitle: string;
  footerPrimarySubtitle: string;
  footerEmailTitle: string;
};

export type Service = {
  code: string;
  title: string;
  description: string;
  tech: string[];
  deliverable: string;
};

export type Capability = {
  label: string;
  title: string;
  description: string;
  signal: string;
};

export type Metric = {
  value: string;
  label: string;
};

export type Project = {
  title: string;
  category: string;
  description: string;
  image: string;
  url: string;
  placeholder: boolean;
  metrics: Metric[];
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type StackHighlight = {
  label: string;
  title: string;
  description: string;
};

export type SeoSettings = {
  title: string;
  description: string;
  keywords: string[];
  siteUrl?: string;
};

export type ThemeSettings = {
  accentCyan: string;
  accentMagenta: string;
  accentGreen: string;
  motionIntensity: "low" | "balanced" | "high";
  objectIntensity: "low" | "balanced" | "high";
  footerStyle: "icon-tiles" | "compact" | "dramatic";
  showGlassObjects: boolean;
  visibleSections: {
    services: boolean;
    work: boolean;
    process: boolean;
    about: boolean;
    contact: boolean;
  };
};

export type SiteContent = {
  profile: Profile;
  contact: Contact;
  cta: HeroCta;
  services: Service[];
  capabilities: Capability[];
  projects: Project[];
  process: ProcessStep[];
  skills: string[];
  stackHighlights: StackHighlight[];
  seo: SeoSettings;
  theme: ThemeSettings;
};
