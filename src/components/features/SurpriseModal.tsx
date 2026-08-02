import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { categories } from '@/constants/menuData';
import { getRecommendation, RecommendationResult } from '@/lib/recommender';
import { UserAnswers } from '@/types/recommendation';

/* ── Constants ────────────────────────────────────────────────────────── */
const WA_NUMBER = '201234567890'; // TODO: replace with real sky 7 number
const FALLBACK  = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=480&h=360&fit=crop&auto=format&q=85';

type Phase    = 'questions' | 'loading' | 'result';
type StepKey  = keyof UserAnswers;

interface StepOption {
  emoji: string;
  label: string;
  value: string;
  isAny?: boolean;
}
interface StepConfig {
  key:     StepKey;
  title:   string;
  options: StepOption[];
}

const STEPS: StepConfig[] = [
  {
    key: 'temperature',
    title: 'تحب المشروب؟',
    options: [
      { emoji: '🔥', label: 'ساخن',    value: 'hot'  },
      { emoji: '🧊', label: 'بارد',    value: 'cold' },
      { emoji: '🎲', label: 'فاجئني',  value: 'any', isAny: true },
    ],
  },
  {
    key: 'mood',
    title: 'إيه مزاجك؟',
    options: [
      { emoji: '😴', label: 'عايز أفوق',  value: 'energize' },
      { emoji: '😌', label: 'عايز أروق',  value: 'relax'    },
      { emoji: '🥵', label: 'منعش',       value: 'refresh'  },
      { emoji: '🍫', label: 'حاجة حلوة', value: 'sweet'    },
      { emoji: '🎲', label: 'أي حاجة',   value: 'any', isAny: true },
    ],
  },
  {
    key: 'flavorFamily',
    title: 'تفضل إيه؟',
    options: [
      { emoji: '☕', label: 'قهوة',       value: 'coffee' },
      { emoji: '🌿', label: 'أعشاب',     value: 'herbs'  },
      { emoji: '🍊', label: 'فواكه',     value: 'fruits' },
      { emoji: '🥛', label: 'حليب',      value: 'milk'   },
      { emoji: '🎲', label: 'مش فارقة', value: 'any', isAny: true },
    ],
  },
  {
    key: 'sweetness',
    title: 'درجة الحلاوة؟',
    options: [
      { emoji: '🙂', label: 'خفيف',    value: 'light'  },
      { emoji: '😊', label: 'متوسط',  value: 'medium' },
      { emoji: '😋', label: 'عالي',    value: 'high'   },
      { emoji: '🎲', label: 'أي درجة', value: 'any', isAny: true },
    ],
  },
];

const AR_NUM = ['١', '٢', '٣', '٤'];

/* ── Sub-components ───────────────────────────────────────────────────── */

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="flex gap-1.5 mb-4">
      {STEPS.map((_, i) => (
        <div
          key={i}
          className="flex-1 h-[3px] rounded-full transition-all duration-500"
          style={{
            background: i <= current
              ? 'linear-gradient(90deg,#c9993d,#f0c862)'
              : 'rgba(255,255,255,0.08)',
          }}
        />
      ))}
    </div>
  );
}

function OptionBtn({ opt, onSelect }: { opt: StepOption; onSelect: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.03 }}
      onClick={onSelect}
      className="flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3.5 px-2 w-full transition-colors"
      style={{
        background: opt.isAny
          ? 'rgba(255,255,255,0.03)'
          : 'linear-gradient(135deg,rgba(201,153,61,0.11),rgba(201,153,61,0.04))',
        border: `1px solid ${opt.isAny ? 'rgba(255,255,255,0.07)' : 'rgba(201,153,61,0.22)'}`,
        minHeight: '68px',
        fontFamily: "'Cairo',sans-serif",
      }}
    >
      <span className="text-2xl leading-none select-none">{opt.emoji}</span>
      <span
        className="text-xs font-semibold text-center leading-tight"
        style={{ color: opt.isAny ? '#6b6870' : '#f0ece4' }}
      >
        {opt.label}
      </span>
    </motion.button>
  );
}

