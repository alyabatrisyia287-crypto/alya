export type ScreenId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type EmotionType = 'Gembira' | 'Sedih' | 'Marah' | 'Takut' | 'Risau' | 'Tidak Pasti';

export type CalmBackground = 'taman' | 'awan' | 'ombak' | 'pelangi';

export type CalmSound = 'hujan' | 'ombak' | 'alam' | 'tanpa_bunyi';

export type ExpressMethod = 'cakap' | 'lukis' | 'gambar';

export type SituationType = 'Rumah' | 'Sekolah' | 'Kawan' | 'Mainan' | 'Cikgu' | 'Keluarga' | 'Tidak Pasti';

export type NeedType = 
  | 'Saya mahu berehat'
  | 'Saya mahu bercakap'
  | 'Saya perlukan bantuan cikgu'
  | 'Saya mahu seseorang menemani'
  | 'Saya mahu melukis'
  | 'Saya mahu bernafas lagi';

export interface EmotionOption {
  type: EmotionType;
  label: string;
  emoji: string;
  color: string;
  bgLight: string;
  borderColor: string;
  description: string;
}

export interface SessionData {
  initialInputMethod?: 'cakap' | 'emosi' | 'kamera';
  selectedEmotion?: EmotionType;
  calmBackground: CalmBackground;
  calmSound: CalmSound;
  breathingCompletedRounds: number;
  expressMethod?: ExpressMethod;
  spokenText?: string;
  voiceAudioUrl?: string;
  drawingDataUrl?: string;
  selectedSituation?: SituationType;
  selectedNeed?: NeedType;
  teacherCalled: boolean;
  completedAt?: Date;
}
