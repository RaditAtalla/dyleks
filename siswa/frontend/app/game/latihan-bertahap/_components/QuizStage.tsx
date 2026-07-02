'use client';

import { X, Volume2, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { QuizStageProps } from '../../types';
import ChoiceQuiz from './ChoiceQuiz';
import HandwritingQuiz from './HandwritingQuiz';

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
  return (
    <div className="flex-1 flex flex-col justify-between py-4">
      {/* Header, Progress & Exit */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Soal {currentIndex + 1} dari {totalQuestions}
          </span>
          <button 
            onClick={onQuit}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-655"
            aria-label="Keluar Game"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-150">
          <div 
            className="bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Quiz Content Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 py-8 space-y-8 shadow-xs flex flex-col items-center my-auto">
        
        {/* Speaker Play Area */}
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={onPlaySound}
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
          <span className="text-xs font-semibold text-slate-455 text-slate-400 uppercase tracking-wider">
            {isSpeaking ? 'Mendengarkan...' : 'Ketuk untuk Mendengar'}
          </span>
        </div>

        {/* Dynamic Quiz Question Type Switch */}
        {question.type === 'choice' ? (
          <>
            <ChoiceQuiz
              question={question}
              selectedOption={selectedOption}
              onSelectOption={onSelectOption}
              isSubmitted={isSubmitted}
            />

            {/* Immediate Feedback Text (Choice only) */}
            {isSubmitted && (
              <div className="w-full flex items-center justify-center gap-2 py-1.5 px-4 rounded-xl text-xs font-bold transition-all duration-200">
                {selectedOption === question.target ? (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 fill-emerald-50 text-emerald-600 shrink-0" /> Jawaban Benar! Hebat!
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 fill-rose-50 text-rose-650 shrink-0" /> Jawaban kurang tepat, itu huruf "{question.target}"
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <HandwritingQuiz
            question={question}
            onHandwritingResult={onHandwritingResult}
            isSubmitted={isSubmitted}
            ocrResult={ocrResult}
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="pt-2">
        {/* Submit button only for choice questions */}
        {question.type === 'choice' && !isSubmitted && (
          <button
            disabled={!selectedOption}
            onClick={onSubmitAnswer}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-250 flex items-center justify-center gap-1.5 ${
              selectedOption 
              ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer transform active:scale-97' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Kirim Jawaban
          </button>
        )}

        {/* Next button shown for both questions after submission */}
        {isSubmitted && (
          <button
            onClick={onNext}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-md shadow-indigo-100/50 flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-97"
          >
            {currentIndex < totalQuestions - 1 ? 'Soal Berikutnya' : 'Lihat Hasil'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
