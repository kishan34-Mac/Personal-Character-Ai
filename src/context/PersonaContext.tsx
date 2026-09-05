import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type PersonaStats = {
  courage: number;
  wisdom: number;
  power: number;
  mystery: number;
  heart: number;
};

export type PersonaData = {
  name: string;
  age: number;
  world: string;
  origin: string;
  superpower: string;
  flaw: string;
  quirk: string;
  truth: string;
  story: string;
  accentColor: string;
  stats: PersonaStats;
  archetype: string;
  matchPercent: number;
};

export type Screen = 'landing' | 'input' | 'loading' | 'result';

type Inputs = { fear: string; dream: string; habit: string };

type PersonaContextValue = {
  screen: Screen;
  inputs: Inputs;
  persona: PersonaData | null;
  error: string | null;
  isLoading: boolean;
  toast: string | null;
  setInputs: (field: keyof Inputs, value: string) => void;
  goToScreen: (screen: Screen) => void;
  generatePersona: () => Promise<void>;
  reset: () => void;
  showToast: (message: string) => void;
};

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('landing');
  const [inputs, setInputsState] = useState<Inputs>({ fear: '', dream: '', habit: '' });
  const [persona, setPersona] = useState<PersonaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const setInputs = useCallback((field: keyof Inputs, value: string) => {
    setInputsState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const goToScreen = useCallback((s: Screen) => setScreen(s), []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  const generatePersona = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Character generation failed.');

      document.documentElement.style.setProperty('--char-accent', data.persona.accentColor);
      setPersona(data.persona as PersonaData);
      setScreen('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setScreen('input');
    } finally {
      setIsLoading(false);
    }
  }, [inputs]);

  const reset = useCallback(() => {
    setPersona(null);
    setInputsState({ fear: '', dream: '', habit: '' });
    setError(null);
    document.documentElement.style.removeProperty('--char-accent');
    setScreen('input');
  }, []);

  return (
    <PersonaContext.Provider
      value={{ screen, inputs, persona, error, isLoading, toast, setInputs, goToScreen, generatePersona, reset, showToast }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
  return ctx;
}
