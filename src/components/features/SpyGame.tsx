import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X as CloseIcon, EyeOff, Play, Clock } from 'lucide-react';

/* ══════════════════════════════════════════════════════════
   THEME
══════════════════════════════════════════════════════════ */
const DARK  = '#0c0c1e';
const GOLD  = '#f0c862';
const GOLD2 = '#c9993d';
const SPY_CLR = '#f87171';

/* ══════════════════════════════════════════════════════════
   CATEGORIES & WORDS
══════════════════════════════════════════════════════════ */
interface WordCategory {
  id: string;
  name: string;
  emoji: string;
  words: string[];
}

const CATEGORIES: WordCategory[] = [
  {
    id: 'places',
    name: 'أماكن',
    emoji: '🌍',
    words: [
      'المطار ✈️', 'الشاطئ 🏖️', 'المستشفى 🏥', 'المدرسة 🏫',
      'البنك 🏦', 'الفندق 🏨', 'المسجد 🕌', 'المكتبة 📚',
      'الحديقة 🌳', 'المتحف 🏛️', 'الميناء ⚓', 'القلعة 🏰',
      'محطة القطار 🚂', 'السوبرماركت 🛒', 'الصيدلية 💊', 'القرية 🏡',
      'المخبز 🥐', 'الحلاق ✂️', 'المصنع 🏭', 'البريد 📮',
      'السوق الشعبي 🛍️', 'قسم الشرطة 👮', 'المحكمة ⚖️', 'الملجأ 🏘️',
    ],
  },
  {
    id: 'entertainment',
    name: 'ترفيه',
    emoji: '🎭',
    words: [
      'السينما 🎬', 'اللوناباك 🎡', 'السيرك 🎪', 'المسرح 🎭',
      'الملاهي 🎢', 'حفل موسيقي 🎵', 'معرض فن 🎨', 'ستوديو تسجيل 🎙️',
      'ملعب فيديو 🎮', 'بطولة شطرنج ♟️', 'مهرجان 🎉', 'حديقة حيوان 🦁',
      'بلاج ليلي 🌙', 'مسرح العرائس 🪆', 'استوديو تصوير 📸', 'غرفة الهروب 🔐',
    ],
  },
  {
    id: 'sports',
    name: 'رياضة',
    emoji: '⚽',
    words: [
      'الملعب ⚽', 'الصالة الرياضية 💪', 'المسبح 🏊', 'حلبة الملاكمة 🥊',
      'ملعب التنس 🎾', 'ميدان السباق 🏇', 'بساط الجودو 🥋', 'نادي الغوص 🤿',
      'ملعب الجمباز 🤸', 'منحدر التزلج ⛷️', 'ملعب البولينج 🎳', 'ملعب الجولف ⛳',
      'صالة الاسكواش 🏸', 'نادي الدراجات 🚴', 'حلبة الكاراتيه 🥋',
    ],
  },
  {
    id: 'food',
    name: 'أكل وشرب',
    emoji: '🍕',
    words: [
      'المطعم 🍽️', 'الكافيه ☕', 'مطعم سوشي 🍣', 'مشوية باربيكيو 🍖',
      'محل آيسكريم 🍦', 'مطعم بيتزا 🍕', 'عربية فول 🥙', 'محل كيك 🎂',
      'مطعم مأكولات بحرية 🦞', 'محل شاورما 🌯', 'كافيتيريا المدرسة 🥗',
      'عربية هوت دوج 🌭', 'مطعم ياباني 🍜', 'محل عصير 🥤', 'مطعم هندي 🍛',
    ],
  },
  {
    id: 'transport',
    name: 'مواصلات',
    emoji: '🚗',
    words: [
      'الطائرة 🛩️', 'القارب 🚢', 'القطار 🚂', 'الباص 🚌',
      'المترو 🚇', 'التاكسي 🚕', 'العبّارة ⛴️', 'الهليكوبتر 🚁',
      'السفينة الكبيرة 🛳️', 'القارب الشراعي ⛵', 'الدراجة النارية 🏍️',
      'الشاحنة 🚛', 'قطار الأنفاق 🚇', 'التوك توك 🛺',
    ],
  },
  {
    id: 'work',
    name: 'أماكن العمل',
    emoji: '👔',
    words: [
      'المكتب 💼', 'مستشفى الطوارئ 🚑', 'مركز شرطة 👮', 'محكمة ⚖️',
      'مطبخ مطعم راقي 👨‍🍳', 'ورشة ميكانيكي 🔧', 'عيادة طبيب أسنان 🦷',
      'غرفة عمليات 🏥', 'مركز إطفاء 🚒', 'مختبر علمي 🧪',
      'مزرعة 🌾', 'حقل نفط 🛢️', 'محطة فضاء 🚀', 'سوق الأسماك 🐟',
    ],
  },
];

