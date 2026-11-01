"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { profile } from "@/content/profile";
import { LiquidBackdrop } from "./liquid-backdrop";

export type ScenePhase = "idle" | "opening" | "entering";
export type IntroPhase = ScenePhase | "boot";
export type SceneStatus = "static" | "loading" | "ready" | "fallback";

const LaptopScene = dynamic(
  () => import("@/components/scene/laptop-scene").then((module) => module.LaptopScene),
  { ssr: false, loading: () => null },
);

const primaryAction =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-dev-accent bg-dev-accent px-5 py-3 font-mono text-sm font-semibold text-dev-bg transition-colors hover:bg-dev-neon hover:border-dev-neon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent";
const secondaryAction =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-dev-border-bright bg-dev-surface/80 px-5 py-3 font-mono text-sm text-dev-text transition-colors hover:border-dev-accent hover:text-dev-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent";

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

function supportsWebGL(): boolean {
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

function rememberUniverseArrival(): void {
  try {
    sessionStorage.setItem("dev-os-universe-arrival", "1");
  } catch {
    // Browser storage can be disabled
  }
}

export interface ChapterHeroProps {
  className?: string;
}

export function ChapterHero({ className = "" }: ChapterHeroProps) {
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

  const enterUniverse = useCallback(() => {
    if (navigationStarted.current) return;
    navigationStarted.current = true;
    clearTransitionTimers();
    rememberUniverseArrival();
    router.push("/universe");
  }, [clearTransitionTimers, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") {
      setSceneStatus("fallback");
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrowViewport = window.matchMedia("(max-width: 767px)");

    const evaluate = () => {
      if (sceneFailed.current || reducedMotion.matches || narrowViewport.matches) {
        setSceneStatus("fallback");
      } else if (!supportsWebGL()) {
        sceneFailed.current = true;
        setSceneStatus("fallback");
      } else {
        setSceneStatus((current) => (current === "ready" ? current : "loading"));
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
    if (phase !== "idle" && sceneStatus === "fallback") enterUniverse();
  }, [enterUniverse, phase, sceneStatus]);

  useEffect(() => clearTransitionTimers, [clearTransitionTimers]);

  const handleEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (sceneStatus !== "ready" || phase !== "idle") {
      rememberUniverseArrival();
      return;
    }
    event.preventDefault();
    phaseRef.current = "opening";
    setPhase("opening");
    setAnnouncement("Opening DEV.OS. Skip intro is available.");
    watchdogTimer.current = setTimeout(enterUniverse, 3600);
  };

  const handleSkip = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    navigationStarted.current = true;
    clearTransitionTimers();
    rememberUniverseArrival();
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
    setSceneStatus((current) => (current === "loading" ? "ready" : current));
  }, []);

  const handleSceneError = useCallback(() => {
    sceneFailed.current = true;
    setSceneStatus("fallback");
  }, []);

  const scenePhase: ScenePhase = phase === "boot" ? "opening" : phase;
  const showScene = sceneStatus === "loading" || sceneStatus === "ready";

  return (
    <section
      id="chapter-01"
      aria-label="Chapter 01: The Engineer"
      className={`relative min-h-[540px] w-full scroll-mt-16 sm:scroll-mt-20 border-b border-dev-border/80 pb-16 pt-4 ${className}`}
    >
      {/* STRICT ZERO-DISTORTION LAYER 0: Ambient Liquid Backdrop */}
      <LiquidBackdrop paused={sceneStatus === "fallback" || phase === "entering"} />

      {/* SEMANTIC EDITORIAL DOM LAYER 2 */}
      <div
        className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] xl:gap-14"
        data-scene-status={sceneStatus}
        data-intro-phase={phase}
      >
        <div>
          {/* Eyebrow & Status pill */}
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-dev-accent">
              DEV.OS // CHAPTER 01
            </p>
            <span aria-hidden="true" className="text-dev-border-bright">/</span>
            <div className="inline-flex items-center gap-2 rounded-full border border-dev-border-bright bg-dev-surface/90 px-3 py-1 font-mono text-[11px] text-dev-text shadow-window">
              <span className="h-2 w-2 rounded-full bg-dev-neon shadow-glow-neon animate-pulse" />
              <span className="tracking-wider text-dev-accent">OPERATIONAL // FULLSTACK &amp; AI</span>
            </div>
          </div>

          {/* Display Headline */}
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-dev-text sm:text-7xl">
            {profile.name}<span className="text-dev-accent">.</span>
          </h1>

          {/* Subtitle / Headline from profile */}
          <p className="mt-5 font-sans text-xl font-medium text-dev-text sm:text-2xl">
            {profile.headline}
          </p>

          {/* Verified Summary */}
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-dev-secondary sm:text-lg">
            {profile.summary}
          </p>

          {/* CV-backed Architectural Focus */}
          <div className="mt-5 max-w-xl border-l-2 border-dev-accent/70 pl-4 font-mono text-xs text-dev-secondary sm:text-sm">
            <p className="leading-6 text-dev-text">
              <span className="text-dev-accent font-semibold">CORE ARCHITECTURE:</span> Full-stack applications · REST APIs · software architecture · AI/RAG
            </p>
          </div>

          {/* Actions & CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/universe" onClick={handleEnter} className={primaryAction}>
              Enter DEV.OS universe →
            </Link>
            <Link href="/projects" className={secondaryAction}>
              Browse portfolio
            </Link>
            <Link href="/workspace" className={secondaryAction}>
              Quick View / 2D workspace
            </Link>
            <Link
              href="/universe"
              onClick={handleSkip}
              className="inline-flex min-h-11 items-center rounded-md px-3 font-mono text-sm text-dev-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dev-accent"
            >
              Skip intro →
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-5 text-sm font-sans text-dev-secondary">
            Prefer a quick scan?{" "}
            <Link href="/about" className="text-dev-accent underline-offset-4 hover:underline focus-visible:underline">
              About
            </Link>
            <span aria-hidden="true"> · </span>
            <Link href="/resume" className="text-dev-accent underline-offset-4 hover:underline focus-visible:underline">
              View resume
            </Link>
            <span aria-hidden="true"> · </span>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dev-accent underline-offset-4 hover:underline focus-visible:underline"
            >
              GitHub ↗
            </a>
          </div>

          {/* Accessible screen reader status announcements */}
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {announcement}
          </p>
        </div>

        {/* LAYER 1: 3D Stage / Accessible Fallback */}
        <div
          className="relative isolate min-h-[360px] overflow-hidden rounded-2xl border border-dev-border-bright/70 bg-gradient-to-br from-dev-elevated to-dev-bg shadow-window sm:min-h-[400px]"
          aria-label="A dark developer desk with a laptop"
          role="img"
        >
          {/* Ambient stage halo */}
          <div
            className="pointer-events-none absolute left-[12%] top-[10%] h-[66%] w-[76%] rounded-full bg-dev-accent/10 blur-[60px]"
            aria-hidden="true"
          />

          {/* 3D perspective desk plane */}
          <div
            className="pointer-events-none absolute -bottom-[34%] -left-[20%] -right-[20%] h-[57%] [transform:perspective(500px)_rotateX(62deg)] border-t border-dev-border-bright/50 bg-gradient-to-r from-dev-surface to-dev-bg shadow-[0_-12px_50px_rgb(var(--dev-color-accent)/0.05)]"
            aria-hidden="true"
          />

          {/* Accessible static CSS fallback laptop (visible in fallback or loading) */}
          <div
            className={`pointer-events-none absolute left-1/2 top-[49%] h-[220px] w-[min(78%,410px)] -translate-x-1/2 -translate-y-1/2 [transform:translate(-50%,-50%)_perspective(700px)_rotateY(-12deg)] transition-opacity duration-200 ${
              sceneStatus === "ready" ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden="true"
          >
            {/* Screen */}
            <div className="absolute left-[9%] top-[4%] h-[76%] w-[82%] overflow-hidden rounded-xl border-[9px] border-b-[13px] border-dev-bg bg-gradient-to-br from-dev-elevated to-dev-bg shadow-[0_0_0_2px_rgb(var(--dev-color-border-bright)),0_0_40px_rgb(var(--dev-color-neon)/0.15)]">
              <div className="flex h-5 items-center gap-1.5 border-b border-dev-border px-2.5">
                <span className="h-1 w-1 rounded-full bg-dev-border-bright" />
                <span className="h-1 w-1 rounded-full bg-dev-border-bright" />
                <span className="h-1 w-1 rounded-full bg-dev-border-bright" />
              </div>
              <div className="p-3 font-mono text-xs font-bold text-dev-neon">
                DEV.OS<span className="ml-1 text-[9px] font-normal text-dev-muted">/ SYSTEM READY</span>
              </div>
              <div className="mx-3 my-1.5 h-1 w-[68%] rounded bg-dev-accent/40" />
              <div className="mx-3 my-1.5 h-1 w-[46%] rounded bg-dev-accent/30" />
              <div className="mx-3 my-1.5 h-1 w-[28%] rounded bg-dev-accent/20" />
            </div>
            {/* Base chassis */}
            <div className="absolute bottom-[6%] left-0 right-0 h-11 origin-top rounded-b-xl rounded-t-sm border-2 border-dev-border-bright bg-gradient-to-b from-dev-elevated to-dev-bg shadow-2xl [transform:perspective(440px)_rotateX(62deg)]">
              <div className="absolute inset-x-[10%] inset-y-1.5 opacity-50 bg-[repeating-linear-gradient(90deg,rgb(var(--dev-color-border-bright))_0_10px,transparent_10px_14px),repeating-linear-gradient(rgb(var(--dev-color-border-bright))_0_3px,transparent_3px_11px)]" />
            </div>
          </div>

          {/* WebGL Procedural 3D Stage */}
          {showScene ? (
            <SceneErrorBoundary onError={handleSceneError}>
              <div className="absolute inset-0 z-[1]" aria-hidden="true">
                <LaptopScene
                  phase={scenePhase}
                  onReady={handleSceneReady}
                  onOpenComplete={handleOpenComplete}
                  onEnterComplete={enterUniverse}
                  onError={handleSceneError}
                />
              </div>
            </SceneErrorBoundary>
          ) : null}

          {/* Boot telemetry display */}
          {phase === "boot" || phase === "entering" ? (
            <div
              className="absolute bottom-11 left-3 right-3 z-[2] max-w-[270px] rounded-lg border border-dev-accent/40 bg-dev-bg/95 p-3.5 font-mono text-[10px] leading-relaxed text-dev-accent shadow-[0_0_28px_rgb(var(--dev-color-accent)/0.15)]"
              aria-hidden="true"
            >
              <p className="mb-1.5 font-bold tracking-wider text-dev-neon">DEV.OS // BOOT_SEQUENCE</p>
              <p>&gt; initializing spatial workstation</p>
              <p>&gt; loading engineering modules</p>
              <p className="text-dev-neon">&gt; ready</p>
            </div>
          ) : null}

          {/* Stage caption */}
          <div
            className="absolute bottom-4 left-5 right-5 z-[3] flex justify-between font-mono text-[9px] tracking-widest text-dev-muted"
            aria-hidden="true"
          >
            <span>DEV.OS // CH.01</span>
            <span>3D_WORKSTATION</span>
          </div>
        </div>
      </div>
    </section>
  );
}
