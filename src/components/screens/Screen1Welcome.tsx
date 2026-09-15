import React from 'react';
import { motion } from 'motion/react';
import { Play, BookOpen, Heart, Sparkles } from 'lucide-react';
import { EmoBuddy } from '../EmoBuddy';

interface Screen1WelcomeProps {
  onStart: () => void;
  onOpenTeacherGuide: () => void;
}

export const Screen1Welcome: React.FC<Screen1WelcomeProps> = ({
  onStart,
  onOpenTeacherGuide,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full text-center">
      {/* Decorative soft badges */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-sm font-bold mb-4 shadow-xs"
      >
        <Sparkles className="w-4 h-4 text-emerald-600" />
        <span>Aplikasi Regulasi Emosi Prasekolah</span>
      </motion.div>

      {/* Main Title & Tagline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold text-emerald-950 tracking-tight font-['Fredoka',sans-serif] mb-2 drop-shadow-xs">
          EMO-CALM AI
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-emerald-700 font-['Fredoka',sans-serif] mb-6">
          Kenal • Tenang • Luahkan
        </p>
      </motion.div>

      {/* Emo-Buddy Rabbit with speech bubble */}
      <div className="my-2">
        <EmoBuddy
          mood="cheerful"
          size="lg"
          speech="Hai! Saya Emo-Buddy. Mari kita kenal perasaan kita."
        />
      </div>

      {/* Two Large Preschool Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
      >
        {/* Button 1: Mula */}
        <button
          id="btn-welcome-start"
          onClick={onStart}
          className="w-full sm:w-1/2 py-5 px-6 rounded-3xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center gap-1 border-b-4 border-emerald-800 focus:outline-hidden"
        >
          <div className="flex items-center gap-2">
            <Play className="w-6 h-6 fill-white" />
            <span className="font-['Fredoka',sans-serif] text-2xl">Mula</span>
          </div>
          <span className="text-xs text-emerald-100 font-medium">Mari Bermula</span>
        </button>

        {/* Button 2: Panduan Guru */}
        <button
          id="btn-welcome-teacher-guide"
          onClick={onOpenTeacherGuide}
          className="w-full sm:w-1/2 py-5 px-6 rounded-3xl bg-white hover:bg-sky-50 active:scale-95 text-sky-900 font-extrabold text-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center gap-1 border-2 border-sky-300 border-b-4 border-b-sky-400 focus:outline-hidden"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sky-600" />
            <span className="font-['Fredoka',sans-serif] text-2xl">Panduan</span>
          </div>
          <span className="text-xs text-sky-700 font-medium">Guru & Ibu Bapa</span>
        </button>
      </motion.div>

      {/* Reassurance Footer Pill */}
      <div className="mt-10 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 bg-white/70 px-4 py-2 rounded-full border border-slate-200">
        <Heart className="w-4 h-4 text-rose-400" />
        <span>Ruang selamat kanak-kanak prasekolah • Tanpa iklan • Privasi terpelihara</span>
      </div>
    </div>
  );
};
