import React, { useState, useEffect } from 'react';
import { ScreenId, EmotionType, CalmBackground, CalmSound, ExpressMethod, SituationType, NeedType, SessionData } from './types';
import { HeaderNav } from './components/HeaderNav';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { ChatbotPanel } from './components/ChatbotPanel';
import { Screen1Welcome } from './components/screens/Screen1Welcome';
import { Screen2ChooseInput } from './components/screens/Screen2ChooseInput';
import { Screen3CalmMode } from './components/screens/Screen3CalmMode';
import { Screen4Breathing } from './components/screens/Screen4Breathing';
import { Screen5Feel } from './components/screens/Screen5Feel';
import { Screen6Express } from './components/screens/Screen6Express';
import { Screen7WhatINeed } from './components/screens/Screen7WhatINeed';
import { Screen8Completion } from './components/screens/Screen8Completion';
import { playAmbientSound, stopAmbientSound } from './utils/audioSynth';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(1);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Core Session Data
  const [sessionData, setSessionData] = useState<SessionData>({
    calmBackground: 'taman',
    calmSound: 'tanpa_bunyi',
    breathingCompletedRounds: 0,
    teacherCalled: false,
  });

  // Sound management: Play ambient sound on Screen 3 or update when sound changes
  useEffect(() => {
    if (currentScreen === 3) {
      playAmbientSound(sessionData.calmSound, isAudioMuted);
    } else {
      stopAmbientSound();
    }
    return () => {
      stopAmbientSound();
    };
  }, [currentScreen, sessionData.calmSound, isAudioMuted]);

  // Audio mute toggle handler
  const handleToggleAudio = () => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      if (next) {
        stopAmbientSound();
      } else if (currentScreen === 3) {
        playAmbientSound(sessionData.calmSound, false);
      }
      return next;
    });
  };

  // Complete Reset of all session data (as required)
  const handleResetSession = () => {
    stopAmbientSound();
    if (sessionData.voiceAudioUrl) {
      try {
        URL.revokeObjectURL(sessionData.voiceAudioUrl);
      } catch {}
    }
    setSessionData({
      calmBackground: 'taman',
      calmSound: 'tanpa_bunyi',
      breathingCompletedRounds: 0,
      teacherCalled: false,
      initialInputMethod: undefined,
      selectedEmotion: undefined,
      expressMethod: undefined,
      spokenText: undefined,
      voiceAudioUrl: undefined,
      drawingDataUrl: undefined,
      selectedSituation: undefined,
      selectedNeed: undefined,
      completedAt: undefined,
    });
    setCurrentScreen(1);
  };

  // Navigation handlers
  const handleGoHome = () => {
    setCurrentScreen(1);
  };

  const handleGoBack = () => {
    if (currentScreen > 1) {
      setCurrentScreen((prev) => (prev - 1) as ScreenId);
    }
  };

  const handleGoNext = () => {
    // Screen-specific navigation logic
    if (currentScreen < 8) {
      // Validate Screen 5 requires emotion
      if (currentScreen === 5 && !sessionData.selectedEmotion) {
        return;
      }
      // Validate Screen 7 requires need
      if (currentScreen === 7 && !sessionData.selectedNeed) {
        return;
      }
      setCurrentScreen((prev) => (prev + 1) as ScreenId);
    }
  };

  const canGoBack = currentScreen > 1;
  const canGoNext =
    currentScreen < 8 &&
    (currentScreen !== 5 || Boolean(sessionData.selectedEmotion)) &&
    (currentScreen !== 7 || Boolean(sessionData.selectedNeed));

  // Determine screen title for Chatbot context
  const getScreenTitle = (screen: ScreenId) => {
    switch (screen) {
      case 5:
        return 'Kenal Emosi';
      case 6:
        return 'Meluahkan Rasa';
      case 7:
        return 'Bantuan Yang Diperlukan';
      default:
        return 'EMO-CALM';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] flex flex-col font-['Nunito',sans-serif] text-[#2D3748]">
      {/* Top Header & Navigation bar */}
      <HeaderNav
        currentScreen={currentScreen}
        totalScreens={8}
        onGoHome={handleGoHome}
        onGoBack={handleGoBack}
        onGoNext={handleGoNext}
        canGoBack={canGoBack}
        canGoNext={canGoNext}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 w-full max-w-6xl mx-auto">
        {/* SCREEN 1: WELCOME */}
        {currentScreen === 1 && (
          <Screen1Welcome
            onStart={() => setCurrentScreen(2)}
            onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
          />
        )}

        {/* SCREEN 2: CHOOSE INPUT */}
        {currentScreen === 2 && (
          <Screen2ChooseInput
            initialEmotion={sessionData.selectedEmotion}
            onContinueToCalm={(data) => {
              setSessionData((prev) => ({
                ...prev,
                initialInputMethod: data.initialInputMethod,
                selectedEmotion: data.selectedEmotion || prev.selectedEmotion,
                spokenText: data.spokenText || prev.spokenText,
                voiceAudioUrl: data.voiceAudioUrl || prev.voiceAudioUrl,
              }));
              setCurrentScreen(3);
            }}
          />
        )}

        {/* SCREEN 3: CALM MODE */}
        {currentScreen === 3 && (
          <Screen3CalmMode
            selectedBg={sessionData.calmBackground}
            onSelectBg={(bg) => setSessionData((prev) => ({ ...prev, calmBackground: bg }))}
            selectedSound={sessionData.calmSound}
            onSelectSound={(snd) => {
              setSessionData((prev) => ({ ...prev, calmSound: snd }));
              playAmbientSound(snd, isAudioMuted);
            }}
            onContinueToBreathing={() => setCurrentScreen(4)}
            isAudioMuted={isAudioMuted}
          />
        )}

        {/* SCREEN 4: BREATHING ACTIVITY */}
        {currentScreen === 4 && (
          <Screen4Breathing
            onFinishBreathing={(rounds) => {
              setSessionData((prev) => ({ ...prev, breathingCompletedRounds: rounds }));
              setCurrentScreen(5);
            }}
            isAudioMuted={isAudioMuted}
          />
        )}

        {/* SCREEN 5: FEEL */}
        {currentScreen === 5 && (
          <Screen5Feel
            selectedEmotion={sessionData.selectedEmotion}
            onSelectEmotion={(emo) => {
              setSessionData((prev) => ({ ...prev, selectedEmotion: emo }));
            }}
            onContinueToExpress={() => setCurrentScreen(6)}
          />
        )}

        {/* SCREEN 6: EXPRESS */}
        {currentScreen === 6 && (
          <Screen6Express
            currentEmotion={sessionData.selectedEmotion}
            selectedMethod={sessionData.expressMethod}
            savedSpokenText={sessionData.spokenText}
            savedVoiceUrl={sessionData.voiceAudioUrl}
            savedDrawingUrl={sessionData.drawingDataUrl}
            savedSituation={sessionData.selectedSituation}
            onSaveExpressData={(data) => {
              setSessionData((prev) => ({
                ...prev,
                expressMethod: data.expressMethod,
                spokenText: data.spokenText ?? prev.spokenText,
                voiceAudioUrl: data.voiceAudioUrl ?? prev.voiceAudioUrl,
                drawingDataUrl: data.drawingDataUrl ?? prev.drawingDataUrl,
                selectedSituation: data.selectedSituation ?? prev.selectedSituation,
              }));
            }}
            onContinueToNeeds={() => setCurrentScreen(7)}
          />
        )}

        {/* SCREEN 7: WHAT I NEED */}
        {currentScreen === 7 && (
          <Screen7WhatINeed
            selectedNeed={sessionData.selectedNeed}
            onSelectNeed={(need) => {
              setSessionData((prev) => ({ ...prev, selectedNeed: need }));
            }}
            onReturnToBreathing={() => setCurrentScreen(4)}
            onContinueToCompletion={() => {
              setSessionData((prev) => ({ ...prev, completedAt: new Date() }));
              setCurrentScreen(8);
            }}
            teacherCalled={sessionData.teacherCalled}
            onSetTeacherCalled={(called) => {
              setSessionData((prev) => ({ ...prev, teacherCalled: called }));
            }}
          />
        )}

        {/* SCREEN 8: COMPLETION */}
        {currentScreen === 8 && (
          <Screen8Completion
            sessionData={sessionData}
            onResetSession={handleResetSession}
            onReturnToMenu={handleGoHome}
          />
        )}
      </main>

      {/* Guided Emo-Buddy Chatbot Panel (Available on screens 5, 6, and 7 as required) */}
      {[5, 6, 7].includes(currentScreen) && (
        <ChatbotPanel
          currentScreenTitle={getScreenTitle(currentScreen)}
          onSelectBreatheAction={() => setCurrentScreen(4)}
          onCallTeacherAction={() => {
            setSessionData((prev) => ({
              ...prev,
              selectedNeed: 'Saya perlukan bantuan cikgu',
              teacherCalled: true,
            }));
            setCurrentScreen(7);
          }}
        />
      )}

      {/* Teacher & Parent Guide Modal */}
      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
      />
    </div>
  );
}
