'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress(prev => {
        const newVal = prev + Math.random() * 12 + 4;
        if (newVal >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setHidden(true);
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        return newVal;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 bg-[#06080f] z-[999999] flex flex-col items-center justify-center gap-7 transition-opacity duration-800">
      <svg viewBox="0 0 240 240" height="120" width="120" className="w-24 h-24">
        <circle strokeLinecap="round" strokeDashoffset="-330" strokeDasharray="0 660" strokeWidth="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className="stroke-[#9708F4] animate-[ringA_2s_linear_infinite]" />
        <circle strokeLinecap="round" strokeDashoffset="-110" strokeDasharray="0 220" strokeWidth="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className="stroke-[#5E14E4] animate-[ringB_2s_linear_infinite]" />
        <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className="stroke-[#9708F4] animate-[ringC_2s_linear_infinite]" />
        <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className="stroke-[#5E14E4] animate-[ringD_2s_linear_infinite]" />
      </svg>
      <div className="text-[#8892a0] text-sm font-bold tracking-[0.2em] uppercase animate-pulse font-head">
        Memuat <span className="text-[#8b5cf6]">Scrape Website</span>
      </div>
      <div className="w-[200px] h-[3px] bg-white/5 rounded-full overflow-hidden">
        <div className="h-full w-0 bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#f472b6] rounded-full transition-all duration-300" style={{ width: progress + '%' }} />
      </div>
      <div className="text-[0.6rem] text-[#8892a0] opacity-30 font-semibold tracking-[0.05em]">
        {Math.floor(progress)}%
      </div>

      <style jsx>{`
        @keyframes ringA {
          from, 4% { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -330; }
          12% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -335; }
          32% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -595; }
          40%, 54% { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -660; }
          62% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -665; }
          82% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -925; }
          90%, to { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -990; }
        }
        @keyframes ringB {
          from, 12% { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -110; }
          20% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -115; }
          40% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -195; }
          48%, 62% { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -220; }
          70% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -225; }
          90% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -305; }
          98%, to { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -330; }
        }
        @keyframes ringC {
          from { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: 0; }
          8% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -5; }
          28% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -175; }
          36%, 58% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -220; }
          66% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -225; }
          86% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -395; }
          94%, to { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -440; }
        }
        @keyframes ringD {
          from, 8% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: 0; }
          16% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -5; }
          36% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -175; }
          44%, 50% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -220; }
          58% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -225; }
          78% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -395; }
          86%, to { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -440; }
        }
      `}</style>
    </div>
  );
}