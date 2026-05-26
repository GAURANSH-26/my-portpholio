import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  AtSign,
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  Code2,
  DatabaseZap,
  Gauge,
  Github,
  Globe2,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  MessageCircle,
  PanelsTopLeft,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  Workflow
} from "lucide-react";
import { Header } from "@/components/Header";
import { HeroSceneLazy } from "@/components/HeroSceneLazy";
import { ScrollBackdrop } from "@/components/ScrollBackdrop";
import type { SiteContent } from "@/data/site";

const serviceIcons = [Globe2, Layers3, DatabaseZap, Gauge, ShieldCheck, Boxes];
const processIcons = [Sparkles, Workflow, Code2, Rocket];
const footerLinks = [
  { label: "Services", href: "#services", key: "services", Icon: PanelsTopLeft },
  { label: "Work", href: "#work", key: "work", Icon: BriefcaseBusiness },
  { label: "Process", href: "#process", key: "process", Icon: Workflow },
  { label: "About", href: "#about", key: "about", Icon: UserRound },
  { label: "Contact", href: "#contact", key: "contact", Icon: Send }
] as const;
const socialIcons = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Instagram
};

export function PortfolioPage({
  content,
  fallbackWarning
}: {
  content: SiteContent;
  fallbackWarning?: string;
}) {
  const { profile, contact, cta, services, capabilities, projects, process, skills, stackHighlights } =
    content;
  const visible = content.theme.visibleSections;
  const themeStyle = {
    "--cyan": content.theme.accentCyan,
    "--magenta": content.theme.accentMagenta,
    "--green": content.theme.accentGreen
  } as CSSProperties;

  return (
    <main style={themeStyle}>
      {fallbackWarning ? (
        <div className="backend-fallback-warning" role="status">
          {fallbackWarning}
        </div>
      ) : null}
      <Header profile={profile} contact={contact} />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <HeroSceneLazy profile={profile} />
        <div className="hero__grain" aria-hidden="true" />
        <div className="hero__content page-shell">
          <p className="eyebrow" data-reveal>
            {profile.availability} / {profile.location}
          </p>
          <h1 id="hero-title" data-reveal>
            {profile.name}
            <span>{profile.role}</span>
          </h1>
          <p className="hero__copy" data-reveal>
            {profile.tagline}
          </p>
          <div className="hero__actions" data-reveal>
            <a className="button button--primary" href={contact.whatsappUrl}>
              <MessageCircle aria-hidden="true" />
              {cta.primaryLabel}
            </a>
            <a className="button button--ghost" href={cta.secondaryHref}>
              {cta.secondaryLabel}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <a className="scroll-cue" href="#services" aria-label="Scroll to services">
          <span />
        </a>
      </section>

      <div className="post-hero" data-scroll-backdrop-root>
        {content.theme.showGlassObjects ? <ScrollBackdrop /> : null}

        {visible.services ? (
          <section className="intro-section page-shell" id="services" aria-labelledby="services-title">
            <div className="services-chapter">
              <div className="services-chapter__sticky">
                <div className="section-kicker" data-reveal>
                  <span>01</span>
                  Services engineered for launch
                </div>
                <div className="section-heading section-heading--stacked">
                  <h2 id="services-title" data-reveal>
                    Full-stack websites that feel premium, load fast, and turn visitors into leads.
                  </h2>
                  <p data-reveal>
                    From animated landing pages to business dashboards, every build is planned around
                    conversion, maintainability, deployment, and long-term growth.
                  </p>
                </div>
              </div>
              <div className="capability-runway" aria-label="Capability runway">
                {capabilities.map((capability) => (
                  <article className="capability-row" key={capability.title} data-capability-row>
                    <span>{capability.label}</span>
                    <h3>{capability.title}</h3>
                    <p>{capability.description}</p>
                    <strong>{capability.signal}</strong>
                  </article>
                ))}
              </div>
            </div>
            <div className="service-grid">
              {services.map((service, index) => {
                const Icon = serviceIcons[index % serviceIcons.length];

                return (
                  <article className="service-card" key={service.title} data-float-card>
                    <div className="service-card__icon">
                      <Icon aria-hidden="true" />
                    </div>
                    <span>{service.code}</span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <div className="chip-row" aria-label={`${service.title} technologies`}>
                      {service.tech.map((item) => (
                        <span className="chip" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                    <strong>{service.deliverable}</strong>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {visible.work ? (
          <section className="work-section" id="work" aria-labelledby="work-title">
            <div className="page-shell">
              <div className="section-kicker" data-reveal>
                <span>02</span>
                Case-study system
              </div>
              <div className="section-heading section-heading--wide">
                <h2 id="work-title" data-reveal>
                  Placeholder case studies designed to become real proof before Awwwards submission.
                </h2>
                <p data-reveal>
                  Replace these with your strongest projects, screenshots, outcomes, and links before
                  publishing publicly. The motion and layout are ready for real content.
                </p>
              </div>
              <div className="work-depth" data-reveal>
                <span>Scroll depth system</span>
                <strong>Sticky case frames / parallax media / proof-first rhythm</strong>
                <p>
                  The work section now behaves like a dark showcase tunnel: each project holds,
                  scales, and lets the next frame rise underneath it.
                </p>
              </div>
              <div className="project-stack">
                {projects.map((project, index) => (
                  <article className="project-card" key={project.title} data-project-card>
                    <div className="project-card__media" data-parallax>
                      <img src={project.image} alt="" loading="lazy" />
                      {project.placeholder ? <span>Replace before Awwwards</span> : null}
                    </div>
                    <div className="project-card__body">
                      <p>{project.category}</p>
                      <h3>
                        <span>0{index + 1}</span>
                        {project.title}
                      </h3>
                      <p>{project.description}</p>
                      <dl>
                        {project.metrics.map((metric) => (
                          <div key={metric.label}>
                            <dt>{metric.value}</dt>
                            <dd>{metric.label}</dd>
                          </div>
                        ))}
                      </dl>
                      <a href={project.url} aria-label={`Open ${project.title}`}>
                        Open project
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {visible.process ? (
          <section className="process-section page-shell" id="process" aria-labelledby="process-title">
            <div className="section-kicker" data-reveal>
              <span>03</span>
              Build rhythm
            </div>
            <div className="section-heading">
              <h2 id="process-title" data-reveal>
                A clear path from rough idea to shipped product.
              </h2>
              <p data-reveal>
                The process is built for clients who want a premium web presence without guessing what
                should happen next.
              </p>
            </div>
            <div className="process-timeline">
              {process.map((step, index) => {
                const Icon = processIcons[index % processIcons.length];

                return (
                  <article key={step.title} data-reveal>
                    <span>0{index + 1}</span>
                    <Icon aria-hidden="true" />
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {visible.about ? (
          <section className="about-section" id="about" aria-labelledby="about-title">
            <div className="page-shell about-grid">
              <div>
                <div className="section-kicker" data-reveal>
                  <span>04</span>
                  Profile
                </div>
                <h2 id="about-title" data-reveal>
                  I build the stack, the interface, and the launch system around the business goal.
                </h2>
                <p data-reveal>{profile.bio}</p>
                <div className="skill-marquee" aria-label="Technology stack">
                  <div>
                    {[...skills, ...skills].map((skill, index) => (
                      <span key={`${skill}-${index}`}>{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="stack-lab" aria-label="Stack highlights">
                  {stackHighlights.map((item) => (
                    <article key={item.title} data-stack-panel>
                      <span>{item.label}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </article>
                  ))}
                </div>
              </div>
              <aside className="profile-panel" data-float-card>
                <img src={profile.photo} alt={`${profile.name} stylized profile placeholder`} />
                <div>
                  <span className="status-pill">
                    <BadgeCheck aria-hidden="true" />
                    {profile.availability}
                  </span>
                  <p>
                    Awwwards prep status: replace the generated portrait, WhatsApp number, email, and
                    case-study placeholders before submitting.
                  </p>
                </div>
              </aside>
            </div>
          </section>
        ) : null}

        {visible.contact ? (
          <section className="contact-section page-shell" id="contact" aria-labelledby="contact-title">
            <div className="contact-panel">
              <p className="eyebrow" data-reveal>
                {cta.contactEyebrow}
              </p>
              <h2 id="contact-title" data-reveal>
                {cta.contactHeading}
              </h2>
              <div className="hero__actions" data-reveal>
                <a className="button button--primary" href={contact.whatsappUrl}>
                  <MessageCircle aria-hidden="true" />
                  {cta.contactWhatsappLabel}
                </a>
                <a className="button button--ghost" href={`mailto:${contact.email}`}>
                  {contact.email}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
        ) : null}

        <footer className="footer-scene" aria-labelledby="footer-title">
          <div className="footer-shell page-shell">
            <div className="footer-cta">
              <p className="eyebrow">{cta.footerEyebrow}</p>
              <h2 id="footer-title">{cta.footerHeading}</h2>
              <div className="footer-contact-grid">
                <a className="footer-contact-card footer-contact-card--primary" href={contact.whatsappUrl}>
                  <span className="footer-icon">
                    <MessageCircle aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{cta.footerPrimaryTitle}</strong>
                    <em>{cta.footerPrimarySubtitle}</em>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
                <a className="footer-contact-card" href={`mailto:${contact.email}`}>
                  <span className="footer-icon">
                    <Mail aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{cta.footerEmailTitle}</strong>
                    <em>{contact.email}</em>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="footer-directory">
              <a className="footer-brand" href="#top" aria-label="Back to top">
                <span>{profile.name.charAt(0) || "G"}</span>
                <div>
                  <strong>{profile.name}</strong>
                  <p>{profile.availability}</p>
                </div>
              </a>
              <nav className="footer-links" aria-label="Section links">
                {footerLinks
                  .filter((link) => visible[link.key])
                  .map(({ href, Icon, label }) => (
                    <a key={href} href={href}>
                      <span className="footer-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <span>{label}</span>
                    </a>
                  ))}
              </nav>
              <nav className="footer-socials" aria-label="Social links">
                {contact.socials.map((social) => {
                  const SocialIcon = socialIcons[social.label as keyof typeof socialIcons] ?? AtSign;

                  return (
                    <a key={social.label} href={social.url} rel="noreferrer" target="_blank">
                      <span className="footer-icon">
                        <SocialIcon aria-hidden="true" />
                      </span>
                      <span>{social.label}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
