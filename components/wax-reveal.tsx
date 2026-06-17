"use client";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

const LOGO_SZ  = 600;   // matches second concentric circle diameter
const WAX_LIFE = 5000;  // ms before a drip fades out
const DRIP_SPD = 110;   // px per second drip growth

type Pt = { x: number; y: number; r: number; born: number; dripH: number; maxH: number };

// Bézier teardrop: wider at root (startY), pointed at tip (startY + h).
// Looks like a hanging wax drop rather than a geometric shape.
function teardrop(
  c: CanvasRenderingContext2D,
  x: number, startY: number,
  h: number, rootW: number,
) {
  if (h < 3 || rootW < 1) return;
  c.beginPath();
  c.moveTo(x - rootW, startY);
  // left side — wide at root, curves in to a fine point
  c.bezierCurveTo(
    x - rootW * 0.92, startY + h * 0.32,
    x - 2.5,          startY + h * 0.84,
    x,                startY + h,
  );
  // right side — mirror
  c.bezierCurveTo(
    x + 2.5,          startY + h * 0.84,
    x + rootW * 0.92, startY + h * 0.32,
    x + rootW,        startY,
  );
  c.closePath();
  c.fill();
}

export default function WaxReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fine      = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    if (!fine) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: true })!;

    // Off-screen canvas accumulates all wax-shape white paint.
    // This becomes the "destination-in" mask applied to the logo.
    const waxCv  = document.createElement("canvas");
    const waxCtx = waxCv.getContext("2d", { alpha: true })!;

    let W = 0, H = 0;
    const resize = () => {
      W = cv.offsetWidth; H = cv.offsetHeight;
      cv.width  = W; cv.height  = H;
      waxCv.width = W; waxCv.height = H;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    // Logo image — drawn first, then clipped to wax shapes
    const img = new window.Image();
    img.src = "/brand/icon-512.png";

    const pts: Pt[] = [];
    let lx = -999, ly = -999;

    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      // Ignore cursor outside the canvas bounds
      if (e.clientX < r.left || e.clientX > r.right ||
          e.clientY < r.top  || e.clientY > r.bottom) return;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if ((x - lx) ** 2 + (y - ly) ** 2 < 100) return; // min 10px travel
      lx = x; ly = y;
      pts.push({
        x, y,
        r:    44 + Math.random() * 18,
        born: performance.now(),
        dripH: 0,
        maxH:  90 + Math.random() * 260,
      });
      if (pts.length > 60) pts.shift();
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const frame = () => {
      const now = performance.now();
      // Expire oldest points
      while (pts.length && now - pts[0].born > WAX_LIFE + 400) pts.shift();

      // ── 1. Draw full logo onto main canvas ────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      if (img.complete && img.naturalWidth) {
        const s  = Math.min(LOGO_SZ, Math.min(W, H) * 0.88);
        const lx = (W - s) / 2;
        const ly = (H - s) / 2;
        ctx.drawImage(img, lx, ly, s, s);
      }

      // ── 2. Paint wax shapes (white) on waxCv ──────────────────────────────
      waxCtx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        const age  = (now - p.born) / 1000;
        // Drip height grows linearly until capped at maxH
        p.dripH = Math.min(p.maxH, age * DRIP_SPD);

        // Fade in fast (150ms), hold, then fade out in the last 800ms
        const fi = Math.min(1, age / 0.15);
        const fo = now - p.born > WAX_LIFE - 800
          ? Math.max(0, (WAX_LIFE - (now - p.born)) / 800) : 1;
        const a = fi * fo;
        if (a <= 0) return;

        waxCtx.save();
        waxCtx.globalAlpha = a;

        // Wax pool — radial gradient: full opacity core, soft feathered edge
        const gr = waxCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        gr.addColorStop(0,    "rgba(255,255,255,1)");
        gr.addColorStop(0.60, "rgba(255,255,255,1)");
        gr.addColorStop(0.82, "rgba(255,255,255,0.55)");
        gr.addColorStop(1,    "rgba(255,255,255,0)");
        waxCtx.beginPath();
        waxCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        waxCtx.fillStyle = gr;
        waxCtx.fill();

        // Wax drip — hangs from the bottom of the pool
        if (p.dripH > 3) {
          waxCtx.fillStyle = "rgba(255,255,255,1)";
          teardrop(waxCtx, p.x, p.y + p.r * 0.58, p.dripH, p.r * 0.26);
        }

        waxCtx.restore();
      });

      // ── 3. Clip logo to wax shapes via destination-in ─────────────────────
      // Only logo pixels that sit under a white wax region survive.
      // Everything else becomes transparent → the hero bg shows through.
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(waxCv, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(frame);
    };

    img.onload = frame;
    if (img.complete && img.naturalWidth) frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
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
