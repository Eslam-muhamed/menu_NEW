import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/* ── Config ── replace with real Google Maps link ─────── */
const GOOGLE_REVIEW_URL = 'https://g.page/r/YOUR_PLACE_ID/review';
const OVERALL_RATING    = 4.9;
const TOTAL_REVIEWS     = '1,247';

/* ── Types ─────────────────────────────────────────────── */
type AvatarColor = 'amber' | 'rose' | 'sky' | 'emerald' | 'violet';
interface Review {
  id: number; name: string; date: string;
  rating: number; text: string; initials: string; color: AvatarColor;
}

/* ── Data ───────────────────────────────────────────────── */
const REVIEWS: Review[] = [
  { id:1, name:'محمد أحمد',   date:'منذ أسبوع',    rating:5, initials:'م', color:'amber',
    text:'تجربة رائعة من أول لآخر! القهوة لذيذة جداً والديكور حلو أوي. الجو فيه حاجة مختلفة عن أي كافيه تاني. هرجع تاني أكيد.' },
  { id:2, name:'سارة علي',    date:'منذ أسبوعين', rating:5, initials:'س', color:'rose',
    text:'أحسن كافيه زرته! الموكتيل والوافل كانوا استثنائيين. الخدمة سريعة والطاقم محترم جداً. أنصح كل الناس بالزيارة.' },
  { id:3, name:'عمر خالد',    date:'منذ شهر',      rating:5, initials:'ع', color:'sky',
    text:'جو هادي ومريح للاسترخاء. الشيشة والمشروبات الباردة من أحلى اللي جربتها. مكان مثالي للقعدة مع الأصحاب.' },
  { id:4, name:'نور إبراهيم', date:'منذ شهر',      rating:5, initials:'ن', color:'emerald',
    text:'من أجمل الكافيهات! كل حاجة مميزة من الأكل للمشروبات. الكريب والسموذي كانوا لذيذين جداً.' },
  { id:5, name:'لينا مصطفى', date:'منذ شهرين',    rating:5, initials:'ل', color:'violet',
    text:'مكان رائع بكل المقاييس، الجو الهادئ والخدمة المميزة يخليه اختيار مثالي لقضاء وقت ممتع مع الأصدقاء.' },
];

const DIST = [
  { s:5, p:82 }, { s:4, p:12 }, { s:3, p:4 }, { s:2, p:1 }, { s:1, p:1 },
];

const AV: Record<AvatarColor, { bg:string; bd:string; fg:string }> = {
  amber:   { bg:'rgba(201,153,61,0.22)',  bd:'rgba(240,200,98,0.4)',   fg:'#f0c862' },
  rose:    { bg:'rgba(220,80,100,0.18)', bd:'rgba(240,120,140,0.35)', fg:'#f48090' },
  sky:     { bg:'rgba(80,160,220,0.18)', bd:'rgba(120,190,240,0.35)', fg:'#78c8f0' },
  emerald: { bg:'rgba(60,180,120,0.18)', bd:'rgba(100,200,150,0.35)', fg:'#64c896' },
  violet:  { bg:'rgba(140,100,220,0.18)',bd:'rgba(170,130,240,0.35)', fg:'#aa82f0' },
};

/* ── useInView ──────────────────────────────────────────── */
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, on };
}

/* ── CountUp ─────────────────────────────────────────────── */
function CountUp({ target, active }: { target: number; active: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now(), dur = 1200;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(parseFloat((target * e).toFixed(1)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);
  return <>{val.toFixed(1)}</>;
}

/* ── Google Logo ─────────────────────────────────────────── */
function GIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink:0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

/* ── Stars ───────────────────────────────────────────────── */
function Stars({ n, size=14, pop=false, active=true }: {
  n: number; size?: number; pop?: boolean; active?: boolean;
}) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'2px' }}>
      {[1,2,3,4,5].map((s, i) => (
        <motion.svg
          key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s <= n ? '#f0c862' : 'none'}
          stroke={s <= n ? '#f0c862' : 'rgba(240,200,98,0.18)'}
          strokeWidth={1.5}
          initial={pop ? { scale:0, opacity:0 } : false}
          animate={pop && active ? { scale:1, opacity:1 } : {}}
          transition={pop ? { delay:0.3+i*0.07, type:'spring', stiffness:380, damping:14 } : {}}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </motion.svg>
      ))}
    </div>
  );
}

