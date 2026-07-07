'use client';

import React, { useEffect } from 'react';
import { LabirinPlayStageProps } from '../../../types';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  Info
} from 'lucide-react';

export default function PlayStage({
  targetLetter,
  rightCount,
  wrongCount,
  mazeGrid,
  playerPosition,
  letterPositions,
  lettersOnMap,
  onMove,
  onRestart,
  onQuit
}: LabirinPlayStageProps) {

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when using arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onMove('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMove]);

  return (
    <div className="flex flex-col justify-between min-h-[85vh] md:min-h-[80vh] space-y-6">
      
      {/* Top Navigation & Title Bar */}
      <div className="flex justify-between items-center pb-1">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">
            Tantangan Spasial
          </span>
          <h1 className="text-base font-black text-slate-800 leading-tight">Labirin Spasial b/d/p/q</h1>
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

      {/* Target Letter Instruction Box */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5 text-center shadow-xs flex items-center justify-center gap-2.5">
        <Info className="w-4 h-4 text-indigo-500 shrink-0" />
        <span className="text-xs text-slate-700 font-bold">
          Cari jalan keluar menuju huruf: <span className="text-sm font-black text-indigo-700 uppercase bg-indigo-100 px-2.5 py-0.5 rounded-lg border border-indigo-200">"{targetLetter}"</span>
        </span>
      </div>

      {/* Labyrinth Grid Container */}
      <div className="flex-1 flex items-center justify-center my-auto">
        <div className="bg-slate-250 border-2 border-slate-350 p-2 rounded-2xl shadow-inner w-full max-w-[300px] aspect-square relative select-none">
          <div className="grid grid-cols-7 grid-rows-7 gap-1 h-full w-full">
            {mazeGrid.map((row, y) =>
              row.map((cell, x) => {
                const isPlayer = playerPosition.x === x && playerPosition.y === y;
                
                // Find if there is a letter at this position
                const letterIndex = letterPositions.findIndex(
                  (pos) => pos.x === x && pos.y === y
                );
                const letter = letterIndex !== -1 ? lettersOnMap[letterIndex] : null;

                // Path vs Wall styling
                const isPath = cell !== 0;

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`relative rounded-md flex items-center justify-center font-bold text-base transition-all duration-100 select-none aspect-square ${
                      isPath
                        ? 'bg-white border border-slate-150'
                        : 'bg-slate-150 border border-slate-200 shadow-xs'
                    }`}
                  >
                    {/* Gridlines helper layout */}
                    <div className="absolute inset-0 opacity-[0.03] border border-slate-900 pointer-events-none" />

                    {/* Letter Display */}
                    {letter && !isPlayer && (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50 border border-indigo-150 text-indigo-650 rounded-md shadow-xs text-lg font-black font-mono lowercase select-none animate-pulse">
                        {letter}
                      </div>
                    )}

                    {/* Cute Mascot Avatar (Player) */}
                    {isPlayer && (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 border border-indigo-700 shadow-md flex flex-col justify-center items-center animate-bounce z-10 select-none">
                        <div className="flex gap-0.5 justify-center items-center">
                          {/* Left Eye */}
                          <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center">
                            <div className="w-0.75 h-0.75 bg-slate-900 rounded-full" />
                          </div>
                          {/* Right Eye */}
                          <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center">
                            <div className="w-0.75 h-0.75 bg-slate-900 rounded-full" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* On-Screen Arrow Controller */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* UP Button */}
          <button
            onClick={() => onMove('up')}
            className="absolute top-0 w-11 h-11 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center shadow-xs text-slate-600 hover:text-slate-800 active:scale-90 transition-transform cursor-pointer"
            aria-label="Gerak Atas"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          {/* LEFT Button */}
          <button
            onClick={() => onMove('left')}
            className="absolute left-0 w-11 h-11 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center shadow-xs text-slate-600 hover:text-slate-800 active:scale-90 transition-transform cursor-pointer"
            aria-label="Gerak Kiri"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Center spacing dot */}
          <div className="w-3 h-3 bg-slate-350 rounded-full" />

          {/* RIGHT Button */}
          <button
            onClick={() => onMove('right')}
            className="absolute right-0 w-11 h-11 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center shadow-xs text-slate-600 hover:text-slate-800 active:scale-90 transition-transform cursor-pointer"
            aria-label="Gerak Kanan"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* DOWN Button */}
          <button
            onClick={() => onMove('down')}
            className="absolute bottom-0 w-11 h-11 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center shadow-xs text-slate-600 hover:text-slate-800 active:scale-90 transition-transform cursor-pointer"
            aria-label="Gerak Bawah"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Counters & Finish Game Button */}
      <div className="space-y-4">
        {/* Score Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Total Points */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col items-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Total Poin
            </span>
            <span className="text-2xl font-black text-indigo-650">{rightCount}</span>
          </div>

          {/* Wrong Gate */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col items-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Salah Gerbang
            </span>
            <span className="text-2xl font-black text-rose-500">{wrongCount}</span>
          </div>
        </div>
      </div>

      {/* Navigation Instruction Footer */}
      <footer className="text-center text-[9px] text-slate-400">
        <p>Gunakan tombol panah di layar atau tombol keyboard WASD/Arah untuk bergerak.</p>
      </footer>
    </div>
  );
}
