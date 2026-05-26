"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MotionSetup() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      return undefined;
    }

    if (!document.querySelector(".hero")) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(progressBar);

    const revealItems = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    const floatCards = gsap.utils.toArray<HTMLElement>("[data-float-card]");
    const projectCards = gsap.utils.toArray<HTMLElement>("[data-project-card]");
    const parallaxItems = gsap.utils.toArray<HTMLElement>("[data-parallax]");
    const capabilityRows = gsap.utils.toArray<HTMLElement>("[data-capability-row]");
    const stackPanels = gsap.utils.toArray<HTMLElement>("[data-stack-panel]");
    const scrollObjects = gsap.utils.toArray<HTMLElement>("[data-scroll-object]");
    const postHero = document.querySelector<HTMLElement>("[data-scroll-backdrop-root]");
    const sections = gsap.utils.toArray<HTMLElement>(
      ".intro-section, .work-section, .process-section, .about-section, .contact-section, .footer-scene"
    );
    const mm = gsap.matchMedia();

    gsap.to(progressBar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.25
      }
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })
      .to(".hero__content", { yPercent: -18, autoAlpha: 0.2, ease: "none" }, 0)
      .to(".hero-canvas", { scale: 1.12, autoAlpha: 0.55, ease: "none" }, 0)
      .to(".scroll-cue", { y: 80, autoAlpha: 0, ease: "none" }, 0);

    if (postHero) {
      gsap.fromTo(
        postHero,
        {
          "--backdrop-shift": "-120px",
          "--object-shift": "80px",
          "--backdrop-veil-opacity": "0.28"
        },
        {
          "--backdrop-shift": "160px",
          "--object-shift": "-180px",
          "--backdrop-veil-opacity": "0.48",
          ease: "none",
          scrollTrigger: {
            trigger: postHero,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7
          }
        }
      );
    }

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { "--section-glow": "0" },
        {
          "--section-glow": "1",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            end: "bottom 28%",
            scrub: true
          }
        }
      );
    });

    revealItems.forEach((item) => {
      gsap.fromTo(
        item,
        { autoAlpha: 0, y: 70, filter: "blur(18px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.25,
          ease: "expo.out",
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    floatCards.forEach((card) => {
      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 110, rotateX: 16, scale: 0.9 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.35,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    projectCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { scale: 0.9, autoAlpha: 0.28, y: 120, rotateZ: index % 2 === 0 ? -1.5 : 1.5 },
        {
          scale: 1 - index * 0.025,
          autoAlpha: 1,
          y: 0,
          rotateZ: 0,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            end: "top 24%",
            scrub: 0.7
          }
        }
      );
    });

    capabilityRows.forEach((row, index) => {
      gsap.fromTo(
        row,
        {
          autoAlpha: 0.2,
          xPercent: index % 2 === 0 ? -8 : 8,
          scale: 0.92,
          filter: "blur(14px)"
        },
        {
          autoAlpha: 1,
          xPercent: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            end: "top 42%",
            scrub: 0.75
          }
        }
      );
    });

    stackPanels.forEach((panel, index) => {
      gsap.fromTo(
        panel,
        { autoAlpha: 0.18, y: 90, rotateX: 12, scale: 0.88 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 88%",
            end: "top 52%",
            scrub: 0.8
          },
          delay: index * 0.04
        }
      );
    });

    parallaxItems.forEach((item) => {
      const target = item.querySelector<HTMLElement>("img") ?? item;

      gsap.fromTo(
        target,
        { yPercent: 6, scale: 1.06 },
        {
          yPercent: -6,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    });

    gsap.fromTo(
      ".process-timeline",
      { "--timeline-progress": "0%" },
      {
        "--timeline-progress": "100%",
        ease: "none",
        scrollTrigger: {
          trigger: ".process-timeline",
          start: "top 78%",
          end: "bottom 45%",
          scrub: true
        }
      }
    );

    mm.add("(min-width: 961px)", () => {
      if (postHero) {
        scrollObjects.forEach((object, index) => {
          const direction = index % 2 === 0 ? 1 : -1;
          const band = (index % 4) - 1.5;

          gsap.fromTo(
            object,
            {
              xPercent: -50 + direction * 7,
              yPercent: -50 + band * 8,
              rotateX: 46 + index * 1.8,
              rotateY: direction * -28,
              rotateZ: direction * (8 + index * 2),
              scale: 0.86 + (index % 3) * 0.06
            },
            {
              xPercent: -50 - direction * 22,
              yPercent: -94 + band * 16,
              rotateX: 74 - index,
              rotateY: direction * 38,
              rotateZ: direction * (-24 - index * 2),
              scale: 1.04 + (index % 4) * 0.035,
              ease: "none",
              scrollTrigger: {
                trigger: postHero,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1
              }
            }
          );
        });
      }

      gsap.to(".service-card:nth-child(odd)", {
        yPercent: -16,
        ease: "none",
        scrollTrigger: {
          trigger: ".service-grid",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".service-card:nth-child(even)", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: ".service-grid",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.fromTo(
        ".work-depth",
        { yPercent: 34, autoAlpha: 0.2, scale: 0.94 },
        {
          yPercent: 0,
          autoAlpha: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".work-depth",
            start: "top 92%",
            end: "top 48%",
            scrub: 0.8
          }
        }
      );

      gsap.to(".profile-panel", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    mm.add("(max-width: 960px)", () => {
      if (postHero) {
        scrollObjects.slice(0, 8).forEach((object, index) => {
          const direction = index % 2 === 0 ? 1 : -1;

          gsap.fromTo(
            object,
            {
              xPercent: -50,
              yPercent: -50,
              rotateX: 42,
              rotateY: direction * -18,
              rotateZ: direction * 8,
              scale: 0.88
            },
            {
              xPercent: -50 - direction * 10,
              yPercent: -78,
              rotateX: 58,
              rotateY: direction * 22,
              rotateZ: direction * -16,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: postHero,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2
              }
            }
          );
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      mm.revert();
      progressBar.remove();
    };
  }, []);

  return null;
}
