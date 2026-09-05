import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import html2canvas from 'html2canvas';
import { usePersona } from '@/context/PersonaContext';
import AbstractPortrait from '@/components/AbstractPortrait';
import RadarChart from '@/components/RadarChart';
import ShareCard from '@/components/ShareCard';

export default function ResultScreen() {
  const { persona, reset, goToScreen, showToast } = usePersona();
  const storyRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [displayedStory, setDisplayedStory] = useState('');
  const [storyStarted, setStoryStarted] = useState(false);
  const [storyComplete, setStoryComplete] = useState(false);

  // Apply accent color on mount
  useEffect(() => {
    if (persona) {
      document.documentElement.style.setProperty('--char-accent', persona.accentColor);
    }
  }, [persona]);

  // GSAP name reveal
  useEffect(() => {
    if (!nameRef.current || !persona) return;
    const name = persona.name;
    nameRef.current.innerHTML = '';
    const chars = name.split('').map((ch) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.display = 'inline-block';
      nameRef.current!.appendChild(span);
      return span;
    });
    gsap.fromTo(
      chars,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out', delay: 0.2 }
    );
  }, [persona]);

  // Typewriter on scroll into view
  useEffect(() => {
    if (!storyRef.current || !persona) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !storyStarted) {
          setStoryStarted(true);
          let idx = 0;
          const fullText = persona.story;
          const interval = setInterval(() => {
            idx++;
            setDisplayedStory(fullText.slice(0, idx));
            if (idx >= fullText.length) {
              clearInterval(interval);
              setStoryComplete(true);
            }
          }, 18);
          return () => clearInterval(interval);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(storyRef.current);
    return () => observer.disconnect();
  }, [persona, storyStarted]);

  if (!persona) return null;

  const accent = persona.accentColor;

  const triggerDownload = () => {
    if (!shareCardRef.current) return;
    html2canvas(shareCardRef.current, {
      backgroundColor: '#080808',
      scale: 2,
      useCORS: true,
      logging: false,
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'my-persona.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Card downloaded');
    }).catch(() => {
      showToast('Download failed. Try again.');
    });
  };

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const traits = [
    { label: 'SUPERPOWER', value: persona.superpower },
    { label: 'FATAL FLAW', value: persona.flaw },
    { label: 'LEGENDARY QUIRK', value: persona.quirk },
    { label: 'LIVES BY', value: persona.truth },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100svh', background: '#080808', overflowY: 'auto' }}>
      {/* PART A — HERO */}
      <section
        style={{
          minHeight: '100svh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${hexToRgba(accent, 0.04)} 0%, transparent 70%)`,
          }}
        />

        <div
          className="result-hero-grid"
          style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '80px 48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* LEFT COLUMN */}
          <div>
            <div
              style={{
                display: 'inline-block',
                marginBottom: 24,
                fontFamily: 'DM Mono, monospace',
                fontSize: 11,
                color: accent,
                letterSpacing: '0.1em',
                border: `1px solid ${hexToRgba(accent, 0.3)}`,
                padding: '4px 14px',
                borderRadius: 2,
              }}
            >
              {persona.matchPercent}% you
            </div>

            <div
              style={{
                marginBottom: 12,
                fontFamily: 'DM Mono, monospace',
                fontSize: 12,
                color: 'rgba(240,237,232,0.35)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              {persona.archetype}
            </div>

            <h1
              ref={nameRef}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(48px,6vw,80px)',
                color: '#f0ede8',
                letterSpacing: '-2px',
                lineHeight: 1.0,
              }}
            >
              {persona.name}
            </h1>

            <div
              style={{
                marginTop: 16,
                marginBottom: 32,
                fontFamily: 'DM Mono, monospace',
                fontWeight: 300,
                fontSize: 13,
                color: 'rgba(240,237,232,0.4)',
                letterSpacing: '-0.2px',
                lineHeight: 1.6,
              }}
            >
              {persona.age} years old · {persona.world}
            </div>

            <div style={{ height: 1, background: 'rgba(240,237,232,0.1)', width: '100%', marginBottom: 32 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {traits.map((t) => (
                <div key={t.label}>
                  <div
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: 10,
                      color: accent,
                      letterSpacing: '0.15em',
                      marginBottom: 4,
                    }}
                  >
                    {t.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize: 15,
                      color: 'rgba(240,237,232,0.7)',
                      lineHeight: 1.6,
                    }}
                  >
                    {t.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 48, display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={scrollToStory}
                style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'rgba(240,237,232,0.3)' }}
              >
                Read their story ↓
              </button>
              <div style={{ width: 1, height: 14, background: 'rgba(240,237,232,0.15)' }} />
              <button
                onClick={triggerDownload}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  color: '#080808',
                  background: '#f0ede8',
                  padding: '8px 20px',
                  borderRadius: 2,
                }}
              >
                Download card
              </button>
              <button
                onClick={() => { reset(); goToScreen('input'); }}
                style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'rgba(240,237,232,0.3)' }}
              >
                Start over
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
            <div style={{ border: '1px solid rgba(240,237,232,0.08)', borderRadius: 4, boxShadow: `0 0 60px ${hexToRgba(accent, 0.08)}` }}>
              <AbstractPortrait persona={persona} size={260} />
            </div>

            <RadarChart stats={persona.stats} accentColor={accent} size={240} />

            <div style={{ textAlign: 'center', maxWidth: 280 }}>
              <div
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: 10,
                  color: 'rgba(240,237,232,0.25)',
                  letterSpacing: '0.15em',
                  marginBottom: 8,
                }}
              >
                ORIGIN
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: 13,
                  color: 'rgba(240,237,232,0.45)',
                  lineHeight: 1.7,
                  textAlign: 'center',
                }}
              >
                {persona.origin}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PART B — STORY */}
      <section
        ref={storyRef}
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0f0f',
          borderTop: '1px solid rgba(240,237,232,0.06)',
        }}
      >
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 48px' }}>
          <div
            style={{
              marginBottom: 24,
              fontFamily: 'DM Mono, monospace',
              fontSize: 11,
              color: 'rgba(240,237,232,0.25)',
              letterSpacing: '0.2em',
            }}
          >
            OPENING SCENE
          </div>

          <h2
            style={{
              marginBottom: 40,
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 36,
              color: '#f0ede8',
              letterSpacing: '-1px',
            }}
          >
            The day it begins.
          </h2>

          <div style={{ height: 1, background: 'rgba(240,237,232,0.08)', marginBottom: 40 }} />

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(16px,1.8vw,19px)',
              color: 'rgba(240,237,232,0.75)',
              lineHeight: 1.9,
              letterSpacing: '-0.2px',
              minHeight: '20em',
            }}
          >
            {displayedStory}
            {storyStarted && !storyComplete && <span className="story-caret">&nbsp;</span>}
          </p>

          <div style={{ marginTop: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 16,
                color: 'rgba(240,237,232,0.35)',
                letterSpacing: '-0.3px',
              }}
            >
              "{persona.truth}"
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <button
                onClick={() => { reset(); goToScreen('input'); }}
                style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'rgba(240,237,232,0.3)' }}
              >
                Try again
              </button>
              <button
                onClick={triggerDownload}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  color: '#080808',
                  background: '#f0ede8',
                  padding: '8px 20px',
                  borderRadius: 2,
                }}
              >
                Download card
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden share card */}
      <ShareCard ref={shareCardRef} persona={persona} />

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          .result-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding: 60px 24px !important;
          }
          .result-hero-grid > div:last-child {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) || 240;
  const g = parseInt(h.substring(2, 4), 16) || 237;
  const b = parseInt(h.substring(4, 6), 16) || 232;
  return `rgba(${r},${g},${b},${alpha})`;
}
