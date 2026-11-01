"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { profile } from "@/content/profile";
import { skillClusters, type SkillClusterId } from "@/content/skill-universe";
import type { UniverseView } from "@/components/scene/immersive/immersive-scene";
import styles from "./universe-experience.module.css";

type SceneStatus = "static" | "loading" | "ready" | "fallback";

const ImmersiveScene = dynamic(
  () => import("@/components/scene/immersive/immersive-scene").then((module) => module.ImmersiveScene),
  { ssr: false, loading: () => null },
);

const stations: readonly { id: UniverseView; label: string; number: string; description: string }[] = [
  { id: "overview", label: "Overview", number: "01", description: "Survey the workstation" },
  { id: "skills", label: "Skills", number: "02", description: "Inspect CV-backed tools" },
  { id: "systems", label: "Systems", number: "03", description: "Trace a conceptual flow" },
  { id: "contact", label: "Connect", number: "04", description: "Choose a direct action" },
];

const systemFlows = [
  {
    id: "api",
    label: "API request",
    steps: [
      { title: "Browser interface", detail: "A client prepares a request and presents the returned state to a person." },
      { title: "REST API", detail: "The server accepts a request, validates its shape, and routes it to application logic." },
      { title: "Service logic", detail: "The application applies its rules and coordinates the data it needs." },
      { title: "Database and response", detail: "Stored data is read or updated; the result travels back through the API to the interface." },
    ],
  },
  {
    id: "rag",
    label: "RAG retrieval",
    steps: [
      { title: "Question", detail: "A question is prepared for retrieval; this illustration does not send it to a service." },
      { title: "Relevant context", detail: "A retrieval step selects candidate material from an indexed source." },
      { title: "Grounded prompt", detail: "Retrieved context and the question are supplied to a language model." },
      { title: "Answer and review", detail: "The generated answer should be checked against its source context before being trusted." },
    ],
  },
  {
    id: "agents",
    label: "AI-assisted workflow",
    steps: [
      { title: "Task brief", detail: "A developer states a bounded implementation task and the constraints." },
      { title: "Agent suggestion", detail: "An AI coding agent drafts code or an approach for review." },
      { title: "Human review", detail: "The developer checks the suggestion for correctness, security, and fit." },
      { title: "Test and integrate", detail: "Targeted verification precedes integration into the project." },
    ],
  },
] as const;

