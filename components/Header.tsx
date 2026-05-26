"use client";

import {
  BriefcaseBusiness,
  Menu,
  MessageCircle,
  PanelsTopLeft,
  UserRound,
  Workflow,
  X
} from "lucide-react";
import { useState } from "react";
import type { Contact, Profile } from "@/data/site";

const navItems = [
  { label: "Services", href: "#services", Icon: PanelsTopLeft },
  { label: "Work", href: "#work", Icon: BriefcaseBusiness },
  { label: "Process", href: "#process", Icon: Workflow },
  { label: "About", href: "#about", Icon: UserRound }
];

export function Header({ profile, contact }: { profile: Profile; contact: Contact }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label={`${profile.name} home`}>
        <span>G</span>
        <strong>{profile.name}</strong>
      </a>
      <nav className={open ? "site-nav site-nav--open" : "site-nav"} aria-label="Main navigation">
        {navItems.map(({ href, Icon, label }) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <a className="header-cta" href={contact.whatsappUrl}>
        <MessageCircle aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
      <button
        className="menu-button"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </header>
  );
}
