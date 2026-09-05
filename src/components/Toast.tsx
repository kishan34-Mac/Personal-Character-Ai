import { AnimatePresence, motion } from 'framer-motion';
import { usePersona } from '@/context/PersonaContext';

export default function Toast() {
  const { toast } = usePersona();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            x: '-50%',
            zIndex: 9000,
            background: '#0f0f0f',
            border: '1px solid rgba(240,237,232,0.1)',
            borderRadius: 2,
            padding: '10px 20px',
            fontFamily: 'DM Mono, monospace',
            fontSize: 12,
            color: '#f0ede8',
          }}
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
