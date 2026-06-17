"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

// How many cursor history points the shader processes per pixel
const N = 60;
// How long (ms) each point stays in the trail
const LIFE = 2200;
// Min pixels cursor must travel before we record a new point (controls density)
const MIN_DIST = 6;

// ── Vertex shader ─────────────────────────────────────────────────────────────
// Draws a full-screen quad; all the work is in the fragment shader.
const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// ── Fragment shader ───────────────────────────────────────────────────────────
// Metaball field: for each pixel, sums the influence of every cursor point.
// Where the combined field > threshold, renders a fluid blob with specular lighting.
const FRAG = `
precision highp float;

uniform vec2  uResolution;
uniform vec2  uPoints[${N}];
uniform float uStrengths[${N}];
uniform int   uCount;

void main() {
  vec2 px = gl_FragCoord.xy;

  float field = 0.0;
  float gx = 0.0;
  float gy = 0.0;

  // Accumulate influence from each trail point.
  // GLSL ES 1.0 doesn't allow break with a non-constant bound,
  // so we branch instead.
  for (int i = 0; i < ${N}; i++) {
    if (i < uCount) {
      float s  = uStrengths[i];
      // Flip Y: canvas y=0 is top, WebGL y=0 is bottom
      vec2  p  = vec2(uPoints[i].x, uResolution.y - uPoints[i].y);
      float dx = px.x - p.x;
      float dy = px.y - p.y;
      float d2 = dx * dx + dy * dy + 1.0;
      // Blob radius scales with viewport width so it looks right on all screens
      float r  = uResolution.x * 0.07 * s;
      float c  = s * r * r / d2;
      field   += c;
      // Gradient of the field (approximates the surface normal)
      gx      -= 2.0 * dx * c / d2;
      gy      -= 2.0 * dy * c / d2;
    }
  }

  // Pixels below the threshold are fully transparent — hero shows through.
  if (field < 0.5) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // Smooth blob edge
  float alpha = smoothstep(0.5, 0.90, field) * 0.92;

  // Convert gradient to an approximate surface normal, then dot with a
  // fixed light direction to get a specular highlight — makes the blob look
  // like a rounded 3-D liquid surface, not a flat sticker.
  float gMag    = sqrt(gx * gx + gy * gy) + 0.001;
  float nx      = gx / gMag;
  float ny      = gy / gMag;
  // Light coming from upper-left
  float spec    = nx * 0.55 + ny * (-0.83);
  spec          = max(0.0, spec);
  spec          = spec * spec * spec;

  // Base colour: cool silver-blue (like liquid glass over cream)
  // Highlight: near-white specular peak
  vec3 base  = vec3(0.60, 0.67, 0.80);
  vec3 hi    = vec3(0.97, 0.98, 1.00);
  vec3 color = mix(base, hi, spec * 0.90 + 0.08);

  gl_FragColor = vec4(color, alpha);
}
`;

// ── Component ─────────────────────────────────────────────────────────────────
type Pt = { x: number; y: number; born: number };

export default function WaterLayer() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const isFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    if (!isFinePointer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Request a transparent WebGL context so the hero behind shows through
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false }) as WebGLRenderingContext | null;
    if (!gl) return;

    // ── Shader compilation helpers ─────────────────────────────────────────
    const compileShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vert = compileShader(gl.VERTEX_SHADER, VERT);
    const frag = compileShader(gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // ── Full-screen quad geometry ──────────────────────────────────────────
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // ── Uniform locations ──────────────────────────────────────────────────
    const uRes    = gl.getUniformLocation(prog, "uResolution");
    const uPts    = gl.getUniformLocation(prog, "uPoints[0]");
    const uStr    = gl.getUniformLocation(prog, "uStrengths[0]");
    const uCount  = gl.getUniformLocation(prog, "uCount");

    // ── Alpha blending — needed for transparent canvas ─────────────────────
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    // ── Viewport / resize ──────────────────────────────────────────────────
    let W = 0, H = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Cursor trail ───────────────────────────────────────────────────────
    const pts: Pt[] = [];
    let lastX = -9999, lastY = -9999;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Throttle by distance so we don't flood the trail on slow moves
      const dx = x - lastX, dy = y - lastY;
      if (dx * dx + dy * dy < MIN_DIST * MIN_DIST) return;
      lastX = x; lastY = y;
      pts.push({ x, y, born: performance.now() });
      if (pts.length > N) pts.shift();
    };
    canvas.addEventListener("mousemove", onMove);

    // ── Flat arrays passed to WebGL uniforms each frame ────────────────────
    const pxFlat = new Float32Array(N * 2);
    const sFlat  = new Float32Array(N);

    // ── Render loop ────────────────────────────────────────────────────────
    let raf = 0;
    const draw = () => {
      const now = performance.now();

      // Expire old points
      let start = 0;
      while (start < pts.length && now - pts[start].born > LIFE) start++;
      if (start > 0) pts.splice(0, start);

      const count = pts.length;
      for (let i = 0; i < count; i++) {
        const p   = pts[i];
        const age = (now - p.born) / LIFE;
        // Easing: slow fade-in, linear hold, accelerated fade-out
        const s   = age < 0.1
          ? age / 0.1                    // 0 → 1 fast ramp
          : 1 - Math.pow((age - 0.1) / 0.9, 1.6); // ease out
        pxFlat[i * 2]     = p.x;
        pxFlat[i * 2 + 1] = p.y;
        sFlat[i]           = Math.max(0, s);
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, W, H);
      gl.uniform2fv(uPts, pxFlat);
      gl.uniform1fv(uStr, sFlat);
      gl.uniform1i(uCount, count);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
    };
  }, [isFinePointer]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 z-20 h-full w-full cursor-none ${
        isFinePointer ? "" : "pointer-events-none opacity-0"
      }`}
    />
  );
}
