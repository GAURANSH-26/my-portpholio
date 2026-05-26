"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import * as THREE from "three";
import type { Profile } from "@/data/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin((pos.y * 4.8) + uTime * 1.35) * 0.055;
    float pulse = sin((pos.x * 7.2) - uTime * 1.8) * 0.035;
    float pointerPush = distance(uv, uPointer) * 0.08;
    pos.z += wave + pulse - pointerPush;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uPointer;

  float random(vec2 value) {
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    float distanceToPointer = distance(uv, uPointer);
    float distortion = sin((uv.y * 18.0) + uTime * 2.0) * 0.009;
    distortion += (0.09 - distanceToPointer) * 0.018;

    vec4 base = texture2D(uTexture, uv + vec2(distortion, 0.0));
    vec4 redShift = texture2D(uTexture, uv + vec2(0.012 + distortion, 0.0));
    vec4 blueShift = texture2D(uTexture, uv - vec2(0.014 - distortion, 0.0));

    float luma = dot(base.rgb, vec3(0.299, 0.587, 0.114));
    vec3 deep = vec3(0.018, 0.020, 0.030);
    vec3 electric = vec3(0.090, 0.920, 1.000);
    vec3 plasma = vec3(0.920, 0.110, 0.860);
    vec3 color = mix(deep, electric, smoothstep(0.16, 0.88, luma));
    color = mix(color, plasma, smoothstep(0.55, 1.0, redShift.r) * 0.42);
    color.r += redShift.r * 0.16;
    color.b += blueShift.b * 0.22;

    float scanline = sin(uv.y * 920.0 + uTime * 4.0) * 0.035;
    float grain = random(uv + uTime * 0.01) * 0.055;
    float vignette = smoothstep(1.05, 0.32, distance(uv, vec2(0.5)));
    float edge = smoothstep(0.0, 0.08, uv.x) * smoothstep(1.0, 0.92, uv.x) * smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.92, uv.y);

    gl_FragColor = vec4((color + scanline + grain) * vignette, edge);
  }
`;

function useInView() {
  const [active, setActive] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { active, ref };
}

function seededValue(index: number) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function EnergyParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 900;
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const radius = 2.1 + seededValue(index) * 4.2;
      const angle = seededValue(index + 900) * Math.PI * 2;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = (seededValue(index + 1800) - 0.5) * 5.5;
      values[index * 3 + 2] = Math.sin(angle) * radius - 1.2;
    }

    return values;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.035;
      pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#42f5ff" size={0.024} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function PortraitMesh({
  texturePath,
  onTextureError,
  onTextureReady
}: {
  texturePath: string;
  onTextureError: () => void;
  onTextureReady: () => void;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const placeholderTexture = useMemo(() => new THREE.Texture(), []);

  useEffect(() => {
    let mounted = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    loader.load(
      texturePath,
      (loadedTexture) => {
        if (!mounted) {
          loadedTexture.dispose();
          return;
        }

        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
        onTextureReady();
      },
      undefined,
      () => {
        if (mounted) {
          setTexture(null);
          onTextureError();
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, [onTextureError, onTextureReady, texturePath]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture ?? placeholderTexture },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) }
    }),
    [placeholderTexture, texture]
  );

  useFrame(({ clock, pointer }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.3) * 0.08;
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.65) * 0.025;
    }

    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    materialRef.current.uniforms.uPointer.value.lerp(
      new THREE.Vector2(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5),
      0.08
    );
  });

  if (!texture) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <mesh position={[1.05, -0.05, 0]} rotation={[0, -0.18, 0]}>
        <planeGeometry args={[2.65, 3.55, 96, 128]} />
        <shaderMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </group>
  );
}

function GlassRings() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.elapsedTime * 0.15;
      group.current.rotation.z = Math.sin(clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <group ref={group} position={[1.05, -0.08, -0.15]}>
      {[0, 1, 2].map((item) => (
        <mesh key={item} rotation={[Math.PI / 2.25, 0, item * 0.72]} scale={1 + item * 0.17}>
          <torusGeometry args={[1.52, 0.012, 16, 180]} />
          <meshBasicMaterial color={item === 1 ? "#f233ff" : "#5cf5ff"} transparent opacity={0.44} />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent({
  onTextureError,
  onTextureReady,
  profile
}: {
  onTextureError: () => void;
  onTextureReady: () => void;
  profile: Profile;
}) {
  return (
    <>
      <color attach="background" args={["#050507"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2.8, 4.8, 3.4]} intensity={2.4} color="#b7fbff" />
      <pointLight position={[-3.2, -1.5, 2.5]} intensity={9} color="#ff36d7" />
      <pointLight position={[3.5, 2, -2]} intensity={4.5} color="#36f6ff" />
      <EnergyParticles />
      <GlassRings />
      <PortraitMesh
        texturePath={profile.photo}
        onTextureError={onTextureError}
        onTextureReady={onTextureReady}
      />
    </>
  );
}

export function HeroScene({ profile }: { profile: Profile }) {
  const reducedMotion = useReducedMotion();
  const { active, ref } = useInView();
  const [textureReady, setTextureReady] = useState(false);

  const handleTextureReady = useCallback(() => setTextureReady(true), []);
  const handleTextureError = useCallback(() => setTextureReady(false), []);
  const handleFallbackError = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      if (event.currentTarget.dataset.fallbackApplied === "true") {
        return;
      }

      event.currentTarget.dataset.fallbackApplied = "true";
      event.currentTarget.src = profile.fallbackPhoto;
    },
    [profile.fallbackPhoto]
  );

  if (reducedMotion) {
    return (
      <div className="hero-canvas hero-canvas--static" aria-hidden="true">
        <img src={profile.photo} alt="" onError={handleFallbackError} />
      </div>
    );
  }

  return (
    <div
      className={textureReady ? "hero-canvas hero-canvas--texture-ready" : "hero-canvas"}
      ref={ref}
      aria-hidden="true"
    >
      <img
        className="hero-canvas__fallback-image"
        src={profile.photo}
        alt=""
        onError={handleFallbackError}
      />
      <Canvas
        camera={{ position: [0, 0, 5.7], fov: 38 }}
        dpr={[1, 1.65]}
        frameloop={active ? "always" : "demand"}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <SceneContent
            onTextureError={handleTextureError}
            onTextureReady={handleTextureReady}
            profile={profile}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
