"use client";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

const N    = 60;    // max trail points in GPU uniform arrays
const LIFE = 7000;  // ms a point lives before expiring
const GRAV = 52;    // px/s — gravity pulls blobs downward

// ── Vertex shader ─────────────────────────────────────────────────────────────
const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// ── Fragment shader ───────────────────────────────────────────────────────────
// For each pixel:
//   1. Accumulate metaball field from gravity-affected cursor trail
//   2. Sample the logo texture where the logo sits
//   3. Below threshold → transparent
//   4. Above threshold → wax material (dark ink base + specular) blended with logo
const FRAG = `
precision highp float;

uniform vec2      uResolution;
uniform vec2      uPoints[${N}];
uniform float     uStrengths[${N}];
uniform int       uCount;
uniform sampler2D uLogo;
uniform float     uLogoCx;
uniform float     uLogoCy;
uniform float     uLogoSize;

void main() {
  vec2 px = gl_FragCoord.xy;

  // ── Metaball field + gradient ──────────────────────────────────────────────
  float field = 0.0;
  float gx    = 0.0;
  float gy    = 0.0;

  for (int i = 0; i < ${N}; i++) {
    if (i < uCount) {
      float s  = uStrengths[i];
      // uPoints already in WebGL px; flip Y so y=0 is bottom
      vec2  p  = vec2(uPoints[i].x, uResolution.y - uPoints[i].y);
      float dx = px.x - p.x;
      float dy = px.y - p.y;
      float d2 = dx * dx + dy * dy + 1.0;
      // Radius: ~8% of canvas width, scales with strength
      float r  = uResolution.x * 0.055 * s;
      float c  = s * r * r / d2;
      field   += c;
      gx      -= 2.0 * dx * c / d2;
      gy      -= 2.0 * dy * c / d2;
    }
  }

  if (field < 0.5) { gl_FragColor = vec4(0.0); return; }

  // ── Edge feathering — smooth at boundary, solid inside ────────────────────
  float alpha = smoothstep(0.5, 0.84, field) * 0.92;

  // ── Surface normal from field gradient → specular highlight ───────────────
  float gMag = sqrt(gx * gx + gy * gy) + 0.001;
  float nx   = gx / gMag;
  float ny   = gy / gMag;
  // Light from upper-left — gives the drip a lit top edge
  float spec = max(0.0, nx * 0.50 + ny * (-0.87));
  spec       = spec * spec * spec;  // cubic for tight, glossy highlight

  // ── Sample logo texture at this pixel ─────────────────────────────────────
  vec2  logoC  = vec2(uLogoCx, uResolution.y - uLogoCy);
  vec2  uv     = (px - logoC) / uLogoSize + 0.5;
  vec4  logo   = vec4(0.0);
  if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
    logo = texture2D(uLogo, uv);
    // Fade alpha to zero near UV edges so the texture boundary is never visible
    // as a hard rectangle — logo's own circular alpha does the real clipping
    float ex = min(uv.x, 1.0 - uv.x);
    float ey = min(uv.y, 1.0 - uv.y);
    logo.a  *= smoothstep(0.0, 0.04, ex) * smoothstep(0.0, 0.04, ey);
  }

  // ── Wax material: near-black with cool specular ────────────────────────────
  //    Matches the site ink colour (#0d0d10 ≈ vec3(0.05,0.05,0.06))
  vec3 waxBase = vec3(0.05, 0.05, 0.07);
  vec3 waxSpec = vec3(0.42, 0.46, 0.58);  // cool blue-grey sheen
  vec3 wax     = mix(waxBase, waxSpec, spec * 0.78 + 0.03);

  // Blend logo into wax — logo mark visible at ~40% through wax
  vec3 finalRGB = mix(wax, logo.rgb, logo.a * 0.40);

  gl_FragColor = vec4(finalRGB, alpha);
}
`;

type Pt = { x: number; y: number; born: number };

