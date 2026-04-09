import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';

interface DetailOverlayProps {
  item: { id: number; src: string; title: string; subtitle?: string; link?: string } | null;
  onClose: () => void;
}

export function DetailOverlay({ item, onClose }: DetailOverlayProps) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="detail-overlay"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto overflow-hidden"
          style={{ background: item.link ? '#0c0b09' : '#fafafa' }}
        >
          {item.link ? (
            /* iframe mode for linked items */
            <iframe
              src={item.link}
              className="w-full h-full border-0"
              title={item.title}
            />
          ) : (
            <>
              {/* Background Typography (Oversized, Golden, Serif) */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 0.1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] text-center text-[20vw] font-serif font-bold italic text-[#d4af37] whitespace-nowrap z-0 pointer-events-none mix-blend-multiply opacity-20"
              >
                {item.title}
              </motion.div>

              {/* Main Layout Grid */}
              <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-16 items-center text-[#1a1a1a]">

                {/* Left Content Column */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                  className="md:col-span-4 flex flex-col justify-center order-2 md:order-1 h-full md:pr-12"
                >
                  <h2 className="text-[#a0a0a0] font-sans text-xs tracking-[0.2em] uppercase mb-4 font-bold">
                    Project No. {String(item.id).padStart(2, '0')}
                  </h2>
                  <h1 className="font-serif text-[10vw] md:text-[5vw] italic text-[#1a1a1a] mb-6 leading-[1.1] font-medium whitespace-[break-spaces]">
                    {item.title}
                  </h1>

                  <div className="w-12 h-[1px] bg-[#d4af37] mb-8" />

                  <p className="text-sm md:text-base leading-relaxed text-[#555] font-sans font-light max-w-sm mb-10">
                    사반세기를 가로 질러 온 위대한 숨결,그 찬란한 성좌 아래 용사님들이 빚어낸 25년의 경이로운 유산! 긴 세월, 꺾이지 않는 기개로 전설의 길을 갈고 닦아 온 용사님들을 예우하며, 그 어느 때보다 찬란한 25주년 기념 어워즈를 개최합니다.
                  </p>

                  <button className="flex items-center gap-4 text-xs tracking-widest uppercase font-semibold text-[#1a1a1a] hover:text-[#d4af37] transition-colors group">
                    Explore Story
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </motion.div>

                {/* Right Image Column */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
                  className="md:col-span-8 h-[60vh] md:h-[80vh] w-full relative order-1 md:order-2"
                >
                  <div
                    className="w-full h-full bg-cover bg-center shadow-2xl"
                    style={{ backgroundImage: `url(${item.src})` }}
                  />
                </motion.div>
              </div>
            </>
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            onClick={onClose}
            className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-2 text-[12px] tracking-[2px] z-[101] cursor-pointer p-2 transition-colors uppercase font-sans font-semibold"
            style={{ color: item.link ? '#f0ebe0' : '#1a1a1a' }}
          >
            CLOSE <X size={16} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}