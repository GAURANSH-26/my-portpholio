import { z } from "zod";

const stringListSchema = z.array(z.string());

const socialLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1)
});

const metricSchema = z.object({
  value: z.string(),
  label: z.string()
});

export const siteContentSchema = z.object({
  profile: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    tagline: z.string(),
    bio: z.string(),
    photo: z.string(),
    fallbackPhoto: z.string(),
    location: z.string(),
    availability: z.string(),
    siteUrl: z.string()
  }),
  contact: z.object({
    whatsappUrl: z.string().min(1),
    email: z.string().min(1),
    socials: z.array(socialLinkSchema)
  }),
  cta: z.object({
    primaryLabel: z.string().min(1),
    secondaryLabel: z.string().min(1),
    secondaryHref: z.string().min(1),
    contactEyebrow: z.string(),
    contactHeading: z.string(),
    contactWhatsappLabel: z.string(),
    footerEyebrow: z.string(),
    footerHeading: z.string(),
    footerPrimaryTitle: z.string(),
    footerPrimarySubtitle: z.string(),
    footerEmailTitle: z.string()
  }),
  services: z.array(
    z.object({
      code: z.string(),
      title: z.string().min(1),
      description: z.string(),
      tech: stringListSchema,
      deliverable: z.string()
    })
  ),
  capabilities: z.array(
    z.object({
      label: z.string(),
      title: z.string().min(1),
      description: z.string(),
      signal: z.string()
    })
  ),
  projects: z.array(
    z.object({
      title: z.string().min(1),
      category: z.string(),
      description: z.string(),
      image: z.string(),
      url: z.string(),
      placeholder: z.boolean(),
      metrics: z.array(metricSchema)
    })
  ),
  process: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string()
    })
  ),
  skills: stringListSchema,
  stackHighlights: z.array(
    z.object({
      label: z.string(),
      title: z.string().min(1),
      description: z.string()
    })
  ),
  seo: z.object({
    title: z.string().min(1),
    description: z.string(),
    keywords: stringListSchema,
    siteUrl: z.string().optional()
  }),
  theme: z.object({
    accentCyan: z.string(),
    accentMagenta: z.string(),
    accentGreen: z.string(),
    motionIntensity: z.enum(["low", "balanced", "high"]),
    objectIntensity: z.enum(["low", "balanced", "high"]),
    footerStyle: z.enum(["icon-tiles", "compact", "dramatic"]),
    showGlassObjects: z.boolean(),
    visibleSections: z.object({
      services: z.boolean(),
      work: z.boolean(),
      process: z.boolean(),
      about: z.boolean(),
      contact: z.boolean()
    })
  })
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
