import React from 'react';
import { Check } from 'lucide-react';

interface StreakModalProps {
  isOpen: boolean;
  streakCount: number;
  onClose: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  streakCount,
  onClose,
}) => {
  if (!isOpen) return null;

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const todayIndex = new Date().getDay(); // 0: Sunday, 1: Monday, ...

  return (
    <div className="fixed inset-0 bg-[#131f24] z-50 flex flex-col justify-between p-6 text-white font-sans">
      <title>Streak Harian! - DyLeks</title>
      
      {/* Spacer Top */}
      <div />

      {/* Main Content Area */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm w-full mx-auto">
        {/* Glow Fire Icon */}
        <div className="relative animate-pulse">
          <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
          <img 
            src="/mascot/fire.svg" 
            className="w-32 h-32 relative z-10 drop-shadow-[0_10px_15px_rgba(249,115,22,0.4)]" 
            alt="Streak Fire" 
          />
        </div>

        {/* Giant Count */}
        <div className="space-y-1">
          <h1 className="text-7xl font-black text-[#ff9600] tracking-tight animate-bounce">
            {streakCount}
          </h1>
          <p className="text-xl font-extrabold uppercase tracking-widest text-[#ff9600]">
            Hari Beruntun!
          </p>
        </div>

        {/* Calendar Card */}
        <div className="bg-[#1f2e35] border border-slate-700/50 rounded-3xl p-5 w-full space-y-4 shadow-xl">
          <div className="flex justify-between items-center px-1">
            {daysOfWeek.map((day, idx) => {
              // Active days: all days in current week up to today
              const isActive = idx <= todayIndex;
              const isToday = idx === todayIndex;

              return (
                <div key={day} className="flex flex-col items-center space-y-2">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${
                    isToday ? 'text-[#ff9600]' : 'text-slate-400'
                  }`}>
                    {day}
                  </span>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    isToday
                      ? 'border-[#ff9600] bg-[#ff9600] text-white shadow-[0_0_8px_rgba(255,150,0,0.5)]'
                      : isActive
                        ? 'border-[#ff9600] bg-[#ff9600] text-white'
                        : 'border-slate-650 border-[#2d3a41] bg-[#1a262c]'
                  }`}>
                    {isActive ? (
                      <Check className="w-4 h-4 stroke-[3px]" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700/50" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-700/30 pt-3 text-left">
            <p className="text-xs text-slate-350 leading-relaxed font-semibold text-center">
              Luar biasa! Kamu terus berlatih secara konsisten untuk mempertajam kemampuan belajarmu.
            </p>
          </div>
        </div>
      </div>

      {/* Button Footer Area */}
      <div className="max-w-sm w-full mx-auto mb-4">
        <button
          onClick={onClose}
          className="w-full py-4 bg-[#00a2f9] hover:bg-[#33b5ff] text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-100 shadow-md border-b-6 border-[#007cb5] active:border-b-0 active:translate-y-[6px]"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
};

export default StreakModal;
