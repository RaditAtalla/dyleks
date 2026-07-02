'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentAuth } from '../hooks/useStudentAuth';
import { 
  X, 
  Volume2, 
  Trophy, 
  ArrowRight,
  Play,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';

const VOWELS = ['A', 'I', 'U', 'E', 'O'];

interface Question {
  target: string;
  options: string[];
}

export default function LatihanBertahap() {
  const { student, loading, requireAuth } = useStudentAuth();
  const router = useRouter();

  // Enforce auth check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  // Game States
  const [stage, setStage] = useState<'landing' | 'quiz' | 'finish'>('landing');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize/Reset Game
  const startNewGame = useCallback(() => {
    const newQuestions: Question[] = [];
    for (let i = 0; i < 10; i++) {
      const randomTarget = VOWELS[Math.floor(Math.random() * VOWELS.length)];
      newQuestions.push({
        target: randomTarget,
        options: [...VOWELS]
      });
    }
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCorrectCount(0);
    setIncorrectCount(0);
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

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.target;

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
    }

    setIsSubmitted(true);
  };

  // Go to next question or finish page
  const handleNext = () => {
    if (currentIndex < 9) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
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
          <div className="flex-1 flex flex-col justify-between py-4">
            {/* Header with Exit */}
            <div className="flex justify-between items-center pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latihan Bertahap</span>
              <button 
                onClick={() => router.push('/')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                aria-label="Kembali ke Beranda"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Welcome Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 py-8 space-y-6 shadow-xs flex flex-col items-center text-center my-auto">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 animate-pulse">
                <Volume2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-800">Latihan Bertahap</h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Halo <strong>{student.name}</strong>! Di game ini, kamu akan mendengarkan suara huruf vokal dan menebak huruf mana yang berbunyi seperti itu.
                </p>
              </div>

              <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Cara Bermain</h3>
                <ol className="text-left text-xs text-slate-600 space-y-1.5 list-decimal pl-4 font-medium">
                  <li>Dengarkan suara huruf vokal yang dimainkan.</li>
                  <li>Pilih huruf yang tepat dari pilihan yang tersedia.</li>
                  <li>Kirim jawaban dan selesaikan semua 10 soal!</li>
                </ol>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={startNewGame}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-md shadow-indigo-100/50 flex items-center justify-center gap-2 cursor-pointer transform active:scale-97"
            >
              <Play className="w-4 h-4 fill-white" /> Mulai Bermain
            </button>
          </div>
        )}

        {/* Game Stage: Quiz */}
        {stage === 'quiz' && questions.length > 0 && (
          <div className="flex-1 flex flex-col justify-between py-4">
            {/* Header, Progress & Exit */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Soal {currentIndex + 1} dari 10
                </span>
                <button 
                  onClick={handleQuit}
                  className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                  aria-label="Keluar Game"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-150">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentIndex) / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Quiz Content Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 py-8 space-y-8 shadow-xs flex flex-col items-center my-auto">
              
              {/* Speaker Play Area */}
              <div className="flex flex-col items-center space-y-3">
                <button
                  onClick={() => playLetterSound(questions[currentIndex].target)}
                  className={`p-6 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm relative ${
                    isSpeaking 
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200 scale-105' 
                    : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 hover:scale-102 active:scale-95'
                  }`}
                  aria-label="Putar Suara Huruf"
                >
                  <Volume2 className={`w-10 h-10 ${isSpeaking ? 'animate-bounce' : ''}`} />
                  {isSpeaking && (
                    <span className="absolute -inset-1 rounded-full border-2 border-indigo-400 animate-ping opacity-25 pointer-events-none" />
                  )}
                </button>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {isSpeaking ? 'Mendengarkan...' : 'Ketuk untuk Mendengar'}
                </span>
              </div>

              {/* Letter Options Grid (All 5 Vowels: A, I, U, E, O) */}
              <div className="space-y-3 w-full">
                <p className="text-[10px] font-extrabold text-slate-400 text-center uppercase tracking-wider">
                  Pilih Huruf Vokal yang Sesuai
                </p>
                
                <div className="grid grid-cols-5 gap-2 w-full">
                  {questions[currentIndex].options.map((option) => {
                    const isSelected = selectedOption === option;
                    const isCorrectOption = option === questions[currentIndex].target;

                    // Compute dynamic styling based on stage & selection
                    let btnStyle = "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100";
                    if (isSubmitted) {
                      if (isCorrectOption) {
                        btnStyle = "bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-xs font-black scale-102";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-50 border-2 border-rose-500 text-rose-700 shadow-xs font-black";
                      } else {
                        btnStyle = "bg-slate-50 border border-slate-100 text-slate-350 opacity-50 pointer-events-none";
                      }
                    } else if (isSelected) {
                      btnStyle = "bg-indigo-50 border-2 border-indigo-500 text-indigo-700 font-black shadow-xs scale-103";
                    }

                    return (
                      <button
                        key={option}
                        disabled={isSubmitted}
                        onClick={() => setSelectedOption(option)}
                        className={`aspect-square flex items-center justify-center text-2xl font-black rounded-2xl transition-all duration-150 shadow-2xs ${
                          !isSubmitted ? 'cursor-pointer active:scale-93' : 'pointer-events-none'
                        } ${btnStyle}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Immediate Feedback Text */}
              {isSubmitted && (
                <div className="w-full flex items-center justify-center gap-2 py-1.5 px-4 rounded-xl text-xs font-bold transition-all duration-200">
                  {selectedOption === questions[currentIndex].target ? (
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 fill-emerald-50 text-emerald-600 shrink-0" /> Jawaban Benar! Hebat!
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 fill-rose-50 text-rose-650 shrink-0" /> Jawaban kurang tepat, itu huruf "{questions[currentIndex].target}"
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              {!isSubmitted ? (
                <button
                  disabled={!selectedOption}
                  onClick={handleSubmitAnswer}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-250 flex items-center justify-center gap-1.5 ${
                    selectedOption 
                    ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer transform active:scale-97' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Kirim Jawaban
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-md shadow-indigo-100/50 flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-97"
                >
                  {currentIndex < 9 ? 'Soal Berikutnya' : 'Lihat Hasil'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Game Stage: Finish */}
        {stage === 'finish' && (
          <div className="flex-1 flex flex-col justify-between py-4">
            {/* Header placeholder */}
            <div className="text-center pt-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Latihan Selesai</span>
            </div>

            {/* Summary Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 py-8 space-y-6 shadow-xs flex flex-col items-center text-center my-auto">
              <div className="p-4 bg-amber-50 text-amber-500 rounded-full border border-amber-100 animate-bounce">
                <Trophy className="w-12 h-12" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-800">Latihan Selesai!</h2>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {correctCount >= 8 
                    ? "Luar biasa! Kamu sangat hebat dalam mengenali suara huruf vokal!" 
                    : "Bagus sekali! Teruskan latihanmu agar ingatanmu semakin kuat!"}
                </p>
              </div>

              {/* Score breakdown stats */}
              <div className="grid grid-cols-2 gap-3 w-full pt-2">
                <div className="bg-emerald-50/55 border border-emerald-100/70 rounded-2xl p-3">
                  <span className="text-[10px] font-extrabold text-emerald-600/80 uppercase tracking-wider block">Benar</span>
                  <span className="text-2xl font-black text-emerald-700">{correctCount}</span>
                </div>
                <div className="bg-rose-50/55 border border-rose-100/70 rounded-2xl p-3">
                  <span className="text-[10px] font-extrabold text-rose-600/80 uppercase tracking-wider block">Salah</span>
                  <span className="text-2xl font-black text-rose-700">{incorrectCount}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={startNewGame}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform active:scale-97 border border-slate-200"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi Latihan
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-md shadow-indigo-150 flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-97"
              >
                Selesai
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