const ALL_WORDS = CATEGORIES.flatMap((c) => c.words);
const GENERAL_CATEGORY: WordCategory = {
  id: 'general',
  name: 'عام',
  emoji: '🎲',
  words: ALL_WORDS,
};

const ALL_DISPLAY_CATEGORIES = [GENERAL_CATEGORY, ...CATEGORIES];

/* ══════════════════════════════════════════════════════════
   TIMER OPTIONS (minutes)
══════════════════════════════════════════════════════════ */
const TIMER_OPTIONS = [3, 5, 8, 10, 15, 20];

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
type Phase = 'setup' | 'reveal' | 'playing' | 'vote' | 'result';

interface Player {
  name: string;
  isSpy: boolean;
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

function pickWord(category: WordCategory): string {
  return category.words[Math.floor(Math.random() * category.words.length)];
}

/* ══════════════════════════════════════════════════════════
   SETUP PHASE
══════════════════════════════════════════════════════════ */
function SetupPhase({
  onStart,
}: {
  onStart: (names: string[], categoryId: string, durationSec: number) => void;
}) {
  const [count, setCount] = useState(4);
  const [names, setNames] = useState<string[]>(Array(8).fill(''));
  const [selectedCat, setSelectedCat] = useState('general');
  const [durationMin, setDurationMin] = useState(8);

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
    onStart(finalNames, selectedCat, durationMin * 60);
  };

  return (
    <div className="px-5 pb-6" dir="rtl">
      <p className="text-xs text-center mb-4" style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}>
        لاعب واحد هيبقى الجاسوس ومش هيعرف الكلمة!
      </p>

      {/* ─ Category ─────────────────────────────── */}
      <div className="mb-4">
        <p className="text-xs font-semibold mb-2" style={{ color: GOLD, fontFamily: "'Cairo', sans-serif" }}>
          تصنيف الكلمات
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_DISPLAY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                fontFamily: "'Cairo', sans-serif",
                fontWeight: selectedCat === cat.id ? 700 : 400,
                cursor: 'pointer', border: 'none',
                background: selectedCat === cat.id
                  ? `linear-gradient(135deg,${GOLD2},${GOLD})`
                  : 'rgba(255,255,255,0.05)',
                color: selectedCat === cat.id ? '#07070f' : '#7a7268',
                transition: 'all 0.2s',
              }}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
        {/* word count hint */}
        <p style={{ color: '#3a3848', fontFamily: "'Cairo', sans-serif", fontSize: '10px', marginTop: '5px' }}>
          {ALL_DISPLAY_CATEGORIES.find((c) => c.id === selectedCat)?.words.length ?? 0} كلمة متاحة
        </p>
      </div>

      {/* ─ Timer ─────────────────────────────────── */}
      <div className="mb-4">
        <p className="text-xs font-semibold mb-2" style={{ color: GOLD, fontFamily: "'Cairo', sans-serif" }}>
          ⏱️ وقت النقاش
        </p>
        <div className="flex gap-2 flex-wrap">
          {TIMER_OPTIONS.map((min) => (
            <button
              key={min}
              onClick={() => setDurationMin(min)}
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
                fontWeight: 700, border: 'none', cursor: 'pointer',
                fontFamily: "'Cairo', sans-serif",
                background: durationMin === min
                  ? `linear-gradient(135deg,${GOLD2},${GOLD})`
                  : 'rgba(255,255,255,0.05)',
                color: durationMin === min ? '#07070f' : '#7a7268',
                transition: 'all 0.2s',
              }}
            >
              {min} د
            </button>
          ))}
        </div>
      </div>

      {/* ─ Player count ──────────────────────────── */}
      <div className="mb-4">
        <p className="text-xs font-semibold mb-2" style={{ color: GOLD, fontFamily: "'Cairo', sans-serif" }}>
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
                background: count === n
                  ? `linear-gradient(135deg,${GOLD2},${GOLD})`
                  : 'rgba(255,255,255,0.05)',
                color: count === n ? '#07070f' : '#7a7268',
                transition: 'all 0.2s',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* ─ Names ─────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
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
   REVEAL PHASE
   FIX: "all done" screen shown only when currentIdx >= players.length
   (i.e. AFTER the last player clicks the "done" button),
   NOT based on the old allDone = players.every(p => p.revealed) logic
   which caused the 4th player's card to be hidden immediately.
