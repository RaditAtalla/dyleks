'use client';

import React from 'react';
import { Trophy, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { CongratsModalProps } from '../../../types';

export default function CongratsModal({
  isOpen,
  letter,
  onRestart,
  onClose,
  onHome
}: CongratsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100 shadow-xl flex flex-col items-center text-center space-y-6 transform scale-100 transition-all duration-300">

        {/* Celebration Visuals */}
        <div className="relative">
          {/* Confetti element 1 */}
          <span className="absolute -top-4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎉</span>
          {/* Confetti element 2 */}
          <span className="absolute -top-6 right-2 text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
          {/* Confetti element 3 */}
          <span className="absolute -bottom-2 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🌟</span>

          <div className="p-4 bg-amber-50 text-amber-500 rounded-full border border-amber-100 shadow-inner flex items-center justify-center">
            <Trophy className="w-12 h-12 stroke-2" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-800">Hebat! Kamu Berhasil</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[240px] mx-auto">
            Kamu telah selesai melatih gerakan menulis huruf <strong className="text-indigo-600 text-sm font-black uppercase">"{letter}"</strong>!
          </p>
        </div>

        {/* Actions Grid */}
        <div className="w-full space-y-2 pt-2">
          {/* Main Action: Continue / Pick another letter */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-97 cursor-pointer"
          >
            Latih Huruf Lain <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-2 gap-2">
            {/* Reset current tracing */}
            <button
              onClick={onRestart}
              className="py-3 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-97 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ulangi
            </button>

            {/* Back Home */}
            <button
              onClick={onHome}
              className="py-3 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-97 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" /> Beranda
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
