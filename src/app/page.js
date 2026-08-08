'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import LoadingScreen from './components/LoadingScreen';
import WelcomeModal from './components/WelcomeModal';
import Link from 'next/link';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Update clock
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const clockHours = document.getElementById('clockHours');
      const clockMinutes = document.getElementById('clockMinutes');
      const clockSeconds = document.getElementById('clockSeconds');
      if (clockHours) clockHours.textContent = hours;
      if (clockMinutes) clockMinutes.textContent = minutes;
      if (clockSeconds) clockSeconds.textContent = seconds;

      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const dateDisplay = document.getElementById('dateDisplay');
      if (dateDisplay) {
        dateDisplay.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
      }
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // Update prayer times
    const prayers = {
      fajr: '04:30',
      dhuhr: '12:00',
      asr: '15:30',
      maghrib: '18:00',
      ishaa: '19:30'
    };
    const prayerEls = ['prayerFajr', 'prayerDhuhr', 'prayerAsr', 'prayerMaghrib', 'prayerIshaa'];
    prayerEls.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = prayers[id.replace('prayer', '').toLowerCase()];
    });
    const cityEl = document.getElementById('prayerCity');
    if (cityEl) cityEl.textContent = 'Jakarta, Indonesia';
    const locationEl = document.getElementById('prayerLocation');
    if (locationEl) locationEl.textContent = 'Jakarta';

    // Calendar
    let calendarDate = new Date();
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const renderCalendar = () => {
      const year = calendarDate.getFullYear();
      const month = calendarDate.getMonth();
      const today = new Date();
      const titleEl = document.getElementById('calendarTitle');
      if (titleEl) titleEl.textContent = monthNames[month] + ' ' + year;

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrevMonth = new Date(year, month, 0).getDate();
      const startDay = firstDay === 0 ? 7 : firstDay;

      let html = '';
      const dayNames = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
      dayNames.forEach(name => {
        html += '<div class="text-[0.45rem] text-white/10 font-bold uppercase py-0.5 tracking-[0.025em]">' + name + '</div>';
      });

      for (let i = startDay - 1; i > 0; i--) {
        const day = daysInPrevMonth - i + 1;
        html += '<div class="text-[0.55rem] text-[#8892a0] opacity-20 py-0.5 rounded cursor-default font-medium">' + day + '</div>';
      }

      for (let i = 1; i <= daysInMonth; i++) {
        const isToday = (i === today.getDate() && month === today.getMonth() && year === today.getFullYear());
        const isWeekend = (new Date(year, month, i).getDay() === 0 || new Date(year, month, i).getDay() === 6);
        let cls = 'text-[0.55rem] text-[#8892a0] py-0.5 rounded cursor-default font-medium hover:bg-white/5';
        if (isToday) cls += ' bg-purple-500/15 text-[#8b5cf6] font-bold';
        if (isWeekend) cls += ' text-red-500/40';
        html += '<div class="' + cls + '">' + i + '</div>';
      }

      const totalDays = startDay - 1 + daysInMonth;
      const remaining = 7 - (totalDays % 7);
      if (remaining < 7) {
        for (let i = 1; i <= remaining; i++) {
          html += '<div class="text-[0.55rem] text-[#8892a0] opacity-20 py-0.5 rounded cursor-default font-medium">' + i + '</div>';
        }
      }

      const gridEl = document.getElementById('calendarGrid');
      if (gridEl) gridEl.innerHTML = html;
    };
    renderCalendar();

    const prevBtn = document.getElementById('calendarPrev');
    const nextBtn = document.getElementById('calendarNext');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
      });
    }

    // Device detection
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
    let os = 'Unknown';
    let browser = 'Unknown';
    if (ua.indexOf('Windows') !== -1) os = 'Windows';
    else if (ua.indexOf('Mac') !== -1) os = 'macOS';
    else if (ua.indexOf('Linux') !== -1) os = 'Linux';
    else if (ua.indexOf('Android') !== -1) os = 'Android';
    else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) os = 'iOS';
    if (ua.indexOf('Chrome') !== -1 && ua.indexOf('Edg') === -1) browser = 'Chrome';
    else if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
    else if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) browser = 'Safari';
    else if (ua.indexOf('Edg') !== -1) browser = 'Edge';

    const deviceIcon = document.getElementById('deviceIcon');
    const deviceName = document.getElementById('deviceName');
    const deviceDetail = document.getElementById('deviceDetail');
    const deviceTypeInfo = document.getElementById('deviceTypeInfo');
    if (deviceIcon) {
      deviceIcon.innerHTML = isMobile ? '<i class="fas fa-mobile-alt"></i>' : '<i class="fas fa-desktop"></i>';
    }
    if (deviceName) deviceName.textContent = isMobile ? (isTablet ? 'Tablet' : 'Smartphone') : 'Desktop / Laptop';
    if (deviceDetail) deviceDetail.textContent = os + ' · ' + browser;
    if (deviceTypeInfo) deviceTypeInfo.textContent = isMobile ? (isTablet ? 'Tablet' : 'Mobile') : 'Desktop';

    // Region detection
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const regionEl = document.getElementById('regionInfo');
        const countryEl = document.getElementById('countryInfo');
        if (regionEl) regionEl.textContent = data.region || 'Unknown';
        if (countryEl) countryEl.textContent = (data.country_name || 'Indonesia') + ' (' + (data.country_code || 'ID') + ')';
      })
      .catch(() => {
        const regionEl = document.getElementById('regionInfo');
        const countryEl = document.getElementById('countryInfo');
        if (regionEl) regionEl.textContent = 'Unknown';
        if (countryEl) countryEl.textContent = 'Indonesia (ID)';
      });

    // Connection
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connEl = document.getElementById('connectionInfo');
    if (connEl) {
      if (conn) {
        connEl.textContent = (conn.effectiveType || '--') + ' · ' + (conn.downlink ? conn.downlink + ' Mbps' : '--');
      } else {
        connEl.textContent = 'Tidak diketahui';
      }
    }

    // Battery
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        const updateBattery = () => {
          const level = Math.round(battery.level * 100);
          const isCharging = battery.charging;
          const fill = document.getElementById('batteryFill');
          const bolt = document.getElementById('boltIcon');
          const percent = document.getElementById('batteryPercent');
          const width = Math.max(5, Math.min(100, level));
          if (fill) fill.style.width = width + '%';
          if (fill) {
            if (width > 60) fill.setAttribute('fill', '#4ade80');
            else if (width > 30) fill.setAttribute('fill', '#fbbf24');
            else fill.setAttribute('fill', '#ef4444');
          }
          if (percent) percent.textContent = width + '%';
          if (bolt) {
            if (isCharging) bolt.classList.add('show');
            else bolt.classList.remove('show');
          }
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {
        const percent = document.getElementById('batteryPercent');
        if (percent) percent.textContent = '--%';
      });
    }

    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  useEffect(() => {
    // Video autoplay
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
    const show = localStorage.getItem('show_welcome') !== 'false';
    setShowWelcome(show);
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      {!loading && showWelcome && <WelcomeModal onClose={handleWelcomeClose} />}

      <Sidebar />

      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[1000px] px-5 py-2.5 bg-[rgba(10,12,20,0.6)] backdrop-blur-[16px] border border-white/5 rounded-[100px] flex justify-between items-center z-[9999] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2.5">
          <button className="md:hidden bg-white/5 border border-white/5 rounded-lg text-[#8892a0] px-2.5 py-1.5 cursor-pointer text-[0.9rem] transition-all duration-250 hover:bg-white/10 hover:text-white flex items-center gap-1.5" id="mobileToggle">
            <i className="fas fa-bars"></i>
            <span className="text-[0.55rem] font-semibold uppercase tracking-[0.025em]">Menu</span>
          </button>
          <a href="/" className="font-head font-bold text-[1rem] text-white tracking-[-0.3px] flex items-center gap-2 no-underline">
            <i className="fas fa-code text-[#8b5cf6]"></i> Scrape<span className="text-[#8b5cf6]">Website</span>
          </a>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            <div className="flex items-center gap-1.5">
              <svg className="w-6 h-3.5 block" viewBox="0 0 30 18" fill="none">
                <rect className="fill-white/5 stroke-white/15 stroke-[1.2] rx-[3px]" x="0.5" y="0.5" width="25" height="17" />
                <rect className="fill-[#4ade80] transition-[width_0.4s_ease] rx-[2px]" id="batteryFill" x="2.5" y="2.5" width="21" height="13" style={{ width: '70%' }} />
                <rect className="fill-white/15 rx-[1px]" x="26" y="4" width="3" height="10" />
                <path className="fill-[#fbbf24] opacity-0 transition-opacity duration-300" id="boltIcon" d="M14 4L9 11h4l-2 6 7-8h-4l2-5z" />
              </svg>
              <span className="text-[0.5rem] font-semibold text-[#8892a0] opacity-60 min-w-[24px]" id="batteryPercent">--%</span>
            </div>
            <span className="text-[0.5rem] font-medium text-[#8892a0] opacity-50 border-l border-white/5 pl-2.5 min-w-[40px] tabular-nums" id="clockStatus">00:00</span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1100px] w-full mx-auto px-5 pb-10 pt-20 relative z-[1]">
        <div className="video-hero w-full max-w-full relative rounded-none overflow-hidden bg-black outline-none border-none shadow-none">
          <video ref={videoRef} className="w-full h-auto block outline-none border-none shadow-none object-cover aspect-video bg-black pointer-events-none" src="/vd/video.mp4" autoPlay loop muted playsInline></video>
          <div className="absolute top-0 left-0 right-0 h-[35%] pointer-events-none z-[2] bg-gradient-to-b from-[rgba(6,8,15,0.85)] to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[45%] pointer-events-none z-[2] bg-gradient-to-t from-[rgba(6,8,15,0.9)] via-[rgba(6,8,15,0.2)] to-transparent"></div>
          <div className="absolute bottom-10 left-10 z-[3] max-w-[70%] pointer-events-none">
            <div className="font-head text-[2.4rem] font-extrabold text-white tracking-[-0.02em] leading-[1.08] shadow-[0_4px_30px_rgba(0,0,0,0.6)] mb-1">
              Scrape <span className="bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">Website</span>
            </div>
            <div className="text-[0.7rem] text-white/35 font-medium tracking-[0.05em] shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
              by <strong className="text-white/50 font-semibold">lifxprg</strong> v3.0
            </div>
            <div className="text-[0.85rem] text-white/50 font-normal max-w-[480px] mt-1.5 leading-relaxed shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
              Download seluruh konten website HTML, CSS, JS, gambar, video dalam satu file ZIP. Cepat, gratis, dan tanpa batasan.
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap w-full pt-2.5">
          <Link href="/scraper" className="font-head font-extrabold text-[1.05rem] px-7 py-3.5 bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white border-2 border-white/15 rounded-[0.5em] shadow-[0.1em_0.1em_0_rgba(0,0,0,0.4)] cursor-pointer inline-flex items-center gap-2.5 no-underline transition-all duration-150 flex-1 min-w-[200px] max-w-[280px] justify-center relative overflow-hidden hover:-translate-x-[0.05em] hover:-translate-y-[0.05em] hover:shadow-[0.2em_0.2em_0_rgba(0,0,0,0.4)] hover:border-white/25 hover:bg-gradient-to-r hover:from-[#7c3aed] hover:to-[#5b21b6] active:translate-x-[0.05em] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_0_rgba(0,0,0,0.4)]">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-600"></span>
            <span className="relative z-10 text-sm transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110"><i className="fas fa-scroll"></i></span>
            <span className="relative z-10 flex flex-col items-start leading-[1.2]">
              <span className="text-[0.95rem] tracking-[0.015em]">Scrape Website</span>
              <span className="text-[0.5rem] font-normal opacity-50 tracking-[0.025em]">Download semua konten</span>
            </span>
          </Link>
          <Link href="/iqc" className="font-head font-extrabold text-[1.05rem] px-7 py-3.5 bg-gradient-to-r from-[#0891b2] to-[#0e7490] text-white border-2 border-[rgba(6,182,212,0.3)] rounded-[0.5em] shadow-[0.1em_0.1em_0_rgba(0,0,0,0.4)] cursor-pointer inline-flex items-center gap-2.5 no-underline transition-all duration-150 flex-1 min-w-[200px] max-w-[280px] justify-center relative overflow-hidden hover:-translate-x-[0.05em] hover:-translate-y-[0.05em] hover:shadow-[0.2em_0.2em_0_rgba(0,0,0,0.4)] hover:border-[rgba(6,182,212,0.5)] hover:bg-gradient-to-r hover:from-[#06b6d4] hover:to-[#0891b2] active:translate-x-[0.05em] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_0_rgba(0,0,0,0.4)]">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-600"></span>
            <span className="relative z-10 text-sm transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110"><i className="fas fa-pen-fancy"></i></span>
            <span className="relative z-10 flex flex-col items-start leading-[1.2]">
              <span className="text-[0.95rem] tracking-[0.015em]">IQC Studio</span>
              <span className="text-[0.5rem] font-normal opacity-50 tracking-[0.025em]">Generate gambar teks</span>
            </span>
          </Link>
        </div>

        <div className="howto-section py-2.5">
          <div className="text-center mb-7.5">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/10 text-[0.6rem] font-bold text-[#a78bfa] tracking-[0.05em] uppercase mb-2">
              <i className="fas fa-list-check"></i> Panduan
            </div>
            <h2 className="font-head text-[1.6rem] font-bold text-white tracking-[-0.02em]">
              Cara <span className="bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">Menggunakan</span>
            </h2>
            <p className="text-[#8892a0] text-[0.85rem] opacity-40 mt-1">Ikuti 4 langkah mudah untuk mulai scraping website</p>
          </div>

          <div className="steps-timeline flex flex-col gap-0 relative py-2.5">
            <div className="absolute left-12 top-7.5 bottom-7.5 w-[2px] bg-gradient-to-b from-[#8b5cf6] via-[#06b6d4] to-[#f472b6] opacity-15 rounded-[10px]"></div>

            <div className="flex items-start gap-6 px-5 py-4 rounded-xl bg-white/5 border border-white/5 mb-3 transition-all duration-400 hover:bg-white/10 hover:border-purple-500/10 hover:translate-x-1.5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-head font-extrabold text-[1.2rem] text-white relative z-[1] bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] shadow-[0_4px_20px_rgba(139,92,246,0.15)] transition-all duration-400 hover:scale-[1.08] hover:shadow-[0_8px_30px_rgba(139,92,246,0.25)]">
                <span className="text-[1rem]"><i className="fas fa-link"></i></span>
              </div>
              <div className="flex-1 pt-1">
                <div className="text-[0.5rem] font-bold uppercase tracking-[0.075em] text-[#8892a0] opacity-20 mb-0.5">Langkah 1</div>
                <div className="font-head text-[1.05rem] font-bold text-white mb-0.5">Masukkan URL</div>
                <div className="text-[0.8rem] text-[#8892a0] opacity-50 leading-relaxed">Tempelkan link website yang ingin kamu scrape di kolom URL yang tersedia.</div>
              </div>
              <div className="flex-shrink-0 text-[#8892a0] opacity-10 text-[1rem] self-center transition-all duration-300 hover:opacity-30 hover:translate-x-1 hover:text-[#8b5cf6]"><i className="fas fa-chevron-right"></i></div>
            </div>

            <div className="flex items-start gap-6 px-5 py-4 rounded-xl bg-white/5 border border-white/5 mb-3 transition-all duration-400 hover:bg-white/10 hover:border-purple-500/10 hover:translate-x-1.5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-head font-extrabold text-[1.2rem] text-white relative z-[1] bg-gradient-to-r from-[#06b6d4] to-[#0891b2] shadow-[0_4px_20px_rgba(6,182,212,0.15)] transition-all duration-400 hover:scale-[1.08] hover:shadow-[0_8px_30px_rgba(6,182,212,0.25)]">
                <span className="text-[1rem]"><i className="fas fa-play"></i></span>
              </div>
              <div className="flex-1 pt-1">
                <div className="text-[0.5rem] font-bold uppercase tracking-[0.075em] text-[#8892a0] opacity-20 mb-0.5">Langkah 2</div>
                <div className="font-head text-[1.05rem] font-bold text-white mb-0.5">Klik Scrape</div>
                <div className="text-[0.8rem] text-[#8892a0] opacity-50 leading-relaxed">Tekan tombol Scrape dan tunggu proses pengambilan data hingga selesai.</div>
              </div>
              <div className="flex-shrink-0 text-[#8892a0] opacity-10 text-[1rem] self-center transition-all duration-300 hover:opacity-30 hover:translate-x-1 hover:text-[#8b5cf6]"><i className="fas fa-chevron-right"></i></div>
            </div>

            <div className="flex items-start gap-6 px-5 py-4 rounded-xl bg-white/5 border border-white/5 mb-3 transition-all duration-400 hover:bg-white/10 hover:border-purple-500/10 hover:translate-x-1.5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-head font-extrabold text-[1.2rem] text-white relative z-[1] bg-gradient-to-r from-[#f472b6] to-[#db2777] shadow-[0_4px_20px_rgba(244,114,182,0.15)] transition-all duration-400 hover:scale-[1.08] hover:shadow-[0_8px_30px_rgba(244,114,182,0.25)]">
                <span className="text-[1rem]"><i className="fas fa-file-archive"></i></span>
              </div>
              <div className="flex-1 pt-1">
                <div className="text-[0.5rem] font-bold uppercase tracking-[0.075em] text-[#8892a0] opacity-20 mb-0.5">Langkah 3</div>
                <div className="font-head text-[1.05rem] font-bold text-white mb-0.5">Download ZIP</div>
                <div className="text-[0.8rem] text-[#8892a0] opacity-50 leading-relaxed">File ZIP siap diunduh semua konten website tersimpan rapi di dalamnya.</div>
              </div>
              <div className="flex-shrink-0 text-[#8892a0] opacity-10 text-[1rem] self-center transition-all duration-300 hover:opacity-30 hover:translate-x-1 hover:text-[#8b5cf6]"><i className="fas fa-chevron-right"></i></div>
            </div>

            <div className="flex items-start gap-6 px-5 py-4 rounded-xl bg-white/5 border border-white/5 transition-all duration-400 hover:bg-white/10 hover:border-purple-500/10 hover:translate-x-1.5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-head font-extrabold text-[1.2rem] text-white relative z-[1] bg-gradient-to-r from-[#fbbf24] to-[#d97706] shadow-[0_4px_20px_rgba(251,191,36,0.15)] transition-all duration-400 hover:scale-[1.08] hover:shadow-[0_8px_30px_rgba(251,191,36,0.25)]">
                <span className="text-[1rem]"><i className="fas fa-folder-open"></i></span>
              </div>
              <div className="flex-1 pt-1">
                <div className="text-[0.5rem] font-bold uppercase tracking-[0.075em] text-[#8892a0] opacity-20 mb-0.5">Langkah 4</div>
                <div className="font-head text-[1.05rem] font-bold text-white mb-0.5">Ekstrak Gunakan</div>
                <div className="text-[0.8rem] text-[#8892a0] opacity-50 leading-relaxed">Buka file ZIP, semua aset website siap kamu gunakan untuk keperluan apapun.</div>
              </div>
              <div className="flex-shrink-0 text-[#4ade80] text-[1rem] self-center"><i className="fas fa-check-circle"></i></div>
            </div>
          </div>
        </div>

        <div className="features grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[rgba(18,22,36,0.75)] backdrop-blur-[16px] rounded-xl border border-white/5 p-5 text-center transition-all duration-250 hover:border-purple-500/15 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-center mb-2.5 text-[#a78bfa]">
              <svg className="w-[34px] h-[34px] stroke-[#a78bfa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/><path d="M3 12a9 9 0 019-9"/>
              </svg>
            </div>
            <div className="text-[0.85rem] font-bold text-white mb-0.5">Selalu Update</div>
            <div className="text-[0.65rem] text-[#8892a0] opacity-40 font-normal leading-relaxed">Scraper diperbarui mengikuti perkembangan website target.</div>
          </div>
          <div className="bg-[rgba(18,22,36,0.75)] backdrop-blur-[16px] rounded-xl border border-white/5 p-5 text-center transition-all duration-250 hover:border-purple-500/15 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-center mb-2.5 text-[#a78bfa]">
              <svg className="w-[34px] h-[34px] stroke-[#a78bfa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="text-[0.85rem] font-bold text-white mb-0.5">Dikurasi Ahli</div>
            <div className="text-[0.65rem] text-[#8892a0] opacity-40 font-normal leading-relaxed">Setiap fitur telah diuji dan diverifikasi oleh tim kurator.</div>
          </div>
          <div className="bg-[rgba(18,22,36,0.75)] backdrop-blur-[16px] rounded-xl border border-white/5 p-5 text-center transition-all duration-250 hover:border-purple-500/15 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-center mb-2.5 text-[#a78bfa]">
              <svg className="w-[34px] h-[34px] stroke-[#a78bfa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/>
              </svg>
            </div>
            <div className="text-[0.85rem] font-bold text-white mb-0.5">100% Gratis</div>
            <div className="text-[0.65rem] text-[#8892a0] opacity-40 font-normal leading-relaxed">Semua tools gratis digunakan. Bebas dipakai untuk semua.</div>
          </div>
        </div>

        <div className="footer-grid w-full relative overflow-hidden rounded-2xl mt-5 bg-gradient-to-b from-[rgba(18,22,36,0.95)] via-[rgba(18,22,36,0.8)] to-[rgba(6,8,15,0.4)] border border-white/5 p-10 pb-7.5">
          <div className="relative z-[1] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7.5">
            <div className="flex flex-col gap-2">
              <span className="font-head text-[0.7rem] font-bold uppercase tracking-[0.075em] text-[#8892a0] opacity-40 mb-1"><i className="fas fa-code"></i> ScrapeWebsite</span>
              <a href="#" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> Tentang Kami</a>
              <a href="#" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> Fitur</a>
              <a href="#" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> Dokumentasi</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-head text-[0.7rem] font-bold uppercase tracking-[0.075em] text-[#8892a0] opacity-40 mb-1"><i className="fas fa-tools"></i> Tools</span>
              <Link href="/scraper" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> Website Scraper</Link>
              <Link href="/iqc" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> IQC Studio</Link>
              <Link href="/dashboard" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> Dashboard</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-head text-[0.7rem] font-bold uppercase tracking-[0.075em] text-[#8892a0] opacity-40 mb-1"><i className="fas fa-support"></i> Support</span>
              <a href="#" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> FAQ</a>
              <a href="#" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> Kontak</a>
              <a href="#" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> Laporan Bug</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-head text-[0.7rem] font-bold uppercase tracking-[0.075em] text-[#8892a0] opacity-40 mb-1"><i className="fas fa-legal"></i> Legal</span>
              <a href="#" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> Privasi</a>
              <a href="#" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> Syarat</a>
              <a href="#" className="text-[#8892a0] no-underline text-[0.8rem] font-medium opacity-30 transition-all duration-250 hover:opacity-80 hover:text-white hover:translate-x-1 flex items-center gap-2"><i className="fas fa-chevron-right text-[0.6rem]"></i> Lisensi</a>
            </div>
          </div>
          <div className="relative z-[1] mt-6 pt-4 border-t border-white/5 flex justify-between items-center flex-wrap gap-2.5">
            <span className="text-[0.6rem] text-[#8892a0] opacity-15 font-normal tracking-[0.025em]"><i className="fas fa-copyright"></i> 2026 Scrape Website</span>
            <div className="flex gap-3">
              <a href="#" className="text-[#8892a0] opacity-15 transition-all duration-250 text-[0.9rem] hover:opacity-60 hover:text-[#a78bfa] hover:-translate-y-0.5"><i className="fab fa-github"></i></a>
              <a href="#" className="text-[#8892a0] opacity-15 transition-all duration-250 text-[0.9rem] hover:opacity-60 hover:text-[#a78bfa] hover:-translate-y-0.5"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-[#8892a0] opacity-15 transition-all duration-250 text-[0.9rem] hover:opacity-60 hover:text-[#a78bfa] hover:-translate-y-0.5"><i className="fab fa-discord"></i></a>
            </div>
          </div>
        </div>
        <div className="text-center py-4 text-[#8892a0] text-[0.6rem] opacity-15 font-normal tracking-[0.025em]">2026 Scrape Website</div>
      </main>

      <div id="toast" className="fixed bottom-7.5 left-1/2 -translate-x-1/2 bg-[rgba(12,12,28,0.95)] border border-white/5 px-6 py-3 rounded-xl text-[0.8rem] text-[#4ade80] z-[99999] hidden backdrop-blur-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] font-semibold"></div>

      <style jsx>{`
        .group:hover .group-hover\\:translate-x-full {
          transform: translateX(100%);
        }
        .group:hover .group-hover\\:rotate-\\[-8deg\\] {
          transform: rotate(-8deg);
        }
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
        .transition-duration-600 {
          transition-duration: 600ms;
        }
      `}</style>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Mobile toggle
          document.getElementById('mobileToggle')?.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
              sidebar.classList.toggle('mobile-open');
              document.querySelector('.sidebar-mobile-overlay')?.classList.toggle('active');
            }
          });

          document.querySelector('.sidebar-mobile-overlay')?.addEventListener('click', function() {
            document.querySelector('.sidebar')?.classList.remove('mobile-open');
            this.classList.remove('active');
          });

          // Toast show/hide
          document.addEventListener('showToast', function(e) {
            const toast = document.getElementById('toast');
            if (toast) {
              toast.textContent = e.detail.message || 'Notifikasi';
              toast.classList.add('show');
              clearTimeout(toast._timeout);
              toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
            }
          });
        `
      }} />
    </>
  );
}