"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

// Simulation cell size in CSS pixels — smaller = smoother, heavier CPU
const SCALE = 5;
// Wave energy retention per physics step (1 = no decay, 0.98 = damps quickly)
const DAMP  = 0.988;

export default function WaterLayer() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const isFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    if (!isFinePointer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, cols = 0, rows = 0;
    let curr = new Float32Array(0);
    let prev = new Float32Array(0);
    let img: ImageData | null = null;
    let raf = 0;

    const init = () => {
      W    = canvas.offsetWidth;
      H    = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      // +2 = 1-cell border on each side (absorbing boundary)
      cols = Math.floor(W / SCALE) + 2;
      rows = Math.floor(H / SCALE) + 2;
      curr = new Float32Array(cols * rows);
      prev = new Float32Array(cols * rows);
      img  = null; // recreated in draw()
    };
    init();
    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    // Push a "water drop" disturbance into the grid at CSS coordinates
    const disturb = (cssX: number, cssY: number) => {
      const cx = Math.floor(cssX / SCALE) + 1;
      const cy = Math.floor(cssY / SCALE) + 1;
      const r  = 5; // radius in cells
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d > r) continue;
          const nx = cx + dx, ny = cy + dy;
          if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1) {
            curr[ny * cols + nx] = 350 * (1 - d / r);
          }
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      disturb(e.clientX - rect.left, e.clientY - rect.top);
    };
    canvas.addEventListener("mousemove", onMove);

    const draw = () => {
      // ── Pond ripple physics ──────────────────────────
      // Each cell = average of 4 neighbours in previous frame, minus own previous
      // value. Multiplied by damping to bleed energy. Creates circular wave rings.
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const i = y * cols + x;
          curr[i] = (
            prev[i - 1] + prev[i + 1] +
            prev[i - cols] + prev[i + cols]
          ) / 2 - curr[i];
          curr[i] *= DAMP;
        }
      }
      // Swap buffers
      const tmp = prev; prev = curr; curr = tmp;

      // ── Pixel rendering via ImageData (avoids per-rect fillStyle overhead) ──
      if (!img || img.width !== W || img.height !== H) {
        img = ctx.createImageData(W, H);
      }
      const data = img.data;

      for (let gy = 0; gy < rows - 2; gy++) {
        for (let gx = 0; gx < cols - 2; gx++) {
          const ci = (gy + 1) * cols + (gx + 1);
          const h  = curr[ci];

          // Surface slope between neighbours → specular highlight intensity
          const dX   = curr[ci + 1]    - curr[ci - 1];
          const dY   = curr[ci + cols] - curr[ci - cols];
          const spec = Math.min(1, Math.sqrt(dX * dX + dY * dY) / 340);

          // Height normalised to [-1, 1] — crest vs trough
          const hn    = Math.max(-1, Math.min(1, h / 280));

          // Combined brightness: height pushes it bright/dark, slope adds white sheen
          const blend = hn * 0.5 + spec * 0.9;

          // Color mapping:
          //   blend ≈ -0.5  → trough: dark blue, almost transparent (hero shows through)
          //   blend ≈  0    → flat:   clear pool blue, 28% opacity
          //   blend ≈ +0.5  → crest:  light blue, ~60% opacity
          //   blend ≈ +1.4  → steep slope: pure white specular, ~100% opaque
          const R = Math.round(Math.max(0, Math.min(255, 110 + blend * 145)));
          const G = Math.round(Math.max(0, Math.min(255, 185 + blend * 70)));
          const B = 255;
          const A = Math.round(Math.max(0, Math.min(255, (0.26 + blend * 0.65) * 255)));

          // Write this cell's colour to every pixel in the SCALE × SCALE block
          const px0 = gx * SCALE, py0 = gy * SCALE;
          for (let py = 0; py < SCALE && py0 + py < H; py++) {
            for (let px = 0; px < SCALE && px0 + px < W; px++) {
              const idx = ((py0 + py) * W + (px0 + px)) * 4;
              data[idx]     = R;
              data[idx + 1] = G;
              data[idx + 2] = B;
              data[idx + 3] = A;
            }
          }
        }
      }

      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

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
      className={`absolute inset-0 z-20 h-full w-full cursor-crosshair ${
        isFinePointer ? "" : "pointer-events-none opacity-0"
      }`}
    />
  );
}
