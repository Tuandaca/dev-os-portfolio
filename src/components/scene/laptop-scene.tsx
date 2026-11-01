"use client";

import { RoundedBox } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type LaptopScenePhase = "idle" | "opening" | "entering";

export interface LaptopSceneProps {
  phase: LaptopScenePhase;
  onReady: () => void;
  onOpenComplete: () => void;
  onEnterComplete: () => void;
  onError: (error?: unknown) => void;
}

const INITIAL_CAMERA = new THREE.Vector3(4.2, 2.75, 5.25);
const INITIAL_TARGET = new THREE.Vector3(0, 0.56, 0);
const OPEN_CAMERA = new THREE.Vector3(3.15, 2.15, 4.05);
const OPEN_TARGET = new THREE.Vector3(0, 0.85, -0.5);
const ENTER_CAMERA = new THREE.Vector3(0.12, 1.25, 1.55);
const ENTER_TARGET = new THREE.Vector3(0, 1.13, -1.05);
const CLOSED_LID_ANGLE = 1.02;
const OPEN_LID_ANGLE = -0.13;

const keyboardPositions = Array.from({ length: 40 }, (_, index) => {
  const row = Math.floor(index / 10);
  const column = index % 10;
  return [-1.41 + column * 0.31, 0.055, -0.68 + row * 0.36] as const;
});

function Keyboard() {
  const keys = useRef<THREE.InstancedMesh>(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!keys.current) return;
    const transform = new THREE.Object3D();
    keyboardPositions.forEach(([x, y, z], index) => {
      transform.position.set(x, y, z);
      transform.updateMatrix();
      keys.current?.setMatrixAt(index, transform.matrix);
    });
    keys.current.instanceMatrix.needsUpdate = true;
    invalidate();
  }, [invalidate]);

  return (
    <instancedMesh ref={keys} args={[undefined, undefined, keyboardPositions.length]}>
      <boxGeometry args={[0.275, 0.022, 0.29]} />
      <meshStandardMaterial color="#171f24" metalness={0.32} roughness={0.64} />
    </instancedMesh>
  );
}

function LaptopBody({
  lid,
  screen,
  bootMarks,
}: {
  lid: React.RefObject<THREE.Group | null>;
  screen: React.RefObject<THREE.MeshStandardMaterial | null>;
  bootMarks: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group>
      <RoundedBox args={[3.55, 0.16, 2.3]} radius={0.065} smoothness={3} position={[0, -0.04, 0]}>
        <meshStandardMaterial color="#10171b" metalness={0.67} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.046, 0.02]}>
        <boxGeometry args={[3.28, 0.011, 1.84]} />
        <meshStandardMaterial color="#202b2c" metalness={0.36} roughness={0.62} />
      </mesh>
      <Keyboard />
      <RoundedBox args={[1.01, 0.008, 0.47]} radius={0.025} smoothness={2} position={[0, 0.056, 0.79]}>
        <meshStandardMaterial color="#252d2f" metalness={0.5} roughness={0.55} />
      </RoundedBox>
      <mesh position={[0, 0.045, 1.148]}>
        <boxGeometry args={[3.14, 0.006, 0.016]} />
        <meshBasicMaterial color="#386c57" />
      </mesh>
      <mesh position={[0, 0.035, -1.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 3.17, 12]} />
        <meshStandardMaterial color="#0a1114" metalness={0.78} roughness={0.3} />
      </mesh>

      <group ref={lid} position={[0, 0.045, -1.065]} rotation={[CLOSED_LID_ANGLE, 0, 0]}>
        <RoundedBox args={[3.47, 2.24, 0.1]} radius={0.065} smoothness={3} position={[0, 1.13, 0]}>
          <meshStandardMaterial color="#0c1115" metalness={0.63} roughness={0.32} />
        </RoundedBox>
        <mesh position={[0, 1.13, 0.056]}>
          <boxGeometry args={[3.23, 1.98, 0.014]} />
          <meshStandardMaterial color="#030b0a" metalness={0.08} roughness={0.24} />
        </mesh>
        <mesh position={[0, 1.13, 0.067]}>
          <planeGeometry args={[3.05, 1.8]} />
          <meshStandardMaterial ref={screen} color="#06120f" emissive="#2e8f63" emissiveIntensity={0.005} metalness={0.04} roughness={0.4} />
        </mesh>
        <group ref={bootMarks} position={[-1.21, 1.65, 0.077]} visible={false}>
          <mesh position={[0.11, 0, 0]}>
            <planeGeometry args={[0.22, 0.12]} />
            <meshBasicMaterial color="#6ee7a0" toneMapped={false} />
          </mesh>
          {[0.8, 1.5, 1.12, 1.72, 0.92].map((width, index) => (
            <mesh key={index} position={[width / 2, -0.3 - index * 0.23, 0]}>
              <planeGeometry args={[width, 0.045]} />
              <meshBasicMaterial color={index === 0 ? "#6ee7a0" : "#287f55"} toneMapped={false} />
            </mesh>
          ))}
        </group>
        <mesh position={[0, 2.13, 0.068]}>
          <sphereGeometry args={[0.018, 8, 6]} />
          <meshBasicMaterial color="#283333" />
        </mesh>
      </group>
    </group>
  );
}

