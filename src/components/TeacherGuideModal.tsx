import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, X, HeartHandshake, EyeOff, Mic, Users, BookOpen } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-emerald-100 p-6 md:p-8 relative text-[#2D3748]"
          >
            {/* Close button */}
            <button
              id="btn-close-teacher-guide"
              onClick={onClose}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors focus:outline-hidden"
              aria-label="Tutup Panduan Guru"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-['Fredoka',sans-serif] text-emerald-900">
                  Panduan Guru & Ibu Bapa
                </h2>
                <p className="text-sm text-slate-500">
                  EMO-CALM AI • Kenal • Tenang • Luahkan
                </p>
              </div>
            </div>

            {/* Required Disclaimer Banner */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-base font-bold text-amber-900 leading-relaxed">
                  “EMO-CALM AI ialah alat sokongan regulasi dan ekspresi emosi. Aplikasi ini bukan alat diagnosis psikologi.”
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Sasaran pengguna: Kanak-kanak prasekolah berumur 5–6 tahun dengan bimbingan guru atau ibu bapa.
                </p>
              </div>
            </div>

            {/* Purpose Section */}
            <div className="mb-6 space-y-2">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                Tujuan Aplikasi
              </h3>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                EMO-CALM AI membantu kanak-kanak prasekolah:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 pl-2">
                <li>Menenangkan badan melalui pernafasan terpandu (bunga & lilin).</li>
                <li>Mengenal dan menamakan emosi asas secara visual.</li>
                <li>Meluahkan pengalaman secara selamat melalui suara, lukisan atau gambar situasi.</li>
                <li>Menyatakan bantuan praktikal yang diperlukan daripada guru.</li>
              </ul>
            </div>

            {/* Privacy Section (Mandatory Points) */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 mb-6">
              <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Privasi dan Keselamatan Kanak-kanak
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong>Kamera dan mikrofon adalah pilihan:</strong> Murid tidak diwajibkan menggunakan peranti media. Pilihan visual sentiasa disediakan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong>Kebenaran perlu diberikan sebelum digunakan:</strong> Akses peranti hanya diminta selepas butang ditekan secara sengaja.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong>Aplikasi tidak mengenal identiti kanak-kanak:</strong> Tiada profil, nama penuh, atau penjejakan peribadi disimpan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong>Wajah dan suara tidak disimpan secara kekal:</strong> Rakaman audio dan paparan cermin kamera hanya bersifat sementara dalam memori sesi dan dipadam apabila sesi ditutup atau dimulakan semula.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong>Aplikasi tidak membuat diagnosis emosi:</strong> Tiada sebarang analisis biometrik, nada suara, atau penilaian psikologi dibuat.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span><strong>Guru atau ibu bapa perlu membimbing:</strong> Kehadiran orang dewasa memberi sokongan emosi empati yang sebenar.</span>
                </li>
              </ul>
            </div>

            {/* Teacher Tips */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-6">
              <h4 className="font-bold text-sky-900 text-sm mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                Cadangan Pelaksanaan di Bilik Darjah
              </h4>
              <p className="text-xs text-sky-800 leading-relaxed">
                Bimbing murid menggunakan "Pusingan Pernafasan" terlebih dahulu apabila mereka gelisah. Jangan paksa murid bercakap sekiranya mereka lebih selesa melukis atau memilih kad gambar situasi.
              </p>
            </div>

            {/* Action button */}
            <div className="text-center">
              <button
                id="btn-understand-teacher-guide"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all text-base font-['Fredoka',sans-serif]"
              >
                Faham & Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
