'use client';

import React from 'react';
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

      <div className={isWordLayout ? "flex flex-col gap-3 w-full" : "grid grid-cols-5 gap-2.5 w-full"}>
        {question.options.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = option === question.target;

          // Compute styles
          let borderStyle = "border-slate-200 text-slate-700 bg-white hover:bg-slate-50";
          let activeTransform = "active:translate-y-[4px] active:border-b-0";

          if (isSubmitted) {
            activeTransform = ""; // disable pegas
            if (isCorrectOption) {
              borderStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 font-extrabold";
            } else if (isSelected) {
              borderStyle = "bg-rose-50 border-rose-500 text-rose-700 font-extrabold";
            } else {
              borderStyle = "bg-slate-50 border-slate-200 text-slate-300 opacity-60 pointer-events-none";
            }
          } else if (isSelected) {
            borderStyle = "bg-indigo-50 border-indigo-500 text-indigo-700 font-extrabold scale-102";
          }

          const buttonClass = isWordLayout
            ? `py-3.5 px-5 text-sm font-bold rounded-2xl text-center border-b-4 select-none transition-all duration-100 transform outline-none shadow-xs ${
                !isSubmitted ? 'cursor-pointer active:scale-98' : 'pointer-events-none'
              } ${borderStyle} ${activeTransform}`
            : `aspect-square flex items-center justify-center text-xl font-black rounded-2xl border-b-4 select-none transition-all duration-100 transform outline-none shadow-xs ${
                !isSubmitted ? 'cursor-pointer active:scale-93' : 'pointer-events-none'
              } ${borderStyle} ${activeTransform}`;

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
