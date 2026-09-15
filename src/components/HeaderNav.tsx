import React from 'react';
import { Volume2, VolumeX, Home, ArrowLeft, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { ScreenId } from '../types';

interface HeaderNavProps {
  currentScreen: ScreenId;
  totalScreens?: number;
  onGoHome: () => void;
  onGoBack: () => void;
  onGoNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onOpenTeacherGuide: () => void;
}

const SCREEN_TITLES: Record<ScreenId, string> = {
  1: 'Mula',
  2: 'Pilih Kaedah',
  3: 'Zon Tenang',
  4: 'Pernafasan',
  5: 'Kenal Emosi',
  6: 'Luahkan',
  7: 'Bantuan Saya',
  8: 'Tahniah',
};

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  totalScreens = 8,
  onGoHome,
  onGoBack,
  onGoNext,
  canGoBack,
  canGoNext,
  isAudioMuted,
  onToggleAudio,
  onOpenTeacherGuide,
}) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-emerald-100/80 sticky top-0 z-30 shadow-xs px-3 py-2.5 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand & Home */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="nav-btn-home"
            onClick={onGoHome}
            className="flex flex-col items-center justify-center p-2 rounded-2xl text-emerald-800 hover:bg-emerald-50 transition-colors focus:outline-hidden"
            title="Kembali ke Laman Utama"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-0.5 text-emerald-800">Utama</span>
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 tracking-tight font-['Fredoka',sans-serif]">
                EMO-CALM AI
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Prasekolah
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Kenal • Tenang • Luahkan
            </p>
          </div>
        </div>

        {/* Center: Step indicators for child/teacher */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            {([1, 2, 3, 4, 5, 6, 7, 8] as ScreenId[]).map((step) => (
              <div
                key={step}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  step === currentScreen
                    ? 'w-7 bg-emerald-600'
                    : step < currentScreen
                    ? 'w-2.5 bg-emerald-300'
                    : 'w-2.5 bg-slate-200'
                }`}
                title={`Langkah ${step}: ${SCREEN_TITLES[step]}`}
              />
            ))}
          </div>
          <span className="text-xs text-emerald-900 font-bold mt-1 font-['Fredoka',sans-serif]">
            Langkah {currentScreen} daripada {totalScreens}: {SCREEN_TITLES[currentScreen]}
          </span>
        </div>

        {/* Right: Audio toggle, Teacher guide, and Nav buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio toggle button */}
          <button
            id="nav-btn-audio-toggle"
            onClick={onToggleAudio}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all focus:outline-hidden ${
              isAudioMuted
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
            title={isAudioMuted ? 'Buka Bunyi' : 'Senyap'}
            aria-label={isAudioMuted ? 'Buka Bunyi' : 'Senyap'}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center">
              {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-bold mt-0.5">
              {isAudioMuted ? 'Bisu' : 'Bunyi'}
            </span>
          </button>

          {/* Panduan Guru button */}
          <button
            id="nav-btn-teacher-guide"
            onClick={onOpenTeacherGuide}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-all focus:outline-hidden"
            title="Buka Panduan Guru"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sky-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-0.5">Cikgu</span>
          </button>

          {/* Navigation Back button */}
          {canGoBack && (
            <button
              id="nav-btn-back"
              onClick={onGoBack}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all focus:outline-hidden"
              title="Kembali ke skrin sebelum"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-amber-800">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold mt-0.5">Kembali</span>
            </button>
          )}

          {/* Navigation Next button */}
          {canGoNext && (
            <button
              id="nav-btn-next"
              onClick={onGoNext}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all focus:outline-hidden"
              title="Teruskan ke langkah seterusnya"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold mt-0.5">Seterusnya</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
