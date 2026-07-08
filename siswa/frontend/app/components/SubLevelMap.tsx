'use client';

import React, { useState } from 'react';
import { X, Lock, Check, Play } from 'lucide-react';
import Button3D from './Button3D';
import InteractiveMascot from './Maskot/InteractiveMascot';

interface SubLevelMapProps {
  studentName: string;
  gameName: string;
  gameCategory: string;
  currentLevel: number;
  getLevelName: (level: number) => string;
  stageProgress: Record<number, number>;
  onStartStage: (stageNum: number) => void;
  onBackToHome: () => void;
  mascotMood?: 'happy' | 'sad' | 'neutral' | 'cheering';
}

const SUB_LEVEL_NODES = [
  { stageNum: 1, title: 'Tahap 1', translateClass: 'translate-x-0' },
  { stageNum: 2, title: 'Tahap 2', translateClass: 'translate-x-10' },
  { stageNum: 3, title: 'Tahap 3', translateClass: 'translate-x-0' },
  { stageNum: 4, title: 'Tahap 4', translateClass: '-translate-x-10' },
  { stageNum: 5, title: 'Tahap 5', translateClass: 'translate-x-0' },
];

/**
 * Reusable 5-stage winding snake sub-level path map component.
 * Used by all DyLeks games to standardize the level progression experience.
 * 
 * Why: Prevents code duplication across 6+ game pages. Each game only needs
 * to provide callbacks and progress state; rendering is handled here.
 */
export default function SubLevelMap({
  studentName,
  gameName,
  gameCategory,
  currentLevel,
  getLevelName,
  stageProgress,
  onStartStage,
  onBackToHome,
  mascotMood = 'happy',
}: SubLevelMapProps) {
  const [selectedStageNum, setSelectedStageNum] = useState<number | null>(null);

  const radius = 34;
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div className="flex-1 flex flex-col justify-between py-4 min-h-[85vh] relative pb-44">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
        <div className="text-left">
          <span className="text-[9px] font-extrabold text-indigo-500 uppercase tracking-widest block">{gameCategory} · Tingkat {currentLevel}</span>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide leading-tight">
            {getLevelName(currentLevel)}
          </h2>
        </div>
        <button
          onClick={onBackToHome}
          className="p-2 hover:bg-white rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600 border border-slate-200/50"
          aria-label="Kembali ke Beranda"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mascot intro card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-4 mt-4 shadow-xs flex items-center gap-3">
        <div className="shrink-0">
          <InteractiveMascot mood={mascotMood} width={48} height={48} />
        </div>
        <div className="text-left leading-tight">
          <h3 className="text-xs font-black text-slate-800">Halo, {studentName}!</h3>
          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">
            Selesaikan ke-5 tahap <strong>{gameName}</strong> untuk menaklukkan tingkat ini!
          </p>
        </div>
      </div>

      {/* Snake Path Nodes */}
      <div className="flex-1 flex flex-col items-center justify-center py-10 relative">
        <div className="absolute top-10 bottom-10 w-1 bg-slate-200/80 rounded-full" />

        <div className="flex flex-col gap-9 items-center w-full relative z-10">
          {SUB_LEVEL_NODES.map((node) => {
            const progress = stageProgress[node.stageNum] ?? (node.stageNum === 1 ? 0 : -1);
            const isCompleted = progress === 100;
            const isLocked = progress === -1;
            const isActive = !isCompleted && !isLocked;
            const isChosen = selectedStageNum === node.stageNum;

            const strokeDashoffset = circumference - (isCompleted ? 1 : 0) * circumference;

            return (
              <div
                key={node.stageNum}
                className={`relative flex items-center justify-center w-full transition-all duration-300 ${node.translateClass}`}
              >
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                    <circle stroke="rgba(226,232,240,0.8)" fill="transparent" strokeWidth={strokeWidth} r={normalizedRadius} cx={radius + 6} cy={radius + 6} />
                    <circle
                      stroke={isCompleted ? '#10B981' : isActive ? '#6366F1' : 'transparent'}
                      fill="transparent"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${circumference} ${circumference}`}
                      style={{ strokeDashoffset }}
                      strokeLinecap="round"
                      r={normalizedRadius}
                      cx={radius + 6}
                      cy={radius + 6}
                    />
                  </svg>

                  <button
                    onClick={() => { if (!isLocked) setSelectedStageNum(node.stageNum); }}
                    className={`w-14 h-14 rounded-full border-2 border-b-6 flex items-center justify-center transition-all duration-100 shadow-xs relative
                      active:border-b-2 active:translate-y-[4px] active:shadow-none
                      ${isCompleted ? 'border-emerald-400 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer'
                        : isActive ? 'border-indigo-400 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 animate-pulse cursor-pointer'
                        : 'border-slate-300 bg-slate-100 text-slate-400 pointer-events-none'}
                      ${isChosen ? 'ring-4 ring-indigo-200' : ''}
                    `}
                  >
                    {isLocked ? <Lock className="w-4 h-4" />
                      : isCompleted ? <Check className="w-5 h-5 stroke-[3]" />
                      : <span className="text-sm font-black">{node.stageNum}</span>
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom action panel */}
      {selectedStageNum !== null && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200/80 shadow-xl z-40 rounded-t-3xl max-w-md w-full mx-auto animate-slide-up">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl">
                <Play className="w-5 h-5 fill-indigo-500" />
              </div>
              <div className="leading-tight">
                <span className="text-[8px] font-extrabold text-indigo-500 uppercase tracking-widest block">
                  Tingkat {currentLevel} · {gameName}
                </span>
                <h3 className="text-sm font-black text-slate-800">Tahap {selectedStageNum}</h3>
              </div>
            </div>

            <Button3D
              variant="primary"
              onClick={() => onStartStage(selectedStageNum)}
              className="w-full py-4 text-xs tracking-wide flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>MULAI TAHAP {selectedStageNum}</span>
            </Button3D>
          </div>
        </div>
      )}
    </div>
  );
}
