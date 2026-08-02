import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X as CloseIcon, Eye, EyeOff, ChevronRight, Play, RotateCcw, Clock } from 'lucide-react';

/* ══════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════ */
const DARK = '#0c0c1e';
const GOLD = '#f0c862';
const GOLD2 = '#c9993d';
const SPY_CLR = '#f87171';

const LOCATIONS: string[] = [
  'المطار ✈️', 'الشاطئ 🏖️', 'المستشفى 🏥', 'المدرسة 🏫',
  'المطعم 🍽️', 'البنك 🏦', 'الفندق 🏨', 'السينما 🎬',
  'الملعب ⚽', 'الحديقة 🌳', 'المسجد 🕌', 'الكافيه ☕',
  'محطة القطار 🚂', 'السوبرماركت 🛒', 'الصيدلية 💊', 'المكتبة 📚',
  'المسبح 🏊', 'الصالة الرياضية 💪', 'المطبخ 🍳', 'القارب 🚢',
  'الطائرة 🛩️', 'اللوناباك 🎡', 'السيرك 🎪', 'القصر 🏰',
  'المخبز 🥐', 'الحلاق ✂️', 'المصنع 🏭', 'القرية 🏡',
];

const GAME_DURATION = 8 * 60; // 8 minutes in seconds

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
type Phase = 'setup' | 'reveal' | 'playing' | 'vote' | 'result';