const focusClass = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dev-accent";
const actionClass = `inline-flex min-h-11 items-center justify-center rounded-control border border-dev-accent bg-dev-accent px-5 py-2.5 font-mono text-sm font-semibold text-dev-bg transition-colors hover:bg-dev-text ${focusClass}`;
const quietActionClass = `inline-flex min-h-11 items-center justify-center rounded-control border border-dev-border-bright px-5 py-2.5 font-mono text-sm text-dev-text transition-colors hover:border-dev-accent hover:text-dev-accent ${focusClass}`;

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
    (context as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function UniverseExperience() {
  const [view, setView] = useState<UniverseView>("overview");
  const [activeSkillId, setActiveSkillId] = useState<SkillClusterId>(skillClusters[0].id);
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>("static");
  const [activeFlowId, setActiveFlowId] = useState<(typeof systemFlows)[number]["id"]>("api");
  const [systemStep, setSystemStep] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const sceneFailed = useRef(false);
  const activeSkill = skillClusters.find((cluster) => cluster.id === activeSkillId) ?? skillClusters[0];
  const activeFlow = systemFlows.find((flow) => flow.id === activeFlowId) ?? systemFlows[0];

  useEffect(() => {
    try {
      if (sessionStorage.getItem("dev-os-universe-arrival") !== "1") return;
      const frame = requestAnimationFrame(() => {
        document.getElementById("universe-heading")?.focus();
        sessionStorage.removeItem("dev-os-universe-arrival");
      });
      return () => cancelAnimationFrame(frame);
    } catch {
      // Focus follows native navigation if session storage is unavailable.
    }
  }, []);

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

  const handleSceneError = useCallback(() => {
    sceneFailed.current = true;
    setSceneStatus("fallback");
  }, []);

  const selectView = useCallback((next: UniverseView) => {
    setView(next);
    const station = stations.find((item) => item.id === next);
    setAnnouncement(`${station?.label ?? "Workspace"} station selected.`);
  }, []);

  const selectSkill = useCallback((id: SkillClusterId) => {
    setActiveSkillId(id);
    setView("skills");
    const cluster = skillClusters.find((item) => item.id === id);
    setAnnouncement(`${cluster?.label ?? "Skill"} cluster selected.`);
  }, []);

  const showScene = sceneStatus === "loading" || sceneStatus === "ready";

  return (
    <section aria-label="Interactive DEV.OS universe" className={styles.shell} data-universe-scene-status={sceneStatus} data-universe-view={view}>
      <div className={styles.topbar}>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-dev-accent">Spatial index / 01—04</p>
          <p className="mt-1 text-sm text-dev-secondary">Explore by scene or use the controls. Every destination has a direct HTML path.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-dev-border-bright px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-dev-secondary">
            {sceneStatus === "ready" ? "3D scene ready" : sceneStatus === "fallback" ? "Static view" : "Preparing scene"}
          </span>
          {showScene ? (
            <button type="button" onClick={() => { sceneFailed.current = true; setSceneStatus("fallback"); setAnnouncement("Static view selected. All stations remain available."); }} className={`min-h-11 rounded-control border border-dev-border-bright px-3 font-mono text-xs text-dev-text hover:border-dev-accent hover:text-dev-accent ${focusClass}`}>
              Use static view
            </button>
          ) : null}
        </div>
      </div>

      <nav aria-label="Universe stations" className={styles.stationNav}>
        {stations.map((station) => (
          <button key={station.id} type="button" aria-pressed={view === station.id} onClick={() => selectView(station.id)} className={`${styles.stationButton} ${view === station.id ? styles.stationActive : ""}`}>
            <span className="font-mono text-[10px] text-dev-accent">{station.number}</span>
            <span className="text-sm font-semibold">{station.label}</span>
            <span className="hidden text-xs text-dev-muted lg:block">{station.description}</span>
          </button>
        ))}
      </nav>

      <div className={styles.body}>
        <div className={styles.stage} role="img" aria-label="A conceptual developer workstation with skill, system and contact stations">
          <div className={styles.staticComposition} aria-hidden="true">
            <div className={styles.orbit} />
            <div className={styles.screen}>
              <span className={styles.screenEyebrow}>DEV.OS / {view.toUpperCase()}</span>
              <span className={styles.screenTitle}>{view === "overview" ? "SYSTEM READY" : stations.find((station) => station.id === view)?.label.toUpperCase()}</span>
              <span className={styles.screenRule} />
              <span className={styles.screenRuleShort} />
            </div>
            <div className={styles.desk} />
          </div>
          {showScene ? (
            <SceneErrorBoundary onError={handleSceneError}>
              <div className={styles.canvas} aria-hidden="true">
                <ImmersiveScene
                  view={view}
                  activeSkillId={activeSkillId}
                  onSelectView={selectView}
                  onSelectSkill={selectSkill}
                  onReady={() => setSceneStatus((current) => current === "loading" ? "ready" : current)}
                  onError={handleSceneError}
                />
              </div>
            </SceneErrorBoundary>
          ) : null}
          <div className={styles.stageCaption} aria-hidden="true">
            <span>DEV.OS / {view.toUpperCase()}</span>
            <span>{sceneStatus === "ready" ? "CLICK OBJECTS OR USE CONTROLS" : "HTML CONTROLS AVAILABLE"}</span>
          </div>
        </div>

        <div className={styles.detail}>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-dev-accent">Selected station / {stations.findIndex((station) => station.id === view) + 1}</p>
          {view === "overview" ? (
            <div className="mt-4 space-y-4">
              <h2 className="text-2xl font-semibold leading-tight">A workstation built around real engineering work.</h2>
              <p className="text-sm leading-7 text-dev-secondary">This spatial map introduces {profile.name}&apos;s verified skill inventory and conceptual software flows. Select a station to inspect its details; the 3D objects are optional controls.</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button type="button" onClick={() => selectView("skills")} className={actionClass}>Explore skills</button>
                <button type="button" onClick={() => selectView("systems")} className={quietActionClass}>Trace a system</button>
              </div>
            </div>
          ) : null}

          {view === "skills" ? (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold">Skill universe</h2>
              <p className="mt-2 text-sm leading-6 text-dev-secondary">Select a cluster to see its CV-backed tools. No proficiency level is inferred.</p>
              <div role="region" aria-label="Skill clusters" className={styles.skillGrid}>
                {skillClusters.map((cluster) => (
                  <button key={cluster.id} type="button" aria-pressed={activeSkillId === cluster.id} onClick={() => selectSkill(cluster.id)} className={`${styles.skillButton} ${activeSkillId === cluster.id ? styles.skillActive : ""}`}>{cluster.label}</button>
                ))}
              </div>
              <div role="region" aria-label="Skill detail" data-active-skill={activeSkillId} className="mt-5 rounded-panel border border-dev-border bg-dev-bg/50 p-4" aria-live="polite">
                <p className="font-mono text-[10px] uppercase tracking-widest text-dev-accent">CV-backed cluster</p>
                <h3 className="mt-2 text-lg font-semibold">{activeSkill.label}</h3>
                <p className="mt-2 text-sm leading-6 text-dev-secondary">{activeSkill.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {activeSkill.items.map((item) => <li key={item} className="rounded border border-dev-border-bright bg-dev-surface px-2.5 py-1 font-mono text-xs text-dev-text">{item}</li>)}
                </ul>
              </div>
              <Link href="/skills" className="mt-4 inline-flex min-h-11 items-center font-mono text-sm text-dev-accent underline-offset-4 hover:underline focus-visible:underline">Read the full skills page →</Link>
            </div>
          ) : null}

          {view === "systems" ? (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold">Conceptual system flow</h2>
              <p className="mt-2 text-sm leading-6 text-dev-secondary">Choose a simplified engineering flow. These are not live systems, project architecture claims, or measured production traces. The 3D object depicts the API path.</p>
              <div aria-label="Conceptual flow selector" className="mt-4 flex flex-wrap gap-2">
                {systemFlows.map((flow) => (
                  <button key={flow.id} type="button" aria-pressed={activeFlowId === flow.id} onClick={() => { setActiveFlowId(flow.id); setSystemStep(0); }} className={`${styles.flowChoice} ${activeFlowId === flow.id ? styles.flowChoiceActive : ""}`}>{flow.label}</button>
                ))}
              </div>
              <ol className={styles.flow} data-active-flow={activeFlowId}>
                {activeFlow.steps.map((step, index) => (
                  <li key={step.title} className={`${styles.flowStep} ${index === systemStep ? styles.flowStepActive : ""}`} aria-current={index === systemStep ? "step" : undefined}>
                    <span className="font-mono text-xs text-dev-accent">0{index + 1}</span>
                    <span className="font-semibold">{step.title}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 min-h-16 text-sm leading-6 text-dev-text" aria-live="polite">{activeFlow.steps[systemStep].detail}</p>
              <button type="button" onClick={() => setSystemStep((current) => (current + 1) % activeFlow.steps.length)} className={actionClass}>Next step →</button>
              <Link href="/projects" className="mt-4 block font-mono text-sm text-dev-accent underline-offset-4 hover:underline focus-visible:underline">See verified project architectures →</Link>
            </div>
          ) : null}

          {view === "contact" ? (
            <div className="mt-4 space-y-4">
              <h2 className="text-2xl font-semibold">Continue the conversation.</h2>
              <p className="text-sm leading-7 text-dev-secondary">Choose the format that works for you. The resume and contact details are owner-approved; the portfolio pages remain available without the 3D scene.</p>
              <div className="flex flex-col gap-3 pt-2">
                <Link href="/resume" className={actionClass}>View resume →</Link>
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className={quietActionClass}>Explore GitHub ↗</a>
                <Link href="/contact" className={quietActionClass}>Contact →</Link>
                <Link href="/workspace" className={quietActionClass}>Quick View / 2D workspace →</Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </section>
  );
}
