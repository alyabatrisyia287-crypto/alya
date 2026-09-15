import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Trees, Cloud, Waves, Sparkles, Volume2 } from 'lucide-react';
import { CalmBackground, CalmSound } from '../../types';
import { EmoBuddy } from '../EmoBuddy';

interface Screen3CalmModeProps {
  selectedBg: CalmBackground;
  onSelectBg: (bg: CalmBackground) => void;
  selectedSound: CalmSound;
  onSelectSound: (sound: CalmSound) => void;
  onContinueToBreathing: () => void;
  isAudioMuted: boolean;
}

interface BgOption {
  id: CalmBackground;
  label: string;
  icon: React.ReactNode;
  hint: string;
}

const BG_OPTIONS: BgOption[] = [
  {
    id: 'taman',
    label: 'Taman Hijau',
    icon: <Trees className="w-5 h-5" />,
    hint: 'Rumput segar & bunga lembut',
  },
  {
    id: 'awan',
    label: 'Awan Perlahan',
    icon: <Cloud className="w-5 h-5" />,
    hint: 'Langit biru & awan gebu',
  },
  {
    id: 'ombak',
    label: 'Ombak Lembut',
    icon: <Waves className="w-5 h-5" />,
    hint: 'Pantai damai & buih air',
  },
  {
    id: 'pelangi',
    label: 'Pelangi Pastel',
    icon: <Sparkles className="w-5 h-5" />,
    hint: 'Warna-warni ceria & tenang',
  },
];

interface SoundOption {
  id: CalmSound;
  label: string;
  emoji: string;
}

const SOUND_OPTIONS: SoundOption[] = [
  { id: 'hujan', label: 'Hujan Lembut', emoji: '🌧️' },
  { id: 'ombak', label: 'Ombak', emoji: '🌊' },
  { id: 'alam', label: 'Alam', emoji: '🍃' },
  { id: 'tanpa_bunyi', label: 'Tanpa Bunyi', emoji: '🔇' },
];

