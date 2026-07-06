'use client';

import { ChoiceQuizProps } from '../../../types';

export default function ChoiceQuiz({
  question,
  selectedOption,
  onSelectOption,
  isSubmitted
}: ChoiceQuizProps) {
  return (
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
              className={`aspect-square flex items-center justify-center text-2xl font-black rounded-2xl transition-all duration-150 shadow-2xs ${!isSubmitted ? 'cursor-pointer active:scale-93' : 'pointer-events-none'
                } ${btnStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
