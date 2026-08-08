'use client';

import { useState, useEffect, useRef } from 'react';

const PLAYLIST = [
  { name: 'Lagu 1', file: '/music/audio.mp3' },
  { name: 'Lagu 2', file: '/music/audio2.mp3' },
  { name: 'Lagu 3', file: '/music/audio3.mp3' },
  { name: 'Lagu 4', file: '/music/audio4.mp3' },
  { name: 'Lagu 5', file: '/music/audio5.mp3' },
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [trackName, setTrackName] = useState('Audio Player');
  const [status, setStatus] = useState('Live');
  const audioRef = useRef(null);

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds) || seconds === Infinity) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + String(secs).padStart(2, '0');
  }

  useEffect(() => {
    const savedTrack = parseInt(localStorage.getItem('music_track_index') || '0');
    const savedPlaying = localStorage.getItem('music_playing') === 'true';
    const savedRepeating = localStorage.getItem('music_repeating') === 'true';
    const savedTime = parseFloat(localStorage.getItem('music_time') || '0');

    if (savedTrack < PLAYLIST.length) {
      setCurrentTrack(savedTrack);
    }
    setIsPlaying(savedPlaying);
    setIsRepeating(savedRepeating);

    audioRef.current = new Audio();
    audioRef.current.src = PLAYLIST[savedTrack].file;
    audioRef.current.preload = 'auto';
    audioRef.current.volume = 0.8;
    audioRef.current.currentTime = savedTime || 0;
    setTrackName(PLAYLIST[savedTrack].name);

    const audio = audioRef.current;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(formatTime(audio.duration));
      if (savedPlaying) {
        audio.play().catch(() => {
          setIsPlaying(false);
          localStorage.setItem('music_playing', 'false');
        });
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        setProgress(pct);
        setCurrentTime(formatTime(audio.currentTime));
        localStorage.setItem('music_time', audio.currentTime.toString());
      }
    });

    audio.addEventListener('play', () => {
      setIsPlaying(true);
      setStatus('Playing');
      localStorage.setItem('music_playing', 'true');
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
      setStatus('Paused');
      localStorage.setItem('music_playing', 'false');
    });

    audio.addEventListener('ended', () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    });

    audio.addEventListener('error', () => {
      setStatus('Error');
    });

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('music_repeating', isRepeating.toString());
  }, [isRepeating]);

  function loadTrack(index, autoplay = true) {
    const track = PLAYLIST[index];
    if (!track) return;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = track.file;
      audio.preload = 'auto';
      audio.volume = 0.8;
      audio.currentTime = 0;
      setCurrentTrack(index);
      setTrackName(track.name);
      setProgress(0);
      setCurrentTime('0:00');
      setStatus('Loading');

      if (autoplay && isPlaying) {
        audio.play().catch(() => {});
      }
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        loadTrack(currentTrack, true);
      });
    }
  }

  function nextTrack() {
    const next = (currentTrack + 1) % PLAYLIST.length;
    localStorage.setItem('music_track_index', next.toString());
    localStorage.setItem('music_time', '0');
    loadTrack(next, true);
  }

  function prevTrack() {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const prev = (currentTrack - 1 + PLAYLIST.length) % PLAYLIST.length;
    localStorage.setItem('music_track_index', prev.toString());
    localStorage.setItem('music_time', '0');
    loadTrack(prev, true);
  }

  function toggleRepeat() {
    setIsRepeating(!isRepeating);
  }

  function handleProgressClick(e) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  }

  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 px-3 mt-0.5 transition-all duration-300 hover:border-purple-500/10">
      <div className="text-[0.55rem] font-bold uppercase tracking-[0.05em] text-white/15 mb-2 flex items-center gap-1.5">
        <i className="fas fa-music text-[#f472b6] text-[0.6rem] animate-[musicPulse_1.5s_ease-in-out_infinite]"></i>
        <span>Musik</span>
        <span className="ml-auto text-[0.45rem] opacity-30" id="musicStatus">● {status}</span>
      </div>

      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        <button className="w-[30px] h-[30px] rounded-full border border-white/5 bg-white/5 text-[#8892a0] cursor-pointer flex items-center justify-center text-[0.65rem] transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/15 hover:text-white hover:scale-[1.05]" onClick={prevTrack}>
          <i className="fas fa-step-backward"></i>
        </button>
        <button className="w-[36px] h-[36px] rounded-full border-none bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white cursor-pointer flex items-center justify-center text-[0.75rem] shadow-[0_2px_12px_rgba(139,92,246,0.15)] transition-all duration-300 hover:scale-[1.08] hover:shadow-[0_4px_20px_rgba(139,92,246,0.25)] active:scale-[0.95]" onClick={togglePlay}>
          <i className={isPlaying ? 'fas fa-pause' : 'fas fa-play'}></i>
        </button>
        <button className="w-[30px] h-[30px] rounded-full border border-white/5 bg-white/5 text-[#8892a0] cursor-pointer flex items-center justify-center text-[0.65rem] transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/15 hover:text-white hover:scale-[1.05]" onClick={nextTrack}>
          <i className="fas fa-step-forward"></i>
        </button>
        <button className={`w-[30px] h-[30px] rounded-full border border-white/5 bg-white/5 text-[#8892a0] cursor-pointer flex items-center justify-center text-[0.65rem] transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/15 hover:text-white hover:scale-[1.05] ${isRepeating ? 'text-[#8b5cf6] border-purple-500/20' : ''}`} onClick={toggleRepeat}>
          <i className="fas fa-repeat"></i>
        </button>
      </div>

      <div className="w-full my-1">
        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden cursor-pointer relative" onClick={handleProgressClick}>
          <div className="h-full w-0 bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#f472b6] rounded-full transition-[width_0.1s_linear]" style={{ width: progress + '%' }} />
        </div>
        <div className="flex justify-between mt-0.5 text-[0.45rem] text-white/15 font-medium tracking-[0.03em]">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>
      </div>

      <div className="text-center mt-0.5">
        <span className="text-[0.55rem] text-white/20 font-medium whitespace-nowrap overflow-hidden text-ellipsis block max-w-full">
          {trackName}
        </span>
      </div>
    </div>
  );
}