/* ── Review Card ─────────────────────────────────────────── */
function ReviewCard({ r, idx, show }: { r: Review; idx: number; show: boolean }) {
  const [exp, setExp] = useState(false);
  const c = AV[r.color];
  const long = r.text.length > 115;
  const text = exp || !long ? r.text : r.text.slice(0, 115) + '…';

  return (
    <motion.div
      initial={{ opacity:0, y:28 }}
      animate={show ? { opacity:1, y:0 } : {}}
      transition={{ delay:0.18+idx*0.09, duration:0.5, ease:[0.16,1,0.3,1] }}
      whileHover={{ y:-5, boxShadow:'0 20px 52px rgba(0,0,0,0.2), 0 0 0 1px rgba(201,153,61,0.22)' }}
      style={{
        position:'relative', minWidth:'282px', maxWidth:'300px', flexShrink:0,
        borderRadius:'22px', overflow:'hidden',
        background:'var(--bg-card)', border:'1px solid var(--border-2)',
        boxShadow:'0 3px 18px rgba(0,0,0,0.08)',
        backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
        willChange:'transform',
      }}
    >
      {/* Gold top accent */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:'2px',
        background:'linear-gradient(90deg,transparent,rgba(201,153,61,0.55),transparent)',
        pointerEvents:'none',
      }}/>
      {/* Corner glow */}
      <div style={{
        position:'absolute', top:'-35px', right:'-35px',
        width:'110px', height:'110px', borderRadius:'50%',
        background:`radial-gradient(circle,${c.bg} 0%,transparent 70%)`,
        pointerEvents:'none',
      }}/>

      <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'12px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px' }} dir="rtl">
          <div style={{ display:'flex', alignItems:'center', gap:'10px', flex:1, minWidth:0 }}>
            <div style={{
              width:'44px', height:'44px', borderRadius:'50%', flexShrink:0,
              background:c.bg, border:`1.5px solid ${c.bd}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:"'Cairo',sans-serif", fontWeight:800, fontSize:'17px', color:c.fg,
            }}>
              {r.initials}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ color:'var(--text-1)', fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:'14px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {r.name}
              </p>
              <p style={{ color:'var(--text-4)', fontFamily:"'Cairo',sans-serif", fontSize:'11px', marginTop:'1px' }}>
                {r.date}
              </p>
            </div>
          </div>
          <div style={{ flexShrink:0, opacity:0.85 }}><GIcon size={16}/></div>
        </div>

        <Stars n={r.rating} size={13}/>

        <div dir="rtl">
          <p style={{ color:'var(--text-2)', fontFamily:"'Cairo',sans-serif", fontSize:'13px', lineHeight:'1.7' }}>
            {text}
          </p>
          {long && (
            <button onClick={() => setExp(x => !x)} style={{
              background:'none', border:'none', cursor:'pointer',
              color:'#c9993d', fontFamily:"'Cairo',sans-serif",
              fontSize:'11px', fontWeight:700, marginTop:'5px', padding:0,
            }}>
              {exp ? 'اقرأ أقل' : 'اقرأ أكثر'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════ */
export default function GoogleReviewSection() {
  const { ref, on } = useInView();

  return (
    <section
      id="google-reviews-section"
      ref={ref}
      style={{ paddingTop:'60px', paddingBottom:'20px', overflow:'hidden', position:'relative' }}
      aria-label="تقييمات العملاء"
    >
      {/* Background decoration */}
      <div aria-hidden="true" style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'8%', right:'-12%', width:'280px', height:'280px', borderRadius:'50%', background:'radial-gradient(circle,rgba(201,153,61,0.07) 0%,transparent 65%)' }}/>
        <div style={{ position:'absolute', bottom:'10%', left:'-8%', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(201,153,61,0.05) 0%,transparent 65%)' }}/>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 px-5 mb-10" aria-hidden="true">
        <div style={{ flex:1, height:'1px', background:'linear-gradient(to right,transparent,rgba(201,153,61,0.28))' }}/>
        <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'rgba(201,153,61,0.45)' }}/>
        <div style={{ flex:1, height:'1px', background:'linear-gradient(to left,transparent,rgba(201,153,61,0.28))' }}/>
      </div>

      {/* Header */}
      <motion.div
        className="text-center px-5 mb-7"
        initial={{ opacity:0, y:18 }}
        animate={on ? { opacity:1, y:0 } : {}}
        transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
      >
        <div style={{
          display:'inline-flex', alignItems:'center', gap:'7px',
          padding:'5px 14px', borderRadius:'100px',
          background:'rgba(66,133,244,0.08)', border:'1px solid rgba(66,133,244,0.22)',
          marginBottom:'14px',
        }}>
          <GIcon size={13}/>
          <span style={{ color:'var(--text-3)', fontFamily:"'Cairo',sans-serif", fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase' }}>
            Google Reviews
          </span>
        </div>
        <h2 dir="rtl" style={{ fontFamily:"'Cairo',sans-serif", fontWeight:800, fontSize:'clamp(1.4rem,5vw,1.9rem)', color:'var(--text-1)', lineHeight:1.3 }}>
          ما يقوله{' '}
          <span style={{ background:'linear-gradient(135deg,#c9993d,#f0c862)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            ضيوفنا
          </span>
        </h2>
      </motion.div>

      {/* Hero rating panel */}
      <motion.div
        initial={{ opacity:0, scale:0.94 }}
        animate={on ? { opacity:1, scale:1 } : {}}
        transition={{ delay:0.1, duration:0.55, ease:[0.16,1,0.3,1] }}
        style={{
          margin:'0 16px 22px', padding:'22px 18px', borderRadius:'24px',
          background:'var(--bg-card)', border:'1px solid rgba(201,153,61,0.18)',
          boxShadow:'0 6px 28px rgba(0,0,0,0.07)',
          display:'flex', alignItems:'center', gap:'18px',
        }}
      >
        {/* Big rating */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', flexShrink:0 }}>
          <span style={{ fontFamily:"'Playfair Display','Georgia',serif", fontWeight:800, fontSize:'3.5rem', lineHeight:1, color:'#f0c862' }}>
            <CountUp target={OVERALL_RATING} active={on}/>
          </span>
          <Stars n={5} size={15} pop active={on}/>
          <p dir="rtl" style={{ color:'var(--text-4)', fontFamily:"'Cairo',sans-serif", fontSize:'10px', textAlign:'center', marginTop:'3px' }}>
            {TOTAL_REVIEWS}+ تقييم Google
          </p>
        </div>

        <div style={{ width:'1px', alignSelf:'stretch', background:'var(--border-2)', flexShrink:0 }}/>

        {/* Distribution bars */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'7px' }}>
          {DIST.map(({ s, p }, i) => (
            <div key={s} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <span style={{ color:'var(--text-4)', fontFamily:"'Cairo',sans-serif", fontSize:'10px', fontWeight:600, minWidth:'10px' }}>{s}</span>
              <svg width="7" height="7" viewBox="0 0 24 24" fill="#f0c862" aria-hidden="true" style={{ flexShrink:0 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <div style={{ flex:1, height:'4px', borderRadius:'100px', background:'rgba(201,153,61,0.12)', overflow:'hidden' }}>
                <motion.div
                  initial={{ width:0 }}
                  animate={on ? { width:`${p}%` } : { width:0 }}
                  transition={{ delay:0.38+i*0.07, duration:0.65, ease:'easeOut' }}
                  style={{ height:'100%', borderRadius:'100px', background: s >= 4 ? 'linear-gradient(90deg,#c9993d,#f0c862)' : 'rgba(201,153,61,0.3)' }}
                />
              </div>
              <span style={{ color:'var(--text-4)', fontFamily:"'Cairo',sans-serif", fontSize:'10px', minWidth:'22px', textAlign:'right' }}>{p}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Horizontal scroll */}
      <div className="scrollbar-hide" style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        <div style={{ display:'flex', gap:'12px', padding:'4px 16px 12px' }} dir="rtl">
          {REVIEWS.map((r, i) => (
            <ReviewCard key={r.id} r={r} idx={i} show={on}/>
          ))}
          <div style={{ minWidth:'4px', flexShrink:0 }}/>
        </div>
      </div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity:0, y:14 }}
        animate={on ? { opacity:1, y:0 } : {}}
        transition={{ delay:0.6, duration:0.45 }}
        style={{ padding:'8px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' }}
      >
        <motion.a
          href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer"
          whileHover={{ scale:1.02, y:-2 }} whileTap={{ scale:0.97 }}
          style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:'9px',
            width:'100%', maxWidth:'380px', padding:'15px 24px', borderRadius:'18px',
            background:'linear-gradient(135deg,#c9993d 0%,#f0c862 100%)',
            color:'#07070f', fontFamily:"'Cairo',sans-serif",
            fontWeight:800, fontSize:'15px', textDecoration:'none',
            boxShadow:'0 6px 28px rgba(201,153,61,0.28)',
          }}
        >
          <GIcon size={18}/>
          اكتب تقييمك على Google
        </motion.a>

        <motion.a
          href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer"
          whileHover={{ opacity:0.65 }}
          style={{ display:'flex', alignItems:'center', gap:'5px', color:'var(--text-3)', fontFamily:"'Cairo',sans-serif", fontSize:'12px', textDecoration:'none' }}
          dir="rtl"
        >
          عرض جميع التقييمات على Google
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform:'rotate(180deg)' }}>
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </motion.a>
      </motion.div>
    </section>
  );
}