function QuestionsPhase({ currentStep, onSelect, onBack }: {
  currentStep: number;
  onSelect:    (value: string) => void;
  onBack:      () => void;
}) {
  const step       = STEPS[currentStep];
  const regularOpts = step.options.filter(o => !o.isAny);
  const anyOpt      = step.options.find(o => o.isAny);

  const cols = regularOpts.length <= 2 ? 'grid-cols-2'
             : regularOpts.length === 3 ? 'grid-cols-3'
             : 'grid-cols-2';

  return (
    <div className="px-5 pb-6">
      {/* Progress row with back button */}
      <div className="flex items-center gap-2 mb-1" dir="rtl">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0 transition-colors hover:bg-white/10"
          aria-label="السابق"
          style={{ visibility: currentStep > 0 ? 'visible' : 'hidden', background: 'rgba(255,255,255,0.06)' }}
        >
          <ChevronRight className="w-4 h-4" style={{ color: '#7a7268' }} />
        </button>
        <div className="flex-1">
          <ProgressBar current={currentStep} />
        </div>
      </div>

      {/* Animated step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <p
            className="text-[11px] text-center mb-1.5"
            style={{ color: '#4a4850', fontFamily: "'Cairo',sans-serif" }}
          >
            السؤال {AR_NUM[currentStep]} من {AR_NUM[STEPS.length - 1]}
          </p>
          <h2
            className="font-bold text-[22px] text-center mb-5"
            dir="rtl"
            style={{ color: '#f0ece4', fontFamily: "'Cairo',sans-serif" }}
          >
            {step.title}
          </h2>

          {/* Regular options grid */}
          <div className={`grid ${cols} gap-2.5 mb-2.5`}>
            {regularOpts.map(opt => (
              <OptionBtn key={opt.value} opt={opt} onSelect={() => onSelect(opt.value)} />
            ))}
          </div>

          {/* "Any" option — always full width */}
          {anyOpt && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(anyOpt.value)}
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                fontFamily: "'Cairo',sans-serif",
              }}
            >
              <span className="text-lg select-none">{anyOpt.emoji}</span>
              <span className="text-sm font-medium" style={{ color: '#6b6870' }}>{anyOpt.label}</span>
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LoadingPhase() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      {/* Spinning ring */}
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, #c9993d 40%, #f0c862 60%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-[3px] rounded-full flex items-center justify-center"
          style={{ background: '#0c0c1e' }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <Sparkles className="w-7 h-7" style={{ color: '#f0c862' }} />
          </motion.div>
        </div>
      </div>

      <motion.p
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="font-bold text-[15px] text-center mb-4"
        dir="rtl"
        style={{ color: '#f0ece4', fontFamily: "'Cairo',sans-serif" }}
      >
        ✨ جاري اختيار المشروب المناسب...
      </motion.p>

      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [-5, 0, -5] }}
            transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.22 }}
            className="w-2 h-2 rounded-full"
            style={{ background: i === 1 ? '#f0c862' : '#c9993d' }}
          />
        ))}
      </div>
    </div>
  );
}

function ResultPhase({ result, onAnother }: {
  result:    RecommendationResult;
  onAnother: () => void;
}) {
  const catName = categories.find(c => c.id === result.item.category)?.name ?? '';
  const catIcon = categories.find(c => c.id === result.item.category)?.icon ?? '✨';
  const waMsg   = encodeURIComponent(`مرحباً،\nعايز أطلب من sky 7:\n${result.item.name} - ${result.item.price} ${result.item.currency}`);
  const waUrl   = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={result.item.image}
          alt={result.item.name}
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top,#0c0c1e 5%,rgba(12,12,30,0.35) 55%,transparent 100%)' }}
        />

        {/* Category */}
        <div className="absolute top-3 right-3">
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(12,12,30,0.82)',
              color: '#f0c862',
              backdropFilter: 'blur(8px)',
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            {catIcon} {catName}
          </span>
        </div>

        {/* Match badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] px-2.5 py-1 rounded-full font-bold"
            style={{
              background: 'rgba(201,153,61,0.2)',
              border: '1px solid rgba(201,153,61,0.4)',
              color: '#f0c862',
              backdropFilter: 'blur(8px)',
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            ترشيح مثالي ✦
          </span>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span
            className="text-sm font-bold px-3 py-1.5 rounded-full"
            style={{ background: '#c9993d', color: '#07070f', fontFamily: "'Cairo',sans-serif" }}
          >
            {result.item.price} {result.item.currency}
          </span>
        </div>
      </div>

      {/* Text content */}
      <div className="px-5 pt-4 pb-6" dir="rtl">
        <h3
          className="font-bold text-xl mb-1.5"
          style={{ color: '#f0ece4', fontFamily: "'Cairo',sans-serif" }}
        >
          {result.item.name}
        </h3>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: '#7a7268', fontFamily: "'Cairo',sans-serif" }}
        >
          {result.item.description}
        </p>

        {/* Reason box */}
        <div
          className="flex items-start gap-2.5 p-3.5 rounded-2xl mb-4"
          style={{
            background: 'rgba(201,153,61,0.08)',
            border: '1px solid rgba(201,153,61,0.18)',
          }}
        >
          <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#c9993d' }} />
          <p
            className="text-xs leading-relaxed"
            style={{ color: '#c9993d', fontFamily: "'Cairo',sans-serif" }}
          >
            <span className="font-bold">سبب الترشيح: </span>
            {result.reason}
          </p>
        </div>

        {/* CTA buttons */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 rounded-2xl text-center font-bold text-sm mb-2.5 transition-opacity hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg,#25D366,#128C7E)',
            color: '#fff',
            fontFamily: "'Cairo',sans-serif",
            boxShadow: '0 6px 24px rgba(37,211,102,0.28)',
            textDecoration: 'none',
          }}
        >
          📱 اطلب الآن عبر واتساب
        </a>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onAnother}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-white/10"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#7a7268',
            fontFamily: "'Cairo',sans-serif",
          }}
        >
          <span>🔄</span>
          رشحلي مشروب تاني
        </motion.button>
      </div>
    </div>
  );
}

