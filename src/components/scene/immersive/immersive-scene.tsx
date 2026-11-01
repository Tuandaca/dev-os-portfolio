"use client";

import { RoundedBox } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { skillClusters, type SkillClusterId } from "@/content/skill-universe";

export type UniverseView = "overview" | "skills" | "systems" | "contact";

export interface ImmersiveSceneProps {
  view: UniverseView;
  activeSkillId: SkillClusterId | null;
  onSelectView: (view: UniverseView) => void;
  onSelectSkill: (id: SkillClusterId) => void;
  onReady: () => void;
  onError: (error?: unknown) => void;
}

const CAMERA_STOPS: Record<UniverseView, { position: readonly [number, number, number]; target: readonly [number, number, number] }> = {
  overview: { position: [0.45, 3.75, 10.6], target: [0, 1.5, -1.4] },
  skills: { position: [-5.6, 2.75, 4.35], target: [-3.8, 1.6, -2.45] },
  systems: { position: [5.65, 2.75, 4.35], target: [3.8, 1.6, -2.45] },
  contact: { position: [4.1, 2.4, 3.85], target: [2.45, 0.95, 1.25] },
};

const ink = "#080d12";
const graphite = "#1a292d";
const raised = "#263b3d";
const trim = "#5d947c";
const signal = "#6ee7a0";
const mutedSignal = "#2c7656";

function makeScreenTexture(title: string, lines: readonly string[], width = 1024, height = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context unavailable");

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#17312d");
  gradient.addColorStop(1, "#0b1918");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "rgba(110, 231, 160, 0.13)";
  context.lineWidth = 1;
  for (let y = 46; y < height; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  context.fillStyle = "#a0f4c0";
  context.font = `600 ${Math.round(height * 0.11)}px Consolas, monospace`;
  context.fillText(title, Math.round(width * 0.07), Math.round(height * 0.23), Math.round(width * 0.87));
  context.fillStyle = "#d1ebe0";
  context.font = `${Math.round(height * 0.065)}px Consolas, monospace`;
  lines.forEach((line, index) => context.fillText(line, Math.round(width * 0.07), Math.round(height * (0.43 + index * 0.14)), Math.round(width * 0.87)));
  context.fillStyle = "#347757";
  context.fillRect(Math.round(width * 0.07), Math.round(height * 0.83), Math.round(width * 0.34), 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function useTextureCleanup(textures: readonly THREE.Texture[]) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    return () => {
      // A deferred cleanup survives React's development-only effect replay.
      timer.current = setTimeout(() => textures.forEach((texture) => texture.dispose()), 0);
    };
  }, [textures]);
}

