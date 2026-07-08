'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentAuth } from '../hooks/useStudentAuth';
import { useGamification } from '../hooks/useGamification';
import { 
  ArrowLeft, Lock, Check, Award, Play, 
  BookOpen, Layers, Edit, Mic, Compass, CircleDot, Shield
} from 'lucide-react';
import InteractiveMascot from '../components/Maskot/InteractiveMascot';
import Button3D from '../components/Button3D';

interface PathNode {
  level: number;
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  iconBg: string;
  translateClass: string;
  gameId: string;
}

const PATH_NODES: PathNode[] = [
  {
    level: 1,
    id: 'latihan-bertahap',
    title: 'Latihan Bertahap',
    description: 'Mengenal suara vokal tunggal dasar.',
    icon: BookOpen,
    color: 'border-indigo-400 bg-indigo-50 text-indigo-700',
    iconBg: 'bg-indigo-100 text-indigo-650',
    translateClass: '-translate-x-12',
    gameId: 'latihan-bertahap'
  },
  {
    level: 2,
    id: 'petualangan-huruf',
    title: 'Petualangan Huruf',
    description: 'Mencocokkan suku kata tunggal dasar.',
    icon: Layers,
    color: 'border-emerald-400 bg-emerald-50 text-emerald-750',
    iconBg: 'bg-emerald-100 text-emerald-700',
    translateClass: '-translate-x-4',
    gameId: 'petualangan-huruf'
  },
  {
    level: 3,
    id: 'tracer-kinestik',
    title: 'Tracer Kinestik',
    description: 'Latihan menjiplak suku kata kompleks.',
    icon: Edit,
    color: 'border-amber-400 bg-amber-50 text-amber-700',
    iconBg: 'bg-amber-100 text-amber-600',
    translateClass: 'translate-x-4',
    gameId: 'tracer-kinestik'
  },
  {
    level: 4,
    id: 'latihan-bicara-ai',
    title: 'Bicara AI',
    description: 'Latihan vokal digraf & diftong dengan AI.',
    icon: Mic,
    color: 'border-rose-400 bg-rose-50 text-rose-700',
    iconBg: 'bg-rose-100 text-rose-600',
    translateClass: 'translate-x-12',
    gameId: 'latihan-bicara-ai'
  },
  {
    level: 5,
    id: 'labirin-spasial',
    title: 'Labirin Spasial',
    description: 'Orientasi kata dasar kiri dan kanan.',
    icon: Compass,
    color: 'border-cyan-400 bg-cyan-50 text-cyan-700',
    iconBg: 'bg-cyan-100 text-cyan-600',
    translateClass: 'translate-x-4',
    gameId: 'labirin-spasial'
  },
  {
    level: 6,
    id: 'letuskan-balon',
    title: 'Letuskan Balon',
    description: 'Latihan motorik merangkai suku kata.',
    icon: CircleDot,
    color: 'border-purple-400 bg-purple-50 text-purple-700',
    iconBg: 'bg-purple-100 text-purple-650',
    translateClass: '-translate-x-4',
    gameId: 'letuskan-balon'
  },
  {
    level: 7,
    id: 'sight-word-shield',
    title: 'Word Shield',
    description: 'Membedakan ejaan kata dasar mirip.',
    icon: Shield,
    color: 'border-teal-400 bg-teal-50 text-teal-750',
    iconBg: 'bg-teal-100 text-teal-700',
    translateClass: '-translate-x-12',
    gameId: 'sight-word-shield'
  },
  {
    level: 8,
    id: 'morpheme-bridge-builder',
    title: 'Bridge Builder',
    description: 'Morfologi kata dan jembatan suku kata.',
    icon: Layers,
    color: 'border-blue-400 bg-blue-50 text-blue-700',
    iconBg: 'bg-blue-100 text-blue-600',
    translateClass: '-translate-x-4',
    gameId: 'morpheme-bridge-builder'
  }
];

