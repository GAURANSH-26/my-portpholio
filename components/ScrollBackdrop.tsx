"use client";

import type { CSSProperties } from "react";

const glassObjects = [
  { kind: "cube", x: 6, y: 6, size: 86, hue: "cyan", delay: -0.4, depth: 18 },
  { kind: "ring", x: 82, y: 10, size: 118, hue: "magenta", delay: -2.2, depth: 34 },
  { kind: "slab", x: 72, y: 24, size: 150, hue: "green", delay: -4.1, depth: 26 },
  { kind: "panel", x: 10, y: 34, size: 172, hue: "magenta", delay: -1.6, depth: 44 },
  { kind: "bar", x: 88, y: 42, size: 126, hue: "cyan", delay: -3.5, depth: 20 },
  { kind: "cube", x: 18, y: 52, size: 106, hue: "green", delay: -5.1, depth: 38 },
  { kind: "ring", x: 70, y: 58, size: 92, hue: "cyan", delay: -6.4, depth: 30 },
  { kind: "panel", x: 8, y: 68, size: 138, hue: "cyan", delay: -7.2, depth: 24 },
  { kind: "slab", x: 80, y: 72, size: 168, hue: "magenta", delay: -8.3, depth: 48 },
  { kind: "cube", x: 46, y: 80, size: 74, hue: "magenta", delay: -9.1, depth: 22 },
  { kind: "bar", x: 15, y: 88, size: 144, hue: "green", delay: -10.2, depth: 36 },
  { kind: "ring", x: 88, y: 94, size: 110, hue: "green", delay: -11.4, depth: 28 }
] as const;

export function ScrollBackdrop() {
  return (
    <div className="scroll-backdrop" aria-hidden="true">
      <div className="scroll-backdrop__mist scroll-backdrop__mist--one" />
      <div className="scroll-backdrop__mist scroll-backdrop__mist--two" />
      <div className="scroll-backdrop__grid" />
      <div className="scroll-backdrop__objects">
        {glassObjects.map((object, index) => {
          const dimensions = {
            cube: [object.size, object.size],
            ring: [object.size, object.size],
            panel: [object.size * 1.25, object.size * 0.68],
            slab: [object.size * 1.48, object.size * 0.38],
            bar: [object.size * 0.36, object.size * 1.72]
          }[object.kind];
          const spin = index % 2 === 0 ? 1 : -1;

          return (
            <span
              className={`scroll-object scroll-object--${object.kind} scroll-object--${object.hue}`}
              data-scroll-object
              key={`${object.kind}-${index}`}
              style={
                {
                  "--x": `${object.x}%`,
                  "--y": `${object.y}%`,
                  "--w": `${dimensions[0]}px`,
                  "--h": `${dimensions[1]}px`,
                  "--delay": `${object.delay}s`,
                  "--depth": `${object.depth}px`,
                  "--base-rotate": `${spin * 9}deg`,
                  "--float-a": `${spin * 4}deg`,
                  "--float-b": `${spin * -9}deg`,
                  "--float-c": `${spin * 12}deg`
                } as CSSProperties
              }
            >
              <span className="scroll-object__body">
                <i />
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
