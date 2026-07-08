import React from 'react';
import { Star, Lock, Check } from 'lucide-react';

export interface PathNode {
  id: string;
  label: string;
  status: 'locked' | 'unlocked' | 'completed';
}

interface LearningPathProps {
  nodes: PathNode[];
  activeNodeId: string;
  onNodeClick: (node: PathNode) => void;
}

/**
 * Peta level linear berbentuk ular/ular tangga (Duolingo-style tree).
 * Menggunakan class margin/translasi horizontal dinamis sesuai modulo indeks node untuk menyusun alur berkelok.
 */
export const LearningPath: React.FC<LearningPathProps> = ({ nodes, activeNodeId, onNodeClick }) => {
  return (
    <div className="flex flex-col items-center gap-8 py-10 w-full max-w-xs mx-auto select-none">
      {nodes.map((node, index) => {
        // Hitung pergeseran posisi horizontal (kiri, tengah, kanan)
        const positionOffset = index % 4 === 0 
          ? 'translate-x-0' 
          : index % 4 === 1 
            ? 'translate-x-6' 
            : index % 4 === 2 
              ? 'translate-x-0' 
              : '-translate-x-6';

        const statusStyles = {
          completed: "bg-emerald-500 border-emerald-600 text-white shadow-[0_4px_12px_rgba(16,185,129,0.35)]",
          unlocked: "bg-indigo-500 border-indigo-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.35)] animate-pulse",
          locked: "bg-slate-200 border-slate-300 text-slate-400 shadow-none cursor-not-allowed"
        };

        const isActive = node.id === activeNodeId;

        return (
          <div key={node.id} className={`relative flex flex-col items-center ${positionOffset} transition-all duration-300`}>
            {isActive && (
              <div className="absolute -top-7 bg-indigo-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-md animate-bounce z-10">
                Mulai!
              </div>
            )}
            
            <button
              onClick={() => node.status !== 'locked' && onNodeClick(node)}
              className={`w-16 h-16 rounded-full border-b-6 flex items-center justify-center transition-all duration-100 ${
                statusStyles[node.status]
              } ${
                node.status !== 'locked' 
                  ? 'cursor-pointer hover:scale-105 active:border-b-0 active:translate-y-[6px]' 
                  : 'pointer-events-none opacity-60'
              } shadow-md`}
            >
              {node.status === 'completed' && <Check className="w-7 h-7 stroke-[3px]" />}
              {node.status === 'unlocked' && <Star className="w-7 h-7 fill-white stroke-[2px]" />}
              {node.status === 'locked' && <Lock className="w-5 h-5 opacity-70" />}
            </button>
            
            <span className="text-[10px] font-extrabold text-slate-500 mt-2 uppercase tracking-wide text-center max-w-[120px] leading-tight">
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default LearningPath;
