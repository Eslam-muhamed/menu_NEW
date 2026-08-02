import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X as CloseIcon, Hash, RotateCcw, Home } from 'lucide-react';

/* ── Types ──────────────────────────────────────────────────────────── */
type Mark   = 'X' | 'O' | null;
type Phase  = 'setup' | 'playing' | 'result';
type Winner = 'X' | 'O' | 'draw';

const WIN_LINES: number[][] = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

const X_CLR = '#f0c862';
const O_CLR = '#93c5fd';
const DARK  = '#0c0c1e';

function checkWinner(board: Mark[]): { mark: 'X'|'O'; line: number[] } | null {
  for (const ln of WIN_LINES) {
    const [a,b,c] = ln;
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { mark: board[a] as 'X'|'O', line: ln };
  }
  return null;
}

/* ── MarkSymbol ──────────────────────────────────────────────────── */
function MarkSymbol({ mark, glowing }: { mark: 'X'|'O'; glowing: boolean }) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: mark === 'X' ? -15 : 15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 18 }}
      style={{
        display: 'block', fontSize: '2rem', fontWeight: 900, lineHeight: 1,
        fontFamily: 'system-ui, monospace',
        color: mark === 'X' ? X_CLR : O_CLR,
        filter: glowing ? `drop-shadow(0 0 12px ${mark === 'X' ? X_CLR : O_CLR}bb)` : 'none',
      }}
    >
      {mark === 'X' ? '✕' : '◯'}
    </motion.span>
  );
}

/* ── Cell ────────────────────────────────────────────────────────── */
function Cell({ mark, isWin, isDimmed, onClick }: {
  mark: Mark; isWin: boolean; isDimmed: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={!mark ? { scale: 0.86 } : undefined}
      onClick={onClick}
      disabled={!!mark}
      className="aspect-square flex items-center justify-center"
      style={{
        background: isWin ? 'rgba(201,153,61,0.13)' : DARK,
        transition: 'background 0.35s, opacity 0.35s',
        opacity: isDimmed ? 0.28 : 1,
        cursor: mark ? 'default' : 'pointer',
        border: 'none',
        minHeight: '86px',
      }}
    >
      {mark && <MarkSymbol mark={mark} glowing={isWin} />}
    </motion.button>
  );
}

/* ── SetupPhase ──────────────────────────────────────────────────── */
function SetupPhase({ players, onChange, onStart }: {
  players: { X: string; O: string };
  onChange: (k: 'X'|'O', v: string) => void;
  onStart: () => void;
}) {
  const canStart = players.X.trim().length > 0 && players.O.trim().length > 0;

  const inp: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
    color: '#f0ece4', fontFamily: "'Cairo', sans-serif", borderRadius: '14px',
    padding: '12px 16px', width: '100%', fontSize: '15px', outline: 'none',
  };

  return (
    <div className="px-5 pb-6" dir="rtl">
      <p className="text-sm text-center mb-5" style={{ color: '#7a7268', fontFamily: "'Cairo', sans-serif" }}>
        دخّل اسم كل لاعب وابدأوا اللعب!
      </p>

      {/* Player X */}
      <div className="mb-3">
        <label className="flex items-center gap-2 mb-2">
          <span style={{ fontFamily: 'monospace', fontWeight: 900, color: X_CLR, fontSize: '1.1rem' }}>✕</span>
          <span style={{ color: X_CLR, fontFamily: "'Cairo', sans-serif", fontSize: '13px', fontWeight: 600 }}>
            اللاعب الأول (X)
          </span>
        </label>
        <input
          style={inp}
          placeholder="اكتب اسمك هنا..."
          value={players.X}
          onChange={e => onChange('X', e.target.value)}
          maxLength={18}
        />
      </div>

      {/* VS divider */}
      <div className="flex items-center gap-3 my-3">
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        <span style={{ color: '#3a3848', fontSize: '12px', fontWeight: 700 }}>VS</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Player O */}
      <div className="mb-7">
        <label className="flex items-center gap-2 mb-2">
          <span style={{ fontFamily: 'monospace', fontWeight: 900, color: O_CLR, fontSize: '1.1rem' }}>◯</span>
          <span style={{ color: O_CLR, fontFamily: "'Cairo', sans-serif", fontSize: '13px', fontWeight: 600 }}>
            اللاعب التاني (O)
          </span>
        </label>
        <input
          style={inp}
          placeholder="اكتب اسمك هنا..."
          value={players.O}
          onChange={e => onChange('O', e.target.value)}
          maxLength={18}
        />
      </div>

      <motion.button
        whileTap={canStart ? { scale: 0.97 } : undefined}
        onClick={canStart ? onStart : undefined}
        style={{
          width: '100%', padding: '15px', borderRadius: '16px',
          fontWeight: 700, fontSize: '15px', fontFamily: "'Cairo', sans-serif",
          cursor: canStart ? 'pointer' : 'not-allowed', border: 'none',
          background: canStart ? 'linear-gradient(135deg,#c9993d,#f0c862)' : 'rgba(255,255,255,0.05)',
          color: canStart ? '#07070f' : '#4a4850',
          boxShadow: canStart ? '0 6px 24px rgba(201,153,61,0.28)' : 'none',
          transition: 'all 0.25s',
        }}
      >
        ابدأوا اللعب! 🎮
      </motion.button>
    </div>
  );
}