interface Player {
  name: string;
  isSpy: boolean;
  revealed: boolean;
}

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/* ══════════════════════════════════════════════════════════
   SETUP PHASE
══════════════════════════════════════════════════════════ */
function SetupPhase({ onStart }: { onStart: (names: string[]) => void }) {
  const [count, setCount] = useState(4);
  const [names, setNames] = useState<string[]>(Array(8).fill(''));

  const inp: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    color: '#f0ece4',
    fontFamily: "'Cairo', sans-serif",
    borderRadius: '12px',
    padding: '10px 14px',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
  };

  const handleStart = () => {
    const finalNames = names
      .slice(0, count)
      .map((n, i) => n.trim() || `لاعب ${i + 1}`);
    onStart(finalNames);
  };

  return (
    <div className="px-5 pb-6" dir="rtl">
      <p className="text-sm text-center mb-5" style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}>
        لاعب واحد هيبقى الجاسوس ومش هيعرف المكان!
      </p>

      {/* Player count selector */}
      <div className="mb-5">
        <p className="text-xs font-semibold mb-3" style={{ color: GOLD, fontFamily: "'Cairo', sans-serif" }}>
          عدد اللاعبين
        </p>
        <div className="flex gap-2 flex-wrap">
          {[3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              style={{
                width: '42px', height: '42px', borderRadius: '12px',
                fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer',
                background: count === n ? `linear-gradient(135deg,${GOLD2},${GOLD})` : 'rgba(255,255,255,0.05)',
                color: count === n ? '#07070f' : '#7a7268',
                transition: 'all 0.2s',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Names */}
      <div className="mb-6 flex flex-col gap-2" style={{ maxHeight: '240px', overflowY: 'auto' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-bold w-5 text-center" style={{ color: GOLD2 }}>{i + 1}</span>
            <input
              style={inp}
              placeholder={`اسم اللاعب ${i + 1}`}
              value={names[i]}
              onChange={(e) => {
                const n = [...names];
                n[i] = e.target.value;
                setNames(n);
              }}
              maxLength={16}
            />
          </div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleStart}
        style={{
          width: '100%', padding: '15px', borderRadius: '16px',
          fontWeight: 700, fontSize: '15px', fontFamily: "'Cairo', sans-serif",
          border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg,${GOLD2},${GOLD})`,
          color: '#07070f',
          boxShadow: '0 6px 24px rgba(201,153,61,0.28)',
        }}
      >
        ابدأ اللعبة! 🕵️
      </motion.button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   REVEAL PHASE — each player taps to see their card
══════════════════════════════════════════════════════════ */
function RevealPhase({
  players, location, currentIdx, onReveal, onNext, onStartTimer,
}: {
  players: Player[];
  location: string;
  currentIdx: number;
  onReveal: () => void;
  onNext: () => void;
  onStartTimer: () => void;
}) {
  const [showing, setShowing] = useState(false);
  const player = players[currentIdx];
  const isLast = currentIdx === players.length - 1;
  const allDone = players.every((p) => p.revealed);

  const handleReveal = () => {
    setShowing(true);
    onReveal();
  };

  const handleNext = () => {
    setShowing(false);
    setTimeout(() => onNext(), 300);
  };

  if (allDone) {
    return (
      <div className="px-5 pb-6 text-center" dir="rtl">
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <h3 className="text-xl font-bold mb-2" style={{ color: '#f0ece4', fontFamily: "'Cairo', sans-serif" }}>
          كل اللاعبين شافوا ورقتهم!
        </h3>
        <p className="text-sm mb-6" style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}>
          دلوقتي ابدأوا تتكلموا وكشفوا الجاسوس!
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStartTimer}
          style={{
            width: '100%', padding: '15px', borderRadius: '16px',
            fontWeight: 700, fontSize: '15px', fontFamily: "'Cairo', sans-serif",
            border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg,${GOLD2},${GOLD})`,
            color: '#07070f',
            boxShadow: '0 6px 24px rgba(201,153,61,0.28)',
          }}
        >
          <Play className="inline w-4 h-4 mr-2" />
          ابدأ التايمر
        </motion.button>
      </div>
    );
  }

  return (
    <div className="px-5 pb-6" dir="rtl">
      {/* Progress */}
      <div className="flex gap-1 mb-5">
        {players.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: i < currentIdx
                ? `linear-gradient(90deg,${GOLD2},${GOLD})`
                : i === currentIdx
                ? 'rgba(201,153,61,0.45)'
                : 'rgba(255,255,255,0.08)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      <p className="text-xs text-center mb-4" style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}>
        دور {player.name} — اضغط على الكارت تشوف ورقتك
      </p>

      {/* Card */}
      <AnimatePresence mode="wait">
        {!showing ? (
          <motion.button
            key="hidden"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            onClick={handleReveal}
            whileTap={{ scale: 0.95 }}
            className="w-full flex flex-col items-center justify-center gap-3"
            style={{
              minHeight: '180px', borderRadius: '20px',
              background: 'linear-gradient(135deg,rgba(201,153,61,0.14),rgba(240,200,98,0.05))',
              border: `1.5px solid rgba(201,153,61,0.28)`,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: `linear-gradient(135deg,${GOLD2},${GOLD})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <EyeOff className="w-6 h-6" style={{ color: '#07070f' }} />
            </div>
            <p style={{ color: GOLD, fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '15px' }}>
              اضغط لترى ورقتك 👆
            </p>
            <p style={{ color: '#4a4850', fontFamily: "'Cairo', sans-serif", fontSize: '11px' }}>
              تأكد إن محدش شايف الشاشة غيرك
            </p>
          </motion.button>
        ) : (
          <motion.div
            key="shown"
            initial={{ opacity: 0, scale: 0.88, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="w-full flex flex-col items-center justify-center gap-3"
            style={{
              minHeight: '180px', borderRadius: '20px',
              background: player.isSpy
                ? 'linear-gradient(135deg,rgba(248,113,113,0.16),rgba(248,113,113,0.05))'
                : 'linear-gradient(135deg,rgba(94,204,122,0.14),rgba(94,204,122,0.04))',
              border: `1.5px solid ${player.isSpy ? 'rgba(248,113,113,0.35)' : 'rgba(94,204,122,0.30)'}`,
            }}
          >
            <div style={{ fontSize: '2.8rem', lineHeight: 1 }}>
              {player.isSpy ? '🕵️' : '📍'}
            </div>
            <div className="text-center px-4">
              {player.isSpy ? (
                <>
                  <p style={{ color: SPY_CLR, fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '22px', marginBottom: '4px' }}>
                    أنت الجاسوس!
                  </p>
                  <p style={{ color: 'rgba(248,113,113,0.6)', fontFamily: "'Cairo', sans-serif", fontSize: '12px' }}>
                    حاول تعرف المكان قبل ما يكشفوك!
                  </p>
                </>
              ) : (
                <>
                  <p style={{ color: 'rgba(94,204,122,0.7)', fontFamily: "'Cairo', sans-serif", fontSize: '12px', marginBottom: '4px' }}>
                    المكان هو
                  </p>
                  <p style={{ color: '#5ecc7a', fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '20px' }}>
                    {location}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showing && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          style={{
            display: 'block', width: '100%', marginTop: '16px', padding: '14px',
            borderRadius: '14px', fontWeight: 700, fontSize: '14px',
            fontFamily: "'Cairo', sans-serif", border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)',
            color: '#f0ece4',
          }}
        >
          {isLast ? '✅ كلنا اتفرجنا' : `التالي: ${players[currentIdx + 1]?.name} ←`}
        </motion.button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PLAYING PHASE — timer + location visible to all
══════════════════════════════════════════════════════════ */
function PlayingPhase({
  location, players, timeLeft, running,
  onToggleTimer, onVote,
}: {
  location: string; players: Player[]; timeLeft: number; running: boolean;
  onToggleTimer: () => void; onVote: () => void;
}) {
  const pct = timeLeft / GAME_DURATION;
  const urgent = timeLeft < 60;

  return (
    <div className="px-5 pb-6" dir="rtl">
      {/* Timer ring */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative flex items-center justify-center" style={{ width: '100px', height: '100px' }}>
          <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
            <circle
              cx="50" cy="50" r="44" fill="none"
              stroke={urgent ? SPY_CLR : GOLD}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct)}`}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <Clock className="w-4 h-4 mb-0.5" style={{ color: urgent ? SPY_CLR : GOLD }} />
            <span style={{
              fontFamily: 'monospace', fontWeight: 800, fontSize: '17px',
              color: urgent ? SPY_CLR : '#f0ece4',
            }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleTimer}
          style={{
            marginTop: '8px', padding: '6px 18px', borderRadius: '20px',
            fontFamily: "'Cairo', sans-serif", fontSize: '12px', fontWeight: 600,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#7a7268', cursor: 'pointer',
          }}
        >
          {running ? '⏸ وقف' : '▶ كمّل'}
        </button>
      </div>

      {/* Location banner */}
      <div className="flex flex-col items-center mb-5 py-4 rounded-2xl"
        style={{ background: 'linear-gradient(135deg,rgba(94,204,122,0.12),rgba(94,204,122,0.04))', border: '1px solid rgba(94,204,122,0.2)' }}
      >
        <p style={{ color: 'rgba(94,204,122,0.7)', fontFamily: "'Cairo', sans-serif", fontSize: '11px', marginBottom: '4px' }}>المكان</p>
        <p style={{ color: '#5ecc7a', fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: '22px' }}>
          {location}
        </p>
      </div>

      {/* Players list */}
      <div className="flex flex-wrap gap-2 mb-5 justify-center">
        {players.map((p, i) => (
          <span key={i} style={{
            padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
            fontFamily: "'Cairo', sans-serif",
            background: 'rgba(255,255,255,0.05)',
            color: '#7a7268', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            {p.name}
          </span>
        ))}
      </div>

      {/* Vote button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onVote}
        style={{
          width: '100%', padding: '15px', borderRadius: '16px',
          fontWeight: 700, fontSize: '15px', fontFamily: "'Cairo', sans-serif",
          border: 'none', cursor: 'pointer',
          background: 'rgba(248,113,113,0.15)', color: SPY_CLR,
          border: '1px solid rgba(248,113,113,0.3)',
        } as React.CSSProperties}
      >
        🗳️ التصويت — كشف الجاسوس
      </motion.button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VOTE PHASE
══════════════════════════════════════════════════════════ */
function VotePhase({
  players, onReveal,
}: {
  players: Player[]; onReveal: (idx: number) => void;
}) {
  return (
    <div className="px-5 pb-6" dir="rtl">
      <p className="text-sm text-center mb-5" style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}>
        مين الجاسوس؟ اختاروا واحد!
      </p>
      <div className="flex flex-col gap-2">
        {players.map((p, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.97 }}
            onClick={() => onReveal(i)}
            style={{
              width: '100%', padding: '14px 18px', borderRadius: '14px',
              fontWeight: 600, fontSize: '15px', fontFamily: "'Cairo', sans-serif",
              border: '1px solid rgba(248,113,113,0.2)',
              background: 'rgba(248,113,113,0.06)',
              color: '#f0ece4', cursor: 'pointer', textAlign: 'right',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <span>{p.name}</span>
            <span style={{ fontSize: '1.3rem' }}>🕵️</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   RESULT PHASE
══════════════════════════════════════════════════════════ */
function ResultPhase({
  accused, players, location, onPlayAgain, onNewGame,
}: {
  accused: number; players: Player[]; location: string;
  onPlayAgain: () => void; onNewGame: () => void;
}) {
  const accPlayer = players[accused];
  const realSpy = players.find((p) => p.isSpy)!;
  const correctGuess = accPlayer.isSpy;

  return (
    <div className="px-5 pb-6" dir="rtl">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="text-center mb-5"
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>
          {correctGuess ? '🎉' : '😈'}
        </div>
        <h3 className="font-black text-xl mb-1" style={{
          color: correctGuess ? GOLD : SPY_CLR,
          fontFamily: "'Cairo', sans-serif",
        }}>
          {correctGuess ? 'مبروك! اتكشف الجاسوس!' : 'الجاسوس فاز!'}
        </h3>
        <p style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '13px' }}>
          {correctGuess
            ? `صح! ${accPlayer.name} كان الجاسوس`
            : `غلط! ${accPlayer.name} مش الجاسوس`}
        </p>
      </motion.div>

      {/* Info cards */}
      <div className="flex flex-col gap-2 mb-5">
        <div className="flex items-center gap-3 py-3 px-4 rounded-2xl"
          style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
        >
          <span style={{ fontSize: '1.6rem' }}>🕵️</span>
          <div>
            <p style={{ color: 'rgba(248,113,113,0.7)', fontFamily: "'Cairo', sans-serif", fontSize: '11px' }}>الجاسوس الحقيقي</p>
            <p style={{ color: SPY_CLR, fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '16px' }}>{realSpy.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 py-3 px-4 rounded-2xl"
          style={{ background: 'rgba(94,204,122,0.08)', border: '1px solid rgba(94,204,122,0.2)' }}
        >
          <span style={{ fontSize: '1.6rem' }}>📍</span>
          <div>
            <p style={{ color: 'rgba(94,204,122,0.7)', fontFamily: "'Cairo', sans-serif", fontSize: '11px' }}>المكان كان</p>
            <p style={{ color: '#5ecc7a', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '16px' }}>{location}</p>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onPlayAgain}
        style={{
          display: 'block', width: '100%', padding: '15px', borderRadius: '16px',
          marginBottom: '10px', fontWeight: 700, fontSize: '15px',
          fontFamily: "'Cairo', sans-serif", border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg,${GOLD2},${GOLD})`, color: '#07070f',
          boxShadow: '0 6px 24px rgba(201,153,61,0.28)',
        }}
      >
        العبوا تاني! 🔄
      </motion.button>

      <button
        onClick={onNewGame}
        style={{
          width: '100%', padding: '13px', borderRadius: '14px',
          fontWeight: 600, fontSize: '14px', fontFamily: "'Cairo', sans-serif",
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: '#7a7268', cursor: 'pointer',
        }}
      >
        لعبة جديدة
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function SpyGame({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [location, setLocation] = useState('');
  const [currentRevealIdx, setCurrentRevealIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [timerRunning, setTimerRunning] = useState(false);
  const [accusedIdx, setAccusedIdx] = useState<number | null>(null);

  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) { setTimerRunning(false); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timeLeft]);

  const handleStart = useCallback((names: string[]) => {
    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const spyIdx = Math.floor(Math.random() * names.length);
    const shuffledIndices = shuffle(names.map((_, i) => i));

    const newPlayers: Player[] = shuffledIndices.map((origIdx) => ({
      name: names[origIdx],
      isSpy: origIdx === spyIdx,
      revealed: false,
    }));

    setLocation(loc);
    setPlayers(newPlayers);
    setCurrentRevealIdx(0);
    setTimeLeft(GAME_DURATION);
    setTimerRunning(false);
    setAccusedIdx(null);
    setPhase('reveal');
  }, []);

  const handleReveal = useCallback(() => {
    setPlayers((prev) =>
      prev.map((p, i) => (i === currentRevealIdx ? { ...p, revealed: true } : p))
    );
  }, [currentRevealIdx]);

  const handleNextReveal = useCallback(() => {
    setCurrentRevealIdx((i) => i + 1);
  }, []);

  const handleStartTimer = useCallback(() => {
    setTimerRunning(true);
    setPhase('playing');
  }, []);

  const handleAccuse = useCallback((idx: number) => {
    setAccusedIdx(idx);
    setTimerRunning(false);
    setPhase('result');
  }, []);

  const handlePlayAgain = useCallback(() => {
    const names = players.map((p) => p.name);
    handleStart(names);
  }, [players, handleStart]);

  const handleNewGame = useCallback(() => {
    setPhase('setup');
    setPlayers([]);
    setLocation('');
    setCurrentRevealIdx(0);
    setTimeLeft(GAME_DURATION);
    setTimerRunning(false);
    setAccusedIdx(null);
  }, []);

  const phaseTitles: Record<Phase, string> = {
    setup:   'لعبة الجاسوس 🕵️',
    reveal:  'شوف ورقتك',
    playing: 'اللعبة شغالة',
    vote:    'التصويت 🗳️',
    result:  'النتيجة',
  };

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
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        style={{
          background: DARK,
          maxHeight: '95svh',
          border: '1px solid rgba(201,153,61,0.18)',
          boxShadow: '0 0 80px rgba(201,153,61,0.1), 0 -20px 60px rgba(0,0,0,0.8)',
        }}
      >
        <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: '95svh' }}>
          {/* Gold line */}
          <div style={{ height: '3px', background: `linear-gradient(90deg,transparent,${GOLD2} 28%,${GOLD} 50%,${GOLD2} 72%,transparent)` }} />

          {/* Handle */}
          <div className="flex justify-center pt-3 sm:hidden">
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.12)' }} />
          </div>

          {/* Header */}
          <div className="pt-5 pb-3 px-5 text-center">
            <div className="mx-auto flex items-center justify-center mb-3"
              style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: 'linear-gradient(135deg,rgba(201,153,61,0.22),rgba(240,200,98,0.06))',
              }}
            >
              <span style={{ fontSize: '22px' }}>🕵️</span>
            </div>
            <h2 style={{ color: '#f0ece4', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>
              {phaseTitles[phase]}
            </h2>
            {phase === 'setup' && (
              <p style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '12px' }}>
                اعرف المكان وكشف الجاسوس اللي جواكم!
              </p>
            )}
          </div>

          {/* Phase content */}
          <AnimatePresence mode="wait">
            {phase === 'setup' && (
              <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <SetupPhase onStart={handleStart} />
              </motion.div>
            )}
            {phase === 'reveal' && (
              <motion.div key={`reveal-${currentRevealIdx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <RevealPhase
                  players={players}
                  location={location}
                  currentIdx={currentRevealIdx}
                  onReveal={handleReveal}
                  onNext={handleNextReveal}
                  onStartTimer={handleStartTimer}
                />
              </motion.div>
            )}
            {phase === 'playing' && (
              <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <PlayingPhase
                  location={location}
                  players={players}
                  timeLeft={timeLeft}
                  running={timerRunning}
                  onToggleTimer={() => setTimerRunning((r) => !r)}
                  onVote={() => setPhase('vote')}
                />
              </motion.div>
            )}
            {phase === 'vote' && (
              <motion.div key="vote" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <VotePhase players={players} onReveal={handleAccuse} />
              </motion.div>
            )}
            {phase === 'result' && accusedIdx !== null && (
              <motion.div key="result" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
                <ResultPhase
                  accused={accusedIdx}
                  players={players}
                  location={location}
                  onPlayAgain={handlePlayAgain}
                  onNewGame={handleNewGame}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close button */}
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