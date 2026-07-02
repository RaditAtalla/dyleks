'use client';

import { X, Volume2, Play } from 'lucide-react';
import { LandingStageProps } from '../../types';

export default function LandingStage({
  studentName,
  onStartGame,
  onBackToHome
}: LandingStageProps) {
  return (
    <div className="flex-1 flex flex-col justify-between py-4">
      {/* Header with Exit */}
      <div className="flex justify-between items-center pb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latihan Bertahap</span>
        <button 
          onClick={onBackToHome}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-655"
          aria-label="Kembali ke Beranda"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Welcome Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 py-8 space-y-6 shadow-xs flex flex-col items-center text-center my-auto">
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 animate-pulse">
          <Volume2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-800">Latihan Bertahap</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Halo <strong>{studentName}</strong>! Di game ini, kamu akan mendengarkan suara huruf vokal dan menebak huruf mana yang berbunyi seperti itu.
          </p>
        </div>

        <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Cara Bermain</h3>
          <ol className="text-left text-xs text-slate-650 space-y-1.5 list-decimal pl-4 font-medium">
            <li>Dengarkan suara huruf vokal yang dimainkan.</li>
            <li>Pilih huruf yang tepat dari pilihan yang tersedia.</li>
            <li>Kirim jawaban dan selesaikan semua 10 soal!</li>
          </ol>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={onStartGame}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-md shadow-indigo-100/50 flex items-center justify-center gap-2 cursor-pointer transform active:scale-97"
      >
        <Play className="w-4 h-4 fill-white" /> Mulai Bermain
      </button>
    </div>
  );
}