function LearningPathContent() {
  const { student, loading, requireAuth, submitPlacement, refreshStudent } = useStudentAuth();
  const router = useRouter();
  
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [isActivating, setIsActivating] = useState(false);

  const handleActivateLevel = async (level: number) => {
    if (!student) return;
    setIsActivating(true);
    try {
      localStorage.setItem(`dyleks_selected_level_${student.id}`, String(level));
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan.');
    } finally {
      setIsActivating(false);
    }
  };

  // Enforce auth
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  // Set active node on mount
  useEffect(() => {
    if (student) {
      const activeNode = PATH_NODES.find(n => n.level === student.currentLevel);
      if (activeNode) {
        setSelectedNode(activeNode);
      }
    }
  }, [student]);

  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat peta belajar...</p>
        </div>
      </div>
    );
  }

  const currentLevel = student.currentLevel || 1;
  const currentXP = student.xp || 0;

  // Custom keyframe animation style
  const styleTag = (
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .animate-float {
        animation: float 2.5s ease-in-out infinite;
      }
    `}</style>
  );

  return (
    <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-start relative">
      <title>Peta Belajar - DyLeks Siswa</title>
      {styleTag}

      {/* Sticky top header bar */}
      <header className="sticky top-0 bg-[#FAF6EE]/95 border-b border-slate-200/60 py-3.5 px-4 z-40 backdrop-blur-xs flex items-center justify-between">
        <div className="max-w-md w-full mx-auto flex items-center gap-3">
          <button 
            onClick={() => router.push('/')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-500 hover:text-slate-700"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-left">
            <span className="text-[9px] font-extrabold text-indigo-500 uppercase tracking-widest block">Metode Lintasan</span>
            <h1 className="text-sm font-black text-slate-800 leading-tight">Peta Belajar</h1>
          </div>
        </div>
      </header>

      {/* Main Map Content Area */}
      <main className="max-w-md w-full mx-auto px-4 py-8 flex flex-col items-center relative flex-1 pb-44">
        
        {/* Connection Winding Path Line in background */}
        <div className="absolute top-16 bottom-32 w-1.5 bg-slate-200/80 rounded-full -z-10" />

        {/* Nodes map */}
        <div className="flex flex-col gap-10 items-center w-full relative">
          {PATH_NODES.map((node) => {
            const isCompleted = node.level < currentLevel;
            const isActive = node.level === currentLevel;
            const isLocked = node.level > currentLevel;

            // Circular progress calculation
            const radius = 38;
            const strokeWidth = 4.5;
            const normalizedRadius = radius - strokeWidth / 2;
            const circumference = normalizedRadius * 2 * Math.PI;
            
            let percent = 0;
            if (isCompleted) percent = 100;
            else if (isActive) percent = currentXP;

            const strokeDashoffset = circumference - (percent / 100) * circumference;

            const IconComponent = node.icon;
            const isChosen = selectedNode?.level === node.level;

            return (
              <div 
                key={node.level} 
                className={`relative flex items-center justify-center w-full transition-all duration-300 ${node.translateClass}`}
              >
                {/* Active mascot badge floating next to current level */}
                {isActive && (
                  <div className="absolute -left-20 top-2 z-20 animate-float pointer-events-none hidden sm:block">
                    <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-md flex items-center gap-1.5 min-w-[100px]">
                      <InteractiveMascot mood="happy" width={32} height={32} />
                      <div className="leading-tight text-left">
                        <span className="text-[7px] font-black text-indigo-500 uppercase tracking-wider block">Belajar</span>
                        <span className="text-[9px] font-bold text-slate-700">Tingkat {node.level}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Node button wrapping container */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  
                  {/* Circular progress ring SVG overlay */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none z-10">
                    {/* Background grey ring */}
                    <circle
                      stroke="rgba(226, 232, 240, 0.9)"
                      fill="transparent"
                      strokeWidth={strokeWidth}
                      r={normalizedRadius}
                      cx={radius + 10} // center within w-24 (which is 96px) -> 48px
                      cy={radius + 10}
                    />
                    {/* Active progress colored ring */}
                    <circle
                      stroke={isCompleted ? '#10B981' : isActive ? '#6366F1' : 'transparent'}
                      fill="transparent"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference + ' ' + circumference}
                      style={{ strokeDashoffset }}
                      strokeLinecap="round"
                      r={normalizedRadius}
                      cx={radius + 10}
                      cy={radius + 10}
                    />
                  </svg>

                  {/* Circular 3D Button Node */}
                  <button
                    onClick={() => {
                      if (!isLocked) {
                        setSelectedNode(node);
                      }
                    }}
                    className={`w-16 h-16 rounded-full border-2 border-b-6 flex items-center justify-center transition-all duration-100 cursor-pointer shadow-sm relative z-20
                      active:border-b-2 active:translate-y-[4px] active:shadow-none
                      ${isCompleted 
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                        : isActive 
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-650 hover:bg-indigo-100 animate-pulse' 
                          : 'border-slate-300 bg-slate-100 text-slate-400 hover:bg-slate-200 pointer-events-none'
                      }
                      ${isChosen ? 'ring-4 ring-indigo-200' : ''}
                    `}
                  >
                    {isLocked ? (
                      <Lock className="w-5 h-5" />
                    ) : isCompleted ? (
                      <Check className="w-6 h-6 stroke-[3]" />
                    ) : (
                      <span className="text-lg font-black">{node.level}</span>
                    )}
                  </button>

                  {/* 100% small tag badge */}
                  {isCompleted && (
                    <span className="absolute bottom-2.5 right-2 bg-emerald-500 text-white font-black text-[7px] uppercase px-1 py-0.5 rounded-md border border-emerald-600 tracking-wider shadow-xs leading-none z-30 select-none">
                      100%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Level Details Panel Card (Fixed at the bottom of viewport) */}
        {selectedNode && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200/80 shadow-2xl z-40 rounded-t-3xl animate-slide-up max-w-md w-full mx-auto">
            <div className="space-y-4">
              
              {/* Node metadata info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border-2 border-b-4 shrink-0 ${selectedNode.iconBg}`}>
                    <selectedNode.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className="text-[8px] font-extrabold text-indigo-500 uppercase tracking-widest block">
                      Tingkat {selectedNode.level}
                    </span>
                    <h3 className="text-sm font-black text-slate-800 leading-tight">
                      {selectedNode.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                      {selectedNode.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">Progres</span>
                  <span className="text-xs font-black text-slate-700">
                    {selectedNode.level < currentLevel ? '100% Selesai' : `${currentXP}%`}
                  </span>
                </div>
              </div>

              {/* Linear mini progress bar for detail */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-150">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${selectedNode.level < currentLevel ? 100 : currentXP}%` }}
                />
              </div>

              {/* Start Game Action Button */}
              <Button3D
                variant="primary"
                disabled={isActivating}
                onClick={() => handleActivateLevel(selectedNode.level)}
                className="w-full py-4 text-xs tracking-wide flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isActivating ? 'Mengaktifkan...' : `PILIH TINGKAT ${selectedNode.level}`}</span>
              </Button3D>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function LearningPath() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat peta belajar...</p>
        </div>
      </div>
    }>
      <LearningPathContent />
    </Suspense>
  );
}
