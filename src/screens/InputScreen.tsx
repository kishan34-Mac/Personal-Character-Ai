import { useState } from 'react';
import { usePersona } from '@/context/PersonaContext';

type FieldKey = 'fear' | 'dream' | 'habit';

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: 'fear', label: 'MY BIGGEST FEAR' },
  { key: 'dream', label: 'MY SECRET DREAM' },
  { key: 'habit', label: 'MY STRANGEST HABIT' },
];

export default function InputScreen() {
  const { inputs, setInputs, error, goToScreen, generatePersona, isLoading } = usePersona();
  const [focused, setFocused] = useState<FieldKey | null>(null);

  const allFilled = FIELDS.every((f) => inputs[f.key].trim().length >= 3);

  const handleGenerate = () => {
    if (!allFilled || isLoading) return;
    goToScreen('loading');
    generatePersona();
  };

  return (
    <div style={{ position: 'relative', width: '100vw', minHeight: '100svh', background: '#080808', overflow: 'hidden' }}>
      <button
        onClick={() => goToScreen('landing')}
        style={{
          position: 'absolute',
          top: 32,
          left: 40,
          zIndex: 10,
          fontFamily: 'DM Mono, monospace',
          fontSize: 12,
          color: 'rgba(240,237,232,0.3)',
        }}
      >
        ← Back
      </button>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 10,
          width: 'min(calc(100vw - 48px), 560px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(240,237,232,0.3)', letterSpacing: '0.2em', marginBottom: 16 }}>
            YOUR THREE THINGS
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(42px,5vw,64px)',
              color: '#f0ede8',
              letterSpacing: '-2px',
              lineHeight: 1.05,
            }}
          >
            Who are you,<br />
            really?
          </h1>
        </div>

        {FIELDS.map((field) => {
          const value = inputs[field.key];
          const isFocused = focused === field.key;
          const isUp = isFocused || value.length > 0;
          return (
            <div
              key={field.key}
              style={{
                position: 'relative',
                borderBottom: `1px solid ${isFocused ? 'rgba(240,237,232,0.4)' : 'rgba(240,237,232,0.1)'}`,
                padding: '28px 0',
                transition: 'border-color 0.6s ease',
              }}
            >
              <label
                style={{
                  position: 'absolute',
                  top: isUp ? 12 : 28,
                  left: 0,
                  fontFamily: 'DM Mono, monospace',
                  fontSize: isUp ? 9 : 10,
                  color: 'rgba(240,237,232,0.25)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  transition: 'all 0.4s ease',
                  pointerEvents: 'none',
                }}
              >
                {field.label}
              </label>
              <input
                type="text"
                maxLength={120}
                value={value}
                onChange={(e) => setInputs(field.key, e.target.value)}
                onFocus={() => setFocused(field.key)}
                onBlur={() => setFocused(null)}
                placeholder=""
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  paddingTop: 28,
                  paddingBottom: 4,
                  fontFamily: 'DM Mono, monospace',
                  fontWeight: 400,
                  fontSize: 'clamp(16px,2.5vw,22px)',
                  color: '#f0ede8',
                  letterSpacing: '-0.5px',
                  caretColor: '#f0ede8',
                }}
              />
              {(isFocused || value.length > 0) && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 0,
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 10,
                    color: 'rgba(240,237,232,0.2)',
                  }}
                >
                  {value.length} / 120
                </span>
              )}
            </div>
          );
        })}

        {error && (
          <div
            style={{
              marginTop: 16,
              fontFamily: 'DM Mono, monospace',
              fontSize: 12,
              color: 'rgba(240,237,232,0.5)',
              borderLeft: '2px solid rgba(240,237,232,0.3)',
              paddingLeft: 12,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(240,237,232,0.2)' }}>
            All three fields required
          </span>
          <button
            onClick={handleGenerate}
            disabled={!allFilled || isLoading}
            style={
              allFilled && !isLoading
                ? {
                    background: '#f0ede8',
                    color: '#080808',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    padding: '12px 28px',
                    borderRadius: 2,
                  }
                : {
                    background: 'transparent',
                    color: 'rgba(240,237,232,0.2)',
                    border: '1px solid rgba(240,237,232,0.08)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    padding: '12px 28px',
                    borderRadius: 2,
                  }
            }
          >
            Create my character →
          </button>
        </div>
      </div>
    </div>
  );
}
