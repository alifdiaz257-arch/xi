'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function IQCPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(hours + ':' + minutes);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Isi pesan terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');
    setShowResult(false);

    try {
      const url = 'https://api.azbry.com/api/maker/iqc?text=' + encodeURIComponent(text);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(url, { signal: controller.signal, mode: 'cors' });
      clearTimeout(timeout);

      if (!res.ok) throw new Error('API error: ' + res.status);
      const ct = res.headers.get('content-type');
      if (!ct || !ct.includes('image')) throw new Error('API tidak mengembalikan gambar');

      const blob = await res.blob();
      if (blob.size === 0) throw new Error('Gambar kosong');

      if (imageUrl) URL.revokeObjectURL(imageUrl);
      const newUrl = URL.createObjectURL(blob);
      setImageUrl(newUrl);
      setShowResult(true);
    } catch (err) {
      console.error(err);
      if (err.name === 'AbortError') setError('Waktu habis. Coba lagi.');
      else setError(err.message || 'Gagal generate.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) {
      setError('Tidak ada gambar.');
      return;
    }
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'iqc-' + Date.now() + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNew = () => {
    setShowResult(false);
    setText('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerate();
    }
  };

  return (
    <div className="max-w-[420px] w-full mx-auto px-5 pb-10 pt-20 relative z-[1]">
      <div className="w-full bg-[rgba(18,22,36,0.75)] backdrop-blur-[16px] rounded-[28px] p-7 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-[containerIn_0.9s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 translate-y-[40px] scale-[0.98]">
        <div className="flex justify-between items-center mb-7 pb-4 border-b border-white/5 animate-[fadeSlide_0.6s_ease_0.15s_forwards] opacity-0 translate-y-2.5">
          <div>
            <div className="font-head text-[1.6rem] font-bold tracking-[-0.5px] text-white bg-gradient-to-r from-white/80 to-white/40 bg-clip-text text-transparent">
              IQC<span className="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] bg-clip-text text-transparent">Studio</span>
            </div>
            <div className="text-[0.65rem] text-white/15 tracking-[0.1em] font-normal mt-0.5">v3.0 mobile</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[0.6rem] font-semibold text-[#4ade80] tracking-[0.04em] uppercase animate-[pulseBadge_2s_ease-in-out_infinite]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-[dotPulse_1.6s_ease-in-out_infinite]"></span>
              Ready
            </div>
          </div>
        </div>

        <div className="mb-4 animate-[fadeSlide_0.6s_ease_0.2s_forwards] opacity-0 translate-y-2.5">
          <label className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.05em] text-white/20 mb-1.5">
            <svg className="w-3.5 h-3.5 stroke-white/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Pesan
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan..."
            className="w-full px-4 py-3.5 bg-white/5 border border-white/5 rounded-xl text-white text-[0.95rem] font-medium outline-none transition-all duration-300 placeholder:text-white/10 placeholder:font-normal focus:border-purple-500/20 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.03)]"
            autoFocus
          />
        </div>

        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[0.9rem] text-white/40 mb-4 animate-[fadeSlide_0.6s_ease_0.25s_forwards] opacity-0 translate-y-2.5">
          <svg className="w-4 h-4 stroke-white/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Waktu sekarang:</span>
          <span className="text-white font-semibold tabular-nums">{currentTime}</span>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[#f87171] text-[0.8rem] mb-4 animate-[shake_0.4s_ease]">
            <svg className="w-4 h-4 stroke-current opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full px-4 py-3.5 border-none rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white text-[0.95rem] font-semibold cursor-pointer transition-all duration-[0.35s] flex items-center justify-center gap-2.5 tracking-[0.025em] mt-1 mb-5 relative overflow-hidden shadow-[0_4px_24px_rgba(124,58,237,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(124,58,237,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:-translate-y-0"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-600 hover:translate-x-full"></span>
          <svg className="w-[18px] h-[18px] stroke-current relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span className="relative z-10">{loading ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : 'Generate'}</span>
        </button>

        {showResult && (
          <div className="mt-1 animate-[resultIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <div className="w-full rounded-2xl overflow-hidden border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] mb-4 transition-shadow duration-400 hover:shadow-[0_16px_56px_rgba(0,0,0,0.6)]">
              <img src={imageUrl} alt="Generated" className="w-full block animate-[imgReveal_0.8s_ease_forwards]" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button onClick={handleDownload} className="px-3 py-3 rounded-xl border border-white/5 bg-white/5 text-white text-[0.85rem] font-medium cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/10 hover:-translate-y-0.5 active:scale-[0.96]">
                <svg className="w-4 h-4 stroke-current opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download
              </button>
              <button onClick={handleNew} className="px-3 py-3 rounded-xl border border-white/5 bg-white/5 text-white text-[0.85rem] font-medium cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/10 hover:-translate-y-0.5 active:scale-[0.96]">
                <svg className="w-4 h-4 stroke-current opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Baru
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-white/5 flex justify-center items-center gap-3 animate-[fadeSlide_0.6s_ease_0.5s_forwards] opacity-0 translate-y-2.5">
          <div className="text-[0.65rem] text-white/10 tracking-[0.075em]">DEV BY <strong className="text-white/20 font-medium">lifxXd</strong></div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-[#8892a0] no-underline text-[0.7rem] font-semibold transition-all duration-250 hover:text-white">
            <i className="fas fa-arrow-left"></i> Kembali
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes containerIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeSlide {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes resultIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes imgReveal {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.7); }
        }
        @keyframes pulseBadge {
          0%, 100% { border-color: rgba(74,222,128,0.1); }
          50% { border-color: rgba(74,222,128,0.25); }
        }
        .transition-duration-600 {
          transition-duration: 600ms;
        }
        .group:hover .group-hover\\:translate-x-full {
          transform: translateX(100%);
        }
      `}</style>
    </div>
  );
}