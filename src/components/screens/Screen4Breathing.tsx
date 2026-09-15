import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, CheckCircle, Pause, Play, ArrowRight, Sparkles } from 'lucide-react';
import { playSoftChime } from '../../utils/audioSynth';

interface Screen4BreathingProps {
  onFinishBreathing: (completedRounds: number) => void;
  isAudioMuted: boolean;
}

type BreathPhase = 'inhale' | 'exhale' | 'finished';

export const Screen4Breathing: React.FC<Screen4BreathingProps> = ({
  onFinishBreathing,
  isAudioMuted,
}) => {
  const [round, setRound] = useState<number>(1);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [secondsLeftInPhase, setSecondsLeftInPhase] = useState<number>(4);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Timer reference
  const timerRef = useRef<number | null>(null);

  // Play chime on phase transition
  useEffect(() => {
    if (!isRunning || phase === 'finished') return;
    if (phase === 'inhale') {
      playSoftChime(isAudioMuted, 'inhale');
    } else if (phase === 'exhale') {
      playSoftChime(isAudioMuted, 'exhale');
    }
  }, [phase, isRunning, isAudioMuted]);

  useEffect(() => {
    if (!isRunning || phase === 'finished') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setSecondsLeftInPhase((prev) => {
        if (prev <= 1) {
          // Switch phase
          if (phase === 'inhale') {
            setPhase('exhale');
            return 4;
          } else if (phase === 'exhale') {
            if (round < 3) {
              setRound((r) => r + 1);
              setPhase('inhale');
              return 4;
            } else {
              // 3 rounds completed!
              setPhase('finished');
              setIsRunning(false);
              playSoftChime(isAudioMuted, 'success');
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [phase, round, isRunning, isAudioMuted]);

  const handleRepeat = () => {
    setRound(1);
    setPhase('inhale');
    setSecondsLeftInPhase(4);
    setIsRunning(true);
  };

  const handleStopToggle = () => {
    setIsRunning((prev) => !prev);
  };

  const handleComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onFinishBreathing(round);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full text-center">
      {/* Round Counter Badge */}
      <div className="mb-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-900 font-extrabold text-base sm:text-lg font-['Fredoka',sans-serif] shadow-xs">
        <span>🌸</span>
        <span>Pusingan {Math.min(round, 3)} daripada 3</span>
      </div>

      {/* Main Breathing Stage Card */}
      <div className="w-full bg-white border-2 border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
        {/* Soft radial background aura */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            phase === 'inhale'
              ? 'bg-gradient-to-b from-rose-50/70 via-emerald-50/40 to-white'
              : phase === 'exhale'
              ? 'bg-gradient-to-b from-sky-50/70 via-amber-50/40 to-white'
              : 'bg-emerald-50/80'
          }`}
        />

        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* STEP 1: Flower slowly expanding for four seconds */}
          {phase === 'inhale' && (
            <motion.div
              key="inhale-flower"
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1.25, opacity: 1 }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center my-4"
            >
              {/* SVG Flower that expands */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  {/* Petals */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <circle
                      key={i}
                      cx="50"
                      cy="28"
                      r="16"
                      fill="#F472B6"
                      opacity="0.85"
                      transform={`rotate(${angle} 50 50)`}
                    />
                  ))}
                  {/* Center of flower */}
                  <circle cx="50" cy="50" r="16" fill="#FBBF24" />
                  <circle cx="46" cy="46" r="3" fill="#FDE68A" />
                </svg>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-['Fredoka',sans-serif] mt-4">
                Bau bunga perlahan-lahan…
              </h3>
              <p className="text-sm font-semibold text-rose-500 mt-1">
                Tarik nafas melalui hidung ({secondsLeftInPhase}s)
              </p>
            </motion.div>
          )}

          {/* STEP 2: Candle with gently moving flame */}
          {phase === 'exhale' && (
            <motion.div
              key="exhale-candle"
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 0.85, opacity: 1 }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center my-4"
            >
              {/* SVG Candle with moving flame */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  {/* Candle Base/Wax */}
                  <rect x="40" y="45" width="20" height="42" rx="4" fill="#60A5FA" />
                  <rect x="42" y="48" width="5" height="36" rx="2" fill="#93C5FD" />
                  {/* Wick */}
                  <line x1="50" y1="45" x2="50" y2="38" stroke="#374151" strokeWidth="2.5" />
                  {/* Flame with gentle wiggle */}
                  <motion.path
                    d="M 50 20 C 44 26 44 35 50 37 C 56 35 56 26 50 20 Z"
                    fill="#F59E0B"
                    animate={{
                      scaleY: [1, 0.85, 1.1, 0.9],
                      scaleX: [1, 1.1, 0.9, 1.05],
                      rotate: [-5, 5, -3, 3],
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: '50px 37px' }}
                  />
                  {/* Inner flame */}
                  <motion.path
                    d="M 50 26 C 47 29 47 34 50 35 C 53 34 53 29 50 26 Z"
                    fill="#FEF08A"
                    animate={{ scale: [1, 0.9, 1.1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{ transformOrigin: '50px 35px' }}
                  />
                </svg>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-sky-700 font-['Fredoka',sans-serif] mt-4">
                Tiup lilin perlahan-lahan…
              </h3>
              <p className="text-sm font-semibold text-sky-600 mt-1">
                Hembus nafas lembut melalui mulut ({secondsLeftInPhase}s)
              </p>
            </motion.div>
          )}

          {/* Finished 3 rounds */}
          {phase === 'finished' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center my-4"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-['Fredoka',sans-serif]">
                Syabas! 3 Pusingan Selesai.
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-sm">
                Badan kamu kini lebih tenang dan sedia untuk berkongsi perasaan.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Working Action Buttons (as required) */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-lg">
        {/* Button 1: Ulang Lagi */}
        <button
          id="btn-breathing-repeat"
          onClick={handleRepeat}
          className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 font-bold text-sm shadow-xs flex items-center gap-2 active:scale-95 transition-all focus:outline-hidden"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ulang Lagi</span>
        </button>

        {/* Button 2: Berhenti / Sambung */}
        {phase !== 'finished' && (
          <button
            id="btn-breathing-stop-toggle"
            onClick={handleStopToggle}
            className={`px-5 py-3 rounded-2xl border-2 font-bold text-sm shadow-xs flex items-center gap-2 active:scale-95 transition-all focus:outline-hidden ${
              isRunning
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Berhenti' : 'Sambung'}</span>
          </button>
        )}

        {/* Button 3: Saya Sudah Tenang (Proceeds forward) */}
        <button
          id="btn-breathing-ready"
          onClick={handleComplete}
          className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95 transition-all border-b-4 border-emerald-800 focus:outline-hidden"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-['Fredoka',sans-serif]">Saya Sudah Tenang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
