'use client';

import { X, Volume2, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { QuizStageProps } from '../../types';

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
  onPlaySound
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
          <span className="text-xs font-semibold text-slate-450 text-slate-400 uppercase tracking-wider">
            {isSpeaking ? 'Mendengarkan...' : 'Ketuk untuk Mendengar'}
          </span>
        </div>

        {/* Letter Options Grid (All 5 Vowels: A, I, U, E, O) */}
        <div className="space-y-3 w-full">
          <p className="text-[10px] font-extrabold text-slate-400 text-center uppercase tracking-wider">
            Pilih Huruf Vokal yang Sesuai
          </p>
          
          <div className="grid grid-cols-5 gap-2 w-full">
            {question.options.map((option) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option === question.target;

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
                  onClick={() => onSelectOption(option)}
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
            {selectedOption === question.target ? (
              <span className="text-emerald-600 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 fill-emerald-50 text-emerald-650 shrink-0" /> Jawaban Benar! Hebat!
              </span>
            ) : (
              <span className="text-rose-600 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 fill-rose-50 text-rose-650 shrink-0" /> Jawaban kurang tepat, itu huruf "{question.target}"
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
            onClick={onSubmitAnswer}
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
