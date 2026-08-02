import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SurpriseModal from '@/components/features/SurpriseModal';

export default function SurpriseButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="surprise-float-btn fixed bottom-6 right-4 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full font-bold text-sm"
        style={{
          background: 'linear-gradient(135deg, #c9993d 0%, #f0c862 100%)',
          color: '#07070f',
          fontFamily: "'Cairo', sans-serif",
        }}
        aria-label="ابهرني — نظام ترشيح ذكي من المنيو"
      >
        <Sparkles className="w-[17px] h-[17px]" />
        ابهرني
      </button>

      <AnimatePresence>
        {open && <SurpriseModal key="surprise-modal" onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}