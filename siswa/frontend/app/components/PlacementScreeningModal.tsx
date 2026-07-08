'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Search, Compass, ShieldAlert, Award, Play } from 'lucide-react';
import InteractiveMascot from './Maskot/InteractiveMascot';
import Button3D from './Button3D';
import { useGameSounds } from '../hooks/useGameSounds';

interface PlacementScreeningModalProps {
  isOpen: boolean;
  studentName: string;
  onSubmit: (level: number, score: number, riskClass: 'low' | 'medium' | 'high') => Promise<void>;
}

interface Question {
  id: number;
  instruction: string;
  voiceText?: string; // Text to speak
  options: string[];
  answer: string;
  isVisualOnly?: boolean;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    instruction: 'Dengarkan suara huruf ini, lalu ketuk jawaban yang benar!',
    voiceText: 'U',
    options: ['A', 'I', 'U', 'E', 'O'],
    answer: 'U'
  },
  {
    id: 2,
    instruction: 'Dengarkan suara suku kata ini, lalu ketuk jawaban yang benar!',
    voiceText: 'BA',
    options: ['BO', 'BI', 'BA', 'BU', 'BE'],
    answer: 'BA'
  },
  {
    id: 3,
    instruction: 'Dengarkan suara kata ini, lalu ketuk jawaban yang benar!',
    voiceText: 'SING',
    options: ['SINK', 'SING', 'SHING', 'TING', 'PING'],
    answer: 'SING'
  },
  {
    id: 4,
    instruction: 'Dengarkan kata ini, lalu ketuk jawaban yang benar!',
    voiceText: 'NYANYI',
    options: ['NANYI', 'NYANYI', 'NANI', 'YANYI', 'MAMI'],
    answer: 'NYANYI'
  },
  {
    id: 5,
    instruction: 'Manakah kata di bawah ini yang ejaannya paling tepat untuk kata "MAKAN"?',
    options: ['MAKNA', 'MAKAN', 'KAMAN', 'AMKAN', 'MANAK'],
    answer: 'MAKAN',
    isVisualOnly: true
  }
];

