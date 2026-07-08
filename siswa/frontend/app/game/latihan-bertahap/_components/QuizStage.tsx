'use client';

import { X, Volume2 } from 'lucide-react';
import { QuizStageProps } from '../../../types';
import ChoiceQuiz from './ChoiceQuiz';
import HandwritingQuiz from './HandwritingQuiz';
import DuolingoProgressBar from '../../../components/DuolingoProgressBar';
import FeedbackFooter from '../../../components/FeedbackFooter';
import InteractiveMascot from '../../../components/Maskot/InteractiveMascot';
import { useGamification } from '../../../hooks/useGamification';

export default function QuizStage({
  currentIndex,
  totalQuestions,
  question,
  selectedOption,
  onSelectOption,
  isSubmitted,
  onSubmitAnswer,
  onNext,
  onQuit,
  isSpeaking,
  onPlaySound,
  onHandwritingResult,
  ocrResult
}: QuizStageProps) {
  const gamification = useGamification();
  
  // Determine correctness for the FeedbackFooter
  let isCorrect: boolean | null = null;
  if (isSubmitted) {
    if (question.type === 'choice') {
      isCorrect = selectedOption === question.target;
    } else {
      isCorrect = ocrResult ? (ocrResult.accuracy > 50 && ocrResult.detected.toLowerCase() === question.target.toLowerCase()) : false;
    }
  }

  // Determine mascot mood based on quiz status
  let mascotMood: 'neutral' | 'happy' | 'sad' | 'cheering' = 'neutral';
  if (isSubmitted) {
    mascotMood = isCorrect ? 'cheering' : 'sad';
  } else if (isSpeaking) {
    mascotMood = 'happy';
  }

  return (
    <div className="flex-1 flex flex-col justify-between py-4 min-h-[85vh] pb-32">
      {/* Header, Progress & Exit */}
      <div className="space-y-4 max-w-sm w-full mx-auto">
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={onQuit}
            className="p-1.5 hover:bg-white rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
            aria-label="Keluar Game"
          >
            <X className="w-5 h-5" />
          </button>
          
          <DuolingoProgressBar current={currentIndex + 1} total={totalQuestions} />
        </div>
      </div>

      {/* Mascot Speech Area */}
      <div className="flex flex-col items-center justify-center my-6 max-w-sm w-full mx-auto">
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200/60 shadow-2xs w-full">
          <div className="shrink-0">
            <InteractiveMascot mood={mascotMood} width={70} height={70} />
          </div>
          <div className="relative bg-slate-50 border border-slate-200 p-3 rounded-2xl flex-1 text-left">
            {/* Audio play button */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPlaySound}
                className={`p-2 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  isSpeaking
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200 scale-105 animate-pulse'
                    : 'bg-indigo-50 text-indigo-650 border-indigo-100 hover:bg-indigo-100'
                }`}
                aria-label="Putar Suara Huruf"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide">
                {isSpeaking ? 'Mendengarkan...' : 'Ketuk untuk Mendengar'}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-655 mt-1.5 leading-normal">
              {question.type === 'choice' 
                ? 'Dengarkan suaranya lalu ketuk huruf yang cocok di bawah!' 
                : `Tulis huruf "${question.target.toUpperCase()}" pada kertas lalu foto dengan kamera!`}
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Content Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col items-center my-auto max-w-sm w-full mx-auto">
        {/* Dynamic Quiz Question Type Switch */}
        {question.type === 'choice' ? (
          <ChoiceQuiz
            question={question}
            selectedOption={selectedOption}
            onSelectOption={onSelectOption}
            isSubmitted={isSubmitted}
          />
        ) : (
          <HandwritingQuiz
            question={question}
            onHandwritingResult={onHandwritingResult}
            isSubmitted={isSubmitted}
            ocrResult={ocrResult}
          />
        )}
      </div>

      {/* Bottom Confirmation Drawer */}
      {(question.type === 'choice' || isSubmitted) && (
        <FeedbackFooter
          isCorrect={isCorrect}
          correctAnswer={question.target}
          onContinue={onNext}
          onCheck={onSubmitAnswer}
          hasSelected={selectedOption !== null}
        />
      )}
    </div>
  );
}
