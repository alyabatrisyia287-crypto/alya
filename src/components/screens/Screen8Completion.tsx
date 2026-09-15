import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  RotateCcw,
  Home,
  Users,
  CheckCircle,
  Heart,
  X,
  Printer,
} from 'lucide-react';
import { SessionData } from '../../types';
import { EmoBuddy } from '../EmoBuddy';

interface Screen8CompletionProps {
  sessionData: SessionData;
  onResetSession: () => void;
  onReturnToMenu: () => void;
}

export const Screen8Completion: React.FC<Screen8CompletionProps> = ({
  sessionData,
  onResetSession,
  onReturnToMenu,
}) => {
  const [showTeacherView, setShowTeacherView] = useState(false);

  // Format Cara Meluahkan label
  const getExpressLabel = () => {
    if (!sessionData.expressMethod) return 'Belum dipilih';
    if (sessionData.expressMethod === 'cakap') return 'Melalui Suara / Catatan Kata';
    if (sessionData.expressMethod === 'lukis') return 'Melalui Lukisan Ekspresi';
    if (sessionData.expressMethod === 'gambar') {
      return `Memilih Gambar Situasi (${sessionData.selectedSituation || 'Situasi'})`;
    }
    return sessionData.expressMethod;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full text-center">
      {/* Cheerful Emo-Buddy celebrating animation */}
      <div className="my-3">
        <EmoBuddy
          mood="celebrating"
          size="lg"
          speech="Syabas! Kamu sudah cuba menenangkan badan dan memberitahu keperluan kamu."
        />
      </div>

      {/* Main Praise Title */}
      <h2 className="text-2xl sm:text-4xl font-extrabold text-emerald-950 font-['Fredoka',sans-serif] mt-2 mb-2">
        Hebat & Tenang!
      </h2>
      <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-md">
        Kamu telah menyelesaikan sesi regulasi emosi bersama Emo-Buddy hari ini.
      </p>

      {/* Simple Session Summary (Strictly Only Required 3 Items) */}
      <div className="w-full max-w-lg bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-md mb-8 text-left">
        <div className="flex items-center gap-2 border-b border-emerald-100 pb-3 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-emerald-900 font-['Fredoka',sans-serif]">
            Rumusan Sesi Emosi
          </h3>
        </div>

        <div className="space-y-4">
          {/* 1. Perasaan yang dipilih */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                Perasaan yang dipilih:
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-800 font-['Fredoka',sans-serif]">
                {sessionData.selectedEmotion || 'Tidak dinyatakan'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          {/* 2. Cara meluahkan */}
          <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                Cara meluahkan:
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-800 font-['Fredoka',sans-serif]">
                {getExpressLabel()}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          {/* 3. Bantuan yang dipilih */}
          <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
                Bantuan yang dipilih:
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-800 font-['Fredoka',sans-serif]">
                {sessionData.selectedNeed || 'Tiada bantuan khusus'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-4 text-center">
          *Tiada rakaman suara, gambar wajah atau data peribadi disimpan secara kekal.
        </p>
      </div>

      {/* 3 Required Working Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl">
        {/* Button 1: Tunjukkan kepada Cikgu */}
        <button
          id="btn-show-to-teacher"
          onClick={() => setShowTeacherView(true)}
          className="w-full sm:w-1/3 py-4 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-b-4 border-sky-800"
        >
          <Users className="w-4 h-4" />
          <span className="font-['Fredoka',sans-serif]">Tunjukkan kepada Cikgu</span>
        </button>

        {/* Button 2: Mulakan Semula */}
        <button
          id="btn-restart-session"
          onClick={onResetSession}
          className="w-full sm:w-1/3 py-4 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-b-4 border-rose-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="font-['Fredoka',sans-serif]">Mulakan Semula</span>
        </button>

        {/* Button 3: Kembali ke Menu */}
        <button
          id="btn-back-to-menu"
          onClick={onReturnToMenu}
          className="w-full sm:w-1/3 py-4 px-4 rounded-2xl bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-2 border-slate-200 border-b-4 border-b-slate-300"
        >
          <Home className="w-4 h-4" />
          <span className="font-['Fredoka',sans-serif]">Kembali ke Menu</span>
        </button>
      </div>

      {/* Teacher View Dialog */}
      <AnimatePresence>
        {showTeacherView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-sky-100 relative"
            >
              <button
                id="btn-close-teacher-view"
                onClick={() => setShowTeacherView(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-['Fredoka',sans-serif] text-slate-800">
                    Paparan Bimbingan Guru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sokongan Regulasi Emosi Murid Prasekolah
                  </p>
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-4 space-y-2">
                <p className="text-sm font-bold text-sky-950">
                  Ringkasan Pilihan Murid:
                </p>
                <div className="text-xs text-slate-700 space-y-1">
                  <p>• <strong>Perasaan:</strong> {sessionData.selectedEmotion || '-'}</p>
                  <p>• <strong>Cara Luahan:</strong> {getExpressLabel()}</p>
                  <p>• <strong>Bantuan yang Diperlukan:</strong> {sessionData.selectedNeed || '-'}</p>
                  {sessionData.spokenText && (
                    <p>• <strong>Catatan Suara/Teks:</strong> "{sessionData.spokenText}"</p>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-5 text-xs text-amber-900">
                <p className="font-bold mb-1">Cadangan Tindakan Guru:</p>
                <p>
                  Sila hampiri murid, pandang mata mereka pada aras yang sama, dan beri sokongan mesra mengikut bantuan yang mereka pohon.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  id="btn-teacher-view-done"
                  onClick={() => setShowTeacherView(false)}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm"
                >
                  Selesai
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
