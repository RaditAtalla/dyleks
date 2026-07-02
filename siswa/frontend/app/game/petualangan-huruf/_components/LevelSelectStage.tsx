'use client';

import { X, Sparkles, BookOpen, Star, Compass, HelpCircle } from 'lucide-react';
import { LevelSelectStageProps } from '../../../types';

const LEVELS = [
  {
    id: 1,
    title: 'Level 1: Vokal Tunggal',
    description: 'Menemukan pasangan huruf vokal tunggal yang sama.',
    example: 'A, I, U, E, O',
    colorClass: 'border-emerald-100 hover:border-emerald-250 hover:bg-emerald-50/20 text-emerald-700',
    iconBg: 'bg-emerald-50 text-emerald-600',
    icon: Star
  },
  {
    id: 2,
    title: 'Level 2: Suku Kata Tunggal',
    description: 'Menemukan pasangan suku kata terbuka satu suku kata.',
    example: 'ba, ca, da, ma, sa',
    colorClass: 'border-blue-100 hover:border-blue-250 hover:bg-blue-50/20 text-blue-700',
    iconBg: 'bg-blue-50 text-blue-600',
    icon: BookOpen
  },
  {
    id: 3,
    title: 'Level 3: Suku Kata Kompleks',
    description: 'Menemukan pasangan suku kata berpola tertutup/kompleks.',
    example: 'ban, tup, sing, plat',
    colorClass: 'border-amber-100 hover:border-amber-250 hover:bg-amber-50/20 text-amber-700',
    iconBg: 'bg-amber-50 text-amber-600',
    icon: Sparkles
  },
  {
    id: 4,
    title: 'Level 4: Digraf & Diftong',
    description: 'Menemukan gabungan huruf konsonan atau bunyi vokal rangkap.',
    example: 'ng, ny, sy, kh, ai, au',
    colorClass: 'border-purple-100 hover:border-purple-250 hover:bg-purple-50/20 text-purple-700',
    iconBg: 'bg-purple-50 text-purple-600',
    icon: Compass
  },
  {
    id: 5,
    title: 'Level 5: Kata Dasar',
    description: 'Menemukan pasangan kata dasar morfologis yang utuh.',
    example: 'main, baca, tulis, makan',
    colorClass: 'border-rose-100 hover:border-rose-250 hover:bg-rose-50/20 text-rose-700',
    iconBg: 'bg-rose-50 text-rose-600',
    icon: HelpCircle
  }
];

export default function LevelSelectStage({
  onSelectLevel,
  onBackToHome
}: LevelSelectStageProps) {
  return (
    <div className="flex-1 flex flex-col justify-start py-4 space-y-4">
      {/* Header with Exit */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">Permainan Memori</span>
          <h2 className="text-base font-black text-slate-800 leading-tight">Petualangan Huruf</h2>
        </div>
        <button
          onClick={onBackToHome}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-655"
          aria-label="Kembali ke Beranda"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Intro info */}
      <div className="text-center space-y-1">
        <h3 className="text-sm font-bold text-slate-700">Pilih Level Petualangan</h3>
        <p className="text-xs text-slate-400">
          Klik level di bawah ini untuk langsung mulai bermain!
        </p>
      </div>

      {/* Levels list */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {LEVELS.map((level) => {
          const IconComponent = level.icon;
          return (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              className={`w-full flex text-left items-start gap-3 p-4 rounded-2xl bg-white border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm active:scale-99 ${level.colorClass}`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${level.iconBg} border border-white shadow-xs`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-850 leading-tight">{level.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{level.description}</p>
                <div className="pt-1 flex items-center gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">Contoh:</span>
                  <code className="text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-semibold text-slate-600 truncate">
                    {level.example}
                  </code>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-2 text-center text-[10px] text-slate-400">
        Pasangkan 2 kartu yang sama untuk membuka semuanya!
      </div>
    </div>
  );
}
