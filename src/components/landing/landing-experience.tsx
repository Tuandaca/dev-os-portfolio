"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import styles from "./landing-experience.module.css";

type ScenePhase = "idle" | "opening" | "entering";
type IntroPhase = ScenePhase | "boot";
type SceneStatus = "static" | "loading" | "ready" | "fallback";

const LaptopScene = dynamic(
  () => import("@/components/scene/laptop-scene").then((module) => module.LaptopScene),
  { ssr: false, loading: () => null },
);

const primaryAction = "inline-flex min-h-11 items-center justify-center rounded-md border border-dev-accent bg-dev-accent px-5 py-3 font-mono text-sm font-semibold text-dev-bg hover:bg-dev-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent";
const secondaryAction = "inline-flex min-h-11 items-center justify-center rounded-md border border-dev-border-bright px-5 py-3 font-mono text-sm text-dev-text hover:border-dev-accent hover:text-dev-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent";

class SceneErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!context) return false;
    const gl = context as WebGLRenderingContext;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function rememberWorkspaceArrival() {
  try {
    sessionStorage.setItem("dev-os-intro-arrival", "1");
  } catch {
    // Browser storage can be disabled. Navigation remains available.
  }
}

export function LandingExperience({ copy, quickLinks }: { copy: ReactNode; quickLinks: ReactNode }) {
  const router = useRouter();
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>("static");
  const [phase, setPhase] = useState<IntroPhase>("idle");
  const [announcement, setAnnouncement] = useState("");
  const phaseRef = useRef<IntroPhase>("idle");
  const bootTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchdogTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigationStarted = useRef(false);
  const bootScheduled = useRef(false);
  const sceneFailed = useRef(false);

  const clearTransitionTimers = useCallback(() => {
    if (bootTimer.current) clearTimeout(bootTimer.current);
    if (watchdogTimer.current) clearTimeout(watchdogTimer.current);
    bootTimer.current = null;
    watchdogTimer.current = null;
  }, []);

  const enterWorkspace = useCallback(() => {
    if (navigationStarted.current) return;
    navigationStarted.current = true;
    clearTransitionTimers();
    rememberWorkspaceArrival();
    router.push("/workspace");
  }, [clearTransitionTimers, router]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrowViewport = window.matchMedia("(max-width: 767px)");

    const evaluate = () => {
      if (sceneFailed.current || reducedMotion.matches || narrowViewport.matches) {
        setSceneStatus("fallback");
      } else if (!supportsWebGL()) {
        sceneFailed.current = true;
        setSceneStatus("fallback");
      } else {
        setSceneStatus((current) => current === "ready" ? current : "loading");
      }
    };

    evaluate();
    reducedMotion.addEventListener("change", evaluate);
    narrowViewport.addEventListener("change", evaluate);
    return () => {
      reducedMotion.removeEventListener("change", evaluate);
      narrowViewport.removeEventListener("change", evaluate);
    };
  }, []);

  useEffect(() => {
    if (sceneStatus !== "loading") return;
    const timer = setTimeout(() => {
      sceneFailed.current = true;
      setSceneStatus("fallback");
    }, 8000);
    return () => clearTimeout(timer);
  }, [sceneStatus]);

  useEffect(() => {
    if (phase !== "idle" && sceneStatus === "fallback") enterWorkspace();
  }, [enterWorkspace, phase, sceneStatus]);

  useEffect(() => clearTransitionTimers, [clearTransitionTimers]);

  const handleEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (sceneStatus !== "ready" || phase !== "idle") {
      rememberWorkspaceArrival();
      return;
    }
    event.preventDefault();
    phaseRef.current = "opening";
    setPhase("opening");
    setAnnouncement("Opening DEV.OS. Skip intro is available.");
    watchdogTimer.current = setTimeout(enterWorkspace, 3600);
  };

  const handleSkip = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    navigationStarted.current = true;
    clearTransitionTimers();
    rememberWorkspaceArrival();
  };

  const handleOpenComplete = useCallback(() => {
    if (phaseRef.current !== "opening" || bootScheduled.current || navigationStarted.current) return;
    bootScheduled.current = true;
    phaseRef.current = "boot";
    setPhase("boot");
    bootTimer.current = setTimeout(() => {
      phaseRef.current = "entering";
      setPhase("entering");
    }, 550);
  }, []);

  const handleSceneReady = useCallback(() => {
    setSceneStatus((current) => current === "loading" ? "ready" : current);
  }, []);

  const handleSceneError = useCallback(() => {
    sceneFailed.current = true;
    setSceneStatus("fallback");
  }, []);

  const scenePhase: ScenePhase = phase === "boot" ? "opening" : phase;
  const showScene = sceneStatus === "loading" || sceneStatus === "ready";

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] xl:gap-14" data-scene-status={sceneStatus} data-intro-phase={phase}>
      <div className="relative z-10">
        {copy}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/workspace" onClick={handleEnter} className={primaryAction}>Enter DEV.OS →</Link>
          <Link href="/projects" className={secondaryAction}>Browse portfolio</Link>
          <Link href="/workspace" onClick={handleSkip} className="inline-flex min-h-11 items-center rounded-md px-3 font-mono text-sm text-dev-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent">Skip intro →</Link>
        </div>
        <div className="mt-5 text-sm text-dev-secondary">{quickLinks}</div>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      </div>

      <div className={styles.stage} aria-label="A dark developer desk with a laptop" role="img">
        <div className={styles.halo} aria-hidden="true" />
        <div className={styles.desk} aria-hidden="true" />
        <div className={`${styles.staticLaptop} ${sceneStatus === "ready" ? styles.staticHidden : ""}`} aria-hidden="true">
          <div className={styles.screen}>
            <div className={styles.screenHeader}><span /> <span /> <span /></div>
            <div className={styles.screenText}>DEV.OS<span> / system ready</span></div>
            <div className={styles.screenLine} />
            <div className={styles.screenLineShort} />
            <div className={styles.screenLineTiny} />
          </div>
          <div className={styles.base}><div className={styles.keyboard} /></div>
        </div>
        {showScene ? (
          <SceneErrorBoundary onError={handleSceneError}>
            <div className={styles.canvas} aria-hidden="true">
              <LaptopScene
                phase={scenePhase}
                onReady={handleSceneReady}
                onOpenComplete={handleOpenComplete}
                onEnterComplete={enterWorkspace}
                onError={handleSceneError}
              />
            </div>
          </SceneErrorBoundary>
        ) : null}
        {phase === "boot" || phase === "entering" ? (
          <div className={styles.boot} aria-hidden="true">
            <p>DEV.OS / BOOT</p>
            <p>&gt; initializing workspace</p>
            <p>&gt; loading portfolio modules</p>
            <p>&gt; ready</p>
          </div>
        ) : null}
        <div className={styles.caption} aria-hidden="true"><span>DEV.OS / 01</span><span>WORKSTATION</span></div>
      </div>
    </div>
  );
}