function CameraRig({ view, onError, onSettled }: Pick<ImmersiveSceneProps, "view" | "onError"> & { onSettled: (view: UniverseView) => void }) {
  const { camera, invalidate } = useThree();
  const target = useRef(new THREE.Vector3(...CAMERA_STOPS.overview.target));
  const errorCallback = useRef(onError);
  errorCallback.current = onError;
  const settledCallback = useRef(onSettled);
  settledCallback.current = onSettled;

  useEffect(() => {
    const stop = CAMERA_STOPS[view];
    const startPosition = camera.position.clone();
    const endPosition = new THREE.Vector3(...stop.position);
    const startTarget = target.current.clone();
    const endTarget = new THREE.Vector3(...stop.target);
    let startedAt: number | null = null;
    let hiddenAt: number | null = null;
    let frame = 0;
    let finished = false;

    const animate = (now: number) => {
      try {
        if (startedAt === null) startedAt = now;
        const progress = Math.min((now - startedAt) / 820, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        camera.position.lerpVectors(startPosition, endPosition, eased);
        target.current.lerpVectors(startTarget, endTarget, eased);
        camera.lookAt(target.current);
        invalidate();
        if (progress < 1) frame = requestAnimationFrame(animate);
        else {
          finished = true;
          settledCallback.current(view);
        }
      } catch (error) {
        finished = true;
        errorCallback.current(error);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        hiddenAt = performance.now();
        cancelAnimationFrame(frame);
      } else if (hiddenAt !== null && !finished) {
        if (startedAt !== null) startedAt += performance.now() - hiddenAt;
        hiddenAt = null;
        frame = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (document.hidden) hiddenAt = performance.now();
    else frame = requestAnimationFrame(animate);
    return () => {
      finished = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [camera, invalidate, view]);

  return null;
}

function Workstation({ onSelect }: { onSelect: () => void }) {
  const screen = useMemo(() => makeScreenTexture("DEV.OS / WORKSTATION", ["ENGINEER · DESIGN · REVIEW", "Explore the systems station", "Conceptual interface / no live data"]), []);
  useTextureCleanup(useMemo(() => [screen], [screen]));
  const keys = useRef<THREE.InstancedMesh>(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!keys.current) return;
    const transform = new THREE.Object3D();
    for (let index = 0; index < 48; index += 1) {
      transform.position.set(-1.02 + (index % 12) * 0.185, 0.695, 0.88 + Math.floor(index / 12) * 0.18);
      transform.updateMatrix();
      keys.current.setMatrixAt(index, transform.matrix);
    }
    keys.current.instanceMatrix.needsUpdate = true;
    invalidate();
  }, [invalidate]);

  return (
    <group>
      <RoundedBox args={[6.1, 0.18, 3.2]} radius={0.08} smoothness={2} position={[0, 0.58, 0.12]}>
        <meshStandardMaterial color={graphite} metalness={0.58} roughness={0.39} />
      </RoundedBox>
      {[-2.65, 2.65].map((x) => (
        <mesh key={x} position={[x, 0.25, 0.12]}>
          <boxGeometry args={[0.14, 0.54, 2.8]} />
          <meshStandardMaterial color="#0a1115" metalness={0.62} roughness={0.43} />
        </mesh>
      ))}
      <mesh position={[0, 1.13, -1.25]}>
        <cylinderGeometry args={[0.055, 0.08, 0.84, 12]} />
        <meshStandardMaterial color="#28383a" metalness={0.78} roughness={0.31} />
      </mesh>
      <RoundedBox args={[0.9, 0.07, 0.48]} radius={0.025} smoothness={2} position={[0, 0.72, -1.23]}>
        <meshStandardMaterial color="#19272a" metalness={0.68} roughness={0.32} />
      </RoundedBox>
      <group position={[0, 2.02, -1.34]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <RoundedBox args={[4.03, 2.34, 0.12]} radius={0.065} smoothness={2}>
          <meshStandardMaterial color="#081113" metalness={0.63} roughness={0.36} />
        </RoundedBox>
        <mesh position={[0, 0, 0.067]}>
          <planeGeometry args={[3.8, 2.1]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
        <mesh position={[0, -1.23, 0.075]}>
          <boxGeometry args={[0.35, 0.018, 0.018]} />
          <meshBasicMaterial color={signal} toneMapped={false} />
        </mesh>
      </group>
      <RoundedBox args={[2.55, 0.1, 0.86]} radius={0.04} smoothness={2} position={[0, 0.68, 1.16]}>
        <meshStandardMaterial color="#111b20" metalness={0.52} roughness={0.52} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[undefined, undefined, 48]}>
        <boxGeometry args={[0.16, 0.03, 0.15]} />
        <meshStandardMaterial color="#273c3a" metalness={0.25} roughness={0.64} />
      </instancedMesh>
      <mesh position={[1.86, 0.68, 1.13]}>
        <sphereGeometry args={[0.16, 14, 10]} />
        <meshStandardMaterial color="#1e2929" metalness={0.32} roughness={0.43} />
      </mesh>
    </group>
  );
}

function SkillRack({ activeSkillId, onSelectSkill }: Pick<ImmersiveSceneProps, "activeSkillId" | "onSelectSkill">) {
  const cards = useMemo(() => skillClusters.map((cluster) => ({
    id: cluster.id,
    texture: makeScreenTexture(cluster.label.toUpperCase(), cluster.items.slice(0, 2), 512, 256),
  })), []);
  useTextureCleanup(useMemo(() => cards.map((card) => card.texture), [cards]));

  return (
    <group position={[-3.8, 0, -2.52]}>
      <RoundedBox args={[3.92, 3.32, 0.24]} radius={0.09} smoothness={2} position={[0, 1.77, -0.16]}>
        <meshStandardMaterial color="#0d171b" metalness={0.64} roughness={0.43} />
      </RoundedBox>
      <mesh position={[0, 3.37, 0]}>
        <boxGeometry args={[3.4, 0.018, 0.04]} />
        <meshBasicMaterial color={mutedSignal} toneMapped={false} />
      </mesh>
      {cards.map((card, index) => {
        const selected = activeSkillId === card.id;
        const x = index % 2 === 0 ? -0.92 : 0.92;
        const y = 2.62 - Math.floor(index / 2) * 0.96;
        return (
          <group key={card.id} position={[x, y, 0.018]} onClick={(event) => { event.stopPropagation(); onSelectSkill(card.id); }}>
            <RoundedBox args={[1.68, 0.82, 0.08]} radius={0.035} smoothness={2}>
              <meshStandardMaterial color={selected ? "#245943" : raised} emissive={selected ? mutedSignal : ink} emissiveIntensity={selected ? 0.18 : 0} metalness={0.48} roughness={0.4} />
            </RoundedBox>
            <mesh position={[0, 0, 0.047]}>
              <planeGeometry args={[1.54, 0.69]} />
              <meshBasicMaterial map={card.texture} toneMapped={false} />
            </mesh>
            <mesh position={[-0.7, -0.33, 0.055]}>
              <circleGeometry args={[0.025, 12]} />
              <meshBasicMaterial color={selected ? signal : mutedSignal} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 0.06, -0.13]}>
        <boxGeometry args={[3.4, 0.12, 0.78]} />
        <meshStandardMaterial color="#0a1115" metalness={0.5} roughness={0.56} />
      </mesh>
    </group>
  );
}

function SystemFlow({ onSelect }: { onSelect: () => void }) {
  const display = useMemo(() => makeScreenTexture("CONCEPT / REQUEST FLOW", ["API  →  SERVICE  →  DATA", "A simplified engineering model", "Not a live production system"], 1024, 512), []);
  useTextureCleanup(useMemo(() => [display], [display]));

  return (
    <group position={[3.8, 0, -2.52]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
      <RoundedBox args={[3.94, 3.32, 0.24]} radius={0.09} smoothness={2} position={[0, 1.77, -0.16]}>
        <meshStandardMaterial color="#0d171b" metalness={0.64} roughness={0.43} />
      </RoundedBox>
      <mesh position={[0, 2.72, 0.025]}>
        <planeGeometry args={[3.42, 1.01]} />
        <meshBasicMaterial map={display} toneMapped={false} />
      </mesh>
      {[-1.18, 0, 1.18].map((x, index) => (
        <group key={index} position={[x, 1.37, 0.05]}>
          <RoundedBox args={[0.87, 0.72, 0.16]} radius={0.055} smoothness={2}>
            <meshStandardMaterial color={index === 1 ? "#234b3b" : raised} emissive={index === 1 ? mutedSignal : ink} emissiveIntensity={0.08} metalness={0.42} roughness={0.5} />
          </RoundedBox>
          <mesh position={[0, 0, 0.086]}>
            <circleGeometry args={[0.13, 24]} />
            <meshBasicMaterial color={index === 1 ? signal : mutedSignal} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.24, 0.086]}>
            <boxGeometry args={[0.43, 0.025, 0.01]} />
            <meshBasicMaterial color="#a9c5b9" toneMapped={false} />
          </mesh>
        </group>
      ))}
      {[-0.59, 0.59].map((x) => (
        <mesh key={x} position={[x, 1.37, 0.052]}>
          <boxGeometry args={[0.25, 0.025, 0.015]} />
          <meshBasicMaterial color={signal} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 0.61, 0.02]}>
        <boxGeometry args={[3.1, 0.02, 0.02]} />
        <meshBasicMaterial color={trim} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.08, -0.11]}>
        <boxGeometry args={[3.5, 0.12, 0.84]} />
        <meshStandardMaterial color="#0a1115" metalness={0.5} roughness={0.56} />
      </mesh>
    </group>
  );
}

function ContactConsole({ onSelect }: { onSelect: () => void }) {
  const display = useMemo(() => makeScreenTexture("NEXT / CONNECT", ["Resume · GitHub · Contact", "Use the actions beside the scene", "Quick View remains available"], 1024, 512), []);
  useTextureCleanup(useMemo(() => [display], [display]));

  return (
    <group position={[2.45, 0, 1.25]} rotation={[0, -0.31, 0]} scale={0.78} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
      <RoundedBox args={[2.65, 0.11, 1.32]} radius={0.06} smoothness={2} position={[0, 0.48, 0]}>
        <meshStandardMaterial color={graphite} metalness={0.57} roughness={0.42} />
      </RoundedBox>
      <mesh position={[0, 1.02, -0.39]}>
        <boxGeometry args={[0.09, 0.98, 0.12]} />
        <meshStandardMaterial color="#263a39" metalness={0.65} roughness={0.38} />
      </mesh>
      <group position={[0, 1.68, -0.39]} rotation={[-0.13, 0, 0]}>
        <RoundedBox args={[2.49, 1.4, 0.1]} radius={0.05} smoothness={2}>
          <meshStandardMaterial color="#0b1417" metalness={0.62} roughness={0.38} />
        </RoundedBox>
        <mesh position={[0, 0, 0.057]}>
          <planeGeometry args={[2.32, 1.23]} />
          <meshBasicMaterial map={display} toneMapped={false} />
        </mesh>
      </group>
      <mesh position={[0, 0.55, 0.45]}>
        <boxGeometry args={[1.95, 0.025, 0.055]} />
        <meshBasicMaterial color={mutedSignal} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Environment({ activeSkillId, onSelectView, onSelectSkill }: Pick<ImmersiveSceneProps, "activeSkillId" | "onSelectView" | "onSelectSkill">) {
  return (
    <>
      <color attach="background" args={[ink]} />
      <ambientLight intensity={0.95} color="#c3dacf" />
      <directionalLight position={[4.5, 7, 6]} intensity={1.7} color="#e2f0e7" />
      <pointLight position={[-3.8, 2.9, -1.4]} intensity={18} distance={8} color={signal} />
      <pointLight position={[3.8, 2.6, -1.6]} intensity={12} distance={8} color="#7dcfbd" />
      <pointLight position={[0, 3.8, 4.6]} intensity={8} distance={9} color="#b9d8cf" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.055, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#101c1e" metalness={0.16} roughness={0.9} />
      </mesh>
      <gridHelper args={[14, 14, "#29483c", "#192b28"]} position={[0, -0.045, -0.5]} />
      <mesh position={[0, 2.25, -4.4]}>
        <boxGeometry args={[15.5, 4.7, 0.12]} />
        <meshStandardMaterial color="#152326" metalness={0.3} roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.13, -4.28]}>
        <boxGeometry args={[14.2, 0.025, 0.04]} />
        <meshBasicMaterial color={mutedSignal} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]}>
        <circleGeometry args={[5.8, 48]} />
        <meshBasicMaterial color="#07110e" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <Workstation onSelect={() => onSelectView("systems")} />
      <SkillRack activeSkillId={activeSkillId} onSelectSkill={onSelectSkill} />
      <SystemFlow onSelect={() => onSelectView("systems")} />
      <ContactConsole onSelect={() => onSelectView("contact")} />
    </>
  );
}

export function ImmersiveScene({ view, activeSkillId, onSelectView, onSelectSkill, onReady, onError }: ImmersiveSceneProps) {
  const rendererOptions = useMemo(() => ({ antialias: true, alpha: false, powerPreference: "low-power" as const }), []);
  const [ready, setReady] = useState(false);
  const [settledView, setSettledView] = useState<UniverseView | null>(null);

  useEffect(() => setSettledView(null), [view]);

  return (
    <div aria-hidden="true" className="h-full w-full" data-scene-ready={ready} data-camera-view={settledView ?? "moving"}>
      <Canvas
        tabIndex={-1}
        camera={{ position: [...CAMERA_STOPS.overview.position], fov: 43, near: 0.1, far: 40 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={rendererOptions}
        onCreated={({ gl }) => {
          try {
            if (gl.getContext()) {
              setReady(true);
              onReady();
            }
            else onError(new Error("WebGL context unavailable"));
          } catch (error) {
            onError(error);
          }
        }}
      >
        <CameraRig view={view} onError={onError} onSettled={setSettledView} />
        <Environment activeSkillId={activeSkillId} onSelectView={onSelectView} onSelectSkill={onSelectSkill} />
      </Canvas>
    </div>
  );
}