══════════════════════════════════════════════════════════ */
function RevealPhase({
  players, word, currentIdx, onNext, onStartTimer,
}: {
  players: Player[];
  word: string;
  currentIdx: number;
  onNext: () => void;
  onStartTimer: () => void;
}) {
  const [showing, setShowing] = useState(false);

  /* ── All done screen ─────────────────────────────────── */
  if (currentIdx >= players.length) {
    return (
      <div className="px-5 pb-6 text-center" dir="rtl">
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <h3
          className="text-xl font-bold mb-2"
          style={{ color: '#f0ece4', fontFamily: "'Cairo', sans-serif" }}
        >
          كل اللاعبين شافوا ورقتهم!
        </h3>
        <p
          className="text-sm mb-6"
          style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}
        >
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
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <Play className="w-4 h-4" />
          ابدأ التايمر
        </motion.button>
      </div>
    );
  }

  /* ── Normal reveal card ──────────────────────────────── */
  const player  = players[currentIdx];
  const isLast  = currentIdx === players.length - 1;

  const handleReveal = () => setShowing(true);

  const handleNext = () => {
    setShowing(false);
    setTimeout(() => onNext(), 200);
  };

  return (
    <div className="px-5 pb-6" dir="rtl">
      {/* Progress */}
      <div className="flex gap-1 mb-5">
        {players.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background:
                i < currentIdx
                  ? `linear-gradient(90deg,${GOLD2},${GOLD})`
                  : i === currentIdx
                  ? 'rgba(201,153,61,0.45)'
                  : 'rgba(255,255,255,0.08)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      <p
        className="text-xs text-center mb-4"
        style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}
      >
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
              background:
                'linear-gradient(135deg,rgba(201,153,61,0.14),rgba(240,200,98,0.05))',
              border: '1.5px solid rgba(201,153,61,0.28)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: `linear-gradient(135deg,${GOLD2},${GOLD})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <EyeOff className="w-6 h-6" style={{ color: '#07070f' }} />
            </div>
            <p
              style={{
                color: GOLD, fontFamily: "'Cairo', sans-serif",
                fontWeight: 700, fontSize: '15px',
              }}
            >
              اضغط لترى ورقتك 👆
            </p>
            <p
              style={{
                color: '#4a4850', fontFamily: "'Cairo', sans-serif",
                fontSize: '11px',
              }}
            >
              تأكد إن محدش شايف الشاشة غيرك
            </p>
          </motion.button>
        ) : (
          <motion.div
            key="shown"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="w-full flex flex-col items-center justify-center gap-3"
            style={{
              minHeight: '180px', borderRadius: '20px',
              background: player.isSpy
                ? 'linear-gradient(135deg,rgba(248,113,113,0.16),rgba(248,113,113,0.05))'
                : 'linear-gradient(135deg,rgba(94,204,122,0.14),rgba(94,204,122,0.04))',
              border: `1.5px solid ${
                player.isSpy
                  ? 'rgba(248,113,113,0.35)'
                  : 'rgba(94,204,122,0.30)'
              }`,
            }}
          >
            <div style={{ fontSize: '2.8rem', lineHeight: 1 }}>
              {player.isSpy ? '🕵️' : '📍'}
            </div>
            {player.isSpy ? (
              <div className="text-center px-4">
                <p
                  style={{
                    color: SPY_CLR, fontFamily: "'Cairo', sans-serif",
                    fontWeight: 800, fontSize: '22px', marginBottom: '4px',
                  }}
                >
                  أنت الجاسوس!
                </p>
                <p
                  style={{
                    color: 'rgba(248,113,113,0.6)',
                    fontFamily: "'Cairo', sans-serif", fontSize: '12px',
                  }}
                >
                  حاول تعرف الكلمة قبل ما يكشفوك!
                </p>
              </div>
            ) : (
              <div className="text-center px-4">
                <p
                  style={{
                    color: 'rgba(94,204,122,0.7)',
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: '12px', marginBottom: '4px',
                  }}
                >
                  الكلمة هي
                </p>
                <p
                  style={{
                    color: '#5ecc7a', fontFamily: "'Cairo', sans-serif",
                    fontWeight: 800, fontSize: '20px',
                  }}
                >
                  {word}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next / Done button — appears only after card is shown */}
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
            background: 'rgba(255,255,255,0.06)', color: '#f0ece4',
          }}
        >
          {isLast ? '✅ كلنا اتفرجنا' : `التالي: ${players[currentIdx + 1]?.name} ←`}
        </motion.button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PLAYING PHASE
