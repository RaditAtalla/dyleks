'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import LandingStage from './_components/LandingStage';
import PlayStage from './_components/PlayStage';

const WORDS = ['main', 'baca', 'tulis', 'makan', 'lari', 'sapu', 'buka', 'beli'];

export default function LatihanBicaraAI() {
  const { student, loading, requireAuth } = useStudentAuth();
  const router = useRouter();

  // Enforce auth check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  // Game Stage State
  const [stage, setStage] = useState<'landing' | 'play'>('landing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const recognitionRef = useRef<any>(null);
  const targetWord = WORDS[currentIndex];

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

  const handleNextWord = () => {
    setIsSubmitted(false);
    setIsCorrect(null);
    setSpokenText('');
    setIsRecording(false);
    setCurrentIndex(prev => (prev + 1) % WORDS.length);
  };

  const handleQuit = () => {
    const confirmQuit = window.confirm("Apakah kamu yakin ingin keluar dari latihan ini?");
    if (confirmQuit) {
      router.push('/');
    }
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start">
      <title>Latihan Bicara AI - DyLeks Siswa</title>

      <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen space-y-5">
        {stage === 'landing' ? (
          <LandingStage
            studentName={student.name}
            onStartGame={() => setStage('play')}
            onBackToHome={() => router.push('/')}
          />
        ) : (
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
        )}
      </main>
    </div>
  );
}
