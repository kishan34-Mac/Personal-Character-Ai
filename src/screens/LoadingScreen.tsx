import { useEffect, useRef, useState } from 'react';

const MESSAGES = [
  'Meeting your character...',
  'Shaping their world...',
  'Writing their story...',
  'Almost born...',
];

export default function LoadingScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [msgIndex, setMsgIndex] = useState(0);

  // Message cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const polyCount = 3;
    const polys = Array.from({ length: polyCount }, (_, pi) => ({
      verts: 7 + pi,
      baseRadius: 120 + pi * 60,
      cx: w / 2,
      cy: h / 2,
      phase: pi * 1.5,
    }));

    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.005;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(t * 0.3);
      ctx.translate(-w / 2, -h / 2);

      polys.forEach((poly) => {
        ctx.beginPath();
        for (let v = 0; v < poly.verts; v++) {
          const angle = (v / poly.verts) * Math.PI * 2;
          const r = poly.baseRadius + Math.sin(t * 2 + v + poly.phase) * 30 + Math.cos(t * 1.5 + v) * 20;
          const px = poly.cx + Math.cos(angle) * r;
          const py = poly.cy + Math.sin(angle) * r;
          if (v === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(240,237,232,0.02)';
        ctx.strokeStyle = 'rgba(240,237,232,0.06)';
        ctx.lineWidth = 0.5;
        ctx.fill();
        ctx.stroke();
      });

      ctx.restore();
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', minHeight: '100svh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(32px,5vw,52px)',
            color: '#f0ede8',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            textAlign: 'center',
          }}
        >
          {MESSAGES[msgIndex]}
        </h1>

        <div style={{ width: 200, height: 1, background: 'rgba(240,237,232,0.1)' }} />

        <div style={{ width: 200, position: 'relative', height: 1, background: 'rgba(240,237,232,0.06)' }}>
          <div
            style={{
              height: 1,
              background: '#f0ede8',
              animation: 'progressFill 12s linear forwards',
            }}
          />
        </div>

        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(240,237,232,0.15)', letterSpacing: '0.1em' }}>
          Powered by Gemini AI
        </div>
      </div>
    </div>
  );
}
