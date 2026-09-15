import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  Smile,
  Camera,
  Square,
  Play,
  RotateCcw,
  ArrowRight,
  VideoOff,
  Volume2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { EmotionType, EmotionOption } from '../../types';

export const EMOTIONS: EmotionOption[] = [
  {
    type: 'Gembira',
    label: 'Gembira',
    emoji: '😊',
    color: 'text-amber-600',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-300',
    description: 'Hati rasa ceria dan manis',
  },
  {
    type: 'Sedih',
    label: 'Sedih',
    emoji: '😢',
    color: 'text-blue-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-300',
    description: 'Hati rasa sayu atau mahu menangis',
  },
  {
    type: 'Marah',
    label: 'Marah',
    emoji: '😠',
    color: 'text-rose-600',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-300',
    description: 'Badan rasa panas dan geram',
  },
  {
    type: 'Takut',
    label: 'Takut',
    emoji: '😨',
    color: 'text-purple-600',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-300',
    description: 'Rasa gementar atau tidak selamat',
  },
  {
    type: 'Risau',
    label: 'Risau',
    emoji: '😟',
    color: 'text-teal-600',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-300',
    description: 'Banyak berfikir dan rasa bimbang',
  },
  {
    type: 'Tidak Pasti',
    label: 'Tidak Pasti',
    emoji: '🤔',
    color: 'text-slate-600',
    bgLight: 'bg-slate-100',
    borderColor: 'border-slate-300',
    description: 'Belum pasti apa yang dirasai',
  },
];

interface Screen2ChooseInputProps {
  onContinueToCalm: (data: {
    initialInputMethod: 'cakap' | 'emosi' | 'kamera';
    selectedEmotion?: EmotionType;
    spokenText?: string;
    voiceAudioUrl?: string;
  }) => void;
  initialEmotion?: EmotionType;
}

type Mode = 'menu' | 'cakap' | 'emosi' | 'kamera';

