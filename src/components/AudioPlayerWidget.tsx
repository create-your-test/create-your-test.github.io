import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerWidgetProps {
  promptText: string;
  caption?: string;
  lang?: string;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({
  promptText,
  caption = 'مقطع استماع صوتي',
  lang = 'en-US'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const handlePlayToggle = () => {
    if (!('speechSynthesis' in window)) {
      alert('ميزة القراءة الصوتية غير مدعومة في متصفحك الحالي');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      if (timerRef.current) window.clearInterval(timerRef.current);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(promptText);
      utterance.rate = playbackRate;
      utterance.lang = lang;
      utterance.volume = isMuted ? 0 : 1;

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
        if (timerRef.current) window.clearInterval(timerRef.current);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        if (timerRef.current) window.clearInterval(timerRef.current);
      };

      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setProgress(0);

      const estimatedDurationMs = (promptText.split(' ').length / (2.5 * playbackRate)) * 1000;
      const intervalMs = 100;
      let elapsed = 0;

      timerRef.current = window.setInterval(() => {
        elapsed += intervalMs;
        const currentPct = Math.min(100, Math.round((elapsed / estimatedDurationMs) * 100));
        setProgress(currentPct);
        if (currentPct >= 100 && timerRef.current) {
          window.clearInterval(timerRef.current);
        }
      }, intervalMs);
    }
  };

  const handleReset = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 my-3 border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">{caption}</h4>
            <span className="text-[11px] text-slate-400 font-mono">Audio Prompt · High Fidelity</span>
          </div>
        </div>

        {/* Speed Toggle */}
        <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 text-[11px]">
          {[0.8, 1.0, 1.2].map(rate => (
            <button
              key={rate}
              type="button"
              onClick={() => {
                setPlaybackRate(rate);
                if (isPlaying) {
                  handleReset();
                }
              }}
              className={`px-2 py-0.5 rounded font-mono transition-colors ${
                playbackRate === rate ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Waveform Visualization Bars */}
      <div className="flex items-center justify-center gap-1 h-8 my-2 px-2 bg-slate-950/60 rounded-lg">
        {Array.from({ length: 32 }).map((_, idx) => {
          const height = isPlaying 
            ? Math.max(15, Math.sin(idx * 0.4 + Date.now() * 0.005) * 80 + Math.random() * 20)
            : ((idx % 4) + 1) * 15;
          const isPassed = (idx / 32) * 100 <= progress;
          return (
            <div
              key={idx}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPassed ? 'bg-indigo-400' : 'bg-slate-700'
              }`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>

      {/* Progress Bar & Controls */}
      <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePlayToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-medium rounded-lg transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>تشغيل الاستماع</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="إعادة من البداية"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400 tabular-nums">
          {progress}%
        </div>
      </div>
    </div>
  );
};
