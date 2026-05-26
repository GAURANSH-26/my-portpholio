"use client";

import dynamic from "next/dynamic";
import type { Profile } from "@/data/site";

const DynamicHeroScene = dynamic(
  () => import("@/components/HeroScene").then((module) => module.HeroScene),
  {
    ssr: false,
    loading: () => <div className="hero-canvas hero-canvas--loading" aria-hidden="true" />
  }
);

export function HeroSceneLazy({ profile }: { profile: Profile }) {
  return <DynamicHeroScene key={profile.photo} profile={profile} />;
}
