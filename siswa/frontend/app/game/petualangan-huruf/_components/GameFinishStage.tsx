'use client';

import { Trophy, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { GameFinishStageProps } from '../../../types';

export default function GameFinishStage({
  level,
  hasNextLevel,
  onNextLevel,
  onRestart,
  onHome
}: GameFinishStageProps) {
  return (
    <div className="flex-1 flex flex-col justify-between py-4">
      <div className="text-center py-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tugas Selesai</span>
      </div>

      {/* Celebration Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 py-8 space-y-6 shadow-xs flex flex-col items-center text-center my-auto">
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 animate-bounce">
          <Trophy className="w-12 h-12 text-amber-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-800">Luar Biasa!</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Kamu telah berhasil menemukan semua pasangan kartu di <strong>Level {level}</strong>!
          </p>
        </div>

        <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Hasil Petualangan</span>
          <p className="text-sm font-extrabold text-slate-700">Semua 8 Kartu Berhasil Terbuka!</p>
        </div>
      </div>

      {/* Action Buttons Panel */}
      <div className="space-y-3 pt-4">
        {hasNextLevel && (
          <button
            onClick={onNextLevel}
            className="w-full py-4 bg-indigo-650 bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-150/50 flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-97"
          >
            Lanjut ke Level Berikutnya <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={onRestart}
          className="w-full py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" /> Main Lagi di Level Ini
        </button>

        <button
          onClick={onHome}
          className="w-full py-3.5 text-slate-500 hover:text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