══════════════════════════════════════════════════════════ */
function PlayingPhase({
  word, players, timeLeft, gameDuration, running,
  onToggleTimer, onVote,
}: {
  word: string;
  players: Player[];
  timeLeft: number;
  gameDuration: number;
  running: boolean;
  onToggleTimer: () => void;
  onVote: () => void;
}) {
  const pct    = gameDuration > 0 ? timeLeft / gameDuration : 0;
  const urgent = timeLeft < 60;

  return (
    <div className="px-5 pb-6" dir="rtl">
      {/* Timer ring */}
      <div className="flex flex-col items-center mb-5">
        <div
          className="relative flex items-center justify-center"
          style={{ width: '100px', height: '100px' }}
        >
          <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="50" cy="50" r="44" fill="none"
              stroke="rgba(255,255,255,0.06)" strokeWidth="7"
            />
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
            <span
              style={{
                fontFamily: 'monospace', fontWeight: 800, fontSize: '17px',
                color: urgent ? SPY_CLR : '#f0ece4',
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <button
          onClick={onToggleTimer}
          style={{
            marginTop: '8px', padding: '6px 18px', borderRadius: '20px',
            fontFamily: "'Cairo', sans-serif", fontSize: '12px', fontWeight: 600,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#7a7268', cursor: 'pointer',
          }}
        >
          {running ? '⏸ وقف' : '▶ كمّل'}
        </button>
      </div>

      {/* Word banner */}
      <div
        className="flex flex-col items-center mb-5 py-4 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg,rgba(94,204,122,0.12),rgba(94,204,122,0.04))',
          border: '1px solid rgba(94,204,122,0.2)',
        }}
      >
        <p
          style={{
            color: 'rgba(94,204,122,0.7)', fontFamily: "'Cairo', sans-serif",
            fontSize: '11px', marginBottom: '4px',
          }}
        >
          الكلمة
        </p>
        <p
          style={{
            color: '#5ecc7a', fontFamily: "'Cairo', sans-serif",
            fontWeight: 800, fontSize: '22px',
          }}
        >
          {word}
        </p>
      </div>

      {/* Players list */}
      <div className="flex flex-wrap gap-2 mb-5 justify-center">
        {players.map((p, i) => (
          <span
            key={i}
            style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
              fontFamily: "'Cairo', sans-serif",
              background: 'rgba(255,255,255,0.05)',
              color: '#7a7268', border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
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
          border: '1px solid rgba(248,113,113,0.3)', cursor: 'pointer',
          background: 'rgba(248,113,113,0.12)', color: SPY_CLR,
        }}
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
  players: Player[];
  onReveal: (idx: number) => void;
}) {
  return (
    <div className="px-5 pb-6" dir="rtl">
      <p
        className="text-sm text-center mb-5"
        style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}
      >
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
  accused, players, word, onPlayAgain, onNewGame,
}: {
  accused: number;
  players: Player[];
  word: string;
  onPlayAgain: () => void;
  onNewGame: () => void;
}) {
  const accPlayer    = players[accused];
  const realSpy      = players.find((p) => p.isSpy)!;
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
        <h3
          className="font-black text-xl mb-1"
          style={{
            color: correctGuess ? GOLD : SPY_CLR,
            fontFamily: "'Cairo', sans-serif",
          }}
        >
          {correctGuess ? 'مبروك! اتكشف الجاسوس!' : 'الجاسوس فاز!'}
        </h3>
        <p style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '13px' }}>
          {correctGuess
            ? `صح! ${accPlayer.name} كان الجاسوس`
            : `غلط! ${accPlayer.name} مش الجاسوس`}
        </p>
      </motion.div>

      <div className="flex flex-col gap-2 mb-5">
        <div
          className="flex items-center gap-3 py-3 px-4 rounded-2xl"
          style={{
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.2)',
          }}
        >
          <span style={{ fontSize: '1.6rem' }}>🕵️</span>
          <div>
            <p
              style={{
                color: 'rgba(248,113,113,0.7)', fontFamily: "'Cairo', sans-serif",
                fontSize: '11px',
              }}
            >
              الجاسوس الحقيقي
            </p>
            <p
              style={{
                color: SPY_CLR, fontFamily: "'Cairo', sans-serif",
                fontWeight: 700, fontSize: '16px',
              }}
            >
              {realSpy.name}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-3 py-3 px-4 rounded-2xl"
          style={{
            background: 'rgba(94,204,122,0.08)',
            border: '1px solid rgba(94,204,122,0.2)',
          }}
        >
          <span style={{ fontSize: '1.6rem' }}>📍</span>
          <div>
            <p
              style={{
                color: 'rgba(94,204,122,0.7)', fontFamily: "'Cairo', sans-serif",
                fontSize: '11px',
              }}
            >
              الكلمة كانت
            </p>
            <p
              style={{
                color: '#5ecc7a', fontFamily: "'Cairo', sans-serif",
                fontWeight: 700, fontSize: '16px',
              }}
            >
              {word}
            </p>
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
  const [phase,           setPhase]           = useState<Phase>('setup');
  const [players,         setPlayers]         = useState<Player[]>([]);
  const [word,            setWord]            = useState('');
  const [currentRevealIdx, setCurrentRevealIdx] = useState(0);
  const [gameDuration,    setGameDuration]    = useState(8 * 60);
  const [timeLeft,        setTimeLeft]        = useState(8 * 60);
  const [timerRunning,    setTimerRunning]    = useState(false);
  const [accusedIdx,      setAccusedIdx]      = useState<number | null>(null);

  // Persist setup for "play again"
  const [savedNames,      setSavedNames]      = useState<string[]>([]);
  const [savedCatId,      setSavedCatId]      = useState('general');
  const [savedDuration,   setSavedDuration]   = useState(8 * 60);

  /* Timer tick */
  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) { setTimerRunning(false); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timeLeft]);

  /* ── Start / restart a game ────────────────────────── */
  const handleStart = useCallback(
    (names: string[], categoryId: string, durationSec: number) => {
      const cat = ALL_DISPLAY_CATEGORIES.find((c) => c.id === categoryId) ?? GENERAL_CATEGORY;
      const selectedWord = pickWord(cat);

      // FIX: shuffle names first, then pick a random position for the spy
      const shuffled = shuffle([...names]);
      const spyPos   = Math.floor(Math.random() * shuffled.length);

      const newPlayers: Player[] = shuffled.map((name, i) => ({
        name,
        isSpy: i === spyPos,
      }));

      setSavedNames(names);
      setSavedCatId(categoryId);
      setSavedDuration(durationSec);

      setWord(selectedWord);
      setPlayers(newPlayers);
      setCurrentRevealIdx(0);
      setGameDuration(durationSec);
      setTimeLeft(durationSec);
      setTimerRunning(false);
      setAccusedIdx(null);
      setPhase('reveal');
    },
    []
  );

  const handleNextReveal    = useCallback(() => setCurrentRevealIdx((i) => i + 1), []);
  const handleStartTimer    = useCallback(() => { setTimerRunning(true); setPhase('playing'); }, []);
  const handleAccuse        = useCallback((idx: number) => {
    setAccusedIdx(idx);
    setTimerRunning(false);
    setPhase('result');
  }, []);

  const handlePlayAgain = useCallback(() => {
    handleStart(savedNames, savedCatId, savedDuration);
  }, [savedNames, savedCatId, savedDuration, handleStart]);

  const handleNewGame = useCallback(() => {
    setPhase('setup');
    setPlayers([]);
    setWord('');
    setCurrentRevealIdx(0);
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
          {/* Gold accent line */}
          <div
            style={{
              height: '3px',
              background: `linear-gradient(90deg,transparent,${GOLD2} 28%,${GOLD} 50%,${GOLD2} 72%,transparent)`,
            }}
          />

          {/* Mobile drag handle */}
          <div className="flex justify-center pt-3 sm:hidden">
            <div
              style={{
                width: '40px', height: '4px', borderRadius: '2px',
                background: 'rgba(255,255,255,0.12)',
              }}
            />
          </div>

          {/* Header */}
          <div className="pt-5 pb-3 px-5 text-center">
            <div
              className="mx-auto flex items-center justify-center mb-3"
              style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background:
                  'linear-gradient(135deg,rgba(201,153,61,0.22),rgba(240,200,98,0.06))',
              }}
            >
              <span style={{ fontSize: '22px' }}>🕵️</span>
            </div>
            <h2
              style={{
                color: '#f0ece4', fontFamily: "'Cairo', sans-serif",
                fontWeight: 700, fontSize: '18px', marginBottom: '4px',
              }}
            >
              {phaseTitles[phase]}
            </h2>
            {phase === 'setup' && (
              <p
                style={{
                  color: '#7a7268', fontFamily: "'Cairo', sans-serif", fontSize: '12px',
                }}
              >
                اعرف الكلمة وكشف الجاسوس اللي جواكم!
              </p>
            )}
          </div>

          {/* Phase content */}
          <AnimatePresence mode="wait">
            {phase === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <SetupPhase onStart={handleStart} />
              </motion.div>
            )}

            {phase === 'reveal' && (
              <motion.div
                key={`reveal-${currentRevealIdx}`}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              >
                <RevealPhase
                  players={players}
                  word={word}
                  currentIdx={currentRevealIdx}
                  onNext={handleNextReveal}
                  onStartTimer={handleStartTimer}
                />
              </motion.div>
            )}

            {phase === 'playing' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <PlayingPhase
                  word={word}
                  players={players}
                  timeLeft={timeLeft}
                  gameDuration={gameDuration}
                  running={timerRunning}
                  onToggleTimer={() => setTimerRunning((r) => !r)}
                  onVote={() => setPhase('vote')}
                />
              </motion.div>
            )}

            {phase === 'vote' && (
              <motion.div
                key="vote"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              >
                <VotePhase players={players} onReveal={handleAccuse} />
              </motion.div>
            )}

            {phase === 'result' && accusedIdx !== null && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.28 }}
              >
                <ResultPhase
                  accused={accusedIdx}
                  players={players}
                  word={word}
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
          className="absolute top-5 left-4 z-30 flex items-center justify-center rounded-full
                     transition-colors hover:bg-white/10"
          style={{
            width: '32px', height: '32px',
            background: 'rgba(255,255,255,0.07)', color: '#7a7268',
            border: 'none', cursor: 'pointer',
          }}
          aria-label="إغلاق"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}