/* ── GamePhase ───────────────────────────────────────────────────── */
function GamePhase({ board, current, players, scores, winLine, hasWinner, onCell, onReset, onHome }: {
  board: Mark[]; current: 'X'|'O'; players: { X: string; O: string };
  scores: { X: number; O: number; draws: number }; winLine: number[] | null;
  hasWinner: boolean; onCell: (i: number) => void; onReset: () => void; onHome: () => void;
}) {
  const turnClr = current === 'X' ? X_CLR : O_CLR;

  return (
    <div className="px-4 pb-5">
      {/* Score bar */}
      <div className="flex items-center justify-between px-2 mb-4" dir="rtl">
        <div className="text-center min-w-0 flex-1">
          <p className="text-[11px] font-semibold truncate" style={{ color: X_CLR, fontFamily: "'Cairo',sans-serif" }}>{players.X}</p>
          <p className="text-3xl font-black" style={{ color: X_CLR }}>{scores.X}</p>
        </div>
        <div className="text-center px-3">
          <p className="text-[10px]" style={{ color: '#3a3848', fontFamily: "'Cairo',sans-serif" }}>تعادل</p>
          <p className="text-xl font-bold" style={{ color: '#3a3848' }}>{scores.draws}</p>
        </div>
        <div className="text-center min-w-0 flex-1">
          <p className="text-[11px] font-semibold truncate" style={{ color: O_CLR, fontFamily: "'Cairo',sans-serif" }}>{players.O}</p>
          <p className="text-3xl font-black" style={{ color: O_CLR }}>{scores.O}</p>
        </div>
      </div>

      {/* Turn indicator */}
      <AnimatePresence mode="wait">
        {!hasWinner && (
          <motion.div key={current}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }} className="flex justify-center mb-4"
          >
            <span className="inline-flex items-center gap-2 text-sm font-bold px-4 py-1.5 rounded-full"
              style={{
                background: `${turnClr}18`, border: `1px solid ${turnClr}35`,
                color: turnClr, fontFamily: "'Cairo',sans-serif",
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{current === 'X' ? '✕' : '◯'}</span>
              دور {current === 'X' ? players.X : players.O}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board */}
      <div className="mx-auto mb-5 rounded-2xl overflow-hidden"
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px', background: 'rgba(201,153,61,0.15)', maxWidth: '288px',
        }}
      >
        {board.map((cell, i) => (
          <Cell key={i} mark={cell}
            isWin={winLine?.includes(i) ?? false}
            isDimmed={winLine !== null && !(winLine.includes(i))}
            onClick={() => onCell(i)}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        {[
          { icon: <RotateCcw className="w-3.5 h-3.5" />, label: 'إعادة', action: onReset },
          { icon: <Home className="w-3.5 h-3.5" />, label: 'لعبة جديدة', action: onHome },
        ].map(btn => (
          <button key={btn.label} onClick={btn.action}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-70"
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#7a7268', fontFamily: "'Cairo',sans-serif", cursor: 'pointer',
            }}
          >
            {btn.icon}{btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── ResultPhase ─────────────────────────────────────────────────── */
function ResultPhase({ winner, players, scores, onNextRound, onNewGame }: {
  winner: Winner; players: { X: string; O: string };
  scores: { X: number; O: number; draws: number };
  onNextRound: () => void; onNewGame: () => void;
}) {
  const isDraw  = winner === 'draw';
  const winName = isDraw ? '' : (winner === 'X' ? players.X : players.O);
  const winClr  = isDraw ? '#7a7268' : (winner === 'X' ? X_CLR : O_CLR);

  return (
    <div className="px-5 pb-6" dir="rtl">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        className="text-center mb-6"
      >
        <div style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '14px' }} className="select-none">
          {isDraw ? '🤝' : '🏆'}
        </div>
        <h3 className="font-black text-2xl mb-1" style={{ color: winClr, fontFamily: "'Cairo',sans-serif" }}>
          {isDraw ? 'تعادل!' : `${winName} فاز! 🎉`}
        </h3>
        <p style={{ color: '#7a7268', fontFamily: "'Cairo',sans-serif", fontSize: '13px' }}>
          {isDraw ? 'جولة كويسة، عوا تاني!' : 'مبروك الفوز 🌟'}
        </p>
      </motion.div>

      {/* Score summary */}
      <div className="flex items-center justify-around py-4 px-3 rounded-2xl mb-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {[
          { name: players.X, score: scores.X, clr: X_CLR },
          { name: 'تعادل', score: scores.draws, clr: '#3a3848' },
          { name: players.O, score: scores.O, clr: O_CLR },
        ].map(p => (
          <div key={p.name} className="text-center">
            <p className="text-[11px] truncate max-w-[70px]" style={{ color: p.clr, fontFamily: "'Cairo',sans-serif" }}>{p.name}</p>
            <p className="text-3xl font-black" style={{ color: p.clr }}>{p.score}</p>
          </div>
        ))}
      </div>

      <motion.button whileTap={{ scale: 0.97 }} onClick={onNextRound}
        style={{
          display: 'block', width: '100%', padding: '15px', borderRadius: '16px',
          marginBottom: '10px', fontWeight: 700, fontSize: '15px',
          fontFamily: "'Cairo',sans-serif", border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg,#c9993d,#f0c862)', color: '#07070f',
          boxShadow: '0 6px 24px rgba(201,153,61,0.28)',
        }}
      >
        جولة تانية 🔄
      </motion.button>

      <button onClick={onNewGame}
        className="flex items-center justify-center gap-2 transition-opacity hover:opacity-70"
        style={{
          width: '100%', padding: '13px', borderRadius: '14px',
          fontWeight: 600, fontSize: '14px', fontFamily: "'Cairo',sans-serif",
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: '#7a7268', cursor: 'pointer',
        }}
      >
        <Home className="w-4 h-4" />
        لعبة جديدة
      </button>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────── */
export default function XOGame({ onClose }: { onClose: () => void }) {
  const [phase,     setPhase]     = useState<Phase>('setup');
  const [players,   setPlayers]   = useState<{ X: string; O: string }>({ X: '', O: '' });
  const [board,     setBoard]     = useState<Mark[]>(Array(9).fill(null));
  const [current,   setCurrent]   = useState<'X'|'O'>('X');
  const [winResult, setWinResult] = useState<{ mark: 'X'|'O'; line: number[] } | null>(null);
  const [winner,    setWinner]    = useState<Winner | null>(null);
  const [scores,    setScores]    = useState<{ X: number; O: number; draws: number }>({ X: 0, O: 0, draws: 0 });

  const handleCell = (idx: number) => {
    if (board[idx] || winner) return;
    const nb = [...board] as Mark[];
    nb[idx]  = current;
    setBoard(nb);

    const wr = checkWinner(nb);
    if (wr) {
      setWinResult(wr);
      setWinner(wr.mark);
      setScores(p => ({ ...p, [wr.mark]: p[wr.mark] + 1 }));
      setTimeout(() => setPhase('result'), 900);
    } else if (nb.every(Boolean)) {
      setWinner('draw');
      setScores(p => ({ ...p, draws: p.draws + 1 }));
      setTimeout(() => setPhase('result'), 500);
    } else {
      setCurrent(c => c === 'X' ? 'O' : 'X');
    }
  };

  const nextRound = () => {
    const first: 'X'|'O' = winner && winner !== 'draw' ? winner : (current === 'X' ? 'O' : 'X');
    setBoard(Array(9).fill(null));
    setCurrent(first);
    setWinResult(null);
    setWinner(null);
    setPhase('playing');
  };

  const newGame = () => {
    setBoard(Array(9).fill(null));
    setCurrent('X');
    setWinResult(null);
    setWinner(null);
    setScores({ X: 0, O: 0, draws: 0 });
    setPlayers({ X: '', O: '' });
    setPhase('setup');
  };

  const phaseTitles: Record<Phase, string> = {
    setup: 'لعبة X O 🎮',
    playing: 'X O',
    result: 'النتيجة',
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ background: 'rgba(7,7,15,0.88)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="relative w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        style={{
          background: DARK, maxHeight: '95svh',
          border: '1px solid rgba(201,153,61,0.18)',
          boxShadow: '0 0 80px rgba(201,153,61,0.1), 0 -20px 60px rgba(0,0,0,0.8)',
        }}
      >
        <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: '95svh' }}>
          {/* Gold top line */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg,transparent,#c9993d 28%,#f0c862 50%,#c9993d 72%,transparent)' }} />

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
              <Hash className="w-5 h-5" style={{ color: '#f0c862' }} />
            </div>
            <h2 style={{ color: '#f0ece4', fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>
              {phaseTitles[phase]}
            </h2>
            {phase === 'setup' && (
              <p style={{ color: '#7a7268', fontFamily: "'Cairo',sans-serif", fontSize: '12px' }}>
                العبوا مع بعض وانتو تستنّوا طلبكم!
              </p>
            )}
          </div>

          {/* Phase content */}
          <AnimatePresence mode="wait">
            {phase === 'setup' && (
              <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <SetupPhase players={players} onChange={(k, v) => setPlayers(p => ({ ...p, [k]: v }))} onStart={() => setPhase('playing')} />
              </motion.div>
            )}
            {phase === 'playing' && (
              <motion.div key="playing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <GamePhase
                  board={board} current={current} players={players} scores={scores}
                  winLine={winResult?.line ?? null} hasWinner={winner !== null}
                  onCell={handleCell}
                  onReset={() => { setBoard(Array(9).fill(null)); setCurrent('X'); setWinResult(null); setWinner(null); }}
                  onHome={newGame}
                />
              </motion.div>
            )}
            {phase === 'result' && winner && (
              <motion.div key="result" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
                <ResultPhase winner={winner} players={players} scores={scores} onNextRound={nextRound} onNewGame={newGame} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close button */}
        <button onClick={onClose}
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