import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1';
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      id="custom-cursor"
      ref={cursorRef}
      className="fixed top-0 left-0 w-3 h-3 bg-[#f0f0f0] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] mix-blend-difference opacity-0 transition-[width,height,background-color] duration-300 ease-out hidden md:flex items-center justify-center text-[10px] font-extrabold text-[#0a0a0a]"
    />
  );
}