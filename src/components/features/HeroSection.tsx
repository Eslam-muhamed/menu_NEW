import heroBg from '@/assets/hero.jpg';
import { useCallback, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════ */
const GOLD  = '#c9993d';
const GOLD2 = '#f0c862';
const BLUE  = '#a8dce8';
const GREEN = '#5ecc7a';

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */
type ShapeKind = 'bean' | 'cup' | 'star' | 'leaf' | 'drop' | 'hex';

interface ShapeCfg {
  id: string;
  kind: ShapeKind;
  top: string;
  left: string;
  size: number;
  initRotate: number;
  opacity: number;
  depth: number;
  floatY: number;
  floatRotate: number;
  floatDur: number;
  floatDelay: number;
  color?: string;
}

/* ══════════════════════════════════════════════════════════════
   SHAPES CONFIG  — populate edges, keep centre clear for text
══════════════════════════════════════════════════════════════ */
const SHAPES: ShapeCfg[] = [
  // ── Top-left cluster ─────────────────────────────────────
  { id:'s1',  kind:'cup',  top:'7%',  left:'5%',   size:28, initRotate:-8,  opacity:0.60, depth:0.90, floatY:10, floatRotate:5,  floatDur:7.0, floatDelay:0.0,  color:GOLD  },
  { id:'s2',  kind:'bean', top:'17%', left:'14%',  size:20, initRotate:22,  opacity:0.66, depth:0.60, floatY:8,  floatRotate:9,  floatDur:6.0, floatDelay:1.0,  color:GOLD  },
  { id:'s3',  kind:'star', top:'25%', left:'7%',   size:14, initRotate:0,   opacity:0.44, depth:0.38, floatY:13, floatRotate:18, floatDur:9.0, floatDelay:2.3,  color:GOLD2 },
  // ── Top-right cluster ────────────────────────────────────
  { id:'s4',  kind:'bean', top:'6%',  left:'74%',  size:22, initRotate:-20, opacity:0.63, depth:0.75, floatY:9,  floatRotate:10, floatDur:6.5, floatDelay:0.5,  color:GOLD  },
  { id:'s5',  kind:'hex',  top:'13%', left:'84%',  size:22, initRotate:10,  opacity:0.48, depth:0.52, floatY:11, floatRotate:6,  floatDur:8.0, floatDelay:1.6,  color:GOLD  },
  { id:'s6',  kind:'drop', top:'23%', left:'69%',  size:10, initRotate:15,  opacity:0.50, depth:0.32, floatY:14, floatRotate:14, floatDur:5.5, floatDelay:3.1,  color:BLUE  },
  // ── Far-left mid ─────────────────────────────────────────
  { id:'s7',  kind:'hex',  top:'37%', left:'2%',   size:20, initRotate:-5,  opacity:0.42, depth:0.65, floatY:8,  floatRotate:5,  floatDur:7.5, floatDelay:2.2,  color:GOLD  },
  { id:'s8',  kind:'bean', top:'52%', left:'3%',   size:17, initRotate:45,  opacity:0.56, depth:0.55, floatY:10, floatRotate:10, floatDur:6.8, floatDelay:0.8,  color:GOLD  },
  { id:'s9',  kind:'leaf', top:'67%', left:'7%',   size:18, initRotate:-28, opacity:0.47, depth:0.70, floatY:7,  floatRotate:8,  floatDur:8.5, floatDelay:3.5,  color:GREEN },
  // ── Far-right mid ────────────────────────────────────────
  { id:'s10', kind:'bean', top:'35%', left:'90%',  size:18, initRotate:18,  opacity:0.58, depth:0.70, floatY:9,  floatRotate:9,  floatDur:7.2, floatDelay:0.4,  color:GOLD  },
  { id:'s11', kind:'cup',  top:'49%', left:'85%',  size:24, initRotate:6,   opacity:0.50, depth:0.50, floatY:11, floatRotate:6,  floatDur:9.5, floatDelay:1.8,  color:GOLD  },
  { id:'s12', kind:'drop', top:'64%', left:'91%',  size:9,  initRotate:-12, opacity:0.46, depth:0.38, floatY:13, floatRotate:16, floatDur:6.2, floatDelay:2.8,  color:GOLD2 },
  // ── Top-centre subtle accents ────────────────────────────
  { id:'s13', kind:'star', top:'5%',  left:'46%',  size:12, initRotate:0,   opacity:0.40, depth:0.28, floatY:10, floatRotate:22, floatDur:8.0, floatDelay:1.2,  color:GOLD  },
  { id:'s14', kind:'drop', top:'11%', left:'30%',  size:8,  initRotate:20,  opacity:0.38, depth:0.25, floatY:12, floatRotate:12, floatDur:7.0, floatDelay:4.2,  color:BLUE  },
  { id:'s15', kind:'star', top:'9%',  left:'62%',  size:10, initRotate:45,  opacity:0.36, depth:0.22, floatY:11, floatRotate:20, floatDur:9.5, floatDelay:2.8,  color:BLUE  },
  // ── Bottom area ──────────────────────────────────────────
  { id:'s16', kind:'bean', top:'78%', left:'13%',  size:18, initRotate:12,  opacity:0.52, depth:0.65, floatY:8,  floatRotate:7,  floatDur:6.5, floatDelay:2.4,  color:GOLD  },
  { id:'s17', kind:'star', top:'80%', left:'47%',  size:14, initRotate:0,   opacity:0.36, depth:0.35, floatY:10, floatRotate:20, floatDur:9.0, floatDelay:1.5,  color:GOLD2 },
  { id:'s18', kind:'hex',  top:'76%', left:'77%',  size:20, initRotate:14,  opacity:0.42, depth:0.58, floatY:9,  floatRotate:6,  floatDur:7.8, floatDelay:3.2,  color:GOLD  },
  { id:'s19', kind:'leaf', top:'82%', left:'86%',  size:16, initRotate:28,  opacity:0.44, depth:0.52, floatY:7,  floatRotate:10, floatDur:8.2, floatDelay:0.7,  color:GREEN },
];

/* ══════════════════════════════════════════════════════════════
   SVG SHAPES
══════════════════════════════════════════════════════════════ */
function ShapeSVG({ kind, size, color }: { kind: ShapeKind; size: number; color: string }) {
  switch (kind) {
    case 'bean':
      return (
        <svg width={size} height={Math.round(size * 0.65)} viewBox="0 0 32 21" fill="none">
          <ellipse cx="16" cy="10.5" rx="15" ry="9.5" fill={color} opacity="0.85" />
          <path d="M16 2.5 Q22 10.5 16 18.5" stroke="rgba(7,7,15,0.55)" strokeWidth="1.8" fill="none" />
        </svg>
      );
    case 'cup':
      return (
        <svg width={size} height={Math.round(size * 1.15)} viewBox="0 0 28 32" fill="none">
          <path d="M4 7H24L21 23H7L4 7Z" fill="none" stroke={color} strokeWidth="1.7" />
          <path d="M7 23L6.5 28H21.5L21 23" fill="none" stroke={color} strokeWidth="1.5" />
          <rect x="4" y="26.5" width="20" height="2" rx="1" fill={color} opacity="0.45" />
          <path d="M24 10H27C27 10 28.5 15 24 16" fill="none" stroke={color} strokeWidth="1.5" />
          {/* steam wisps */}
          <path d="M10 5.5 Q11 3 10 1"   stroke={BLUE} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.65" />
          <path d="M14 5   Q15 2.5 14 0.5" stroke={BLUE} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.55" />
          <path d="M18 5.5 Q19 3 18 1"   stroke={BLUE} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.65" />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="1"   x2="12" y2="23"  stroke={color} strokeWidth="2"   strokeLinecap="round" opacity="0.82" />
          <line x1="1"  y1="12"  x2="23" y2="12"  stroke={color} strokeWidth="2"   strokeLinecap="round" opacity="0.82" />
          <line x1="4"  y1="4"   x2="20" y2="20"  stroke={color} strokeWidth="1"   strokeLinecap="round" opacity="0.40" />
          <line x1="20" y1="4"   x2="4"  y2="20"  stroke={color} strokeWidth="1"   strokeLinecap="round" opacity="0.40" />
        </svg>
      );
    case 'leaf':
      return (
        <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 24 26" fill="none">
          <path d="M12 2 C19 2 22 9 20 17 C18 22 15 24 12 24 C9 24 6 22 4 17 C2 9 5 2 12 2Z" fill={color} opacity="0.62" />
          <path d="M12 24 L12 8" stroke="rgba(7,7,15,0.30)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M9 14 L12 10 L15 14" stroke="rgba(7,7,15,0.20)" strokeWidth="1" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'drop':
      return (
        <svg width={size} height={Math.round(size * 1.35)} viewBox="0 0 14 19" fill="none">
          <path d="M7 1 Q13 8.5 13 12.5 A6 6 0 0 1 1 12.5 Q1 8.5 7 1Z" fill={color} opacity="0.68" />
        </svg>
      );
    case 'hex':
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <path d="M14 2L25.5 8.5V21.5L14 28L2.5 21.5V8.5L14 2Z" fill="none" stroke={color} strokeWidth="1.6" opacity="0.72" />
          <path d="M14 7L20.5 10.75V18.25L14 22L7.5 18.25V10.75L14 7Z" fill={color} opacity="0.10" />
        </svg>
      );
  }
}

/* ══════════════════════════════════════════════════════════════
   MOUSE PARALLAX HOOK
══════════════════════════════════════════════════════════════ */
function useMouseParallax(ref: React.RefObject<HTMLElement>) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 55, damping: 22 });
  const y = useSpring(rawY, { stiffness: 55, damping: 22 });

  const onMove = useCallback(
    (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      rawX.set(((e.clientX - r.left) / r.width  - 0.5) * 2);
      rawY.set(((e.clientY - r.top)  / r.height - 0.5) * 2);
    },
    [rawX, rawY, ref]
  );

  const onTouch = useCallback(
    (e: TouchEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r || !e.touches[0]) return;
      rawX.set(((e.touches[0].clientX - r.left) / r.width  - 0.5) * 2);
      rawY.set(((e.touches[0].clientY - r.top)  / r.height - 0.5) * 2);
    },
    [rawX, rawY, ref]
  );

  const onLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', onMove);
    el.addEventListener('touchmove', onTouch, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('touchmove', onTouch);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [onMove, onTouch, onLeave]);

  return { x, y };
}

