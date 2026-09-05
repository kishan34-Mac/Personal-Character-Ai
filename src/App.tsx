import { AnimatePresence, motion } from 'framer-motion';
import { PersonaProvider, usePersona } from '@/context/PersonaContext';
import CursorDot from '@/components/CursorDot';
import GrainOverlay from '@/components/GrainOverlay';
import Toast from '@/components/Toast';
import LandingScreen from '@/screens/LandingScreen';
import InputScreen from '@/screens/InputScreen';
import LoadingScreen from '@/screens/LoadingScreen';
import ResultScreen from '@/screens/ResultScreen';

function ScreenRouter() {
  const { screen } = usePersona();

  const screenMap = {
    landing: LandingScreen,
    input: InputScreen,
    loading: LoadingScreen,
    result: ResultScreen,
  };

  const Current = screenMap[screen];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <Current />
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <PersonaProvider>
      <GrainOverlay />
      <CursorDot />
      <ScreenRouter />
      <Toast />
    </PersonaProvider>
  );
}

export default App;