export const Screen2ChooseInput: React.FC<Screen2ChooseInputProps> = ({
  onContinueToCalm,
  initialEmotion,
}) => {
  const [selectedMode, setSelectedMode] = useState<Mode>('menu');
  const [chosenEmotion, setChosenEmotion] = useState<EmotionType | undefined>(initialEmotion);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [micUnavailable, setMicUnavailable] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraUnavailable, setCameraUnavailable] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const speechRecognizerRef = useRef<any>(null);

  // Check speech recognition support once on mount
  useEffect(() => {
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      setSpeechSupported(true);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
      stopCameraStream();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Clean camera stream
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  // Clean voice recorder
  const stopRecordingCleanup = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
  };

  // Start Voice Recording
  const handleStartRecording = async () => {
    setMicUnavailable(false);
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicUnavailable(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      // 15-second timer
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 14) {
            handleStopRecording();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);

      // Optional Speech to Text
      const SpeechRec =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const recognizer = new SpeechRec();
          recognizer.lang = 'ms-MY';
          recognizer.continuous = false;
          recognizer.interimResults = true;

          recognizer.onresult = (event: any) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; i++) {
              fullText += event.results[i][0].transcript;
            }
            if (fullText.trim()) {
              setTranscriptText(fullText);
            }
          };

          recognizer.onerror = () => {
            // Safe silent fallback without alert
          };

          recognizer.start();
          speechRecognizerRef.current = recognizer;
        } catch {
          // ignore speech recog failure
        }
      }
    } catch {
      setMicUnavailable(true);
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
  };

  const handlePlayAudio = () => {
    if (!audioUrl) return;
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    const audio = new Audio(audioUrl);
    audioPlayerRef.current = audio;
    setIsPlayingAudio(true);
    audio.onended = () => setIsPlayingAudio(false);
    audio.play().catch(() => setIsPlayingAudio(false));
  };

  const handleRerecord = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setAudioUrl(null);
    setTranscriptText('');
    setRecordingDuration(0);
    handleStartRecording();
  };

  // Start Camera
  const handleOpenCamera = async () => {
    setCameraUnavailable(false);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraUnavailable(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch {
      setCameraUnavailable(true);
      setCameraActive(false);
    }
  };

  const handleCloseCamera = () => {
    stopCameraStream();
  };

  const handleContinue = () => {
    stopCameraStream();
    stopRecordingCleanup();
    onContinueToCalm({
      initialInputMethod: selectedMode === 'menu' ? 'emosi' : (selectedMode as any),
      selectedEmotion: chosenEmotion,
      spokenText: transcriptText.trim() || undefined,
      voiceAudioUrl: audioUrl || undefined,
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full text-center">
      {/* Title & Prompt */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-['Fredoka',sans-serif] mb-2">
        Bagaimana kamu mahu bermula?
      </h2>
      <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-lg">
        Pilih satu cara yang paling selesa untuk kamu kongsikan perasaan sekarang.
      </p>

      {/* 3 Main Choice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-6">
        {/* Choice 1: Cakap */}
        <button
          id="btn-mode-cakap"
          onClick={() => {
            setSelectedMode('cakap');
            stopCameraStream();
          }}
          className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
            selectedMode === 'cakap'
              ? 'bg-amber-50 border-amber-400 shadow-md ring-4 ring-amber-200'
              : 'bg-white hover:bg-slate-50 border-emerald-100 shadow-xs'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Mic className="w-8 h-8" />
          </div>
          <span className="text-xl font-bold text-slate-800 font-['Fredoka',sans-serif]">
            Cakap
          </span>
          <span className="text-xs text-slate-500 font-medium">Gunakan suara kamu</span>
        </button>

        {/* Choice 2: Pilih Perasaan */}
        <button
          id="btn-mode-emosi"
          onClick={() => {
            setSelectedMode('emosi');
            stopCameraStream();
          }}
          className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
            selectedMode === 'emosi'
              ? 'bg-emerald-50 border-emerald-400 shadow-md ring-4 ring-emerald-200'
              : 'bg-white hover:bg-slate-50 border-emerald-100 shadow-xs'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Smile className="w-8 h-8" />
          </div>
          <span className="text-xl font-bold text-slate-800 font-['Fredoka',sans-serif]">
            Pilih Perasaan
          </span>
          <span className="text-xs text-slate-500 font-medium">Pilih gambar muka</span>
        </button>

        {/* Choice 3: Lihat Wajah */}
        <button
          id="btn-mode-kamera"
          onClick={() => {
            setSelectedMode('kamera');
          }}
          className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
            selectedMode === 'kamera'
              ? 'bg-sky-50 border-sky-400 shadow-md ring-4 ring-sky-200'
              : 'bg-white hover:bg-slate-50 border-emerald-100 shadow-xs'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Camera className="w-8 h-8" />
          </div>
          <span className="text-xl font-bold text-slate-800 font-['Fredoka',sans-serif]">
            Lihat Wajah
          </span>
          <span className="text-xs text-slate-500 font-medium">Lihat cermin muka</span>
        </button>
      </div>

      {/* Reminder pill */}
      <p className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-6">
        <span>ℹ️</span>
        <span>Gunakan mikrofon dan kamera bersama cikgu atau ibu bapa.</span>
      </p>

      {/* MODE 1: CAKAP (Voice recording + Fallback) */}
      {selectedMode === 'cakap' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-md mb-6"
        >
          <h3 className="text-lg font-bold text-amber-900 font-['Fredoka',sans-serif] mb-1">
            Rakam Suara Kamu
          </h3>
          <p className="text-xs text-slate-600 mb-4">
            Tekan butang mikrofon, kemudian ceritakan apa yang kamu rasa (sehingga 15 saat).
          </p>

          {micUnavailable ? (
            /* Fallback when mic unavailable or rejected */
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-sm font-semibold flex items-center gap-3 text-left">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <span>Mikrofon tidak dapat digunakan. Kamu boleh taip atau pilih gambar.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 text-left mb-1.5">
                  Taip perkataan kamu di sini:
                </label>
                <textarea
                  id="input-mic-fallback-text"
                  rows={2}
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                  placeholder="Contoh: Saya rasa sedih kerana..."
                  className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  id="btn-fallback-choose-emotion"
                  onClick={() => setSelectedMode('emosi')}
                  className="px-5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm transition-all"
                >
                  Pilih Perasaan
                </button>
              </div>
            </div>
          ) : (
            /* Normal Voice Recording Controls */
            <div className="flex flex-col items-center gap-4">
              {/* Large Mic Button */}
              {!audioUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <button
                    id="btn-voice-record-toggle"
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 focus:outline-hidden ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-200'
                        : 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105'
                    }`}
                    aria-label={isRecording ? 'Berhenti Merakam' : 'Mula Merakam'}
                  >
                    {isRecording ? (
                      <Square className="w-10 h-10 fill-white" />
                    ) : (
                      <Mic className="w-12 h-12" />
                    )}
                  </button>

                  <span className="text-xs font-bold text-slate-700">
                    {isRecording ? 'Sedang Merakam...' : 'Tekan Mikrofon untuk Mula'}
                  </span>

                  {/* Timer display */}
                  <div className="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full">
                    Masa: {recordingDuration}s / 15s
                  </div>
                </div>
              ) : (
                /* Audio Recorded Actions */
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span>Suara kamu sudah dirakam dengan selamat!</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {/* Dengar Semula */}
                    <button
                      id="btn-voice-play-audio"
                      onClick={handlePlayAudio}
                      className="px-4 py-2.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-sm flex items-center gap-2 transition-all"
                    >
                      <Play className="w-4 h-4 fill-emerald-800" />
                      <span>{isPlayingAudio ? 'Sedang Main...' : 'Dengar Semula'}</span>
                    </button>

                    {/* Rakam Semula */}
                    <button
                      id="btn-voice-rerecord"
                      onClick={handleRerecord}
                      className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center gap-2 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Rakam Semula</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Speech-to-Text result (editable) */}
              <div className="w-full text-left mt-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {speechSupported
                    ? 'Teks pertuturan (boleh dibetulkan jika perlu):'
                    : 'Catatan cikgu/murid (manual):'}
                </label>
                <textarea
                  id="input-voice-transcript"
                  rows={2}
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                  placeholder="Kandungan suara atau catatan murid..."
                  className="w-full p-2.5 rounded-2xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm focus:outline-hidden"
                />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* MODE 2: PILIH PERASAAN */}
      {selectedMode === 'emosi' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white border-2 border-emerald-200 rounded-3xl p-5 shadow-md mb-6"
        >
          <h3 className="text-lg font-bold text-emerald-950 font-['Fredoka',sans-serif] mb-1">
            Pilih Perasaan yang Paling Sesuai
          </h3>
          <p className="text-xs text-slate-600 mb-4">
            Sentuh satu gambar muka di bawah:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EMOTIONS.map((emo) => (
              <button
                key={emo.type}
                id={`btn-choose-emo-${emo.type.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setChosenEmotion(emo.type)}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                  chosenEmotion === emo.type
                    ? `${emo.bgLight} ${emo.borderColor} ring-4 ring-emerald-200 scale-102 shadow-sm`
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-4xl select-none">{emo.emoji}</span>
                <span className="font-bold text-base text-slate-800 font-['Fredoka',sans-serif]">
                  {emo.label}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {emo.description}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* MODE 3: LIHAT WAJAH (Camera Preview + 6 Emotion Buttons) */}
      {selectedMode === 'kamera' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white border-2 border-sky-200 rounded-3xl p-5 shadow-md mb-6"
        >
          <h3 className="text-lg font-bold text-sky-950 font-['Fredoka',sans-serif] mb-1">
            Cermin Wajah (Pilihan)
          </h3>
          <p className="text-xs text-slate-600 mb-4">
            Kamera hanya untuk kamu melihat ekspresi muka sendiri. Tiada gambar disimpan atau dimuat naik.
          </p>

          {cameraUnavailable ? (
            /* Fallback when camera unavailable */
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-sm font-semibold mb-4 text-center">
              Kamera tidak dapat digunakan. Tidak mengapa, kamu masih boleh memilih perasaan di bawah.
            </div>
          ) : (
            /* Live Camera preview or Buka Kamera button */
            <div className="flex flex-col items-center mb-4">
              {!cameraActive ? (
                <div className="w-full max-w-sm h-48 rounded-2xl bg-slate-100 border-2 border-dashed border-sky-300 flex flex-col items-center justify-center gap-2 p-4">
                  <Camera className="w-10 h-10 text-sky-500" />
                  <p className="text-xs text-slate-600 text-center">
                    Kamera adalah pilihan. Tekan butang di bawah untuk membuka cermin wajah bersama cikgu.
                  </p>
                  <button
                    id="btn-open-camera"
                    onClick={handleOpenCamera}
                    className="px-5 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-xs transition-all"
                  >
                    Buka Kamera
                  </button>
                </div>
              ) : (
                <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-md border-2 border-sky-300 bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-48 object-cover -scale-x-100"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      id="btn-close-camera"
                      onClick={handleCloseCamera}
                      className="px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <VideoOff className="w-3.5 h-3.5" />
                      <span>Tutup Kamera</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6 Emotion buttons below camera */}
          <div className="border-t border-sky-100 pt-3">
            <p className="text-xs font-bold text-slate-700 mb-3">
              Lihat wajah kamu, kemudian pilih perasaan yang paling sesuai:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {EMOTIONS.map((emo) => (
                <button
                  key={emo.type}
                  id={`btn-camera-emo-${emo.type.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setChosenEmotion(emo.type)}
                  className={`p-2.5 rounded-2xl border-2 flex items-center gap-2 transition-all ${
                    chosenEmotion === emo.type
                      ? `${emo.bgLight} ${emo.borderColor} ring-3 ring-sky-300 shadow-xs`
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-2xl">{emo.emoji}</span>
                  <span className="text-xs font-bold text-slate-800 font-['Fredoka',sans-serif]">
                    {emo.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Teruskan button to Calm Mode (Screen 3) */}
      <div className="mt-2">
        <button
          id="btn-choose-input-teruskan"
          onClick={handleContinue}
          className="px-8 py-4 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-3 border-b-4 border-emerald-800 focus:outline-hidden"
        >
          <span className="font-['Fredoka',sans-serif]">Teruskan ke Zon Tenang</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-slate-400 mt-2">
          Langkah seterusnya: Kita akan tenangkan badan bersama Emo-Buddy
        </p>
      </div>
    </div>
  );
};
