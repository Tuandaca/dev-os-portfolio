"use client";

import { useEffect, useRef, useState } from "react";

export interface LiquidBackdropProps {
  paused?: boolean;
  className?: string;
}

const VERTEX_SHADER_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.05 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 st = gl_FragCoord.xy / max(u_resolution.xy, vec2(1.0, 1.0));
  st.x *= u_resolution.x / max(u_resolution.y, 1.0);

  // Slow viscous fluid progression
  float t = u_time * 0.035;

  // Domain warping with fbm
  vec2 q = vec2(fbm(st + vec2(0.0, 0.0) + t * 0.25), fbm(st + vec2(5.2, 1.3) + t * 0.2));
  vec2 r = vec2(fbm(st + 3.0 * q + vec2(1.7, 9.2) + t * 0.15), fbm(st + 3.0 * q + vec2(8.3, 2.8) + t * 0.12));
  float f = fbm(st + 3.5 * r);

  // Dark Neon Liquid Palette
  vec3 c_bg      = vec3(0.027, 0.039, 0.035); // #070A09 Canvas
  vec3 c_surface = vec3(0.055, 0.082, 0.071); // #0E1512 Surface
  vec3 c_crest   = vec3(0.071, 0.102, 0.086); // #121A16 Fluid Crests
  vec3 c_accent  = vec3(0.431, 0.906, 0.627); // #6EE7A0 Primary Green
  vec3 c_neon    = vec3(0.224, 1.0, 0.533);   // #39FF88 High-Intensity Neon

  // Base fluid interpolation
  vec3 col = mix(c_bg, c_surface, clamp((f * f) * 4.0, 0.0, 1.0));
  col = mix(col, c_crest, clamp(length(q), 0.0, 1.0));

  // Subtle bioluminescence at the fluid crests
  float crestGlow = smoothstep(0.4, 0.85, f) * clamp(r.x * 1.4, 0.0, 1.0);
  col += c_accent * (crestGlow * 0.10);

  // Peak laser highlight
  float neonHighlight = pow(clamp(f + r.y * 0.45, 0.0, 1.0), 4.0);
  col += c_neon * (neonHighlight * 0.05);

  // Radial vignette to ground edges in deep #070A09
  vec2 uv = gl_FragCoord.xy / max(u_resolution.xy, vec2(1.0, 1.0));
  float vignette = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y) * 16.0;
  vignette = clamp(pow(vignette, 0.3), 0.0, 1.0);
  col = mix(c_bg, col, vignette);

  gl_FragColor = vec4(col, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function LiquidBackdrop({ paused = false, className = "" }: LiquidBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canRenderWebGL, setCanRenderWebGL] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") {
      setCanRenderWebGL(false);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrowViewport = window.matchMedia("(max-width: 767px)");

    const evaluate = () => {
      if (reducedMotion.matches || narrowViewport.matches) {
        setCanRenderWebGL(false);
        return;
      }
      try {
        const testCanvas = document.createElement("canvas");
        const gl = testCanvas.getContext("webgl2") ?? testCanvas.getContext("webgl");
        if (!gl) {
          setCanRenderWebGL(false);
          return;
        }
        (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
        setCanRenderWebGL(true);
      } catch {
        setCanRenderWebGL(false);
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
    if (!canRenderWebGL) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      return;
    }

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    const quadPositions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, quadPositions, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "a_position");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");

    let animationFrameId: number | null = null;
    let startTime: number | null = null;
    let inView = true;
    let isHidden = document.hidden;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(Math.floor(rect.width * dpr), 1);
      const h = Math.max(Math.floor(rect.height * dpr), 1);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    resize();

    const render = (now: number) => {
      if (paused || !inView || isHidden) {
        animationFrameId = null;
        return;
      }

      if (startTime === null) startTime = now;
      const elapsed = (now - startTime) / 1000;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);

      gl.enableVertexAttribArray(aPos);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uRes, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (animationFrameId === null && !paused && inView && !isHidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    startLoop();

    // IntersectionObserver to pause rendering when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        inView = entry?.isIntersecting ?? false;
        if (inView) startLoop();
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    // Visibility change listener
    const onVisibilityChange = () => {
      isHidden = document.hidden;
      if (!isHidden) startLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Resize listener
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", resize);

      gl.deleteBuffer(posBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [canRenderWebGL, paused]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {/* STRICT ZERO-DISTORTION RULE: Static CSS radial gradient always present as base/fallback */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgb(18 26 22 / 0.6) 0%, rgb(7 10 9) 70%)",
        }}
      />
      {canRenderWebGL ? (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full pointer-events-none opacity-85"
        />
      ) : null}
    </div>
  );
}
