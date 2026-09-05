import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePersona } from '@/context/PersonaContext';

export default function LandingScreen() {
  const { goToScreen } = usePersona();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.1 + 0.05,
    }));

    const blobs = Array.from({ length: 3 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 200 + 200,
    }));

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);

      // Blobs
      blobs.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0 || b.x > w) b.vx *= -1;
        if (b.y < 0 || b.y > h) b.vy *= -1;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, 'rgba(255,255,255,0.02)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.fillStyle = `rgba(240,237,232,${p.opacity})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // GSAP stagger
  useEffect(() => {
    if (!containerRef.current) return;
    const children = Array.from(containerRef.current.children);
    gsap.fromTo(
      children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.2 }
    );
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', minHeight: '100svh', background: '#080808', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 10,
          width: 'min(calc(100vw - 48px), 520px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 40,
        }}
      >
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(240,237,232,0.3)', letterSpacing: '0.25em' }}>
          CHARACTER GENERATOR
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 'clamp(60px, 14vw, 140px)',
            letterSpacing: '-4px',
            lineHeight: 1.0,
            paddingBottom: 8,
            background: 'linear-gradient(160deg, #f0ede8 0%, rgba(240,237,232,0.3) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          PERSONA
        </h1>

        <div style={{ width: 60, height: 1, background: 'rgba(240,237,232,0.15)' }} />

        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(18px,2.5vw,26px)',
            color: 'rgba(240,237,232,0.6)',
            letterSpacing: '-0.5px',
            lineHeight: 1.4,
          }}
        >
          Three things about you.<br />
          One character who carries them all.
        </div>

        <button
          onClick={() => goToScreen('input')}
          style={{
            background: '#f0ede8',
            color: '#080808',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: 15,
            padding: '14px 40px',
            borderRadius: 2,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Begin →
        </button>

        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'rgba(240,237,232,0.2)', letterSpacing: '0.05em' }}>
          Takes 15 seconds. Stays with you longer.
        </div>
      </div>
    </div>
  );
}
