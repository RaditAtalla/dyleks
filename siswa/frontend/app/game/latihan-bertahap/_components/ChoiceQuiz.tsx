'use client';

import { ChoiceQuizProps } from '../../../types';

export default function ChoiceQuiz({
  question,
  selectedOption,
  onSelectOption,
  isSubmitted
}: ChoiceQuizProps) {
  const maxOptionLength = Math.max(...question.options.map(o => o.length));
  const isWordLayout = maxOptionLength > 2;

  return (
    <div className="space-y-4 w-full">
      <p className="text-[10px] font-extrabold text-slate-400 text-center uppercase tracking-wider">
        Pilih Jawaban yang Sesuai
      </p>

      <div className={isWordLayout ? "flex flex-col gap-2.5 w-full" : "grid grid-cols-5 gap-2 w-full"}>
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

          const buttonClass = isWordLayout
            ? `py-3 px-5 text-base font-bold rounded-2xl text-center transition-all duration-150 shadow-2xs ${
                !isSubmitted ? 'cursor-pointer active:scale-98' : 'pointer-events-none'
              } ${btnStyle}`
            : `aspect-square flex items-center justify-center text-2xl font-black rounded-2xl transition-all duration-150 shadow-2xs ${
                !isSubmitted ? 'cursor-pointer active:scale-93' : 'pointer-events-none'
              } ${btnStyle}`;

          return (
            <button
              key={option}
              disabled={isSubmitted}
              onClick={() => onSelectOption(option)}
              className={buttonClass}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
