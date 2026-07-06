'use client';
 
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import { QuizQuestion } from '../../types';
import { saveGameSession } from '../../services/gameService';
import LandingStage from './_components/LandingStage';
import QuizStage from './_components/QuizStage';
import FinishStage from './_components/FinishStage';
 
const VOWELS = ['A', 'I', 'U', 'E', 'O'];
 
export default function LatihanBertahap() {
  const { student, loading, requireAuth, refreshStudent } = useStudentAuth();
  const router = useRouter();
 
  // Enforce auth check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);
 
  // Game States
  const [stage, setStage] = useState<'landing' | 'quiz' | 'finish'>('landing');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ocrResult, setOcrResult] = useState<{ detected: string; accuracy: number } | null>(null);
  const [answers, setAnswers] = useState<Array<{
    questionNo: number;
    type: 'choice' | 'handwriting';
    target: string;
    answer: string;
    isCorrect: boolean;
    ocrAccuracy?: number;
  }>>([]);
 
  // Initialize/Reset Game
  const startNewGame = useCallback(() => {
    const newQuestions: QuizQuestion[] = [];
    for (let i = 0; i < 10; i++) {
      const randomTarget = VOWELS[Math.floor(Math.random() * VOWELS.length)];
      newQuestions.push({
        target: randomTarget,
        options: [...VOWELS],
        type: i < 8 ? 'choice' : 'handwriting' // Questions 9 and 10 are handwriting recognition
      });
    }
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setOcrResult(null);
    setAnswers([]);
    setStage('quiz');
  }, []);

  // Text to Speech logic
  const playLetterSound = useCallback((letter: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = 'id-ID';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Auto-play sound when question changes
  useEffect(() => {
    if (stage === 'quiz' && questions.length > 0) {
      const timer = setTimeout(() => {
        playLetterSound(questions[currentIndex].target);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, currentIndex, questions, playLetterSound]);

  // Handle Quit action
  const handleQuit = () => {
    const confirmQuit = window.confirm("Apakah kamu yakin ingin keluar? Skor latihan kamu saat ini tidak akan disimpan.");
    if (confirmQuit) {
      router.push('/');
    }
  };

  // Submit Answer (Choice question only)
  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.target;

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
    }

    setAnswers(prev => [
      ...prev,
      {
        questionNo: currentIndex + 1,
        type: 'choice',
        target: currentQuestion.target,
        answer: selectedOption,
        isCorrect
      }
    ]);

    setIsSubmitted(true);
  };

  // Handwriting API result callback
  const handleHandwritingResult = useCallback((detected: string, accuracy: number, isCorrect: boolean) => {
    setSelectedOption(detected);
    setOcrResult({ detected, accuracy });

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
    }

    setAnswers(prev => [
      ...prev,
      {
        questionNo: currentIndex + 1,
        type: 'handwriting',
        target: questions[currentIndex].target,
        answer: detected,
        isCorrect,
        ocrAccuracy: accuracy
      }
    ]);

    setIsSubmitted(true);
  }, [currentIndex, questions]);

  // Go to next question or finish page
  const handleNext = async () => {
    if (currentIndex < 9) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setOcrResult(null);
      setIsSubmitted(false);
    } else {
      // Save game session to the database
      const accuracyPercent = Math.round((correctCount / 10) * 100);
      const payload = {
        level: student.currentLevel || 1,
        accuracy: accuracyPercent,
        correctCount: correctCount,
        totalCount: 10,
        questions: answers
      };

      console.log("Saving game session for student:", student.id);
      console.log("Session payload:", payload);

      try {
        const updated = await saveGameSession(student.id, payload);
        console.log("Save API response updated student:", updated);
        if (updated) {
          await refreshStudent();
          console.log("Student state refreshed successfully.");
        } else {
          console.warn("Save API failed or returned null response.");
        }
      } catch (error) {
        console.error("Error saving game session:", error);
      }
      setStage('finish');
    }
  };

  // Render loading state if auth check is running
  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <title>Memuat - Latihan Bertahap</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat petualangan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start">
      <title>Latihan Bertahap - DyLeks Siswa</title>

      {/* Mobile container */}
      <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen space-y-5">

        {/* Game Stage: Landing */}
        {stage === 'landing' && (
          <LandingStage
            studentName={student.name}
            onStartGame={startNewGame}
            onBackToHome={() => router.push('/')}
          />
        )}

        {/* Game Stage: Quiz */}
        {stage === 'quiz' && questions.length > 0 && (
          <QuizStage
            currentIndex={currentIndex}
            totalQuestions={10}
            question={questions[currentIndex]}
            selectedOption={selectedOption}
            onSelectOption={setSelectedOption}
            isSubmitted={isSubmitted}
            onSubmitAnswer={handleSubmitAnswer}
            onNext={handleNext}
            onQuit={handleQuit}
            isSpeaking={isSpeaking}
            onPlaySound={() => playLetterSound(questions[currentIndex].target)}
            onHandwritingResult={handleHandwritingResult}
            ocrResult={ocrResult}
          />
        )}

        {/* Game Stage: Finish */}
        {stage === 'finish' && (
          <FinishStage
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            onRestart={startNewGame}
            onFinish={() => router.push('/')}
          />
        )}

      </main>
    </div>
  );
}
