'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WelcomeModal({ onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isHidden = localStorage.getItem('show_welcome') === 'false';
    if (!isHidden) {
      setTimeout(() => setShow(true), 300);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999998] flex items-center justify-center p-5 bg-black/70 backdrop-blur-xl animate-[modalFade_0.6s_ease]" onClick={handleClose}>
      <div className="max-w-[420px] w-full bg-[rgba(18,22,36,0.92)] backdrop-blur-xl rounded-[28px] p-8 border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.03),transparent_60%)]" />

        <button className="absolute top-3.5 right-4 z-10 bg-white/5 border border-white/5 rounded-full w-9 h-9 text-[#8892a0] text-sm cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 hover:rotate-90" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="relative z-[1] flex flex-col items-center justify-center mb-5 pt-5 pb-2.5">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] pointer-events-none bg-gradient-to-t from-purple-500/0 via-purple-500/5 to-transparent rounded-[50%_50%_0_0/100%_100%_0_0]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[250px] h-[130px] pointer-events-none bg-[radial-gradient(ellipse_at_center_bottom,rgba(139,92,246,0.08),transparent_70%)] rounded-full blur-[20px]" />

          <div className="relative w-[120px] h-[120px] z-[2]">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-[#06080f] border-2 border-purple-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_40px_rgba(139,92,246,0.05)] transition-all duration-400 hover:border-purple-500/30 hover:shadow-[0_12px_48px_rgba(0,0,0,0.5),0_0_60px_rgba(139,92,246,0.08)] hover:scale-[1.02]">
              <img src="/ft/foto.png" alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
            </div>
            <div className="absolute inset-[-6px] rounded-[20px] border-[1.5px] border-purple-500/10 pointer-events-none transition-all duration-400 group-hover:border-purple-500/15 group-hover:inset-[-8px]" />
            <div className="absolute -top-px -right-px w-[30px] h-[30px] pointer-events-none border-t-2 border-r-2 border-purple-500/20 rounded-tr-[14px] transition-all duration-400 group-hover:border-purple-500/30" />
            <div className="absolute -bottom-px -left-px w-[30px] h-[30px] pointer-events-none border-b-2 border-l-2 border-purple-500/20 rounded-bl-[14px] transition-all duration-400 group-hover:border-purple-500/30" />
          </div>
        </div>

        <div className="relative z-[1] text-center">
          <div className="text-[0.55rem] font-bold uppercase tracking-[0.1em] text-[#8892a0] opacity-30 mb-1">Selamat Datang</div>
          <h1 className="font-head text-[1.6rem] font-extrabold text-white mb-0.5 tracking-[-0.02em]">
            Scrape <span className="bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">Website</span>
          </h1>
          <div className="text-[0.7rem] text-[#8892a0] opacity-40 font-medium mb-3.5">by lifxprg</div>
          <p className="text-[0.8rem] text-[#8892a0] opacity-40 leading-relaxed max-w-[320px] mx-auto mb-5">
            Tools scraping website terbaik. Download seluruh konten website dalam satu file ZIP. Cepat, gratis, dan tanpa batasan.
          </p>

          <button className="inline-flex items-center gap-2.5 px-8 py-3 border-none rounded-full font-head font-bold text-[0.85rem] text-white cursor-pointer relative overflow-hidden bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] shadow-[0_4px_24px_rgba(139,92,246,0.2)] transition-all duration-400 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(139,92,246,0.35)] active:scale-[0.97]" onClick={() => alert('Hubungi kami di:\nEmail: support@scrapeweb.com\nWhatsApp: +62 812-3456-7890')}>
            <span className="relative z-10 text-sm transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110"><i className="fas fa-paper-plane"></i></span>
            <span className="relative z-10">Hubungi Kami</span>
          </button>

          <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-white/5">
            <a href="#" className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[#8892a0] text-[0.9rem] bg-white/5 border border-white/5 transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/15 hover:text-purple-500 hover:-translate-y-1"><i className="fab fa-github"></i></a>
            <a href="#" className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[#8892a0] text-[0.9rem] bg-white/5 border border-white/5 transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/15 hover:text-purple-500 hover:-translate-y-1"><i className="fab fa-twitter"></i></a>
            <a href="#" className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[#8892a0] text-[0.9rem] bg-white/5 border border-white/5 transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/15 hover:text-purple-500 hover:-translate-y-1"><i className="fab fa-instagram"></i></a>
            <a href="#" className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[#8892a0] text-[0.9rem] bg-white/5 border border-white/5 transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/15 hover:text-purple-500 hover:-translate-y-1"><i className="fab fa-youtube"></i></a>
            <a href="#" className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[#8892a0] text-[0.9rem] bg-white/5 border border-white/5 transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/15 hover:text-purple-500 hover:-translate-y-1"><i className="fab fa-discord"></i></a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .group:hover .group-hover\\:inset-\\[-8px\\] { inset: -8px; }
        .group:hover .group-hover\\:rotate-\\[-8deg\\] { transform: rotate(-8deg); }
        .group:hover .group-hover\\:scale-110 { transform: scale(1.1); }
      `}</style>
    </div>
  );
}