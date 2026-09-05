import { useEffect, useRef } from 'react';
import type { PersonaData } from '@/context/PersonaContext';

export default function AbstractPortrait({ persona, size = 300 }: { persona: PersonaData; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const seed = persona.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rng = (n: number) => ((seed * 1664525 + 1013904223 + n) & 0xffffffff) / 0xffffffff;

    const cx = size / 2;
    const cy = size / 2;
    const accent = persona.accentColor;

    // 1. Background
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, size, size);

    // 2. Geometric layers
    const stats = persona.stats;
    const shapeCount = 5;
    for (let i = 0; i < shapeCount; i++) {
      const shapeSize = rng(i) * size * 0.6 + size * 0.1;
      const ox = cx + (rng(i + 50) - 0.5) * size * 0.4;
      const oy = cy + (rng(i + 60) - 0.5) * size * 0.4;
      const fillAlpha = rng(i + 10) * 0.3 + 0.05;
      const strokeAlpha = rng(i + 20) * 0.4 + 0.1;
      const lw = rng(i + 30) * 1 + 0.5;

      ctx.fillStyle = hexToRgba(accent, fillAlpha);
      ctx.strokeStyle = hexToRgba(accent, strokeAlpha);
      ctx.lineWidth = lw;
      ctx.beginPath();

      if (stats.courage > 70) {
        // triangle
        const r = shapeSize / 2;
        for (let v = 0; v < 3; v++) {
          const angle = (v / 3) * Math.PI * 2 - Math.PI / 2;
          const px = ox + Math.cos(angle) * r;
          const py = oy + Math.sin(angle) * r;
          if (v === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (stats.wisdom > 70) {
        // spiral/circle
        const r = shapeSize / 2;
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
      } else if (stats.mystery > 70) {
        // irregular polygon
        const verts = 5 + Math.floor(rng(i + 40) * 4);
        for (let v = 0; v < verts; v++) {
          const angle = (v / verts) * Math.PI * 2;
          const r = (shapeSize / 2) * (0.6 + rng(i + v) * 0.6);
          const px = ox + Math.cos(angle) * r;
          const py = oy + Math.sin(angle) * r;
          if (v === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (stats.heart > 70) {
        // curved organic
        const r = shapeSize / 2;
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const wave = 1 + Math.sin(a * 3) * 0.2;
          const px = ox + Math.cos(a) * r * wave;
          const py = oy + Math.sin(a) * r * wave;
          if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (stats.power > 70) {
        // radial burst
        const rays = 8;
        const r = shapeSize / 2;
        for (let v = 0; v < rays * 2; v++) {
          const angle = (v / (rays * 2)) * Math.PI * 2;
          const radius = v % 2 === 0 ? r : r * 0.4;
          const px = ox + Math.cos(angle) * radius;
          const py = oy + Math.sin(angle) * radius;
          if (v === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else {
        // default circle
        ctx.arc(ox, oy, shapeSize / 2, 0, Math.PI * 2);
      }

      ctx.fill();
      ctx.stroke();
    }

    // 3. Grain texture
    for (let i = 0; i < 800; i++) {
      const px = rng(i + 1000) * size;
      const py = rng(i + 2000) * size;
      ctx.fillStyle = `rgba(255,255,255,${rng(i + 3000) * 0.04 + 0.02})`;
      ctx.fillRect(px, py, 1, 1);
    }

    // 4. Central void
    ctx.fillStyle = '#080808';
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // 5. Name initial
    ctx.font = `${size * 0.12}px 'Playfair Display', serif`;
    ctx.fillStyle = hexToRgba(accent, 0.15);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(persona.name[0] || '?', cx, cy + size * 0.05);

    // 6. Outer vignette
    const grad = ctx.createRadialGradient(cx, cy, size * 0.2, cx, cy, size * 0.7);
    grad.addColorStop(0, 'rgba(8,8,8,0)');
    grad.addColorStop(1, 'rgba(8,8,8,0.6)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }, [persona, size]);

  return <canvas ref={canvasRef} />;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) || 240;
  const g = parseInt(h.substring(2, 4), 16) || 237;
  const b = parseInt(h.substring(4, 6), 16) || 232;
  return `rgba(${r},${g},${b},${alpha})`;
}