export default function WaxReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fine      = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    if (!fine) return;
    const cv = canvasRef.current;
    if (!cv) return;

    const gl = cv.getContext("webgl", {
      alpha: true, premultipliedAlpha: false,
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    // ── Shader compilation ─────────────────────────────────────────────────
    const compile = (type: number, src: string): WebGLShader | null => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vert = compile(gl.VERTEX_SHADER,   VERT);
    const frag = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // ── Full-screen quad ───────────────────────────────────────────────────
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // ── Uniform locations ──────────────────────────────────────────────────
    const uRes      = gl.getUniformLocation(prog, "uResolution");
    const uPts      = gl.getUniformLocation(prog, "uPoints[0]");
    const uStr      = gl.getUniformLocation(prog, "uStrengths[0]");
    const uCnt      = gl.getUniformLocation(prog, "uCount");
    const uLogoSmp  = gl.getUniformLocation(prog, "uLogo");
    const uLogoCx   = gl.getUniformLocation(prog, "uLogoCx");
    const uLogoCy   = gl.getUniformLocation(prog, "uLogoCy");
    const uLogoSize = gl.getUniformLocation(prog, "uLogoSize");

    // Alpha blending for transparent canvas
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    // ── Resize handling ────────────────────────────────────────────────────
    let W = 0, H = 0, DPR = 1;
    const resize = () => {
      DPR = window.devicePixelRatio || 1;
      W   = cv.offsetWidth;
      H   = cv.offsetHeight;
      cv.width  = Math.round(W * DPR);
      cv.height = Math.round(H * DPR);
      gl.viewport(0, 0, cv.width, cv.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    // ── Logo texture ───────────────────────────────────────────────────────
    // Use the 1024×1024 source so Retina screens never have to upsample
    const tex = gl.createTexture();
    const img = new window.Image();
    img.src   = "/brand/icon-512.png"; // icon-only (no wordmark text)
    img.onload = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      // Trilinear filtering — smooth at all sizes, no mip-seam transitions
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.generateMipmap(gl.TEXTURE_2D);
      // Anisotropic filtering if available — sharpens texture at oblique angles
      const ani = gl.getExtension("EXT_texture_filter_anisotropic");
      if (ani) gl.texParameterf(gl.TEXTURE_2D, ani.TEXTURE_MAX_ANISOTROPY_EXT, 4);
    };

    // ── Cursor trail ───────────────────────────────────────────────────────
    const pts: Pt[] = [];
    let lx = -999, ly = -999;

    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right ||
          e.clientY < r.top  || e.clientY > r.bottom) return;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if ((x - lx) ** 2 + (y - ly) ** 2 < 64) return; // min 8px travel
      lx = x; ly = y;
      pts.push({ x, y, born: performance.now() });
      if (pts.length > N) pts.shift();
    };
    window.addEventListener("mousemove", onMove);

    // Flat typed arrays uploaded to GPU each frame
    const pxFlat = new Float32Array(N * 2);
    const sFlat  = new Float32Array(N);

    let raf = 0;
    const frame = () => {
      const now = performance.now();

      // Expire old points
      while (pts.length && now - pts[0].born > LIFE) pts.shift();

      // Logo rect — centered in the canvas, sized to match second circle (600px)
      const logoSize = Math.min(600, Math.min(W, H) * 0.88);

      const count = pts.length;
      for (let i = 0; i < count; i++) {
        const p   = pts[i];
        const age = (now - p.born) / LIFE;  // 0→1 over lifetime

        // Strength: fast ramp-in (5%), hold, ease-out over remaining life
        const s = age < 0.05
          ? age / 0.05
          : 1 - Math.pow((age - 0.05) / 0.95, 2.0);
        sFlat[i] = Math.max(0, s);

        // x stays fixed; y drifts downward at GRAV px/s (gravity)
        const gravPx = GRAV * (now - p.born) / 1000;
        pxFlat[i * 2]     = p.x * DPR;
        pxFlat[i * 2 + 1] = (p.y + gravPx) * DPR;
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform2fv(uPts, pxFlat);
      gl.uniform1fv(uStr, sFlat);
      gl.uniform1i(uCnt, count);
      gl.uniform1i(uLogoSmp, 0);
      // Logo center in CSS px (shader converts to WebGL px internally)
      gl.uniform1f(uLogoCx,   (W / 2) * DPR);
      gl.uniform1f(uLogoCy,   (H / 2) * DPR);
      gl.uniform1f(uLogoSize, logoSize  * DPR);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      gl.deleteTexture(tex);
    };
  }, [fine]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[6] h-full w-full"
    />
  );
}
