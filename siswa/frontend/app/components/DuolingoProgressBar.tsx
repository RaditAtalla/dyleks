import React from 'react';

interface DuolingoProgressBarProps {
  current: number;
  total: number;
}

/**
 * Progress bar linear minimalis dengan highlight gloss/shine efek.
 * Memberikan visualisasi seberapa dekat siswa dengan akhir sesi pembelajaran.
 */
export const DuolingoProgressBar: React.FC<DuolingoProgressBarProps> = ({ current, total }) => {
  const progressPercent = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full flex items-center gap-3">
      <div className="h-4 flex-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
        <div 
          className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out relative shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Efek kilatan cahaya (highlight gloss) */}
          <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
      <span className="text-xs font-bold text-slate-500 select-none">
        {current}/{total}
      </span>
    </div>
  );
};

export default DuolingoProgressBar;
