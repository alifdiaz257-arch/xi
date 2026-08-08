'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalScrapes: 0,
    totalFiles: 0,
    avgSize: '0 KB',
    lastScrape: '-'
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    let historyData = [];
    try {
      const raw = localStorage.getItem('webzip_history');
      if (raw) { historyData = JSON.parse(raw); }
    } catch (e) { historyData = []; }

    setHistory(historyData);

    let totalF = 0, totalSize = 0, sizeCount = 0, lastTime = '-';

    if (historyData.length > 0) {
      const last = historyData[0];
      if (last.time) {
        const d = new Date(last.time);
        lastTime = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      } else if (last.timestamp) {
        const d = new Date(last.timestamp);
        lastTime = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      }
      historyData.forEach(h => {
        totalF += h.files || 0;
        if (h.size) {
          const sizeMatch = String(h.size).match(/([\d.]+)\s*(KB|MB)/);
          if (sizeMatch) {
            let sizeNum = parseFloat(sizeMatch[1]);
            if (sizeMatch[2] === 'MB') sizeNum *= 1024;
            totalSize += sizeNum; sizeCount++;
          }
        }
      });
      const avg = sizeCount > 0 ? Math.round(totalSize / sizeCount) : 0;
      setStats({
        totalScrapes: historyData.length,
        totalFiles: totalF,
        avgSize: avg > 1024 ? (avg / 1024).toFixed(1) + ' MB' : (avg || 0) + ' KB',
        lastScrape: lastTime
      });
    } else {
      setStats({
        totalScrapes: 0,
        totalFiles: 0,
        avgSize: '0 KB',
        lastScrape: '-'
      });
    }
  };

  const clearHistory = () => {
    if (!confirm('Hapus semua riwayat scraping? (ZIP di database akan dihapus juga)')) return;
    localStorage.removeItem('webzip_history');
    // Clear IndexedDB
    const request = indexedDB.open('WebZipDB', 1);
    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction('zips', 'readwrite');
      const store = transaction.objectStore('zips');
      store.clear();
      transaction.oncomplete = function() {
        loadHistory();
        // Show toast
        const toast = document.getElementById('toast');
        if (toast) {
          toast.textContent = 'Riwayat dan ZIP berhasil dihapus!';
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 3000);
        }
      };
      db.close();
    };
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const d = new Date(timestamp);
    return d.toLocaleString('id-ID');
  };

  return (
    <div className="max-w-[900px] w-full mx-auto px-5 pb-10 pt-20 relative z-[1]">
      <div className="flex flex-col gap-4">
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[#8892a0] text-[0.75rem] font-semibold transition-all duration-250 hover:bg-white/10 hover:text-white hover:-translate-x-1 w-fit">
          <i className="fas fa-arrow-left text-[0.8rem]"></i> Kembali
        </Link>

        <div className="bg-[rgba(18,22,36,0.75)] backdrop-blur-[16px] rounded-2xl border border-white/5 p-5 transition-all duration-250 hover:border-purple-500/15">
          <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.08em] text-[#8892a0] font-bold opacity-50 mb-3">
            <i className="fas fa-chart-simple"></i> Statistik Scraping
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center transition-all duration-250 hover:border-purple-500/15 hover:-translate-y-0.5">
              <div className="text-[1.5rem] mb-1"><svg className="w-6 h-6 stroke-[#8892a0] opacity-30 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/><circle cx="12" cy="16" r="5"/></svg></div>
              <div className="font-head text-[1.6rem] font-bold text-white">{stats.totalScrapes}</div>
              <div className="text-[0.55rem] text-[#8892a0] uppercase tracking-[0.025em] opacity-40 font-semibold mt-0.5">Total Scrape</div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center transition-all duration-250 hover:border-purple-500/15 hover:-translate-y-0.5">
              <div className="text-[1.5rem] mb-1"><svg className="w-6 h-6 stroke-[#8892a0] opacity-30 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
              <div className="font-head text-[1.6rem] font-bold text-white">{stats.totalFiles}</div>
              <div className="text-[0.55rem] text-[#8892a0] uppercase tracking-[0.025em] opacity-40 font-semibold mt-0.5">Total File</div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center transition-all duration-250 hover:border-purple-500/15 hover:-translate-y-0.5">
              <div className="text-[1.5rem] mb-1"><svg className="w-6 h-6 stroke-[#8892a0] opacity-30 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div>
              <div className="font-head text-[1.6rem] font-bold text-white">{stats.avgSize}</div>
              <div className="text-[0.55rem] text-[#8892a0] uppercase tracking-[0.025em] opacity-40 font-semibold mt-0.5">Rata-rata</div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center transition-all duration-250 hover:border-purple-500/15 hover:-translate-y-0.5">
              <div className="text-[1.5rem] mb-1"><svg className="w-6 h-6 stroke-[#8892a0] opacity-30 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
              <div className="font-head text-[1.6rem] font-bold text-white">{stats.lastScrape}</div>
              <div className="text-[0.55rem] text-[#8892a0] uppercase tracking-[0.025em] opacity-40 font-semibold mt-0.5">Terakhir</div>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(18,22,36,0.75)] backdrop-blur-[16px] rounded-2xl border border-white/5 p-5 transition-all duration-250 hover:border-purple-500/15">
          <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.08em] text-[#8892a0] font-bold opacity-50 mb-3">
            <i className="fas fa-clock"></i> Riwayat Aktivitas
          </div>

          <div id="historyList">
            {history.length === 0 ? (
              <div className="text-center text-[#8892a0] text-[0.8rem] py-7.5 opacity-40 font-medium">
                📭 Belum ada aktivitas scraping.<br />
                <span className="text-[0.6rem] opacity-50">Coba scrape dulu di halaman utama</span>
              </div>
            ) : (
              history.map((h, idx) => (
                <div key={idx} className="flex justify-between items-center px-3.5 py-2.5 bg-white/5 border border-white/5 rounded-xl mb-2 transition-all duration-250 hover:border-purple-500/20 flex-wrap gap-2">
                  <span className="font-semibold text-[0.85rem] text-white word-break-break-all flex-1 min-w-[120px]">{h.url}</span>
                  <div className="flex gap-3 text-[0.65rem] text-[#8892a0] font-medium flex-wrap">
                    <span className="opacity-50">📄 {h.files || 0} file</span>
                    <span className="opacity-50">📦 {h.size || '-'}</span>
                    <span className="opacity-50">🕐 {formatDate(h.time || h.timestamp)}</span>
                  </div>
                  {h.zipId ? (
                    <button className="px-3 py-1 rounded-md border-none text-[0.6rem] font-bold cursor-pointer bg-emerald-500/10 text-[#4ade80] border border-emerald-500/15 transition-all duration-200 font-body inline-flex items-center gap-1 hover:bg-emerald-500/20" onClick={() => {
                      // Download zip from IndexedDB
                      const request = indexedDB.open('WebZipDB', 1);
                      request.onsuccess = function(event) {
                        const db = event.target.result;
                        const transaction = db.transaction('zips', 'readonly');
                        const store = transaction.objectStore('zips');
                        const getRequest = store.get(h.zipId);
                        getRequest.onsuccess = function() {
                          const result = getRequest.result;
                          if (!result) {
                            const toast = document.getElementById('toast');
                            if (toast) { toast.textContent = 'ZIP tidak ditemukan di database.'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
                            return;
                          }
                          try {
                            const blob = result.blob;
                            const name = h.fileName || 'webzip.zip';
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            const toast = document.getElementById('toast');
                            if (toast) { toast.textContent = 'ZIP berhasil di-download!'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
                          } catch (e) {
                            console.error(e);
                            const toast = document.getElementById('toast');
                            if (toast) { toast.textContent = 'Gagal download ZIP.'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
                          }
                        };
                        db.close();
                      };
                    }}>
                      <i className="fas fa-download"></i> ZIP
                    </button>
                  ) : (
                    <span className="text-[0.55rem] opacity-30">⚠️ ZIP tidak tersedia</span>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2.5 flex-wrap mt-3 pt-3 border-t border-white/5">
            <button onClick={clearHistory} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-none bg-gradient-to-r from-[#dc2626] to-[#ef4444] text-white text-[0.75rem] font-bold cursor-pointer transition-all duration-250 shadow-[0_4px_20px_rgba(220,38,38,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(220,38,38,0.25)]">
              <i className="fas fa-trash"></i> Hapus Semua
            </button>
            <button onClick={loadHistory} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-[#8892a0] text-[0.75rem] font-bold cursor-pointer transition-all duration-250 hover:bg-white/10 hover:text-white">
              <i className="fas fa-refresh"></i> Refresh
            </button>
          </div>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[#8892a0] text-[0.75rem] font-semibold transition-all duration-250 hover:bg-white/10 hover:text-white hover:-translate-x-1 w-fit mt-1">
          <i className="fas fa-arrow-left text-[0.8rem]"></i> Kembali
        </Link>
      </div>

      <div id="toast" className="fixed bottom-7.5 left-1/2 -translate-x-1/2 bg-[rgba(12,12,28,0.95)] border border-white/5 px-6 py-3 rounded-xl text-[0.8rem] text-[#4ade80] z-[99999] hidden backdrop-blur-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] font-semibold"></div>

      <style jsx>{`
        .word-break-break-all { word-break: break-all; }
        .toast.show { display: block; animation: toastIn 0.3s ease; }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Toast show/hide
          const toast = document.getElementById('toast');
          if (toast) {
            const originalShow = toast.classList.add.bind(toast.classList);
            toast.classList.add = function(cls) {
              if (cls === 'show') {
                originalShow(cls);
                clearTimeout(toast._timeout);
                toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
              } else {
                originalShow(cls);
              }
            };
          }
        `
      }} />
    </div>
  );
}