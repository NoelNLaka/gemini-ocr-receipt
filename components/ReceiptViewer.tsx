
import React from 'react';

interface ReceiptViewerProps {
  image: string;
}

const ReceiptViewer: React.FC<ReceiptViewerProps> = ({ image }) => {
  return (
    <div className="relative w-full bg-[#131516] flex items-center justify-center p-6 h-[40vh]">
      <div className="relative w-full max-w-[280px] aspect-[3/4] shadow-2xl overflow-hidden rounded-sm ring-1 ring-white/10">
        <div 
          className="absolute inset-0 bg-center bg-no-repeat bg-cover grayscale-[0.2] opacity-90 transition-transform duration-500 hover:scale-110" 
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        
        {/* Mock OCR Highlight Overlays to match requested visual */}
        <div className="absolute top-[10%] left-[10%] w-[80%] h-[5%] border-2 border-primary/50 bg-primary/10 rounded-sm animate-pulse"></div>
        <div className="absolute bottom-[15%] right-[10%] w-[30%] h-[4%] border-2 border-accent/50 bg-accent/10 rounded-sm animate-pulse delay-75"></div>
      </div>

      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined">zoom_in</span>
        </button>
        <button className="size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined">fullscreen</span>
        </button>
      </div>
    </div>
  );
};

export default ReceiptViewer;
