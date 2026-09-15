import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  Palette,
  Image as ImageIcon,
  Square,
  Play,
  RotateCcw,
  Eraser,
  Trash2,
  Save,
  Check,
  ArrowRight,
  Heart,
  Sparkles,
} from 'lucide-react';
import { ExpressMethod, SituationType, EmotionType } from '../../types';

interface Screen6ExpressProps {
  currentEmotion?: EmotionType;
  selectedMethod?: ExpressMethod;
  savedSpokenText?: string;
  savedVoiceUrl?: string;
  savedDrawingUrl?: string;
  savedSituation?: SituationType;
  onSaveExpressData: (data: {
    expressMethod: ExpressMethod;
    spokenText?: string;
    voiceAudioUrl?: string;
    drawingDataUrl?: string;
    selectedSituation?: SituationType;
  }) => void;
  onContinueToNeeds: () => void;
}

const SITUATION_CARDS: { id: SituationType; label: string; emoji: string; desc: string }[] = [
  { id: 'Rumah', label: 'Rumah', emoji: '🏠', desc: 'Hal di tempat tinggal' },
  { id: 'Sekolah', label: 'Sekolah', emoji: '🏫', desc: 'Bilik darjah / aktiviti' },
  { id: 'Kawan', label: 'Kawan', emoji: '👫', desc: 'Rakan sebaya di tadika' },
  { id: 'Mainan', label: 'Mainan', emoji: '🧸', desc: 'Permainan atau barang saya' },
  { id: 'Cikgu', label: 'Cikgu', emoji: '👩‍🏫', desc: 'Pembelajaran bersama guru' },
  { id: 'Keluarga', label: 'Keluarga', emoji: '👨‍👩‍👧‍👦', desc: 'Ibu, bapa atau adik-beradik' },
  { id: 'Tidak Pasti', label: 'Tidak Pasti', emoji: '❓', desc: 'Hanya rasa di dalam badan' },
];

const COLORS = [
  { label: 'Hitam', hex: '#2D3748' },
  { label: 'Merah', hex: '#EF4444' },
  { label: 'Oren', hex: '#F97316' },
  { label: 'Kuning', hex: '#EAB308' },
  { label: 'Hijau', hex: '#10B981' },
  { label: 'Biru', hex: '#3B82F6' },
  { label: 'Ungu', hex: '#8B5CF6' },
  { label: 'Merah Jambu', hex: '#EC4899' },
];