/* ── Main Modal ───────────────────────────────────────────────────────── */
export default function SurpriseModal({ onClose }: { onClose: () => void }) {
  const [phase,       setPhase]       = useState<Phase>('questions');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers,     setAnswers]     = useState<Partial<UserAnswers>>({});
  const [result,      setResult]      = useState<RecommendationResult | null>(null);
  const [shownIds,    setShownIds]    = useState<string[]>([]);

  const startLoading = (ans: UserAnswers, exclude: string[]) => {
    setPhase('loading');
    setTimeout(() => {
      const rec = getRecommendation(ans, exclude);
      setShownIds(prev => [...prev, rec.item.id]);
      setResult(rec);
      setPhase('result');
    }, 2000);
  };

  const handleSelect = (value: string) => {
    const step       = STEPS[currentStep];
    const newAnswers = { ...answers, [step.key]: value } as Partial<UserAnswers>;
    setAnswers(newAnswers);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      startLoading(newAnswers as UserAnswers, shownIds);
    }
  };

  const handleBack = () => {
    if (currentStep <= 0) return;
    // Clear answers for current step and beyond
    const newAnswers = { ...answers };
    STEPS.slice(currentStep).forEach(s => { delete newAnswers[s.key]; });
    setAnswers(newAnswers);
    setCurrentStep(prev => prev - 1);
  };

  const handleAnother = () => {
    startLoading(answers as UserAnswers, shownIds);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ background: 'rgba(7,7,15,0.88)', backdropFilter: 'blur(16px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="relative w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        style={{
          background:  '#0c0c1e',
          border:      '1px solid rgba(201,153,61,0.18)',
          boxShadow:   '0 0 80px rgba(201,153,61,0.1), 0 -20px 60px rgba(0,0,0,0.8)',
          maxHeight:   '92svh',
        }}
      >
        {/* Scrollable inner */}
        <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: '92svh' }}>
          {/* Gold top line */}
          <div
            className="h-[3px] w-full flex-shrink-0"
            style={{ background: 'linear-gradient(90deg,transparent,#c9993d 28%,#f0c862 50%,#c9993d 72%,transparent)' }}
          />

          {/* Mobile drag handle */}
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
          </div>

          {/* Modal header (shown in questions + loading) */}
          {phase !== 'result' && (
            <div className="pt-5 pb-3 px-5 text-center">
              <div
                className="mx-auto w-11 h-11 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'linear-gradient(135deg,rgba(201,153,61,0.22),rgba(240,200,98,0.08))' }}
              >
                <Sparkles className="w-5 h-5" style={{ color: '#f0c862' }} />
              </div>
              <h2
                className="font-bold text-lg mb-1"
                style={{ color: '#f0ece4', fontFamily: "'Cairo',sans-serif" }}
              >
                ابهرني! ✨
              </h2>
              <p
                className="text-xs"
                style={{ color: '#7a7268', fontFamily: "'Cairo',sans-serif" }}
              >
                {phase === 'loading'
                  ? 'بدور على المشروب المثالي ليك...'
                  : 'جاوب على ٤ أسئلة وهرشحلك أحسن حاجة'}
              </p>
            </div>
          )}

          {/* Phase content */}
          <AnimatePresence mode="wait">
            {phase === 'questions' && (
              <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <QuestionsPhase currentStep={currentStep} onSelect={handleSelect} onBack={handleBack} />
              </motion.div>
            )}
            {phase === 'loading' && (
              <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <LoadingPhase />
              </motion.div>
            )}
            {phase === 'result' && result && (
              <motion.div key="r" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <ResultPhase result={result} onAnother={handleAnother} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close button — absolute, always visible */}
        <button
          onClick={onClose}
          className="absolute top-5 left-4 z-30 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.07)', color: '#7a7268' }}
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}