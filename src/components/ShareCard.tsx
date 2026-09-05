import { forwardRef } from 'react';
import type { PersonaData } from '@/context/PersonaContext';

const ShareCard = forwardRef<HTMLDivElement, { persona: PersonaData }>(
  ({ persona }, ref) => {
    const accent = persona.accentColor;
    return (
      <div
        ref={ref}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          zIndex: -1,
          width: '640px',
          height: '380px',
          background: '#080808',
          border: '1px solid rgba(240,237,232,0.1)',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'DM Sans, sans-serif',
          color: '#f0ede8',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: 12, color: 'rgba(240,237,232,0.3)', letterSpacing: '0.2em', marginBottom: 4 }}>
              PERSONA
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(240,237,232,0.2)', letterSpacing: '0.15em' }}>
              {persona.archetype}
            </div>
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: accent, letterSpacing: '0.1em', border: `1px solid ${accent}4d`, padding: '4px 12px', borderRadius: 2 }}>
            {persona.matchPercent}% YOU
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(240,237,232,0.08)' }} />

        {/* Centre */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 48, color: '#f0ede8', letterSpacing: '-2px' }}>
            {persona.name}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 16, color: 'rgba(240,237,232,0.5)', lineHeight: 1.5, maxWidth: 500 }}>
            "{persona.truth}"
          </div>
        </div>

        {/* Traits row */}
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'SUPERPOWER', value: persona.superpower },
            { label: 'FLAW', value: persona.flaw },
            { label: 'QUIRK', value: persona.quirk },
            { label: 'ARCHETYPE', value: persona.archetype },
          ].map((t) => (
            <div key={t.label} style={{ flex: 1 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'rgba(240,237,232,0.25)', letterSpacing: '0.15em', marginBottom: 4 }}>
                {t.label}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(240,237,232,0.6)', lineHeight: 1.4 }}>
                {t.value.length > 40 ? t.value.slice(0, 37) + '…' : t.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'rgba(240,237,232,0.08)' }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(240,237,232,0.2)' }}>
            Created with PERSONA
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(240,237,232,0.15)' }}>
            persona.app
          </div>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;
