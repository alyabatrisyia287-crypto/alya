import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coffee,
  MessageCircle,
  GraduationCap,
  Users,
  Palette,
  Wind,
  Bell,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { NeedType } from '../../types';

interface Screen7WhatINeedProps {
  selectedNeed?: NeedType;
  onSelectNeed: (need: NeedType) => void;
  onReturnToBreathing: () => void;
  onContinueToCompletion: () => void;
  teacherCalled: boolean;
  onSetTeacherCalled: (called: boolean) => void;
}

interface NeedCardOption {
  type: NeedType;
  label: string;
  emoji: string;
  icon: React.ReactNode;
  bgLight: string;
  borderColor: string;
}

const NEED_OPTIONS: NeedCardOption[] = [
  {
    type: 'Saya mahu berehat',
    label: 'Saya mahu berehat',
    emoji: '🛋️',
    icon: <Coffee className="w-6 h-6 text-amber-600" />,
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-300',
  },
  {
    type: 'Saya mahu bercakap',
    label: 'Saya mahu bercakap',
    emoji: '🗣️',
    icon: <MessageCircle className="w-6 h-6 text-sky-600" />,
    bgLight: 'bg-sky-50',
    borderColor: 'border-sky-300',
  },
  {
    type: 'Saya perlukan bantuan cikgu',
    label: 'Saya perlukan bantuan cikgu',
    emoji: '👩‍🏫',
    icon: <GraduationCap className="w-6 h-6 text-rose-600" />,
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-300',
  },
  {
    type: 'Saya mahu seseorang menemani',
    label: 'Saya mahu seseorang menemani',
    emoji: '🤝',
    icon: <Users className="w-6 h-6 text-purple-600" />,
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-300',
  },
  {
    type: 'Saya mahu melukis',
    label: 'Saya mahu melukis',
    emoji: '🎨',
    icon: <Palette className="w-6 h-6 text-emerald-600" />,
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
  },
  {
    type: 'Saya mahu bernafas lagi',
    label: 'Saya mahu bernafas lagi',
    emoji: '🌸',
    icon: <Wind className="w-6 h-6 text-teal-600" />,
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-300',
  },
];

export const Screen7WhatINeed: React.FC<Screen7WhatINeedProps> = ({
  selectedNeed,
  onSelectNeed,
  onReturnToBreathing,
  onContinueToCompletion,
  teacherCalled,
  onSetTeacherCalled,
}) => {
  const [showCallAlert, setShowCallAlert] = useState(teacherCalled);

  const handleSelect = (need: NeedType) => {
    onSelectNeed(need);
    if (need === 'Saya mahu bernafas lagi') {
      onReturnToBreathing();
    }
  };

  const handleCallTeacher = () => {
    setShowCallAlert(true);
    onSetTeacherCalled(true);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full text-center">
      {/* Title */}
      <h2 className="text-2xl sm:text-4xl font-extrabold text-emerald-950 font-['Fredoka',sans-serif] mb-2">
        Apa yang boleh membantu kamu sekarang?
      </h2>
      <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-md">
        Pilih satu perkara yang kamu rasa dapat menolong kamu berasa lebih selesa.
      </p>

      {/* 6 Large Need Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-3xl mb-6">
        {NEED_OPTIONS.map((opt) => {
          const isSelected = selectedNeed === opt.type;
          return (
            <motion.button
              key={opt.type}
              id={`btn-need-${opt.type.replace(/\s+/g, '-').toLowerCase()}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(opt.type)}
              className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center gap-2.5 transition-all text-center relative ${
                isSelected
                  ? `${opt.bgLight} ${opt.borderColor} ring-4 ring-emerald-300 shadow-md scale-102`
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                </div>
              )}
              <span className="text-4xl select-none">{opt.emoji}</span>
              <span className="text-base sm:text-lg font-bold text-slate-800 font-['Fredoka',sans-serif] leading-snug">
                {opt.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Special Teacher Support Card if "Saya perlukan bantuan cikgu" is selected */}
      <AnimatePresence>
        {selectedNeed === 'Saya perlukan bantuan cikgu' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xl bg-rose-50 border-3 border-rose-300 rounded-3xl p-6 shadow-lg mb-6 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-rose-950 font-['Fredoka',sans-serif] mb-2">
              Baik. Tunjukkan skrin ini kepada cikgu.
            </h3>
            <p className="text-sm text-slate-600 mb-5 max-w-md mx-auto">
              Cikgu sentiasa ada untuk membantu mendengar dan memberi pelukan atau sokongan.
            </p>

            {/* Button: Panggil Cikgu */}
            <button
              id="btn-call-teacher"
              onClick={handleCallTeacher}
              className="px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 mx-auto border-b-4 border-rose-800"
            >
              <Bell className="w-6 h-6 animate-bounce" />
              <span className="font-['Fredoka',sans-serif]">Panggil Cikgu</span>
            </button>

            {/* When pressed: Show notification banner as required */}
            {showCallAlert && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-white border-2 border-rose-400 rounded-2xl shadow-sm inline-flex items-center gap-3 text-left"
              >
                <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span className="text-lg font-extrabold text-rose-900 font-['Fredoka',sans-serif]">
                  “Cikgu, saya perlukan bantuan.”
                </span>
              </motion.div>
            )}

            <p className="text-[11px] text-slate-400 mt-4">
              *Aplikasi tidak menghantar sebarang mesej atau maklumat peribadi ke luar peranti.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teruskan Button */}
      <button
        id="btn-need-teruskan"
        disabled={!selectedNeed}
        onClick={onContinueToCompletion}
        className={`px-8 py-4 rounded-3xl font-extrabold text-lg shadow-lg flex items-center gap-3 transition-all ${
          selectedNeed
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 border-b-4 border-emerald-800 cursor-pointer shadow-emerald-200'
            : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed opacity-75'
        }`}
      >
        <span className="font-['Fredoka',sans-serif]">Seterusnya: Rumusan & Selesai</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
