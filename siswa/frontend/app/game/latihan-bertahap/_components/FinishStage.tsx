'use client';

import { Trophy, RotateCcw } from 'lucide-react';
import { FinishStageProps } from '../../../types';
import Button3D from '../../../components/Button3D';
import InteractiveMascot from '../../../components/Maskot/InteractiveMascot';

export default function FinishStage({
  correctCount,
  incorrectCount,
  onRestart,
  onFinish
}: FinishStageProps) {
  const isExcellent = correctCount >= 8;

  return (
    <div className="flex-1 flex flex-col justify-between py-4 min-h-[80vh] max-w-sm w-full mx-auto">
      {/* Header placeholder */}
      <div className="text-center pt-2">
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Latihan Selesai</span>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 py-8 space-y-6 shadow-sm flex flex-col items-center text-center my-auto">
        <InteractiveMascot mood={isExcellent ? 'cheering' : 'happy'} width={100} height={100} />

        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-slate-800">Latihan Selesai!</h2>
          <p className="text-xs text-slate-550 max-w-xs mx-auto leading-relaxed text-slate-500 font-semibold">
            {isExcellent
              ? "Luar biasa! Kamu sangat hebat dalam mengenali suara huruf vokal!"
              : "Bagus sekali! Teruskan latihanmu agar ingatanmu semakin kuat!"}
          </p>
        </div>

        {/* Score breakdown stats */}
        <div className="grid grid-cols-2 gap-3 w-full pt-2">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">Benar</span>
            <span className="text-2xl font-black text-emerald-700">{correctCount}</span>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3">
            <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider block">Salah</span>
            <span className="text-2xl font-black text-rose-700">{incorrectCount}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 pt-4">
        <Button3D
          variant="secondary"
          onClick={onRestart}
          className="w-full py-4 text-sm flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Ulangi Latihan
        </Button3D>

        <Button3D
          variant="success"
          onClick={onFinish}
          className="w-full py-4 text-sm"
        >
          Selesai
        </Button3D>
      </div>
    </div>
  );
}
