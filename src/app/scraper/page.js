// src/app/scraper/page.js - FIXED
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ScraperPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState([]);
  const [zipData, setZipData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileCount, setFileCount] = useState(0);
  const [zipSize, setZipSize] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [totalFiles, setTotalFiles] = useState(0);
  const [folderView, setFolderView] = useState([]);
  const [currentFile, setCurrentFile] = useState('Menunggu...');
  const [fileStatus, setFileStatus] = useState('⏳');
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  // Video autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLog(prev => [...prev, { time, message, type }]);
  };

  const handleScrape = async () => {
    if (!url) {
      addLog('Masukkan URL!', 'err');
      setError('Masukkan URL!');
      return;
    }

    let validUrl;
    try {
      validUrl = new URL(url).href;
    } catch {
      addLog('URL tidak valid!', 'err');
      setError('URL tidak valid!');
      return;
    }

    setLoading(true);
    setProgress(5);
    setLog([]);
    setZipData(null);
    setShowPopup(false);
    setError('');
    addLog('🚀 Mulai Scrape: ' + validUrl, 'info');

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: validUrl }),
      });

      setProgress(50);
      addLog('⏳ Memproses data...', 'info');

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Gagal scraping');
      }

      setProgress(80);
      addLog('✅ Scraping selesai! ' + data.fileCount + ' file ditemukan', 'ok');

      // Convert base64 to blob
      const byteCharacters = atob(data.zip);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/zip' });

      setZipData(blob);
      setFileName(data.fileName);
      setFileCount(data.fileCount);
      setZipSize(data.size);
      setTotalFiles(data.fileCount);
      setProgress(100);
      setShowPopup(true);
      addLog('📦 ZIP siap diunduh: ' + data.fileName, 'ok');

      // Update folder view
      if (data.files) {
        const folders = {};
        data.files.forEach(f => {
          const parts = f.path.split('/');
          let current = '';
          parts.forEach((p, i) => {
            if (i < parts.length - 1) {
              current += (current ? '/' : '') + p;
              if (!folders[current]) {
                folders[current] = { 
                  name: p + '/', 
                  path: current + '/', 
                  type: 'folder', 
                  size: 0, 
                  depth: current.split('/').length - 1 
                };
              }
            }
          });
        });
        const folderList = Object.values(folders);
        const fileList = data.files.map(f => ({
          ...f,
          depth: f.path.split('/').length - 1
        }));
        setFolderView([...folderList, ...fileList]);
      }

    } catch (err) {
      console.error('Scrape error:', err);
      addLog('❌ Error: ' + err.message, 'err');
      setError(err.message || 'Terjadi kesalahan saat scraping');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = () => {
    if (!zipData) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipData);
    link.download = fileName || 'webzip.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowPopup(false);
    addLog('⬇ Download: ' + fileName, 'ok');
  };

  const clearAll = () => {
    setUrl('');
    setLog([]);
    setProgress(0);
    setFolderView([]);
    setZipData(null);
    setShowPopup(false);
    setTotalFiles(0);
    setCurrentFile('Menunggu...');
    setFileStatus('⏳');
    setError('');
    addLog('🧹 Dibersihkan', 'info');
  };

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleScrape();
    }
  };

  return (
    <div className="max-w-[1100px] w-full mx-auto px-5 pb-10 pt-20 relative z-[1]">
      <div className="flex flex-col gap-4">
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[#8892a0] text-[0.75rem] font-semibold transition-all duration-250 hover:bg-white/10 hover:text-white hover:-translate-x-1 w-fit">
          <i className="fas fa-arrow-left text-[0.8rem]"></i> Kembali
        </Link>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-[#f87171] text-[0.85rem] flex items-center gap-2.5">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
            <button className="ml-auto text-[#f87171]/60 hover:text-[#f87171] text-sm" onClick={() => setError('')}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <div className="bg-[rgba(18,22,36,0.75)] backdrop-blur-[16px] rounded-2xl border border-white/5 p-5 transition-all duration-250 hover:border-purple-500/15">
          <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.08em] text-[#8892a0] font-bold opacity-50 mb-2.5">
            <svg className="w-3.5 h-3.5 stroke-[#8892a0] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Super Scraper Pro V2
          </div>

          <div className="flex gap-2.5 flex-wrap bg-white/5 rounded-xl p-1.5 border border-white/5">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className="flex-1 min-w-[180px] px-4 py-2.5 bg-transparent border-none text-white text-[0.85rem] font-semibold outline-none placeholder:text-[#8892a0] placeholder:opacity-30"
              disabled={loading}
            />
            <button
              onClick={handleScrape}
              disabled={loading}
              className="px-4 py-2.5 border-none rounded-xl font-bold text-[0.75rem] cursor-pointer transition-all duration-200 inline-flex items-center gap-1.5 font-body uppercase tracking-[0.015em] relative shadow-[0_4px_0_rgba(0,0,0,0.3)] translate-y-0 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-[0_4px_0_#4c1d95,0_6px_20px_rgba(124,58,237,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#4c1d95,0_10px_30px_rgba(124,58,237,0.35)] disabled:opacity-50 disabled:translate-y-0.5 disabled:shadow-[0_2px_0_#4c1d95] disabled:cursor-not-allowed"
            >
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Scraping...</> : <><i className="fas fa-scroll"></i> Scrape</>}
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2.5 border-none rounded-xl font-bold text-[0.75rem] cursor-pointer transition-all duration-200 inline-flex items-center gap-1.5 font-body uppercase tracking-[0.015em] relative shadow-[0_4px_0_rgba(0,0,0,0.3)] translate-y-0 bg-white/5 text-[#8892a0] border border-white/5 shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:bg-white/10 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]"
            >
              <i className="fas fa-eraser"></i> Clear
            </button>
          </div>
        </div>

        <div className="bg-[rgba(18,22,36,0.75)] backdrop-blur-[16px] rounded-2xl border border-white/5 p-5 transition-all duration-250 hover:border-purple-500/15">
          <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.08em] text-[#8892a0] font-bold opacity-50 mb-2.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 stroke-[#8892a0] opacity-50">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
            Progress
          </div>

          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#f472b6] rounded-full transition-all duration-400" style={{ width: progress + '%' }} />
          </div>

          <div className="flex justify-between mt-1.5 text-[0.6rem] font-semibold text-[#8892a0] opacity-50">
            <span>{loading ? 'Memproses...' : 'Menunggu...'}</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 mt-2 text-[0.65rem] text-[#8892a0] font-medium min-h-[32px]">
            <span className="text-[0.9rem] text-[#8b5cf6]"><i className="fas fa-file"></i></span>
            <span className="text-white font-semibold flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{currentFile}</span>
            <span className="text-[0.55rem] text-[#4ade80] font-semibold">{fileStatus}</span>
          </div>
        </div>

        <div className="bg-[rgba(18,22,36,0.75)] backdrop-blur-[16px] rounded-2xl border border-white/5 p-5 transition-all duration-250 hover:border-purple-500/15">
          <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.08em] text-[#8892a0] font-bold opacity-50 mb-2.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 stroke-[#8892a0] opacity-50">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            Folder Structure
          </div>

          <div className="flex flex-col gap-0.5 text-[0.7rem] max-h-[280px] overflow-y-auto py-1 font-semibold">
            {folderView.length === 0 ? (
              <>
                <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[#8892a0] font-semibold">
                  <span className="w-4 text-center flex-shrink-0"><i className="fas fa-folder text-[#60a5fa]"></i></span>
                  <span className="text-white word-break-break-all font-semibold text-[#06b6d4]">root/</span>
                </div>
                <div className="pl-6 text-[#8892a0] text-[0.6rem] opacity-30">Belum ada data</div>
              </>
            ) : (
              folderView.map((f, i) => {
                const indent = f.depth ? 'pl-' + Math.min(f.depth * 4, 12) : '';
                let icon = 'fa-file';
                let color = 'text-[#8892a0]';
                if (f.type === 'folder') {
                  icon = 'fa-folder';
                  color = 'text-[#60a5fa]';
                } else if (f.type === 'html') {
                  icon = 'fa-html5';
                  color = 'text-[#e34f26]';
                } else if (f.type === 'css' || f.type === 'style') {
                  icon = 'fa-css3-alt';
                  color = 'text-[#264de4]';
                } else if (f.type === 'script') {
                  icon = 'fa-js';
                  color = 'text-[#f7df1e]';
                } else if (f.type === 'image') {
                  icon = 'fa-image';
                  color = 'text-[#ff6b6b]';
                } else if (f.type === 'video') {
                  icon = 'fa-video';
                  color = 'text-[#ff6b9d]';
                } else if (f.type === 'audio') {
                  icon = 'fa-music';
                  color = 'text-[#4ecdc4]';
                } else if (f.type === 'font') {
                  icon = 'fa-font';
                  color = 'text-[#a29bfe]';
                } else if (f.type === 'json') {
                  icon = 'fa-code';
                  color = 'text-[#fbbf24]';
                } else if (f.type === 'pdf') {
                  icon = 'fa-file-pdf';
                  color = 'text-[#ef4444]';
                } else if (f.type === 'zip') {
                  icon = 'fa-file-archive';
                  color = 'text-[#8b5cf6]';
                } else if (f.type === 'txt') {
                  icon = 'fa-file-alt';
                  color = 'text-[#94a3b8]';
                }
                return (
                  <div key={i} className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[#8892a0] font-semibold hover:bg-white/5 ${indent}`}>
                    <span className="w-4 text-center flex-shrink-0"><i className={`fas ${icon} ${color}`}></i></span>
                    <span className="text-white word-break-break-all font-semibold">{f.name}</span>
                    <span className="ml-auto text-[0.55rem] text-[#8892a0] flex-shrink-0 font-medium opacity-40">{formatSize(f.size)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-[rgba(18,22,36,0.75)] backdrop-blur-[16px] rounded-2xl border border-white/5 p-5 transition-all duration-250 hover:border-purple-500/15">
          <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.08em] text-[#8892a0] font-bold opacity-50 mb-2.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 stroke-[#8892a0] opacity-50">
              <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/><circle cx="12" cy="16" r="5"/><path d="M12 11v5"/><path d="M9 13l3 3 3-3"/>
            </svg>
            Statistik
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[rgba(18,22,36,0.75)] border border-white/5 rounded-xl p-3.5 text-center transition-all duration-250 hover:border-purple-500/15 hover:-translate-y-0.5">
              <div className="text-[1.5rem] mb-1"><svg className="w-6 h-6 stroke-[#8892a0] opacity-30 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
              <div className="text-[0.5rem] text-[#8892a0] font-bold uppercase tracking-[0.025em] opacity-40">Total File</div>
              <div className="text-[0.85rem] font-bold text-white mt-0.5">{totalFiles}</div>
            </div>
            <div className="bg-[rgba(18,22,36,0.75)] border border-white/5 rounded-xl p-3.5 text-center transition-all duration-250 hover:border-purple-500/15 hover:-translate-y-0.5">
              <div className="text-[1.5rem] mb-1"><svg className="w-6 h-6 stroke-[#8892a0] opacity-30 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div>
              <div className="text-[0.5rem] text-[#8892a0] font-bold uppercase tracking-[0.025em] opacity-40">Ukuran ZIP</div>
              <div className="text-[0.85rem] font-bold text-white mt-0.5">{zipSize || '0 KB'}</div>
            </div>
            <div className="bg-[rgba(18,22,36,0.75)] border border-white/5 rounded-xl p-3.5 text-center transition-all duration-250 hover:border-purple-500/15 hover:-translate-y-0.5">
              <div className="text-[1.5rem] mb-1"><svg className="w-6 h-6 stroke-[#8892a0] opacity-30 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
              <div className="text-[0.5rem] text-[#8892a0] font-bold uppercase tracking-[0.025em] opacity-40">Waktu</div>
              <div className="text-[0.85rem] font-bold text-white mt-0.5">0s</div>
            </div>
            <div className="bg-[rgba(18,22,36,0.75)] border border-white/5 rounded-xl p-3.5 text-center transition-all duration-250 hover:border-purple-500/15 hover:-translate-y-0.5">
              <div className="text-[1.5rem] mb-1"><svg className="w-6 h-6 stroke-[#8892a0] opacity-30 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
              <div className="text-[0.5rem] text-[#8892a0] font-bold uppercase tracking-[0.025em] opacity-40">Folder</div>
              <div className="text-[0.85rem] font-bold text-white mt-0.5">{folderView.filter(f => f.type === 'folder').length}</div>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(18,22,36,0.75)] backdrop-blur-[16px] rounded-2xl border border-white/5 p-5 transition-all duration-250 hover:border-purple-500/15">
          <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.08em] text-[#8892a0] font-bold opacity-50 mb-2.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 stroke-[#8892a0] opacity-50">
              <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
            Log
          </div>

          <div className="bg-black/30 rounded-xl p-2 px-3 max-h-[120px] overflow-y-auto text-[0.6rem] text-[#8892a0] border border-white/5 leading-relaxed font-semibold">
            {log.length === 0 ? (
              <div className="flex gap-2.5 py-0.5 border-b border-white/5">
                <span className="text-[#8892a0] opacity-30 min-w-[55px] flex-shrink-0 font-medium">[init]</span>
                <span className="text-[#06b6d4]">Super Scraper Pro V2 siap. Support semua file!</span>
              </div>
            ) : (
              log.map((entry, i) => (
                <div key={i} className="flex gap-2.5 py-0.5 border-b border-white/5">
                  <span className="text-[#8892a0] opacity-30 min-w-[55px] flex-shrink-0 font-medium">[{entry.time}]</span>
                  <span className={
                    entry.type === 'ok' ? 'text-[#4ade80]' :
                    entry.type === 'err' ? 'text-[#ef4444]' :
                    entry.type === 'warn' ? 'text-[#fbbf24]' :
                    'text-[#06b6d4]'
                  }>{entry.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[#8892a0] text-[0.75rem] font-semibold transition-all duration-250 hover:bg-white/10 hover:text-white hover:-translate-x-1 w-fit mt-1">
          <i className="fas fa-arrow-left text-[0.8rem]"></i> Kembali
        </Link>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center animate-[popIn_0.3s_ease]">
          <div className="bg-[rgba(12,12,28,0.95)] rounded-2xl p-8 max-w-[400px] w-[90%] border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.5)] text-center">
            <div className="text-3xl mb-1">
              <svg className="w-12 h-12 stroke-[#4ade80] mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <div className="font-head text-[1.2rem] font-bold mb-1 bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">Scraping Selesai!</div>
            <div className="text-[#8892a0] text-[0.8rem] mb-3 font-medium">
              <strong className="text-white">{new URL(url).hostname}</strong> berhasil discrape.<br />
              <span className="text-[0.7rem] text-[#8892a0] opacity-40">Total <span>{totalFiles}</span> file</span>
            </div>
            <div className="text-[#8892a0] text-[0.7rem] my-1 mb-4 opacity-40 font-medium">Ukuran: ~{zipSize || '0 KB'}</div>
            <div className="flex gap-2.5 justify-center flex-wrap">
              <button onClick={downloadZip} className="px-6 py-3 border-none rounded-xl font-bold text-[0.75rem] cursor-pointer transition-all duration-200 inline-flex items-center gap-1.5 font-body uppercase tracking-[0.015em] relative shadow-[0_4px_0_rgba(0,0,0,0.3)] translate-y-0 bg-gradient-to-r from-[#059669] to-[#10b981] text-white shadow-[0_4px_0_#047857,0_6px_20px_rgba(5,150,105,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#047857,0_10px_30px_rgba(5,150,105,0.35)]">
                <i className="fas fa-download"></i> Download
              </button>
              <button onClick={() => setShowPopup(false)} className="px-6 py-3 border-none rounded-xl font-bold text-[0.75rem] cursor-pointer transition-all duration-200 inline-flex items-center gap-1.5 font-body uppercase tracking-[0.015em] relative shadow-[0_4px_0_rgba(0,0,0,0.3)] translate-y-0 bg-white/5 text-[#8892a0] border border-white/5 shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:bg-white/10 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .word-break-break-all { word-break: break-all; }
        .pl-4 { padding-left: 1rem; }
        .pl-8 { padding-left: 2rem; }
        .pl-12 { padding-left: 3rem; }
        .pl-16 { padding-left: 4rem; }
        .pl-20 { padding-left: 5rem; }
        .pl-24 { padding-left: 6rem; }
        .pl-28 { padding-left: 7rem; }
        .pl-32 { padding-left: 8rem; }
      `}</style>
    </div>
  );
}
