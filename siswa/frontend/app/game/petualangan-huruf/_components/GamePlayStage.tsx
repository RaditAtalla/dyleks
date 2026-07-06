'use client';

import { ArrowLeft, RotateCcw, Award, CheckCircle2, HelpCircle } from 'lucide-react';
import { GamePlayStageProps } from '../../../types';

export default function GamePlayStage({
  level,
  levelName,
  cards,
  onCardClick,
  onResetLevel,
  onQuit
}: GamePlayStageProps) {
  const matchedCount = cards.filter(c => c.isMatched).length / 2;

  return (
    <div className="flex-1 flex flex-col justify-between py-4 space-y-4">
      {/* Top Navigation / Info Bar */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <button
          onClick={onQuit}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Pilih Level
        </button>
        <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-650 px-2 py-0.5 rounded-full border border-indigo-100">
          Level {level}
        </span>
      </div>

      {/* Title & Progress Tracker */}
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Permainan Memori</h3>
          <h2 className="text-sm font-bold text-slate-800 leading-tight truncate max-w-[200px]">
            {levelName}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50/50 px-2.5 py-1 rounded-xl border border-indigo-100/50">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Pasangan: {matchedCount} / 4</span>
        </div>
      </div>

      {/* Main Grid: 8 Cards in 2 rows x 4 columns */}
      <div className="grid grid-cols-4 gap-2.5 my-auto py-2">
        {cards.map((card) => {
          const isOpen = card.isRevealed || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => onCardClick(card.id)}
              disabled={card.isMatched}
              className={`h-28 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden select-none active:scale-95 ${card.isMatched
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-inner cursor-default'
                  : isOpen
                    ? 'bg-white border-indigo-200 text-indigo-700 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-300 hover:text-slate-400 cursor-pointer shadow-xs'
                }`}
            >
              {/* Back of Card (Hidden) */}
              {!isOpen && (
                <div className="flex flex-col items-center justify-center gap-1">
                  <HelpCircle className="w-6 h-6 text-slate-300/80" />
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Cari</span>
                </div>
              )}

              {/* Front of Card (Revealed / Matched) */}
              {isOpen && (
                <div className="flex flex-col items-center justify-center p-1 w-full h-full animate-in fade-in zoom-in-95 duration-200">
                  {card.isMatched && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 absolute top-1.5 right-1.5" />
                  )}
                  <span className={`font-black text-center wrap-break-words leading-tight px-1 w-full ${card.value.length > 5
                      ? 'text-[11px]'
                      : card.value.length > 3
                        ? 'text-xs'
                        : 'text-sm'
                    }`}>
                    {card.value}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Button Panel */}
      <div className="pt-2">
        <button
          onClick={onResetLevel}
          className="w-full py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Acak & Ulangi Level Ini
        </button>
      </div>
    </div>
  );
}
