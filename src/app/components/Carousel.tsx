import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity, useAnimationFrame } from 'motion/react';
import { GALLERY_ITEMS } from '../data';

interface CarouselProps {
  onSelect: (item: any) => void;
  active: boolean;
}

export function Carousel({ onSelect, active }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  
  // Spring physics for smooth scroll interpolation
  const springConfig = { damping: 30, stiffness: 200, mass: 1 };
  const smoothX = useSpring(scrollX, springConfig);
  
  // Velocity calculation for dynamic skewing (elastic/jelly effect)
  const velocityX = useVelocity(smoothX);
  const skewX = useTransform(velocityX, [-2000, 2000], [-10, 10], { clamp: true });

  const isDragging = useRef(false);
  const lastX = useRef(0);
  const targetX = useRef(0);
  
  // Content bounds calculation
  const [bounds, setBounds] = useState({ min: 0, max: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        // Assume padding on sides, and item width + gap
        const viewportWidth = window.innerWidth;
        const totalContentWidth = GALLERY_ITEMS.length * (viewportWidth > 768 ? 320 : viewportWidth * 0.65) + (GALLERY_ITEMS.length - 1) * (viewportWidth > 768 ? 16 : 8);
        const maxScroll = Math.max(0, totalContentWidth - viewportWidth + (viewportWidth * 0.4)); 
        // Adding extra space so the last item can reach the middle or further
        
        setBounds({ min: -maxScroll, max: viewportWidth * 0.2 });
      }
    };
    
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!active) return;
    isDragging.current = true;
    lastX.current = e.clientX;
    document.body.style.cursor = 'grabbing';
    
    const cursor = document.getElementById('custom-cursor');
    if (cursor) cursor.setAttribute('data-text', 'DRAG');
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !active) return;
    const delta = e.clientX - lastX.current;
    targetX.current += delta;
    
    // Soft boundary resistance
    if (targetX.current > bounds.max) {
        targetX.current = bounds.max + (targetX.current - bounds.max) * 0.1;
    } else if (targetX.current < bounds.min) {
        targetX.current = bounds.min + (targetX.current - bounds.min) * 0.1;
    }
    
    scrollX.set(targetX.current);
    lastX.current = e.clientX;
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = 'default';
    
    // Snap back to bounds if exceeded
    if (targetX.current > bounds.max) {
        targetX.current = bounds.max;
        scrollX.set(targetX.current);
    } else if (targetX.current < bounds.min) {
        targetX.current = bounds.min;
        scrollX.set(targetX.current);
    }

    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
      cursor.setAttribute('data-text', cursor.classList.contains('hover-state') ? 'VIEW' : '');
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!active) return;
    targetX.current -= e.deltaY * 1.5;
    targetX.current -= e.deltaX * 1.5;
    
    if (targetX.current > bounds.max) targetX.current = bounds.max;
    if (targetX.current < bounds.min) targetX.current = bounds.min;
    
    scrollX.set(targetX.current);
  };

  return (
    <div 
      className="absolute inset-0 flex items-center w-full h-full overflow-hidden touch-none z-10"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    >
      <motion.div 
        ref={containerRef}
        className="flex items-center gap-2 md:gap-4 px-[10vw] md:px-[30vw] h-full"
        style={{ x: smoothX }}
      >
        {GALLERY_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            className="relative shrink-0 cursor-pointer group w-[65vw] h-[65vh] md:w-[320px] md:h-[600px] origin-bottom"
            style={{ skewX }}
            onClick={() => {
              if (active && !isDragging.current) onSelect(item);
            }}
            onMouseEnter={() => {
              const cursor = document.getElementById('custom-cursor');
              if (cursor) {
                cursor.classList.add('hover-state');
                cursor.setAttribute('data-text', 'VIEW');
              }
            }}
            onMouseLeave={() => {
              const cursor = document.getElementById('custom-cursor');
              if (cursor) {
                cursor.classList.remove('hover-state');
                cursor.setAttribute('data-text', '');
              }
            }}
          >
            {/* Image container */}
            <div className="w-full h-full overflow-hidden relative shadow-2xl transition-colors duration-700" style={{ backgroundColor: '#3b3b3b' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3b3b3b')}
            >
              <motion.div
                className="w-full h-full bg-cover bg-center transition-all duration-700 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.src})` }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Subtle index / label below or inside */}
            <div className="absolute -bottom-8 left-0 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <span className="text-[#d4af37] font-serif text-lg italic">{item.title}</span>
                <span className="text-[#a0a0a0] font-sans text-xs tracking-widest uppercase">{item.subtitle}</span>
            </div>
            
            {/* Index number on side (bookshelf style detail) */}
            <div className="absolute top-4 -right-10 rotate-90 origin-left text-[#666] font-sans text-xs tracking-[0.3em] opacity-50 font-bold">
                NO. {String(i + 1).padStart(2, '0')}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}