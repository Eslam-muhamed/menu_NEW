import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Hash } from 'lucide-react';
import XOGame from '@/components/features/XOGame';

export default function XOButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed z-40 flex items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
        style={{
          bottom: '5.4rem',
          left: '1rem',
          width: '52px',
          height: '52px',
          background: 'linear-gradient(135deg, rgba(14,14,32,0.97), rgba(24,24,52,0.97))',
          border: '1.5px solid rgba(201,153,61,0.38)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.55), 0 0 16px rgba(201,153,61,0.1)',
          cursor: 'pointer',
        }}
        aria-label="العب X O"
      >
        <Hash className="w-[22px] h-[22px]" style={{ color: '#f0c862' }} />
      </button>

      <AnimatePresence>
        {open && <XOGame key="xo-game" onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}