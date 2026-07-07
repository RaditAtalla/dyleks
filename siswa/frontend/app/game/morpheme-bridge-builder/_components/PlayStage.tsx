'use client';

import React from 'react';
import { MorphemeBridgePlayStageProps, MorphemeBridgeTile } from '../../../types';
import { X, RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function PlayStage({
  target,
  correctPieces,
  tilePool,
  selectedTiles,
  rightCount,
  wrongCount,
  isWrongFlash,
  isCorrectFlash,
  onTileClick,
  onRestart,
  onQuit,
}: MorphemeBridgePlayStageProps) {
  const totalSlots = correctPieces.length;

  return (
    <div className="flex flex-col min-h-[85vh] space-y-4">
      {/* Inline animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        @keyframes pop-in {
          0% { transform: scale(0.7); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes correct-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
          50% { box-shadow: 0 0 0 8px rgba(34,197,94,0.15); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-pop-in { animation: pop-in 0.2s ease-out forwards; }
        .animate-correct-pulse { animation: correct-pulse 0.6s ease-in-out; }
      `}</style>

      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest">
            Morfologi Kata (Morpheme Structure)
          </span>
          <h1 className="text-base font-black text-slate-800 leading-tight">Morpheme Bridge</h1>
        </div>
        <div className="flex items-center gap-1">
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

      {/* ── Instruction Badge ── */}
      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-3 flex items-start gap-2 shadow-xs">
        <HelpCircle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
        <span className="text-xs text-slate-600 font-medium leading-normal">
          Klik potongan kata di bawah untuk menyusun jembatan kata dasar dan imbuhannya.
        </span>
      </div>

      {/* ── Main Game Card ── */}
      <div
        className={`bg-white border-2 rounded-3xl p-5 shadow-xs space-y-5 transition-all duration-200
          ${isWrongFlash ? 'animate-shake border-rose-300 bg-rose-50/30' : ''}
          ${isCorrectFlash ? 'animate-correct-pulse border-emerald-300' : 'border-slate-100'}
        `}
      >
        {/* Target Word */}
        <div className="text-center space-y-1">
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
            Target Jembatan
          </p>
          <div className="inline-block bg-slate-900 text-white font-black text-2xl tracking-widest px-6 py-2.5 rounded-2xl shadow-md">
            {target.toUpperCase()}
          </div>
        </div>

        {/* Bridge Slots */}
        <div className="space-y-2">
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-center">
            Jembatan Kata
          </p>
          <div
            className={`min-h-[52px] w-full rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 px-3 py-2 transition-colors duration-200
              ${selectedTiles.length === 0 ? 'border-slate-200 bg-slate-50' : 'border-violet-200 bg-violet-50/40'}
            `}
          >
            {selectedTiles.length === 0 ? (
              <span className="text-xs text-slate-400 font-medium italic">
                Ketuk kepingan di bawah untuk mengisi jembatan
              </span>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedTiles.map((tile, idx) => {
                  const isLastSlot = idx === selectedTiles.length - 1;
                  return (
                    <div
                      key={tile.id}
                      className={`px-3.5 py-2 rounded-xl font-black text-sm uppercase tracking-wide
                        ${isCorrectFlash
                          ? 'bg-emerald-500 text-white border border-emerald-400'
                          : 'bg-violet-600 text-white border border-violet-500'
                        }
                        ${isLastSlot ? 'animate-pop-in' : ''}
                        shadow-sm
                      `}
                    >
                      {tile.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bridge progress indicators (slot dots) */}
          <div className="flex justify-center gap-1.5 pt-1">
            {Array.from({ length: totalSlots }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300
                  ${idx < selectedTiles.length
                    ? isCorrectFlash
                      ? 'bg-emerald-400 w-5'
                      : 'bg-violet-500 w-5'
                    : 'bg-slate-200 w-3'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Tile Pool */}
        <div className="space-y-2">
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-center">
            Pilihan Kepingan
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {tilePool.map((tile) => (
              <TileButton key={tile.id} tile={tile} onTileClick={onTileClick} />
            ))}
            {tilePool.length === 0 && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold py-2">
                <CheckCircle2 className="w-4 h-4" />
                Semua kepingan sudah dipakai!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Score Row ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col items-center">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
            Total Poin
          </span>
          <span className="text-2xl font-black text-violet-600">{rightCount}</span>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col items-center">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
            Salah Hubung
          </span>
          <span className="text-2xl font-black text-rose-500">{wrongCount}</span>
        </div>
      </div>
    </div>
  );
}

// Separate tile button to avoid re-renders of the whole pool
function TileButton({
  tile,
  onTileClick,
}: {
  tile: MorphemeBridgeTile;
  onTileClick: (tile: MorphemeBridgeTile) => void;
}) {
  return (
    <button
      id={`tile-btn-${tile.id}`}
      onClick={() => onTileClick(tile)}
      className={`
        px-4 py-2.5 rounded-xl border-2 font-black text-sm uppercase tracking-wide
        transition-all duration-150 cursor-pointer select-none
        active:scale-95 hover:scale-105
        ${tile.isDistractor
          ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-slate-600 shadow-md'
          : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-slate-600 shadow-md'
        }
      `}
    >
      {tile.label}
    </button>
  );
}
