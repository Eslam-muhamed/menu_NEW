import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X as CloseIcon, Hash } from 'lucide-react';
import XOGame from '@/components/features/XOGame';
import SpyGame from '@/components/features/SpyGame';

type ActiveGame = 'xo' | 'spy' | null;

const DARK = '#0c0c1e';
const GOLD = '#f0c862';
const GOLD2 = '#c9993d';

/* ── Game Picker Sheet ─────────────────────────────────── */
function GamePicker({ onSelect, onClose }: {
  onSelect: (game: 'xo' | 'spy') => void;
  onClose: () => void;
}) {
  const games = [
    {
      id: 'xo' as const,
      emoji: '✕◯',
      title: 'X O',
      desc: 'لاعبين يتبارزوا في لعبة X O',
      gradient: 'linear-gradient(135deg,rgba(240,200,98,0.14),rgba(201,153,61,0.05))',
      border: 'rgba(201,153,61,0.28)',
      clr: GOLD,
    },
    {
      id: 'spy' as const,
      emoji: '🕵️',
      title: 'الجاسوس',
      desc: 'ابعد 3–8 لاعبين وكشف الجاسوس المختبي',
      gradient: 'linear-gradient(135deg,rgba(248,113,113,0.13),rgba(248,113,113,0.04))',
      border: 'rgba(248,113,113,0.28)',
      clr: '#f87171',
    },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ background: 'rgba(7,7,15,0.88)', backdropFilter: 'blur(16px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="relative w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{
          background: DARK,
          border: '1px solid rgba(201,153,61,0.18)',
          boxShadow: '0 0 60px rgba(201,153,61,0.08), 0 -20px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Gold line */}
        <div style={{ height: '3px', background: `linear-gradient(90deg,transparent,${GOLD2} 28%,${GOLD} 50%,${GOLD2} 72%,transparent)` }} />

        {/* Handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.12)' }} />
        </div>

        {/* Header */}
        <div className="pt-5 pb-4 px-5 text-center" dir="rtl">
          <h2 style={{ color: '#f0ece4', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>
            العاب الانتظار 🎮
          </h2>
          <p style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '12px' }}>
            اختار لعبة تلعبها وانت بتستنى طلبك!
          </p>
        </div>

        {/* Game cards */}
        <div className="px-4 pb-6 flex flex-col gap-3" dir="rtl">
          {games.map((g) => (
            <motion.button
              key={g.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(g.id)}
              style={{
                width: '100%', padding: '18px 20px', borderRadius: '18px',
                border: `1.5px solid ${g.border}`,
                background: g.gradient,
                cursor: 'pointer', textAlign: 'right',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}
            >
              {/* Emoji icon */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.05)',
                fontSize: g.id === 'xo' ? '18px' : '26px',
                fontFamily: g.id === 'xo' ? 'monospace' : undefined,
                fontWeight: g.id === 'xo' ? 900 : undefined,
                color: g.id === 'xo' ? g.clr : undefined,
                letterSpacing: g.id === 'xo' ? '-2px' : undefined,
              }}>
                {g.emoji}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: g.clr, fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '16px', marginBottom: '2px' }}>
                  {g.title}
                </p>
                <p style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '12px' }}>
                  {g.desc}
                </p>
              </div>

              {/* Arrow */}
              <div style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 left-4 z-30 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.07)', color: '#7a7268', border: 'none', cursor: 'pointer' }}
          aria-label="إغلاق"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Main button ───────────────────────────────────────── */
export default function XOButton() {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  const handleSelect = (game: 'xo' | 'spy') => {
    setPickerOpen(false);
    setTimeout(() => setActiveGame(game), 180);
  };

  const handleClose = () => {
    setPickerOpen(false);
    setActiveGame(null);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setPickerOpen(true); setActiveGame(null); }}
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
        aria-label="العاب الانتظار"
      >
        <Hash className="w-[22px] h-[22px]" style={{ color: GOLD }} />
      </button>

      {/* Picker */}
      <AnimatePresence>
        {pickerOpen && (
          <GamePicker
            key="picker"
            onSelect={handleSelect}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* XO Game */}
      <AnimatePresence>
        {activeGame === 'xo' && (
          <XOGame key="xo-game" onClose={handleClose} />
        )}
      </AnimatePresence>

      {/* Spy Game */}
      <AnimatePresence>
        {activeGame === 'spy' && (
          <SpyGame key="spy-game" onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  );
}