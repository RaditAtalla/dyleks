'use client';

import { Trophy, RotateCcw } from 'lucide-react';
import { FinishStageProps } from '../../types';

export default function FinishStage({
  correctCount,
  incorrectCount,
  onRestart,
  onFinish
}: FinishStageProps) {
  return (
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
          onClick={onRestart}
          className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform active:scale-97 border border-slate-200"
        >
          <RotateCcw className="w-4 h-4" /> Ulangi Latihan
        </button>
        
        <button
          onClick={onFinish}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-md shadow-indigo-150 flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-97"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
