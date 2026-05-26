import type {
  Capability,
  Contact,
  ProcessStep,
  Profile,
  Project,
  Service,
  SiteContent,
  StackHighlight
} from "./types.js";

export type {
  Capability,
  Contact,
  HeroCta,
  Metric,
  ProcessStep,
  Profile,
  Project,
  SeoSettings,
  Service,
  SiteContent,
  SocialLink,
  StackHighlight,
  ThemeSettings
} from "./types.js";

export const siteContent = {
  profile: {
    name: "Gauransh",
    role: "Full-Stack Developer",
    tagline:
      "I design and build cinematic websites, full-stack web apps, ecommerce flows, dashboards, SEO foundations, and launch systems for growing businesses.",
    bio:
      "I help brands turn rough ideas into fast, polished web products. My work connects strategy, UI design, front-end animation, backend logic, deployment, and maintenance so clients get one clear build partner instead of disconnected pieces.",
    photo: "/profile/profile.jpg",
    fallbackPhoto: "/profile/profile-fallback.svg",
    location: "India / Remote",
    availability: "Available for new builds",
    siteUrl: "https://gauransh.dev"
  } satisfies Profile,
  contact: {
    whatsappUrl: "https://wa.me/919999999999?text=Hi%20Gauransh%2C%20I%20want%20to%20build%20a%20website%20or%20web%20app.",
    email: "hello@gauransh.dev",
    socials: [
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
      { label: "GitHub", url: "https://github.com/" },
      { label: "Instagram", url: "https://www.instagram.com/" }
    ]
  } satisfies Contact,
  cta: {
    primaryLabel: "Start on WhatsApp",
    secondaryLabel: "View work system",
    secondaryHref: "#work",
    contactEyebrow: "Have a website, app, or dashboard in mind?",
    contactHeading: "Let us turn it into a fast, memorable, conversion-ready web experience.",
    contactWhatsappLabel: "Message on WhatsApp",
    footerEyebrow: "Final checkpoint",
    footerHeading: "Ready to build a web experience that sells before the first call?",
    footerPrimaryTitle: "Start a project",
    footerPrimarySubtitle: "WhatsApp direct line",
    footerEmailTitle: "Email Gauransh"
  },
  services: [
    {
      code: "S01",
      title: "Business Websites",
      description:
        "Premium responsive websites with strong messaging, polished pages, contact flows, and launch-ready SEO basics.",
      tech: ["Next.js", "SEO", "CMS-ready"],
      deliverable: "Brand site, landing pages, speed pass"
    },
    {
      code: "S02",
      title: "Web Apps",
      description:
        "Custom portals, dashboards, admin systems, and authenticated app experiences built around real workflows.",
      tech: ["React", "Node", "Auth"],
      deliverable: "Frontend, backend, deployment"
    },
    {
      code: "S03",
      title: "Ecommerce",
      description:
        "Catalog, cart, payment, product story, and performance improvements for stores that need trust and conversion.",
      tech: ["Shopify", "Stripe", "Analytics"],
      deliverable: "Storefront, checkout, tracking"
    },
    {
      code: "S04",
      title: "3D And Motion",
      description:
        "Interactive WebGL moments, scroll narratives, shader effects, and microinteractions that make a site memorable.",
      tech: ["Three.js", "GSAP", "Shaders"],
      deliverable: "Hero scenes, transitions, motion system"
    },
    {
      code: "S05",
      title: "Performance And SEO",
      description:
        "Technical cleanup, Core Web Vitals improvements, semantic content, metadata, indexing, and analytics foundations.",
      tech: ["Lighthouse", "Schema", "A11y"],
      deliverable: "Audit, fixes, search foundation"
    },
    {
      code: "S06",
      title: "Care And Growth",
      description:
        "Maintenance, new sections, content updates, security checks, backups, and conversion experiments after launch.",
      tech: ["Vercel", "Monitoring", "Support"],
      deliverable: "Monthly web service support"
    }
  ] satisfies Service[],
  capabilities: [
    {
      label: "01 / Strategy",
      title: "Offer, audience, and page architecture before pixels.",
      description:
        "I map the conversion path, sections, CTAs, content hierarchy, and launch priorities so the build feels intentional from the first scroll.",
      signal: "Direction"
    },
    {
      label: "02 / Interface",
      title: "Dark, premium UI systems with motion built into the layout.",
      description:
        "The design system covers spacing, responsive components, content states, mobile behavior, and interaction details instead of isolated screens.",
      signal: "Design"
    },
    {
      label: "03 / Engineering",
      title: "Frontend, backend, APIs, auth, dashboards, and deployment.",
      description:
        "Every public page and private workflow is built with maintainable code, clear data flow, and production hosting in mind.",
      signal: "Build"
    },
    {
      label: "04 / Growth",
      title: "Performance, SEO, analytics, maintenance, and iteration.",
      description:
        "After launch, the site can keep improving through speed passes, content updates, conversion experiments, and technical care.",
      signal: "Scale"
    }
  ] satisfies Capability[],
  projects: [
    {
      title: "Luminous Commerce",
      category: "Ecommerce / Performance",
      description:
        "A premium store concept built around fast browsing, cinematic product reveals, and a focused checkout journey.",
      image: "/projects/luminous-commerce.svg",
      url: "#contact",
      placeholder: true,
      metrics: [
        { value: "3.1s", label: "target LCP" },
        { value: "18%", label: "cart lift goal" }
      ]
    },
    {
      title: "Atlas Operations",
      category: "SaaS / Dashboard",
      description:
        "A dense business dashboard system for teams that need analytics, role-based actions, and clean daily workflows.",
      image: "/projects/atlas-operations.svg",
      url: "#contact",
      placeholder: true,
      metrics: [
        { value: "7", label: "core flows" },
        { value: "24/7", label: "ops-ready UI" }
      ]
    },
    {
      title: "Pulse Launch",
      category: "Landing Page / Leads",
      description:
        "A conversion-focused launch page with sharp storytelling, scroll motion, social proof, and WhatsApp lead capture.",
      image: "/projects/pulse-launch.svg",
      url: "#contact",
      placeholder: true,
      metrics: [
        { value: "42%", label: "lead intent goal" },
        { value: "95+", label: "SEO target" }
      ]
    }
  ] satisfies Project[],
  process: [
    {
      title: "Discover",
      description:
        "Clarify the offer, audience, pages, features, references, and conversion path before design starts."
    },
    {
      title: "Design",
      description:
        "Create the visual system, interaction direction, content blocks, and responsive layouts."
    },
    {
      title: "Develop",
      description:
        "Build the frontend, backend pieces, integrations, animation system, and content structure."
    },
    {
      title: "Deploy",
      description:
        "Ship on production hosting with SEO metadata, analytics, performance passes, and launch support."
    }
  ] satisfies ProcessStep[],
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "Three.js",
    "GSAP",
    "Vercel",
    "SEO",
    "APIs",
    "UI Systems"
  ],
  stackHighlights: [
    {
      label: "Frontend",
      title: "Cinematic React interfaces",
      description:
        "Next.js, React, TypeScript, component systems, responsive layouts, accessibility, and animation timing."
    },
    {
      label: "Backend",
      title: "Product logic that holds up",
      description:
        "APIs, authentication, dashboards, databases, payments, file flows, admin tools, and integrations."
    },
    {
      label: "Launch",
      title: "Production polish",
      description:
        "Vercel deployment, SEO metadata, analytics setup, Core Web Vitals, QA passes, and maintenance support."
    }
  ] satisfies StackHighlight[],
  seo: {
    title: "Gauransh - Full-Stack Developer For Premium Web Services",
    description:
      "Cinematic portfolio for Gauransh, a full-stack developer building websites, web apps, ecommerce, dashboards, SEO foundations, and web service systems.",
    keywords: [
      "Gauransh",
      "full-stack developer",
      "web development",
      "web services",
      "Next.js developer",
      "3D portfolio",
      "Three.js portfolio",
      "Awwwards portfolio"
    ],
    siteUrl: "https://gauransh.dev"
  },
  theme: {
    accentCyan: "#52f5ff",
    accentMagenta: "#f53cff",
    accentGreen: "#9fffcb",
    motionIntensity: "high",
    objectIntensity: "balanced",
    footerStyle: "icon-tiles",
    showGlassObjects: true,
    visibleSections: {
      services: true,
      work: true,
      process: true,
      about: true,
      contact: true
    }
  }
} satisfies SiteContent;
