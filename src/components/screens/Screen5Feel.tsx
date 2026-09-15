import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, HeartHandshake } from 'lucide-react';
import { EmotionType } from '../../types';
import { EMOTIONS } from './Screen2ChooseInput';
import { EmoBuddy } from '../EmoBuddy';

interface Screen5FeelProps {
  selectedEmotion?: EmotionType;
  onSelectEmotion: (emotion: EmotionType) => void;
  onContinueToExpress: () => void;
}

export const Screen5Feel: React.FC<Screen5FeelProps> = ({
  selectedEmotion,
  onSelectEmotion,
  onContinueToExpress,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full text-center">
      {/* Title */}
      <h2 className="text-2xl sm:text-4xl font-extrabold text-emerald-950 font-['Fredoka',sans-serif] mb-2">
        Sekarang, bagaimana perasaan kamu?
      </h2>
      <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-md">
        Sentuh satu perasaan yang paling sesuai dengan apa yang ada di dalam hati kamu.
      </p>

      {/* 6 Large Selectable Emotion Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-2xl mb-6">
        {EMOTIONS.map((emo) => {
          const isSelected = selectedEmotion === emo.type;
          return (
            <motion.button
              key={emo.type}
              id={`btn-feel-emo-${emo.type.toLowerCase().replace(/\s+/g, '-')}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectEmotion(emo.type)}
              className={`p-4 sm:p-5 rounded-3xl border-3 flex flex-col items-center justify-center gap-2 transition-all relative ${
                isSelected
                  ? `${emo.bgLight} ${emo.borderColor} ring-4 ring-emerald-300 shadow-md scale-102`
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                </div>
              )}
              <span className="text-4xl sm:text-5xl select-none filter drop-shadow-xs">
                {emo.emoji}
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-800 font-['Fredoka',sans-serif]">
                {emo.label}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {emo.description}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Reassurance text after selection (mandatory) */}
      {selectedEmotion ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg p-4 bg-emerald-50 border-2 border-emerald-300 rounded-3xl mb-6 flex items-center justify-center gap-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <p className="text-sm sm:text-base font-bold text-emerald-900 font-['Fredoka',sans-serif] text-left">
            “Terima kasih kerana memberitahu. Kamu lebih tahu perasaan kamu.”
          </p>
        </motion.div>
      ) : (
        <div className="text-xs font-semibold text-slate-400 mb-6 bg-slate-100 px-4 py-2 rounded-full inline-block">
          Sila pilih satu perasaan di atas untuk meneruskan
        </div>
      )}

      {/* Teruskan Button - Enabled only after emotion is selected */}
      <button
        id="btn-feel-teruskan"
        disabled={!selectedEmotion}
        onClick={onContinueToExpress}
        className={`px-8 py-4 rounded-3xl font-extrabold text-lg shadow-lg flex items-center gap-3 transition-all ${
          selectedEmotion
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 border-b-4 border-emerald-800 cursor-pointer shadow-emerald-200'
            : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed opacity-75'
        }`}
      >
        <span className="font-['Fredoka',sans-serif]">Teruskan ke Meluahkan</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