export const Screen3CalmMode: React.FC<Screen3CalmModeProps> = ({
  selectedBg,
  onSelectBg,
  selectedSound,
  onSelectSound,
  onContinueToBreathing,
  isAudioMuted,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-5xl mx-auto w-full relative">
      {/* Visual background showcase card with CSS illustration */}
      <div className="w-full rounded-3xl overflow-hidden shadow-lg border-2 border-white mb-6 relative min-h-[220px] sm:min-h-[260px] flex items-center justify-center">
        {/* Dynamic CSS Background Illustration */}
        {selectedBg === 'taman' && (
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-100 via-emerald-50 to-emerald-200 flex flex-col justify-end overflow-hidden">
            {/* Sun */}
            <div className="absolute top-6 right-10 w-16 h-16 rounded-full bg-amber-200/70 blur-xs" />
            {/* Rolling Hills in CSS */}
            <div className="w-[120%] -ml-[10%] h-24 bg-emerald-300/40 rounded-t-[100px]" />
            <div className="w-[140%] -ml-[20%] h-20 bg-emerald-400/50 rounded-t-[120px] -mt-10 flex items-center justify-around px-12">
              <span className="text-2xl animate-bounce" style={{ animationDuration: '4s' }}>🌸</span>
              <span className="text-xl animate-bounce" style={{ animationDuration: '3.5s' }}>🌼</span>
              <span className="text-2xl animate-bounce" style={{ animationDuration: '4.5s' }}>🌷</span>
              <span className="text-xl animate-bounce" style={{ animationDuration: '3.8s' }}>🌻</span>
            </div>
          </div>
        )}

        {selectedBg === 'awan' && (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-indigo-50 flex items-center justify-center overflow-hidden">
            <motion.div
              animate={{ x: [-20, 20, -20] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-6 left-12 w-28 h-12 bg-white/80 rounded-full blur-xs"
            />
            <motion.div
              animate={{ x: [30, -30, 30] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-10 right-16 w-36 h-16 bg-white/90 rounded-full blur-xs shadow-sm"
            />
            <div className="text-4xl opacity-80">☁️ ⛅ ☁️</div>
          </div>
        )}

        {selectedBg === 'ombak' && (
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-100 via-teal-100 to-cyan-300 flex flex-col justify-end overflow-hidden">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[130%] -ml-[15%] h-24 bg-teal-200/50 rounded-t-[140px]"
            />
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[140%] -ml-[20%] h-16 bg-cyan-400/60 rounded-t-[100px] -mt-10"
            />
            <div className="absolute top-8 text-3xl">🌊 🐚 🐬</div>
          </div>
        )}

        {selectedBg === 'pelangi' && (
          <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-purple-50 to-amber-50 flex items-center justify-center overflow-hidden">
            {/* CSS Rainbow Arch */}
            <div className="w-64 h-32 border-t-8 border-rose-300 rounded-t-full flex items-center justify-center pt-2">
              <div className="w-52 h-28 border-t-8 border-amber-300 rounded-t-full flex items-center justify-center pt-2">
                <div className="w-40 h-24 border-t-8 border-emerald-300 rounded-t-full flex items-center justify-center pt-2">
                  <div className="w-28 h-20 border-t-8 border-sky-300 rounded-t-full flex items-center justify-center pt-2">
                    <div className="w-16 h-16 border-t-8 border-purple-300 rounded-t-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-6 left-8 text-2xl">✨</div>
            <div className="absolute bottom-6 right-8 text-2xl">🌈</div>
          </div>
        )}

        {/* Emo-Buddy relaxing in center */}
        <div className="relative z-10 p-4">
          <EmoBuddy
            mood="calm"
            size="md"
            speech="Tidak mengapa. Mari kita tenangkan badan dahulu."
          />
        </div>
      </div>

      {/* Background Selector */}
      <div className="w-full max-w-2xl bg-white border-2 border-emerald-100 rounded-3xl p-4 sm:p-5 shadow-sm mb-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-800 font-['Fredoka',sans-serif] text-center mb-3">
          Pilih Suasana Menenangkan yang Kamu Suka:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BG_OPTIONS.map((bg) => (
            <button
              key={bg.id}
              id={`btn-calm-bg-${bg.id}`}
              onClick={() => onSelectBg(bg.id)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                selectedBg === bg.id
                  ? 'bg-emerald-100 border-emerald-500 shadow-sm ring-2 ring-emerald-300 font-bold'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  selectedBg === bg.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {bg.icon}
              </div>
              <span className="text-xs font-bold font-['Fredoka',sans-serif] text-slate-800">
                {bg.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sound Selector */}
      <div className="w-full max-w-2xl bg-white border-2 border-sky-100 rounded-3xl p-4 sm:p-5 shadow-sm mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Volume2 className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-800 font-['Fredoka',sans-serif]">
            Pilih Bunyi Menenangkan (Pilihan):
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SOUND_OPTIONS.map((snd) => (
            <button
              key={snd.id}
              id={`btn-calm-snd-${snd.id}`}
              onClick={() => onSelectSound(snd.id)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                selectedSound === snd.id
                  ? 'bg-sky-100 border-sky-500 shadow-sm ring-2 ring-sky-300'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-2xl select-none">{snd.emoji}</span>
              <span className="text-xs font-bold font-['Fredoka',sans-serif] text-slate-800">
                {snd.label}
              </span>
            </button>
          ))}
        </div>

        {/* Selected sound feedback message required by prompt */}
        <div className="mt-3 text-center">
          <span className="inline-block text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
            Bunyi ini dipilih: {SOUND_OPTIONS.find((s) => s.id === selectedSound)?.label}
            {isAudioMuted && ' (Bunyi sistem sedang dibisukan)'}
          </span>
        </div>
      </div>

      {/* Next to Breathing Button */}
      <button
        id="btn-calm-teruskan-bernafas"
        onClick={onContinueToBreathing}
        className="px-8 py-4 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-3 border-b-4 border-emerald-800 focus:outline-hidden"
      >
        <span className="font-['Fredoka',sans-serif]">Seterusnya: Aktiviti Bernafas</span>
        <ArrowRight className="w-5 h-5" />
      </button>
      <p className="text-xs text-slate-500 mt-2">
        Mari tenangkan degupan jantung dengan bau bunga & tiup lilin
      </p>
    </div>
  );
};