/* ══════════════════════════════════════════════════════════════
   FLOATING SHAPE COMPONENT
   — outer motion.div: position + mouse parallax + fade-in
   — inner motion.div: ambient float loop
══════════════════════════════════════════════════════════════ */
function FloatingShape({
  cfg,
  mouseX,
  mouseY,
}: {
  cfg: ShapeCfg;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const px = useTransform(mouseX, [-1, 1], [-cfg.depth * 30, cfg.depth * 30]);
  const py = useTransform(mouseY, [-1, 1], [-cfg.depth * 24, cfg.depth * 24]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: cfg.top, left: cfg.left, x: px, y: py }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: cfg.opacity, scale: 1 }}
      transition={{ duration: 1.1, delay: cfg.floatDelay * 0.22 + 0.25, ease: 'easeOut' }}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          y:      [-cfg.floatY,      cfg.floatY],
          rotate: [cfg.initRotate - cfg.floatRotate, cfg.initRotate + cfg.floatRotate],
        }}
        transition={{
          y: {
            duration:   cfg.floatDur,
            delay:      cfg.floatDelay,
            repeat:     Infinity,
            repeatType: 'mirror',
            ease:       'easeInOut',
          },
          rotate: {
            duration:   cfg.floatDur * 1.15,
            delay:      cfg.floatDelay,
            repeat:     Infinity,
            repeatType: 'mirror',
            ease:       'easeInOut',
          },
        }}
      >
        <ShapeSVG kind={cfg.kind} size={cfg.size} color={cfg.color ?? GOLD} />
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { x: mouseX, y: mouseY } = useMouseParallax(heroRef);

  const handleScrollDown = () => {
    document.getElementById('menu-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ minHeight: '85vh', maxHeight: '100svh' }}
    >
      {/* Background Image */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover hero-img"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-sky7-bg/65 to-sky7-bg" />
      <div className="absolute inset-0 bg-sky7-bg/20" />

      {/* Gold glow orb */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[500px] md:h-[500px] rounded-full blur-3xl opacity-15 animate-float"
        style={{ background: 'radial-gradient(circle, #c9993d, #f0c862, transparent)' }}
      />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* ── Floating decorative shapes ── */}
      {SHAPES.map((cfg) => (
        <FloatingShape key={cfg.id} cfg={cfg} mouseX={mouseX} mouseY={mouseY} />
      ))}

      {/* Corner decorations */}
      <div className="absolute top-5 left-5 pointer-events-none" aria-hidden="true">
        <div className="w-7 h-px bg-sky7-gold/40" />
        <div className="w-px h-7 bg-sky7-gold/40 mt-0" />
      </div>
      <div className="absolute top-5 right-5 pointer-events-none flex flex-col items-end" aria-hidden="true">
        <div className="w-7 h-px bg-sky7-gold/40" />
        <div className="w-px h-7 bg-sky7-gold/40 ml-auto" />
      </div>
      <div className="absolute bottom-16 left-5 pointer-events-none flex flex-col justify-end" aria-hidden="true">
        <div className="w-px h-7 bg-sky7-gold/40" />
        <div className="w-7 h-px bg-sky7-gold/40" />
      </div>
      <div className="absolute bottom-16 right-5 pointer-events-none flex flex-col items-end justify-end" aria-hidden="true">
        <div className="w-px h-7 bg-sky7-gold/40 ml-auto" />
        <div className="w-7 h-px bg-sky7-gold/40" />
      </div>

      {/* Main Content — z-10 stays above shapes */}
      <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
        <p
          className="font-body text-sky7-gold/75 tracking-[0.35em] uppercase text-xs mb-8 animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          Premium Café Experience
        </p>

        <h1
          className="font-display leading-none mb-6 animate-fade-up"
          style={{ fontSize: 'clamp(4rem, 18vw, 9rem)', animationDelay: '300ms' }}
        >
          <span className="text-sky7-cream">sky </span>
          <span className="gold-text-shimmer">7</span>
        </h1>

        <div
          className="flex items-center justify-center gap-3 mb-8 animate-fade-in"
          style={{ animationDelay: '450ms' }}
          aria-hidden="true"
        >
          <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to right, transparent, rgba(201,153,61,0.5))' }} />
          <div className="w-1 h-1 rounded-full bg-sky7-gold/60" />
          <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to left, transparent, rgba(201,153,61,0.5))' }} />
        </div>

        <p
          className="font-body text-sky7-muted text-xs md:text-sm max-w-sm mx-auto mb-10 leading-relaxed animate-fade-up"
          style={{ animationDelay: '550ms' }}
        >
          Where every sip tells a story. Discover our curated collection of premium beverages and artisan creations.
        </p>

        <button
          onClick={handleScrollDown}
          className="group flex flex-col items-center gap-3 mx-auto animate-fade-in"
          style={{ animationDelay: '750ms' }}
          aria-label="Scroll down to explore menu"
        >
          <span className="font-body text-sky7-dim text-[11px] tracking-[0.2em] uppercase group-hover:text-sky7-gold transition-colors duration-300">
            Explore Menu
          </span>
          <div
            className="relative w-5 h-8 rounded-full border flex items-start justify-center pt-1.5 transition-colors duration-300"
            style={{ borderColor: 'rgba(201,153,61,0.3)' }}
          >
            <div className="w-0.5 h-2 rounded-full bg-sky7-gold/60 animate-bounce-soft" />
          </div>
        </button>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-sky7-bg to-transparent pointer-events-none" />
    </section>
  );
}