export const Screen6Express: React.FC<Screen6ExpressProps> = ({
  currentEmotion,
  selectedMethod: initialMethod = 'cakap',
  savedSpokenText = '',
  savedVoiceUrl,
  savedDrawingUrl,
  savedSituation,
  onSaveExpressData,
  onContinueToNeeds,
}) => {
  const [method, setMethod] = useState<ExpressMethod>(initialMethod);

  // Cakap state
  const [becauseText, setBecauseText] = useState<string>(
    savedSpokenText || ''
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(
    savedVoiceUrl || null
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Lukis state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#2D3748');
  const [brushSize, setBrushSize] = useState<number>(6);
  const [isEraser, setIsEraser] = useState(false);
  const [drawingSaved, setDrawingSaved] = useState(Boolean(savedDrawingUrl));

  // Gambar state
  const [situation, setSituation] = useState<SituationType | undefined>(savedSituation);

  // Refs for recording
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Initialize canvas if drawing mode
  useEffect(() => {
    if (method === 'lukis' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // If we have saved drawing, load it
        if (savedDrawingUrl) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
          img.src = savedDrawingUrl;
        } else {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }, [method, savedDrawingUrl]);

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        try {
          recorderRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Voice recording handlers
  const handleStartVoice = async () => {
    audioChunksRef.current = [];
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => {
          if (s >= 14) {
            handleStopVoice();
            return 15;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setIsRecording(false);
    }
  };

  const handleStopVoice = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handlePlayVoice = () => {
    if (!recordedAudioUrl) return;
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    const a = new Audio(recordedAudioUrl);
    audioPlayerRef.current = a;
    setIsPlayingAudio(true);
    a.onended = () => setIsPlayingAudio(false);
    a.play().catch(() => setIsPlayingAudio(false));
  };

  // Canvas drawing handlers
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setDrawingSaved(false);
  };

  const drawMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const coords = getCanvasCoords(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDraw = () => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) ctx.closePath();
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setDrawingSaved(false);
  };

  const handleSaveDrawing = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setDrawingSaved(true);
    onSaveExpressData({
      expressMethod: 'lukis',
      drawingDataUrl: dataUrl,
    });
  };

  const handleSelectSituation = (sit: SituationType) => {
    setSituation(sit);
    onSaveExpressData({
      expressMethod: 'gambar',
      selectedSituation: sit,
    });
  };

  const handleContinue = () => {
    let drawingData: string | undefined = savedDrawingUrl;
    if (method === 'lukis' && canvasRef.current) {
      drawingData = canvasRef.current.toDataURL('image/png');
    }

    onSaveExpressData({
      expressMethod: method,
      spokenText: becauseText.trim() || undefined,
      voiceAudioUrl: recordedAudioUrl || undefined,
      drawingDataUrl: drawingData,
      selectedSituation: situation,
    });

    onContinueToNeeds();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full text-center">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-['Fredoka',sans-serif] mb-2">
        Bagaimana kamu mahu meluahkan perasaan?
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 mb-6">
        Pilih sama ada bercakap, melukis atau menyentuh gambar situasi.
      </p>

      {/* 3 Expression Tabs */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-xl mb-6">
        {/* Tab 1: Cakap */}
        <button
          id="btn-express-tab-cakap"
          onClick={() => setMethod('cakap')}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
            method === 'cakap'
              ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300 font-bold'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <Mic className="w-6 h-6 text-amber-600" />
          <span className="text-sm sm:text-base font-['Fredoka',sans-serif]">Cakap</span>
        </button>

        {/* Tab 2: Lukis */}
        <button
          id="btn-express-tab-lukis"
          onClick={() => setMethod('lukis')}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
            method === 'lukis'
              ? 'bg-purple-100 border-purple-400 text-purple-950 shadow-sm ring-2 ring-purple-300 font-bold'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <Palette className="w-6 h-6 text-purple-600" />
          <span className="text-sm sm:text-base font-['Fredoka',sans-serif]">Lukis</span>
        </button>

        {/* Tab 3: Pilih Gambar */}
        <button
          id="btn-express-tab-gambar"
          onClick={() => setMethod('gambar')}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
            method === 'gambar'
              ? 'bg-sky-100 border-sky-400 text-sky-950 shadow-sm ring-2 ring-sky-300 font-bold'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <ImageIcon className="w-6 h-6 text-sky-600" />
          <span className="text-sm sm:text-base font-['Fredoka',sans-serif]">Pilih Gambar</span>
        </button>
      </div>

      {/* METHOD 1: CAKAP */}
      {method === 'cakap' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white border-2 border-amber-200 rounded-3xl p-5 sm:p-6 shadow-md mb-6 text-left"
        >
          {/* Sentence starter required by prompt */}
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 mb-4">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Panduan Ayat Permulaan:
            </span>
            <p className="text-lg sm:text-xl font-extrabold text-amber-950 font-['Fredoka',sans-serif]">
              “Saya rasa <span className="underline decoration-amber-500">{currentEmotion || '______'}</span> kerana <span className="underline decoration-amber-500">______</span>.”
            </p>
          </div>

          {/* Voice recorder button */}
          <div className="flex flex-col items-center justify-center gap-3 py-2 border-b border-amber-100 mb-4">
            <button
              id="btn-express-record-toggle"
              onClick={isRecording ? handleStopVoice : handleStartVoice}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {isRecording ? <Square className="w-8 h-8 fill-white" /> : <Mic className="w-10 h-10" />}
            </button>
            <span className="text-xs font-bold text-slate-700">
              {isRecording ? `Sedang merakam (${recordingSeconds}s)...` : 'Tekan untuk rakam suara'}
            </span>

            {recordedAudioUrl && (
              <div className="flex items-center gap-2">
                <button
                  id="btn-express-play-voice"
                  onClick={handlePlayVoice}
                  className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-emerald-800" />
                  <span>{isPlayingAudio ? 'Sedang Main...' : 'Dengar Suara'}</span>
                </button>
                <button
                  id="btn-express-rerecord-voice"
                  onClick={() => {
                    setRecordedAudioUrl(null);
                    handleStartVoice();
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rakam Semula</span>
                </button>
              </div>
            )}
          </div>

          {/* Manual typing alternative */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Atau taip sambungan ayat di sini (bantuan guru/ibu bapa):
            </label>
            <textarea
              id="input-express-because"
              rows={3}
              value={becauseText}
              onChange={(e) => setBecauseText(e.target.value)}
              placeholder="Contoh: ...kerana kawan ambil mainan saya tadi / saya penat..."
              className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm focus:outline-hidden"
            />
          </div>
        </motion.div>
      )}

      {/* METHOD 2: LUKIS */}
      {method === 'lukis' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white border-2 border-purple-200 rounded-3xl p-4 sm:p-5 shadow-md mb-6"
        >
          {/* Drawing Canvas Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-purple-100">
            {/* Colors */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  id={`btn-canvas-color-${c.label.toLowerCase()}`}
                  onClick={() => {
                    setCurrentColor(c.hex);
                    setIsEraser(false);
                  }}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform ${
                    !isEraser && currentColor === c.hex
                      ? 'scale-120 border-slate-900 ring-2 ring-purple-300'
                      : 'border-white hover:scale-105'
                  }`}
                  title={c.label}
                />
              ))}
            </div>

            {/* Brush sizes & Eraser */}
            <div className="flex items-center gap-2">
              <button
                id="btn-canvas-brush-small"
                onClick={() => setBrushSize(4)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                  brushSize === 4 && !isEraser
                    ? 'bg-purple-100 border-purple-400 text-purple-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Kecil
              </button>
              <button
                id="btn-canvas-brush-large"
                onClick={() => setBrushSize(14)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                  brushSize === 14 && !isEraser
                    ? 'bg-purple-100 border-purple-400 text-purple-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Besar
              </button>

              <button
                id="btn-canvas-eraser"
                onClick={() => setIsEraser((prev) => !prev)}
                className={`p-1.5 rounded-xl border flex items-center gap-1 text-xs font-bold ${
                  isEraser
                    ? 'bg-rose-100 border-rose-400 text-rose-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Padam garisan"
              >
                <Eraser className="w-4 h-4" />
                <span>Padam</span>
              </button>

              <button
                id="btn-canvas-clear"
                onClick={handleClearCanvas}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold flex items-center gap-1"
                title="Kosongkan lukisan"
              >
                <Trash2 className="w-4 h-4" />
                <span>Kosongkan</span>
              </button>
            </div>
          </div>

          {/* The Actual HTML5 Canvas */}
          <div className="w-full flex justify-center overflow-hidden touch-none">
            <canvas
              ref={canvasRef}
              width={560}
              height={320}
              onMouseDown={startDraw}
              onMouseMove={drawMove}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={drawMove}
              onTouchEnd={stopDraw}
              className="bg-white border-2 border-dashed border-purple-300 rounded-2xl w-full max-w-lg h-64 sm:h-72 cursor-crosshair shadow-inner"
            />
          </div>

          {/* Action button for session save */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {drawingSaved ? 'Lukisan disimpan dalam sesi ini.' : 'Lukis apa sahaja yang kamu rasa.'}
            </span>
            <button
              id="btn-canvas-save-session"
              onClick={handleSaveDrawing}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              {drawingSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{drawingSaved ? 'Disimpan' : 'Simpan untuk Sesi Ini'}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* METHOD 3: PILIH GAMBAR */}
      {method === 'gambar' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white border-2 border-sky-200 rounded-3xl p-4 sm:p-5 shadow-md mb-6"
        >
          <p className="text-xs font-bold text-slate-700 mb-3">
            Pilih kad situasi yang berkaitan dengan perasaan kamu:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {SITUATION_CARDS.map((sit) => {
              const isSelected = situation === sit.id;
              return (
                <button
                  key={sit.id}
                  id={`btn-situation-${sit.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleSelectSituation(sit.id)}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-sky-100 border-sky-400 ring-3 ring-sky-300 shadow-sm scale-102'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-3xl select-none">{sit.emoji}</span>
                  <span className="text-sm font-bold text-slate-800 font-['Fredoka',sans-serif]">
                    {sit.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {sit.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Required feedback after choice */}
          {situation && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-sky-50 border border-sky-300 rounded-2xl text-sky-900 text-sm font-bold flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Terima kasih kerana berkongsi.</span>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Teruskan Button */}
      <button
        id="btn-express-teruskan"
        onClick={handleContinue}
        className="px-8 py-4 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-3 border-b-4 border-emerald-800 focus:outline-hidden"
      >
        <span className="font-['Fredoka',sans-serif]">Seterusnya: Bantuan yang Diperlukan</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
