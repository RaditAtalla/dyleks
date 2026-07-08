'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import PlayStage from './_components/PlayStage';
import { useGameSounds } from '../../hooks/useGameSounds';
import { getChallengePool } from '../challenge-pools';
import SubLevelMap from '../../components/SubLevelMap';
import { useSubLevelProgress } from '../../hooks/useSubLevelProgress';

// Nada suara dimainkan menggunakan hook useGameSounds bawaan portal siswa

export default function LatihanBicaraAI() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat game...</p>
        </div>
      </div>
    }>
      <LatihanBicaraAIContent />
    </Suspense>
  );
}

function LatihanBicaraAIContent() {
  const { student, loading, requireAuth } = useStudentAuth();
  const router = useRouter();
  const { playCorrect, playWrong } = useGameSounds();
  const searchParams = useSearchParams();
  const levelParam = searchParams.get('level');

  const studentLevel = levelParam ? parseInt(levelParam, 10) : (student?.currentLevel || 1);

  const { stageProgress, activeStageNum, setActiveStageNum, handleStageWin } = useSubLevelProgress({
    gameKey: 'bicara',
    studentLevel,
  });
  // Enforce auth check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  // Game Stage State
  const [stage, setStage] = useState<'map' | 'play'>('map');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [stageWordsCorrect, setStageWordsCorrect] = useState(0);
  const WORDS_TO_WIN = 5; // Must get 5 words correct to win a stage

  const recognitionRef = useRef<any>(null);

  const wordsList = useMemo(() => {
    const pool = getChallengePool(studentLevel);
    return pool?.items || ['MAIN'];
  }, [studentLevel]);

  const targetWord = useMemo(() => {
    if (wordsList.length === 0) return 'MAIN';
    return wordsList[currentIndex % wordsList.length];
  }, [wordsList, currentIndex]);

  // Speech synthesis (Text-to-Speech)
  const playWordSound = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(targetWord);
      utterance.lang = 'id-ID';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, [targetWord]);

  // Autoplay sound on play stage load or word change
  useEffect(() => {
    if (stage === 'play') {
      const timer = setTimeout(() => {
        playWordSound();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, currentIndex, playWordSound]);

  // Clean up synthesis and recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Listen to custom subcomponent events (for retry and manual simulation submit)
  useEffect(() => {
    const handleManualSubmit = (e: Event) => {
      const customEvent = e as CustomEvent;
      const text = customEvent.detail.text;

      setSpokenText(text);
      const cleanWord = targetWord.toLowerCase().trim();
      const cleanSpoken = text.toLowerCase().trim();
      const correct = cleanSpoken === cleanWord || cleanSpoken.includes(cleanWord);

      setIsCorrect(correct);
      setIsSubmitted(true);
    };

    const handleRetry = () => {
      setIsSubmitted(false);
      setIsCorrect(null);
      setSpokenText('');
    };

    window.addEventListener('latihan-bicara-manual-submit', handleManualSubmit);
    window.addEventListener('latihan-bicara-retry', handleRetry);

    return () => {
      window.removeEventListener('latihan-bicara-manual-submit', handleManualSubmit);
      window.removeEventListener('latihan-bicara-retry', handleRetry);
    };
  }, [targetWord]);

  // Play sounds when correctness changes
  useEffect(() => {
    if (isCorrect === true) {
      playCorrect();
    } else if (isCorrect === false) {
      playWrong();
    }
  }, [isCorrect, playCorrect, playWrong]);

  // Speech recognition controller methods
  const startRecording = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda tidak mendukung deteksi suara (Speech Recognition). Silakan gunakan input manual.");
      return;
    }

    // Cancel TTS if active
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'id-ID';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsRecording(true);
        setSpokenText('');
        setIsSubmitted(false);
        setIsCorrect(null);
      };

      rec.onresult = (event: any) => {
        if (event.results && event.results[0]) {
          const transcript = event.results[0][0].transcript;
          setSpokenText(transcript);

          const cleanWord = targetWord.toLowerCase().trim();
          const cleanSpoken = transcript.toLowerCase().trim();
          const correct = cleanSpoken === cleanWord || cleanSpoken.includes(cleanWord);

          setIsCorrect(correct);
          setIsSubmitted(true);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        
        // If error occurred and not submitted, treat as unrecognized
        if (!isSubmitted) {
          setSpokenText('');
          setIsCorrect(false);
          setIsSubmitted(true);
        }
      };

      rec.onend = () => {
        setIsRecording(false);
        // Yield to browser execution to make sure onresult can fire first
        setTimeout(() => {
          setIsSubmitted(prevSubmitted => {
            if (!prevSubmitted) {
              setSpokenText('');
              setIsCorrect(false);
              return true;
            }
            return prevSubmitted;
          });
        }, 150);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error("Speech recognition initialization failed:", e);
      setIsRecording(false);
      if (!isSubmitted) {
        setSpokenText('');
        setIsCorrect(false);
        setIsSubmitted(true);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleNextWord = async () => {
    setIsSubmitted(false);
    setIsCorrect(null);
    setSpokenText('');
    setIsRecording(false);

    if (isCorrect) {
      const newCorrect = stageWordsCorrect + 1;
      setStageWordsCorrect(newCorrect);
      if (newCorrect >= WORDS_TO_WIN) {
        await handleStageWin();
        setStageWordsCorrect(0);
        setStage('map');
        return;
      }
    }

    setCurrentIndex(prev => (prev + 1) % wordsList.length);
  };

  const handleQuit = () => {
    const confirmQuit = window.confirm("Apakah kamu yakin ingin keluar dari latihan ini?");
    if (confirmQuit) {
      setStage('map');
    }
  };

  const getLevelName = (lvl: number) => {
    const names: Record<number, string> = {
      1: 'Vokal Tunggal', 2: 'Suku Kata Tunggal', 3: 'Suku Kata Kompleks',
      4: 'Digraf & Diftong', 5: 'Kata Dasar', 6: 'Suku Kata Blending',
      7: 'Diskriminasi Visual', 8: 'Morfologi Kata'
    };
    return names[lvl] || 'Kemampuan Dasar';
  };

  // Render loading state while checking authentication
  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <title>Memuat - Latihan Bicara AI</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat latihan...</p>
        </div>
      </div>
    );
  }

  if (stage === 'map') {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-start">
        <title>Latihan Bicara AI - DyLeks Siswa</title>
        <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen">
          <SubLevelMap
            studentName={student.name}
            gameName="Bicara AI"
            gameCategory="Latihan Pengucapan"
            currentLevel={studentLevel}
            getLevelName={getLevelName}
            stageProgress={stageProgress}
            onStartStage={(stageNum) => {
              setActiveStageNum(stageNum);
              setStageWordsCorrect(0);
              setCurrentIndex(0);
              setStage('play');
            }}
            onBackToHome={() => router.push('/')}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start">
      <title>Latihan Bicara AI - DyLeks Siswa</title>
      <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen space-y-5">
        <PlayStage
          targetWord={targetWord}
          isSpeaking={isSpeaking}
          onPlaySound={playWordSound}
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          spokenText={spokenText}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          onNextWord={handleNextWord}
          onQuit={handleQuit}
        />
      </main>
    </div>
  );
}
