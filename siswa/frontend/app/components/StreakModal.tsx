import React from 'react';
import { Check } from 'lucide-react';

interface StreakModalProps {
  isOpen: boolean;
  streakCount: number;
  lastActiveDate: string | null;
  onClose: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  streakCount,
  lastActiveDate,
  onClose,
}) => {
  if (!isOpen) return null;

  const daysOfWeekNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  
  const today = new Date();
  const todayDateString = today.toDateString();
  const todayIndex = today.getDay();

  interface DisplayDay {
    name: string;
    dateString: string;
    isActive: boolean;
    isToday: boolean;
  }

  const displayDays: DisplayDay[] = [];

  if (streakCount === 0) {
    // Jika streak 0, hanya tampilkan hari ini sebagai target tidak aktif
    displayDays.push({
      name: daysOfWeekNames[todayIndex],
      dateString: todayDateString,
      isActive: false,
      isToday: true,
    });
  } else {
    const lastActive = lastActiveDate ? new Date(lastActiveDate) : new Date();
    
    // Cari kapan streak dimulai: lastActive - (streakCount - 1) hari
    const startDate = new Date(lastActive);
    startDate.setDate(startDate.getDate() - (streakCount - 1));
    
    // Tentukan batas akhir tampilan:
    // Jika aktivitas terakhir adalah kemarin, kita ingin tetap menampilkan hari ini sebagai target pending
    const endDate = new Date(today);
    
    // Iterasi untuk membuat rentang hari dari startDate ke endDate
    const tempDate = new Date(startDate);
    const maxDays = Math.max(7, streakCount + 2); // Batas aman loop
    let count = 0;
    
    while (tempDate <= endDate && count < maxDays) {
      const tempDateString = tempDate.toDateString();
      const tempDateObj = new Date(tempDate);
      
      const isActive = tempDateObj >= startDate && tempDateObj <= lastActive;
      const isToday = tempDateString === todayDateString;
      
      displayDays.push({
        name: daysOfWeekNames[tempDate.getDay()],
        dateString: tempDateString,
        isActive,
        isToday,
      });
      
      tempDate.setDate(tempDate.getDate() + 1);
      count++;
    }

    if (displayDays.length === 0) {
      displayDays.push({
        name: daysOfWeekNames[todayIndex],
        dateString: todayDateString,
        isActive: true,
        isToday: true,
      });
    }
  }

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
          <div className="flex justify-center gap-4 flex-wrap items-center px-1">
            {displayDays.map((day) => {
              return (
                <div key={day.dateString} className="flex flex-col items-center space-y-2">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${
                    day.isToday ? 'text-[#ff9600]' : 'text-slate-400'
                  }`}>
                    {day.name}
                  </span>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    day.isActive
                      ? day.isToday
                        ? 'border-[#ff9600] bg-[#ff9600] text-white shadow-[0_0_8px_rgba(255,150,0,0.5)]'
                        : 'border-[#ff9600] bg-[#ff9600] text-white'
                      : day.isToday
                        ? 'border-[#ff9600] border-dashed bg-[#1a262c] text-[#ff9600]'
                        : 'border-[#2d3a41] bg-[#1a262c]'
                  }`}>
                    {day.isActive ? (
                      <Check className="w-4 h-4 stroke-[3px]" />
                    ) : (
                      <div className={`w-2.5 h-2.5 rounded-full ${day.isToday ? 'bg-[#ff9600]/40' : 'bg-slate-700/50'}`} />
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
