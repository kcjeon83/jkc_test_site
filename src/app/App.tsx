import { useState } from 'react';
import { Carousel } from './components/Carousel';
import { DetailOverlay } from './components/DetailOverlay';

export default function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  
  return (
    <div className="bg-[#0a0a0a] text-[#f0f0f0] font-sans w-screen h-screen overflow-hidden select-none relative">
      {/* Header (logo + nav, aligned like the sub-pages' #hd) */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-end justify-between px-[18px] pt-[14px] pb-[10px] md:px-12 md:pt-[30px] md:pb-5 pointer-events-none">
        {/* Logo */}
        <div className="text-[16px] md:text-[22px] font-extrabold text-[#f0f0f0] uppercase pointer-events-none" style={{fontFamily:'Pretendard, sans-serif', letterSpacing:'0.1em'}}>
          jeonkicheol
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-6 md:gap-9 pointer-events-auto">
          {['Collection', 'Reviews', 'Releases'].map((label) => (
            <span
              key={label}
              className="text-[12px] tracking-[2px] uppercase font-sans font-semibold text-[#f0f0f0]/50 hover:text-[#f0f0f0] transition-colors duration-300 cursor-pointer"
            >
              {label}
            </span>
          ))}
        </nav>
      </div>
      
      {/* Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-[25vw] md:text-[18vw] font-extrabold text-white/5 whitespace-nowrap z-0 pointer-events-none tracking-tighter">
        ARCHIVE
      </div>
      
      {/* Center Guide UI */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10 opacity-50 pointer-events-none">
        <span className="text-[10px] tracking-[2px] font-bold text-[#f0f0f0]">DRAG OR SCROLL</span>
        <div className="w-[1px] h-[30px] bg-[#f0f0f0]" />
      </div>

      {/* 3D Carousel Scene */}
      <Carousel onSelect={setSelectedItem} active={!selectedItem} />
      
      {/* Detail Overlay View */}
      <DetailOverlay item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}