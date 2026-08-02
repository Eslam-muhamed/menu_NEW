import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { onComplete: () => void; }

/* ── Coffee bean (small oval shape) ─────────────────────────── */
function CoffeeBean({ style }: { style: React.CSSProperties }) {
  return (
    <div style={style}>
      <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
        <ellipse cx="9" cy="5.5" rx="8.5" ry="5" fill="#2a1a08" stroke="#c9993d" strokeWidth="0.8" opacity="0.75" />
        <path d="M9 1.5 Q12 5.5 9 9.5" stroke="#c9993d" strokeWidth="0.7" fill="none" opacity="0.6" />
      </svg>
    </div>
  );
}

/* ── Steam wisps ─────────────────────────────────────────────── */
function SteamWisp({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.path
      d={`M${x} 60 Q${x - 8} 40 ${x} 20 Q${x + 8} 0 ${x} -20`}
      stroke="rgba(168, 220, 232, 0.45)"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0, y: 0 }}
      animate={{
        pathLength: [0, 1, 1],
        opacity: [0, 0.55, 0],
        y: [-10, -50, -90],
      }}
      transition={{
        duration: 2.2,
        delay,
        repeat: Infinity,
        repeatDelay: 0.4,
        ease: 'easeOut',
      }}
    />
  );
}

/* ── Main Splash ─────────────────────────────────────────────── */
export default function SplashScreen({ onComplete }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // Floating bean configs
  const beans = [
    { top: '22%', left: '12%',  rotate: '-18deg', animDelay: '0s',    animDur: '4.2s' },
    { top: '68%', left: '8%',   rotate: '30deg',  animDelay: '0.7s',  animDur: '3.8s' },
    { top: '18%', right: '10%', rotate: '12deg',  animDelay: '0.3s',  animDur: '4.5s' },
    { top: '72%', right: '12%', rotate: '-25deg', animDelay: '1.1s',  animDur: '4s'   },
    { top: '45%', left: '5%',   rotate: '45deg',  animDelay: '1.6s',  animDur: '3.6s' },
  ];

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#07070f' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
        >
          {/* Radial glow behind logo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(168,220,232,0.07) 0%, transparent 72%)',
            }}
          />

          {/* Floating coffee beans */}
          {beans.map((b, i) => (
            <CoffeeBean
              key={i}
              style={{
                position: 'absolute',
                top: b.top,
                left: (b as { left?: string }).left,
                right: (b as { right?: string }).right,
                transform: `rotate(${b.rotate})`,
                animation: `beanFloat ${b.animDur} ease-in-out infinite alternate`,
                animationDelay: b.animDelay,
                opacity: 0.7,
              }}
            />
          ))}

          {/* Logo + steam group */}
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0.78, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.2, 0.64, 1] }}
          >
            {/* Steam SVG above cup */}
            <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)' }}>
              <svg width="120" height="80" viewBox="0 0 120 80" overflow="visible">
                <SteamWisp x={30}  delay={0}    />
                <SteamWisp x={60}  delay={0.55} />
                <SteamWisp x={90}  delay={1.1}  />
              </svg>
            </div>

            {/* Logo mark — SVG recreation of sky 7 style */}
            <div className="relative mb-2 select-none" style={{ width: '200px', height: '200px' }}>
              <svg
                viewBox="0 0 200 200"
                width="200" height="200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#c8ecf4" />
                    <stop offset="50%"  stopColor="#a8dce8" />
                    <stop offset="100%" stopColor="#7bbfd4" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 7 — main numeral, large & bold */}
                <text
                  x="108" y="105"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="130"
                  fontWeight="900"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fill="url(#logoGrad)"
                  filter="url(#glow)"
                  opacity="0.88"
                >7</text>

                {/* Sky — italic script over the 7 */}
                <text
                  x="108" y="138"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="42"
                  fontWeight="700"
                  fontStyle="italic"
                  fontFamily="Georgia, 'Palatino Linotype', serif"
                  fill="url(#logoGrad)"
                  filter="url(#glow)"
                  letterSpacing="2"
                >Sky</text>

                {/* Decorative fragment top-left (matches logo accent shards) */}
                <rect x="26" y="22" width="28" height="10" rx="6" fill="url(#logoGrad)" opacity="0.55" transform="rotate(-5,26,22)" />
                {/* Decorative fragment top-right */}
                <rect x="142" y="18" width="22" height="9" rx="5" fill="url(#logoGrad)" opacity="0.45" transform="rotate(8,142,18)" />
                {/* Decorative fragment bottom */}
                <rect x="92" y="170" width="16" height="8" rx="4" fill="url(#logoGrad)" opacity="0.5" transform="rotate(-3,92,170)" />
              </svg>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              style={{
                color: 'rgba(168,220,232,0.55)',
                fontFamily: "'Cairo', 'Inter', sans-serif",
                fontSize: '13px',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                marginTop: '-6px',
              }}
            >
              CAFÉ & LOUNGE
            </motion.p>
          </motion.div>

          {/* Bottom loading dots */}
          <motion.div
            className="absolute bottom-14 flex gap-2 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {[0, 0.2, 0.4].map((d, i) => (
              <motion.span
                key={i}
                style={{
                  display: 'block', width: '5px', height: '5px',
                  borderRadius: '50%', background: '#a8dce8',
                }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, delay: d, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}