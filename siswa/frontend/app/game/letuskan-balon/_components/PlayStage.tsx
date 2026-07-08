'use client';

import React from 'react';
import { LetuskanBalonPlayStageProps } from '../../../types';
import { X, RotateCcw, HelpCircle } from 'lucide-react';

const BUBBLE_GRADIENTS = [
  // Sky/Blue
  'from-sky-50/90 to-blue-100/80 border-sky-300 text-sky-700 shadow-[inset_-2px_-3px_6px_rgba(14,165,233,0.15),0_4px_8px_rgba(186,230,253,0.25)]',
  // Indigo
  'from-indigo-50/90 to-indigo-100/80 border-indigo-300 text-indigo-700 shadow-[inset_-2px_-3px_6px_rgba(99,102,241,0.15),0_4px_8px_rgba(197,202,249,0.25)]',
  // Purple
  'from-purple-50/90 to-purple-100/80 border-purple-300 text-purple-700 shadow-[inset_-2px_-3px_6px_rgba(168,85,247,0.15),0_4px_8px_rgba(233,213,252,0.25)]',
  // Pink
  'from-pink-50/90 to-pink-100/80 border-pink-300 text-pink-700 shadow-[inset_-2px_-3px_6px_rgba(244,63,94,0.15),0_4px_8px_rgba(252,231,243,0.25)]',
  // Emerald
  'from-emerald-50/90 to-emerald-100/80 border-emerald-300 text-emerald-700 shadow-[inset_-2px_-3px_6px_rgba(16,185,129,0.15),0_4px_8px_rgba(167,243,208,0.25)]',
  // Amber
  'from-amber-50/90 to-amber-100/80 border-amber-300 text-amber-700 shadow-[inset_-2px_-3px_6px_rgba(245,158,11,0.15),0_4px_8px_rgba(253,230,138,0.25)]',
];

export default function PlayStage({
  currentWord,
  currentSyllables,
  currentSyllableIndex,
  rightCount,
  wrongCount,
  bubbles,
  onPopBubble,
  onRestart,
  onQuit,
  isWrongFlash,
}: LetuskanBalonPlayStageProps) {
  return (
    <div className="flex flex-col justify-between min-h-[85vh] md:min-h-[80vh] space-y-5">
      {/* Styles for bubble animations and screen shakes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .bubble-glow {
          box-shadow: inset -2px -4px 10px rgba(255, 255, 255, 0.9),
                      inset 2px 4px 10px rgba(0, 0, 0, 0.05),
                      0 6px 12px rgba(99, 102, 241, 0.08);
        }
        .bubble-glow:hover {
          transform: scale(1.05);
          box-shadow: inset -2px -4px 12px rgba(255, 255, 255, 0.95),
                      inset 2px 4px 10px rgba(99, 102, 241, 0.15),
                      0 8px 16px rgba(99, 102, 241, 0.12);
        }
      `}</style>

      {/* Top Header */}
      <div className="flex justify-between items-center pb-1">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">
            Phonological Blending
          </span>
          <h1 className="text-base font-black text-slate-800 leading-tight">Bubble Popper</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRestart}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
            title="Ulangi Permainan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onQuit}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
            aria-label="Keluar Permainan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Instruction Badge */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 text-center shadow-xs flex items-center justify-center gap-2">
        <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
        <span className="text-xs text-slate-600 font-bold leading-normal">
          Letuskan balon suku kata berurutan untuk membentuk kata target.
        </span>
      </div>

      {/* Main Game Screen Canvas */}
      <div className="flex-1 flex items-center justify-center my-auto">
        <div
          className={`w-full max-w-[320px] aspect-4/5 bg-slate-100/50 border-2 border-slate-200 rounded-3xl shadow-inner relative overflow-hidden transition-all duration-300 ${isWrongFlash ? 'animate-shake border-rose-300 bg-rose-50/20' : ''
            }`}
        >
          {/* Backdrop Floating Gridlines */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#0f172a_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />

          {/* Target Word Badge (Centered Top) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-slate-200/80 px-6 py-2 rounded-2xl shadow-sm text-center z-20 min-w-[130px]">
            <span className="block text-[8px] font-extrabold text-indigo-500 uppercase tracking-widest leading-none mb-0.5">
              BENTUK KATA
            </span>
            <span className="block text-xl font-black text-slate-800 tracking-wider">
              {currentWord.toUpperCase()}
            </span>
          </div>

          {/* Floating Bubble Balloons */}
          {bubbles.map((bubble) => {
            const gradient = BUBBLE_GRADIENTS[bubble.colorIndex % BUBBLE_GRADIENTS.length];
            return (
              <button
                key={bubble.id}
                onClick={() => onPopBubble(bubble.id)}
                className={`absolute rounded-full border-2 flex items-center justify-center font-black select-none cursor-pointer backdrop-blur-[0.5px] bubble-glow bg-gradient-to-br ${gradient}`}
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: bubble.size > 70 ? '14px' : '12px',
                  letterSpacing: '0.05em',
                }}
              >
                {/* Bubble Text */}
                <span className="drop-shadow-xs uppercase">{bubble.syllable}</span>

                {/* Bubble Highlight Accent (Specular Reflection Effect) */}
                <div className="absolute top-1.5 left-2 w-2.5 h-1 bg-white/60 rounded-full rotate-[-15deg] pointer-events-none" />
                <div className="absolute top-3 left-1.5 w-1 h-1 bg-white/40 rounded-full rotate-[-15deg] pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Syllable Indicators Row */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-center mb-3">
          Suku Kata Terbentuk
        </p>
        <div className="flex justify-center items-center gap-2">
          {currentSyllables.map((syllable, idx) => {
            const isMatched = idx < currentSyllableIndex;
            const isNext = idx === currentSyllableIndex;
            return (
              <div
                key={`${syllable}-${idx}`}
                className={`px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider text-center transition-all duration-300 min-w-[65px] ${isMatched
                    ? 'bg-cyan-50 border-2 border-cyan-300 text-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.12)] scale-105'
                    : isNext
                      ? 'bg-indigo-50/50 border border-indigo-200 border-dashed text-indigo-400 animate-pulse'
                      : 'bg-slate-50 border-slate-200 text-slate-350'
                  }`}
              >
                {syllable}
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Grid Counters */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3.5">
          {/* Total Poin */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col items-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Total Poin
            </span>
            <span className="text-2xl font-black text-indigo-650">{rightCount}</span>
          </div>

          {/* Salah Pencet */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col items-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Salah Pencet
            </span>
            <span className="text-2xl font-black text-rose-500">{wrongCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
