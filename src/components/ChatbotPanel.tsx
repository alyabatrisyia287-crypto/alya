import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Sparkles, ChevronRight } from 'lucide-react';
import { EmoBuddy } from './EmoBuddy';

interface ChatbotOption {
  id: string;
  childPrompt: string;
  buddyReply: string; // strictly <= 12 words
  iconEmoji: string;
}

const PREDEFINED_CHATS: ChatbotOption[] = [
  {
    id: 'sedih_tegang',
    childPrompt: 'Saya rasa sedih atau takut',
    buddyReply: 'Tidak mengapa. Saya ada untuk membantu kamu.', // 7 words
    iconEmoji: '🌧️',
  },
  {
    id: 'tarik_nafas',
    childPrompt: 'Badan saya rasa berdebar',
    buddyReply: 'Mari kita tarik nafas perlahan-lahan bersama-sama.', // 7 words
    iconEmoji: '🌸',
  },
  {
    id: 'sukar_cakap',
    childPrompt: 'Saya susah nak bercakap sekarang',
    buddyReply: 'Kamu boleh pilih gambar jika belum mahu bercakap.', // 8 words
    iconEmoji: '🎨',
  },
  {
    id: 'nak_cikgu',
    childPrompt: 'Boleh panggil cikgu?',
    buddyReply: 'Boleh, mari kita minta bantuan cikgu bersama.', // 7 words
    iconEmoji: '👩‍🏫',
  },
  {
    id: 'pelik',
    childPrompt: 'Adakah salah saya rasa begini?',
    buddyReply: 'Tidak salah. Kamu lebih tahu perasaan kamu.', // 7 words
    iconEmoji: '💛',
  },
  {
    id: 'selesai',
    childPrompt: 'Saya sudah beritahu perasaan saya',
    buddyReply: 'Terima kasih kerana memberitahu. Kamu sangat berani!', // 7 words
    iconEmoji: '⭐',
  },
];

interface ChatbotPanelProps {
  currentScreenTitle: string;
  onSelectBreatheAction?: () => void;
  onCallTeacherAction?: () => void;
}

export const ChatbotPanel: React.FC<ChatbotPanelProps> = ({
  currentScreenTitle,
  onSelectBreatheAction,
  onCallTeacherAction,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeReply, setActiveReply] = useState<string>('Hai! Ada apa yang boleh Emo-Buddy bantu?');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handleSelect = (chat: ChatbotOption) => {
    setSelectedPrompt(chat.childPrompt);
    setActiveReply(chat.buddyReply);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          id="btn-open-chatbot"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-white text-emerald-800 border-2 border-emerald-300 shadow-xl rounded-full px-4 py-3 hover:bg-emerald-50 focus:outline-hidden"
          aria-label="Bual dengan Emo-Buddy"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm md:text-base font-['Fredoka',sans-serif]">
            Bual dengan Emo-Buddy
          </span>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </motion.button>
      )}

      {/* Expanded Guided Chat Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[92vw] max-w-sm sm:max-w-md bg-white border-2 border-emerald-200 rounded-3xl shadow-2xl p-4 md:p-5 flex flex-col gap-3 text-[#2D3748] max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-emerald-900 font-['Fredoka',sans-serif]">
                    Emo-Buddy AI
                  </h4>
                  <p className="text-xs text-slate-500">Bimbingan Mesra • {currentScreenTitle}</p>
                </div>
              </div>
              <button
                id="btn-close-chatbot"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                aria-label="Tutup bual"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bunny Mini Avatar & Current Reply (Speech Bubble) */}
            <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-100 flex items-center gap-3">
              <div className="shrink-0 scale-75 -my-3 -mx-2">
                <EmoBuddy mood="cheerful" size="sm" showSpeechBubble={false} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-0.5">
                  Emo-Buddy menjawab:
                </p>
                <p className="text-sm md:text-base font-bold text-slate-800 font-['Fredoka',sans-serif] leading-snug">
                  "{activeReply}"
                </p>
              </div>
            </div>

            {/* Child selected question feedback */}
            {selectedPrompt && (
              <div className="text-right">
                <span className="inline-block bg-sky-100 text-sky-900 text-xs font-semibold px-3 py-1.5 rounded-full border border-sky-200">
                  Kamu: {selectedPrompt}
                </span>
              </div>
            )}

            {/* Quick Action Shortcuts if appropriate */}
            <div className="flex gap-2 text-xs">
              {onSelectBreatheAction && (
                <button
                  onClick={() => {
                    onSelectBreatheAction();
                    setIsOpen(false);
                  }}
                  className="flex-1 py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl font-bold flex items-center justify-center gap-1"
                >
                  🌸 Bernafas
                </button>
              )}
              {onCallTeacherAction && (
                <button
                  onClick={() => {
                    onCallTeacherAction();
                    setIsOpen(false);
                  }}
                  className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold flex items-center justify-center gap-1"
                >
                  👩‍🏫 Panggil Cikgu
                </button>
              )}
            </div>

            {/* Guided Choice Buttons */}
            <p className="text-xs font-bold text-slate-500 mt-1">
              Pilih satu pertanyaan untuk Emo-Buddy:
            </p>
            <div className="overflow-y-auto space-y-2 pr-1 max-h-52">
              {PREDEFINED_CHATS.map((item) => (
                <button
                  key={item.id}
                  id={`btn-chat-${item.id}`}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs md:text-sm font-semibold transition-all flex items-center justify-between gap-2 ${
                    selectedPrompt === item.childPrompt
                      ? 'bg-emerald-100/80 border-emerald-400 text-emerald-950 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{item.iconEmoji}</span>
                    <span>{item.childPrompt}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-2">
              Bimbingan terpandu selamat • Tiada data peribadi direkodkan
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