function CameraAndHinge({ phase, onOpenComplete, onEnterComplete, onError }: Pick<LaptopSceneProps, "phase" | "onOpenComplete" | "onEnterComplete" | "onError">) {
  const lid = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  const bootMarks = useRef<THREE.Group>(null);
  const target = useRef(INITIAL_TARGET.clone());
  const callbacks = useRef({ onOpenComplete, onEnterComplete, onError });
  callbacks.current = { onOpenComplete, onEnterComplete, onError };
  const { camera, invalidate } = useThree();

  useEffect(() => {
    if (phase !== "idle" || !lid.current || !screen.current) return;
    lid.current.rotation.x = CLOSED_LID_ANGLE;
    screen.current.emissiveIntensity = 0.005;
    if (bootMarks.current) bootMarks.current.visible = false;
    camera.position.copy(INITIAL_CAMERA);
    target.current.copy(INITIAL_TARGET);
    camera.lookAt(target.current);
    invalidate();
  }, [phase, camera, invalidate]);

  useEffect(() => {
    if (phase === "idle" || !lid.current || !screen.current) return;

    const duration = phase === "opening" ? 940 : 700;
    const endCamera = phase === "opening" ? OPEN_CAMERA : ENTER_CAMERA;
    const endTarget = phase === "opening" ? OPEN_TARGET : ENTER_TARGET;
    const startCamera = camera.position.clone();
    const startTarget = target.current.clone();
    const startLid = lid.current.rotation.x;
    const endLid = OPEN_LID_ANGLE;
    const startGlow = screen.current.emissiveIntensity;
    let startedAt: number | null = null;
    let hiddenAt: number | null = null;
    let frame = 0;
    let finished = false;

    const advance = (timestamp: number) => {
      try {
        if (startedAt === null) startedAt = timestamp;
        const progress = Math.min((timestamp - startedAt) / duration, 1);
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        if (lid.current) lid.current.rotation.x = THREE.MathUtils.lerp(startLid, endLid, eased);
        if (screen.current) screen.current.emissiveIntensity = THREE.MathUtils.lerp(startGlow, 0.12, eased);
        if (bootMarks.current) bootMarks.current.visible = phase === "entering" || eased > 0.43;
        camera.position.lerpVectors(startCamera, endCamera, eased);
        target.current.lerpVectors(startTarget, endTarget, eased);
        camera.lookAt(target.current);
        invalidate();
        if (progress < 1) {
          frame = requestAnimationFrame(advance);
        } else if (!finished) {
          finished = true;
          if (phase === "opening") callbacks.current.onOpenComplete();
          else callbacks.current.onEnterComplete();
        }
      } catch (error) {
        callbacks.current.onError(error);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        hiddenAt = performance.now();
        cancelAnimationFrame(frame);
      } else if (hiddenAt !== null && !finished) {
        if (startedAt !== null) startedAt += performance.now() - hiddenAt;
        hiddenAt = null;
        frame = requestAnimationFrame(advance);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (document.hidden) hiddenAt = performance.now();
    else frame = requestAnimationFrame(advance);
    return () => {
      finished = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [phase, camera, invalidate]);

  return <LaptopBody lid={lid} screen={screen} bootMarks={bootMarks} />;
}

export function LaptopScene({ phase, onReady, onOpenComplete, onEnterComplete, onError }: LaptopSceneProps) {
  const rendererOptions = useMemo(() => ({ antialias: true, alpha: true, powerPreference: "low-power" as const }), []);

  return (
    <div aria-hidden="true" className="h-full w-full pointer-events-none">
      <Canvas
        tabIndex={-1}
        camera={{ position: [4.2, 2.75, 5.25], fov: 36, near: 0.1, far: 32 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={rendererOptions}
        onCreated={({ gl }) => {
          try {
            if (gl.getContext()) onReady();
            else onError(new Error("WebGL context unavailable"));
          } catch (error) {
            onError(error);
          }
        }}
      >
        <color attach="background" args={["#080d12"]} />
        <ambientLight intensity={0.72} color="#b6d1c2" />
        <directionalLight position={[2.4, 5.5, 3]} intensity={2.1} color="#d6e5dd" />
        <pointLight position={[-3.2, 1.4, -1.6]} intensity={16} distance={7} color="#6ee7a0" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#0b1115" metalness={0.22} roughness={0.92} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.136, -2.2]}>
          <planeGeometry args={[7.5, 0.012]} />
          <meshBasicMaterial color="#194a38" />
        </mesh>
        <CameraAndHinge phase={phase} onOpenComplete={onOpenComplete} onEnterComplete={onEnterComplete} onError={onError} />
      </Canvas>
    </div>
  );
}
