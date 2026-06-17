"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

type Drop = { x: number; y: number; born: number };

// How long (ms) the water takes to flow back after the cursor leaves
const LIFE   = 1800;
// Radius of the reveal circle at each cursor position
const RADIUS = 110;

export default function WaterLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drops     = useRef<Drop[]>([]);
  const frame     = useRef<number>(0);
  const isFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    if (!isFinePointer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      drops.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        born: performance.now(),
      });
      // Cap trail length
      if (drops.current.length > 500) drops.current.splice(0, 100);
    };

    canvas.addEventListener("mousemove", onMove);

    const draw = () => {
      const now = performance.now();

      ctx.clearRect(0, 0, W, H);

      // ── Water surface — blue-tinted frosted overlay ──
      ctx.fillStyle = "rgba(210, 228, 255, 0.78)";
      ctx.fillRect(0, 0, W, H);

      // Subtle horizontal shimmer lines — light refracting off water surface
      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.strokeStyle = "rgb(80 140 255)";
      ctx.lineWidth = 1;
      const t = now * 0.00035;
      for (let y = 0; y < H; y += 14) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 5) {
          const wy = y + Math.sin(x * 0.025 + t + y * 0.012) * 5
                       + Math.sin(x * 0.06  - t * 1.3)       * 2;
          x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy);
        }
        ctx.stroke();
      }
      ctx.restore();

      // ── Punch transparent holes where the cursor has passed ──
      ctx.globalCompositeOperation = "destination-out";

      const list = drops.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const d   = list[i];
        const age = now - d.born;
        if (age > LIFE) { list.splice(i, 1); continue; }

        const progress = age / LIFE;
        // Slow to start fading, then accelerates — feels like water tension
        const alpha = 1 - Math.pow(progress, 1.7);
        const r     = RADIUS * (1 - progress * 0.12);

        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r);
        g.addColorStop(0,    `rgba(0,0,0,${alpha})`);
        g.addColorStop(0.45, `rgba(0,0,0,${alpha * 0.95})`);
        g.addColorStop(0.75, `rgba(0,0,0,${alpha * 0.4})`);
        g.addColorStop(1,    "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      frame.current = requestAnimationFrame(draw);
    };

    frame.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
    };
  }, [isFinePointer]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // Hidden on touch — mobile users see the hero directly (better UX)
      className={`absolute inset-0 z-20 h-full w-full cursor-none ${
        isFinePointer ? "" : "pointer-events-none opacity-0"
      }`}
    />
  );
}