export const PlacementScreeningModal: React.FC<PlacementScreeningModalProps> = ({
  isOpen,
  studentName,
  onSubmit
}) => {
  const { playCorrect, playWrong } = useGameSounds();
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sound play
  const speakText = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.65; // slow speed for kids to hear clearly
      utterance.pitch = 1.1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const currentQuestion = QUESTIONS[currentQuestionIdx];

  // Auto-speak on question load
  useEffect(() => {
    if (step === 'quiz' && currentQuestion?.voiceText) {
      const timer = setTimeout(() => {
        speakText(currentQuestion.voiceText!);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [step, currentQuestionIdx, speakText]);

  if (!isOpen) return null;

  const handleStart = () => {
    setStep('quiz');
    setCurrentQuestionIdx(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleCheck = () => {
    if (!selectedOption || isSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.answer;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      playCorrect();
    } else {
      playWrong();
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setStep('result');
    }
  };

  // Determine placement result details
  let level = 1;
  let riskClass: 'low' | 'medium' | 'high' = 'high';
  let badgeTitle = 'Ksatria Huruf Berat';
  let badgeDesc = 'Kamu memiliki semangat baja untuk menguasai huruf dari dasar!';
  let BadgeIcon = ShieldAlert;
  let badgeColor = 'bg-rose-50 text-rose-600 border-rose-100';

  if (correctCount === 5) {
    level = 6;
    riskClass = 'low';
    badgeTitle = 'Detektif Huruf Ringan';
    badgeDesc = 'Hebat! Mata detektifmu tajam sekali dalam mengenali kata-kata!';
    BadgeIcon = Search;
    badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
  } else if (correctCount >= 3) {
    level = 3;
    riskClass = 'medium';
    badgeTitle = 'Penjelajah Kata Sedang';
    badgeDesc = 'Luar biasa! Mari bertualang menjelajahi kata yang lebih seru!';
    BadgeIcon = Compass;
    badgeColor = 'bg-indigo-50 text-indigo-650 border-indigo-100';
  }

  const handleSaveResult = async () => {
    setIsSaving(true);
    // Score mapped to percentage for SQLite risk_score (correct out of 5, e.g. 5/5 -> 100, 3/5 -> 60)
    const riskScore = Math.round((correctCount / QUESTIONS.length) * 100);
    await onSubmit(level, riskScore, riskClass);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF6EE] flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[500px] space-y-6">
        
        {step === 'intro' && (
          <div className="flex-1 flex flex-col justify-between py-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <InteractiveMascot mood="happy" width={110} height={110} />
              <div className="space-y-1.5">
                <h2 className="text-xl font-black text-slate-800">
                  Selamat Datang, {studentName}!
                </h2>
                <p className="text-xs text-slate-500 font-bold max-w-xs leading-relaxed mx-auto">
                  Sebelum kita mulai berpetualang, yuk kita bermain tebak kata sebentar agar aku tahu kemampuan hebatmu!
                </p>
              </div>
            </div>

            <Button3D
              onClick={handleStart}
              variant="primary"
              className="w-full py-4 mt-6 text-sm tracking-wide flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" /> Mulai Tebak Kata!
            </Button3D>
          </div>
        )}

        {step === 'quiz' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Petualangan Pengenalan</span>
                <span>{currentQuestionIdx + 1} / {QUESTIONS.length}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIdx + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center space-y-5">
              <InteractiveMascot mood={isSubmitted ? (selectedOption === currentQuestion.answer ? 'happy' : 'sad') : 'neutral'} width={70} height={70} />
              
              <h3 className="text-xs font-black text-slate-700 max-w-xs leading-relaxed">
                {currentQuestion.instruction}
              </h3>

              {/* Sound Synth Trigger Button (for audios) */}
              {!currentQuestion.isVisualOnly && (
                <button
                  onClick={() => speakText(currentQuestion.voiceText!)}
                  disabled={isSpeaking}
                  className={`p-4 rounded-2xl border-2 border-b-4 border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center gap-2 font-black text-xs select-none active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer ${
                    isSpeaking ? 'animate-pulse opacity-80' : ''
                  }`}
                >
                  <Volume2 className="w-5 h-5 shrink-0" />
                  <span>DENGARKAN LAGI</span>
                </button>
              )}

              {/* Options buttons */}
              <div className="grid grid-cols-5 gap-2 w-full pt-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option;
                  const isAnswerCorrect = option === currentQuestion.answer;
                  
                  let buttonClass = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/50';
                  if (isSelected) {
                    if (isSubmitted) {
                      buttonClass = isAnswerCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-inner'
                        : 'bg-rose-50 border-rose-300 text-rose-700 shadow-inner';
                    } else {
                      buttonClass = 'bg-indigo-50 border-indigo-300 text-indigo-650 shadow-inner';
                    }
                  } else if (isSubmitted && isAnswerCorrect) {
                    buttonClass = 'bg-emerald-50 border-emerald-200 text-emerald-600';
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleOptionClick(option)}
                      disabled={isSubmitted}
                      className={`py-3 text-base font-black rounded-xl border-2 transition-all uppercase cursor-pointer select-none active:scale-95 flex items-center justify-center ${buttonClass}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="pt-4 border-t border-slate-100">
              {!isSubmitted ? (
                <Button3D
                  onClick={handleCheck}
                  disabled={!selectedOption}
                  variant="success"
                  className="w-full py-4 text-sm font-black"
                >
                  PERIKSA
                </Button3D>
              ) : (
                <Button3D
                  onClick={handleNext}
                  variant={selectedOption === currentQuestion.answer ? 'success' : 'danger'}
                  className="w-full py-4 text-sm font-black"
                >
                  {currentQuestionIdx < QUESTIONS.length - 1 ? 'PERTANYAAN BERIKUTNYA' : 'LIHAT HASIL'}
                </Button3D>
              )}
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="flex-1 flex flex-col justify-between py-2">
            <div className="flex flex-col items-center text-center space-y-5">
              <InteractiveMascot mood="cheering" width={100} height={100} />
              
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block">
                  Hasil Penilaian Awal
                </span>
                <h2 className="text-lg font-black text-slate-800">
                  Luar Biasa, {studentName}!
                </h2>
                <p className="text-[11px] text-slate-500 font-bold leading-normal max-w-xs mx-auto">
                  Kamu telah menyelesaikan petualangan pengenalan kata dengan baik!
                </p>
              </div>

              {/* Badge awarded */}
              <div className={`w-full p-4 border border-slate-200/80 rounded-2xl flex flex-col items-center gap-2 ${badgeColor} border-2`}>
                <div className="p-3 bg-white rounded-full border border-slate-100 shadow-sm animate-bounce">
                  <BadgeIcon className="w-8 h-8" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black uppercase tracking-wider">{badgeTitle}</h4>
                  <p className="text-[10px] leading-relaxed font-semibold max-w-xs">{badgeDesc}</p>
                </div>
              </div>

              {/* Level placement display */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 w-full grid grid-cols-2 gap-2 text-center">
                <div className="flex flex-col">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Akurasi Soal</span>
                  <span className="text-base font-black text-slate-700">{correctCount} / {QUESTIONS.length} Benar</span>
                </div>
                <div className="flex flex-col border-l border-slate-200">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Tingkat Awal</span>
                  <span className="text-base font-black text-indigo-650">Tingkat {level}</span>
                </div>
              </div>
            </div>

            <Button3D
              onClick={handleSaveResult}
              disabled={isSaving}
              variant="primary"
              className="w-full py-4 mt-6 text-sm tracking-wide flex items-center justify-center gap-1.5"
            >
              <span>{isSaving ? 'Menyimpan Petualangan...' : 'MULAI PETUALANGAN!'}</span>
            </Button3D>
          </div>
        )}

      </div>
    </div>
  );
};

export default PlacementScreeningModal;
