'use client';

import React, { useState } from 'react';
import { X, Lock, Check, Play, BookOpen, Star, HelpCircle } from 'lucide-react';
import { LandingStageProps } from '../../../types';
import Button3D from '../../../components/Button3D';
import InteractiveMascot from '../../../components/Maskot/InteractiveMascot';

interface SubLevelNode {
  stageNum: number;
  title: string;
  description: string;
  translateClass: string;
}

const SUB_LEVELS: SubLevelNode[] = [
  {
    stageNum: 1,
    title: 'Tahap 1: Pengenalan Bunyi',
    description: 'Latihan kepekaan fonik huruf vokal.',
    translateClass: 'translate-x-0'
  },
  {
    stageNum: 2,
    title: 'Tahap 2: Gabung Fonem',
    description: 'Menghubungkan dua huruf vokal.',
    translateClass: 'translate-x-10'
  },
  {
    stageNum: 3,
    title: 'Tahap 3: Ejaan Dasar',
    description: 'Mencocokkan suara dengan tulisan visual.',
    translateClass: 'translate-x-0'
  },
  {
    stageNum: 4,
    title: 'Tahap 4: Menulis Huruf',
    description: 'Tracing bentuk huruf vokal.',
    translateClass: '-translate-x-10'
  },
  {
    stageNum: 5,
    title: 'Tahap 5: Tantangan Akhir',
    description: 'Evaluasi total pengenalan vokal.',
    translateClass: 'translate-x-0'
  }
];

export default function LandingStage({
  studentName,
  currentLevel,
  stageProgress,
  onStartStage,
  onBackToHome
}: LandingStageProps) {
  const [selectedStage, setSelectedStage] = useState<SubLevelNode | null>(null);

  // Get level metadata
  const getLevelName = (lvl: number) => {
    switch (lvl) {
      case 1: return 'Vokal Tunggal';
      case 2: return 'Suku Kata Tunggal';
      case 3: return 'Suku Kata Kompleks';
      case 4: return 'Digraf & Diftong';
      case 5: return 'Kata Dasar';
      case 6: return 'Suku Kata Blending';
      case 7: return 'Diskriminasi Visual';
      case 8: return 'Morfologi Kata';
      default: return 'Kemampuan Dasar';
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-4 min-h-[85vh] relative pb-44">
      {/* Header status bar with Exit */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
        <div className="text-left">
          <span className="text-[9px] font-extrabold text-indigo-500 uppercase tracking-widest block">Tingkat {currentLevel}</span>
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

      <div className="bg-white border border-slate-200/60 rounded-3xl p-4 mt-4 shadow-xs flex items-center gap-3">
        <div className="shrink-0">
          <InteractiveMascot mood="happy" width={48} height={48} />
        </div>
        <div className="text-left leading-tight">
          <h3 className="text-xs font-black text-slate-800">Halo, {studentName}!</h3>
          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">
            Selesaikan ke-5 tahap di bawah ini untuk menguasai tingkat ini!
          </p>
        </div>
      </div>

      {/* 5-Stage Winding Snake Level Path */}
      <div className="flex-1 flex flex-col items-center justify-center py-10 relative">
        {/* Background connector line */}
        <div className="absolute top-10 bottom-10 w-1 bg-slate-200/80 rounded-full" />

        <div className="flex flex-col gap-9 items-center w-full relative z-10">
          {SUB_LEVELS.map((node) => {
            const progress = stageProgress[node.stageNum] ?? (node.stageNum === 1 ? 0 : -1);
            const isCompleted = progress === 100;
            const isLocked = progress === -1;
            const isActive = !isCompleted && !isLocked;

            // Circular progress ring parameters
            const radius = 34;
            const strokeWidth = 4;
            const normalizedRadius = radius - strokeWidth / 2;
            const circumference = normalizedRadius * 2 * Math.PI;
            const pct = isCompleted ? 100 : isActive ? 0 : 0;
            const strokeDashoffset = circumference - (pct / 100) * circumference;

            const isChosen = selectedStage?.stageNum === node.stageNum;

            return (
              <div 
                key={node.stageNum} 
                className={`relative flex items-center justify-center w-full transition-all duration-300 ${node.translateClass}`}
              >
                <div className="relative w-20 h-20 flex items-center justify-center">
                  
                  {/* Progress ring SVG */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                    <circle
                      stroke="rgba(226, 232, 240, 0.8)"
                      fill="transparent"
                      strokeWidth={strokeWidth}
                      r={normalizedRadius}
                      cx={radius + 6}
                      cy={radius + 6}
                    />
                    <circle
                      stroke={isCompleted ? '#10B981' : isActive ? '#6366F1' : 'transparent'}
                      fill="transparent"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference + ' ' + circumference}
                      style={{ strokeDashoffset }}
                      strokeLinecap="round"
                      r={normalizedRadius}
                      cx={radius + 6}
                      cy={radius + 6}
                    />
                  </svg>

                  {/* Circle 3D Button */}
                  <button
                    onClick={() => {
                      if (!isLocked) {
                        setSelectedStage(node);
                      }
                    }}
                    className={`w-14 h-14 rounded-full border-2 border-b-6 flex items-center justify-center transition-all duration-100 cursor-pointer shadow-xs relative
                      active:border-b-2 active:translate-y-[4px] active:shadow-none
                      ${isCompleted
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : isActive
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-650 hover:bg-indigo-100 animate-pulse'
                          : 'border-slate-350 bg-slate-100 text-slate-400 pointer-events-none'
                      }
                      ${isChosen ? 'ring-4 ring-indigo-200' : ''}
                    `}
                  >
                    {isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : isCompleted ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <span className="text-sm font-black">{node.stageNum}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Info Panel (shows details of selected stage) */}
      {selectedStage && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200/80 shadow-xl z-40 rounded-t-3xl max-w-md w-full mx-auto animate-slide-up">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-2xl">
                <Star className="w-5 h-5 fill-indigo-500" />
              </div>
              <div className="leading-tight">
                <span className="text-[8px] font-extrabold text-indigo-500 uppercase tracking-widest block">Tingkat {currentLevel}</span>
                <h3 className="text-sm font-black text-slate-800">{selectedStage.title}</h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{selectedStage.description}</p>
              </div>
            </div>

            <Button3D
              variant="primary"
              onClick={() => onStartStage(selectedStage.stageNum)}
              className="w-full py-4 text-xs tracking-wide flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>MULAI TAHAP {selectedStage.stageNum}</span>
            </Button3D>
          </div>
        </div>
      )}

    </div>
  );
}
