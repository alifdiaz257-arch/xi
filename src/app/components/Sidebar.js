// src/app/components/Sidebar.js - FULL FIX
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MusicPlayer from './MusicPlayer';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed') === 'true';
    if (window.innerWidth > 700) {
      setCollapsed(saved);
    }
    setShowWelcome(localStorage.getItem('show_welcome') !== 'false');

    // Event listener untuk mobile toggle dari navbar
    const handleMobileToggle = () => {
      setMobileOpen(prev => !prev);
    };

    const mobileToggleBtn = document.getElementById('mobileToggle');
    if (mobileToggleBtn) {
      mobileToggleBtn.addEventListener('click', handleMobileToggle);
    }

    // Close sidebar when clicking overlay
    const overlay = document.querySelector('.sidebar-mobile-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        setMobileOpen(false);
      });
    }

    return () => {
      if (mobileToggleBtn) {
        mobileToggleBtn.removeEventListener('click', handleMobileToggle);
      }
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    localStorage.setItem('sidebar_collapsed', (!collapsed).toString());
  };

  const toggleWelcome = () => {
    const newState = !showWelcome;
    setShowWelcome(newState);
    localStorage.setItem('show_welcome', newState.toString());
    // Show toast notification
    if (window.showToast) {
      window.showToast(newState ? 'Welcome modal akan ditampilkan' : 'Welcome modal disembunyikan');
    }
  };

  return (
    <>
      <div className={`fixed top-0 left-0 h-screen bg-[rgba(10,12,20,0.94)] backdrop-blur-[16px] border-r border-white/5 z-[10000] p-4 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden shadow-[4px_0_32px_rgba(0,0,0,0.3)] transition-all duration-300 ${collapsed ? 'w-[60px]' : 'w-[280px]'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center gap-2.5 py-1.5 px-1 pb-3 border-b border-white/5 mb-1 relative">
          <div className={`text-[1.5rem] text-[#8b5cf6] ${collapsed ? 'flex' : 'hidden'}`}><i className="fas fa-code"></i></div>
          <div className={`font-head font-extrabold text-[1.1rem] text-white tracking-[-0.3px] ${collapsed ? 'hidden' : 'block'}`}>
            Scrape<span className="text-[#8b5cf6]">Web</span>
          </div>
          <button className="absolute top-1/2 -translate-y-1/2 -right-[14px] w-[28px] h-[28px] rounded-full bg-[rgba(18,22,36,0.95)] border border-white/5 text-[#8892a0] cursor-pointer flex items-center justify-center text-[0.7rem] transition-all duration-300 hover:bg-[#8b5cf6] hover:text-white hover:border-[#8b5cf6]" onClick={toggleSidebar}>
            <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'}`}></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-1.5 pr-0.5">
          <div className="flex flex-col gap-0.5 py-1">
            <div className={`text-[0.5rem] uppercase tracking-[0.075em] text-white/10 font-bold px-2.5 py-1 ${collapsed ? 'hidden' : 'block'}`}>Menu</div>
            <Link href="/" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#8892a0] text-[0.78rem] font-medium transition-all duration-250 hover:bg-white/5 hover:text-white ${collapsed ? 'justify-center' : ''}`}>
              <i className="fas fa-home w-5 text-center text-[0.9rem]"></i>
              <span className={collapsed ? 'hidden' : 'block'}>Beranda</span>
            </Link>
            <Link href="/scraper" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#8892a0] text-[0.78rem] font-medium transition-all duration-250 hover:bg-white/5 hover:text-white ${collapsed ? 'justify-center' : ''}`}>
              <i className="fas fa-scroll w-5 text-center text-[0.9rem]"></i>
              <span className={collapsed ? 'hidden' : 'block'}>Scraper Pro</span>
              <span className={`ml-auto text-[0.45rem] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-[0.015em] ${collapsed ? 'hidden' : 'block'}`}>Pro</span>
            </Link>
            <Link href="/iqc" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#8892a0] text-[0.78rem] font-medium transition-all duration-250 hover:bg-white/5 hover:text-white ${collapsed ? 'justify-center' : ''}`}>
              <i className="fas fa-pen-fancy w-5 text-center text-[0.9rem]"></i>
              <span className={collapsed ? 'hidden' : 'block'}>IQC Studio</span>
            </Link>
            <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#8892a0] text-[0.78rem] font-medium transition-all duration-250 hover:bg-white/5 hover:text-white ${collapsed ? 'justify-center' : ''}`}>
              <i className="fas fa-chart-simple w-5 text-center text-[0.9rem]"></i>
              <span className={collapsed ? 'hidden' : 'block'}>Dashboard</span>
            </Link>
          </div>

          <div className="h-px bg-white/5 my-0.5" />

          <div className="text-center py-1.5 px-0 font-head font-bold text-[1.2rem] text-white tracking-[0.1em] bg-white/5 rounded-lg border border-white/5">
            <span id="clockHours" className="inline">00</span>:<span id="clockMinutes" className="inline">00</span>:<span className="text-[0.7rem] text-[#8892a0] opacity-30 font-normal" id="clockSeconds">00</span>
            <div className="text-[0.55rem] text-[#8892a0] opacity-30 font-normal tracking-[0.05em] mt-0.5" id="dateDisplay">--, -- --- ----</div>
          </div>

          <div className="h-px bg-white/5 my-0.5" />

          <MusicPlayer />

          <div className="h-px bg-white/5 my-0.5" />

          <div className="bg-white/5 border border-white/5 rounded-xl p-2 px-2.5 mt-0.5">
            <div className="text-[0.55rem] font-bold uppercase tracking-[0.05em] text-white/15 mb-1.5 flex items-center gap-1.5">
              <i className="fas fa-mosque text-[#fbbf24] text-[0.6rem]"></i>
              <span>Jadwal Sholat</span>
              <span className="ml-auto text-[0.45rem] opacity-30" id="prayerLocation">Indonesia</span>
            </div>
            <div>
              <div className="flex items-center gap-2 py-0.5 px-1 rounded-md transition-all duration-200 hover:bg-white/5">
                <span className="w-2 h-2 rounded-full bg-[#6366f1] flex-shrink-0"></span>
                <span className="text-[0.65rem] text-[#8892a0] flex-1 font-medium">Subuh</span>
                <span className="text-[0.65rem] text-white font-semibold tabular-nums" id="prayerFajr">--:--</span>
              </div>
              <div className="flex items-center gap-2 py-0.5 px-1 rounded-md transition-all duration-200 hover:bg-white/5">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] flex-shrink-0"></span>
                <span className="text-[0.65rem] text-[#8892a0] flex-1 font-medium">Dzuhur</span>
                <span className="text-[0.65rem] text-white font-semibold tabular-nums" id="prayerDhuhr">--:--</span>
              </div>
              <div className="flex items-center gap-2 py-0.5 px-1 rounded-md transition-all duration-200 hover:bg-white/5">
                <span className="w-2 h-2 rounded-full bg-[#f97316] flex-shrink-0"></span>
                <span className="text-[0.65rem] text-[#8892a0] flex-1 font-medium">Ashar</span>
                <span className="text-[0.65rem] text-white font-semibold tabular-nums" id="prayerAsr">--:--</span>
              </div>
              <div className="flex items-center gap-2 py-0.5 px-1 rounded-md transition-all duration-200 hover:bg-white/5">
                <span className="w-2 h-2 rounded-full bg-[#ef4444] flex-shrink-0"></span>
                <span className="text-[0.65rem] text-[#8892a0] flex-1 font-medium">Maghrib</span>
                <span className="text-[0.65rem] text-white font-semibold tabular-nums" id="prayerMaghrib">--:--</span>
              </div>
              <div className="flex items-center gap-2 py-0.5 px-1 rounded-md transition-all duration-200 hover:bg-white/5">
                <span className="w-2 h-2 rounded-full bg-[#8b5cf6] flex-shrink-0"></span>
                <span className="text-[0.65rem] text-[#8892a0] flex-1 font-medium">Isya</span>
                <span className="text-[0.65rem] text-white font-semibold tabular-nums" id="prayerIshaa">--:--</span>
              </div>
            </div>
            <div className="text-[0.5rem] text-[#8892a0] opacity-30 text-center mt-1 tracking-[0.025em]" id="prayerCity">Jakarta, Indonesia</div>
          </div>

          <div className="h-px bg-white/5 my-0.5" />

          <div className="bg-white/5 border border-white/5 rounded-xl p-2 px-2.5">
            <div className="flex justify-between items-center mb-1.5">
              <button className="bg-transparent border-none text-[#8892a0] cursor-pointer px-1.5 py-0.5 rounded text-[0.6rem] transition-all duration-200 hover:bg-white/5 hover:text-white" id="calendarPrev"><i className="fas fa-chevron-left"></i></button>
              <span className="text-[0.65rem] font-semibold text-[#8892a0] opacity-60" id="calendarTitle">Januari 2024</span>
              <button className="bg-transparent border-none text-[#8892a0] cursor-pointer px-1.5 py-0.5 rounded text-[0.6rem] transition-all duration-200 hover:bg-white/5 hover:text-white" id="calendarNext"><i className="fas fa-chevron-right"></i></button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center" id="calendarGrid">
              <div className="text-[0.45rem] text-white/10 font-bold uppercase py-0.5 tracking-[0.025em]">M</div>
              <div className="text-[0.45rem] text-white/10 font-bold uppercase py-0.5 tracking-[0.025em]">S</div>
              <div className="text-[0.45rem] text-white/10 font-bold uppercase py-0.5 tracking-[0.025em]">S</div>
              <div className="text-[0.45rem] text-white/10 font-bold uppercase py-0.5 tracking-[0.025em]">R</div>
              <div className="text-[0.45rem] text-white/10 font-bold uppercase py-0.5 tracking-[0.025em]">K</div>
              <div className="text-[0.45rem] text-white/10 font-bold uppercase py-0.5 tracking-[0.025em]">J</div>
              <div className="text-[0.45rem] text-white/10 font-bold uppercase py-0.5 tracking-[0.025em]">S</div>
            </div>
          </div>

          <div className="h-px bg-white/5 my-0.5" />

          <div className="flex flex-col gap-0.5 py-1">
            <div className={`text-[0.5rem] uppercase tracking-[0.075em] text-white/10 font-bold px-2.5 py-1 ${collapsed ? 'hidden' : 'block'}`}>Pengaturan</div>
            <button className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#8892a0] text-[0.78rem] font-medium transition-all duration-250 hover:bg-white/5 hover:text-white w-full text-left cursor-pointer border-none bg-transparent ${collapsed ? 'justify-center' : ''}`} onClick={toggleWelcome}>
              <i className={`fas fa-${showWelcome ? 'eye' : 'eye-slash'} w-5 text-center text-[0.9rem]`}></i>
              <span className={collapsed ? 'hidden' : 'block'}>{showWelcome ? 'Tampilkan Welcome Modal' : 'Sembunyikan Welcome Modal'}</span>
              <span className={`ml-auto text-[0.45rem] px-2 py-0.5 rounded-full font-bold uppercase tracking-[0.015em] ${showWelcome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'} ${collapsed ? 'hidden' : 'block'}`}>{showWelcome ? 'On' : 'Off'}</span>
            </button>
          </div>

          <div className="h-px bg-white/5 my-0.5" />

          <div className="flex flex-col gap-0.5 py-1">
            <div className={`text-[0.5rem] uppercase tracking-[0.075em] text-white/10 font-bold px-2.5 py-1 ${collapsed ? 'hidden' : 'block'}`}>Perangkat</div>
            <div className="flex items-center gap-2.5 px-2.5 py-1.5 bg-white/5 rounded-lg border border-white/5">
              <div className="text-[1.1rem] text-[#06b6d4]" id="deviceIcon"><i className="fas fa-desktop"></i></div>
              <div className={`flex flex-col ${collapsed ? 'hidden' : 'block'}`}>
                <div className="text-[0.7rem] font-semibold text-white" id="deviceName">Desktop</div>
                <div className="text-[0.5rem] text-[#8892a0] opacity-40" id="deviceDetail">Windows Chrome</div>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5 my-0.5" />

          <div className="flex flex-col gap-0.5 py-1">
            <div className={`text-[0.5rem] uppercase tracking-[0.075em] text-white/10 font-bold px-2.5 py-1 ${collapsed ? 'hidden' : 'block'}`}>Informasi</div>
            <div className="bg-white/5 border border-white/5 rounded-xl px-2.5 py-1.5">
              <div className="flex items-center gap-1.5 py-0.5 text-[0.6rem] text-[#8892a0]">
                <i className="fas fa-globe w-4 text-[0.55rem] opacity-30 flex-shrink-0"></i>
                <span className="opacity-20 font-semibold min-w-[32px] text-[0.5rem] uppercase tracking-[0.015em]">Region</span>
                <span className="text-white font-medium text-[0.6rem] text-[#8b5cf6]" id="regionInfo">--</span>
              </div>
              <div className="flex items-center gap-1.5 py-0.5 text-[0.6rem] text-[#8892a0]">
                <i className="fas fa-flag w-4 text-[0.55rem] opacity-30 flex-shrink-0"></i>
                <span className="opacity-20 font-semibold min-w-[32px] text-[0.5rem] uppercase tracking-[0.015em]">Negara</span>
                <span className="text-white font-medium text-[0.6rem]" id="countryInfo">--</span>
              </div>
              <div className="flex items-center gap-1.5 py-0.5 text-[0.6rem] text-[#8892a0]">
                <i className="fas fa-wifi w-4 text-[0.55rem] opacity-30 flex-shrink-0"></i>
                <span className="opacity-20 font-semibold min-w-[32px] text-[0.5rem] uppercase tracking-[0.015em]">Koneksi</span>
                <span className="text-white font-medium text-[0.6rem]" id="connectionInfo">--</span>
              </div>
              <div className="flex items-center gap-1.5 py-0.5 text-[0.6rem] text-[#8892a0]">
                <i className="fas fa-microchip w-4 text-[0.55rem] opacity-30 flex-shrink-0"></i>
                <span className="opacity-20 font-semibold min-w-[32px] text-[0.5rem] uppercase tracking-[0.015em]">Device</span>
                <span className="text-white font-medium text-[0.6rem]" id="deviceTypeInfo">--</span>
              </div>
              <div className="flex items-center gap-1.5 py-0.5 text-[0.6rem] text-[#8892a0]">
                <i className="fas fa-circle w-4 text-[0.35rem] text-[#4ade80] flex-shrink-0"></i>
                <span className="opacity-20 font-semibold min-w-[32px] text-[0.5rem] uppercase tracking-[0.015em]">Server</span>
                <span className="text-[#4ade80] font-medium text-[0.55rem]">Online</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5 my-0.5" />

          <div className="px-3 py-1 mt-auto">
            <span className="text-[0.45rem] text-white/5 tracking-[0.05em]">v3.0 Stable</span>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] ${mobileOpen ? 'block' : 'hidden'} md:hidden`} onClick={() => setMobileOpen(false)} />
    </>
  );
}