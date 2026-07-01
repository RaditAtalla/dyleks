'use client';

import { useEffect } from 'react';
import { useStudentAuth } from './hooks/useStudentAuth';
import { 
  User, 
  School, 
  Sparkles, 
  Trophy, 
  ChevronRight,
  BookOpen,
  Compass,
  Activity,
  Mic
} from 'lucide-react';

export default function Home() {
  const { student, teacher, loading, requireAuth } = useStudentAuth();

  // Enforce auth check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <title>Memuat - DyLeks Siswa</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat petualangan...</p>
        </div>
      </div>
    );
  }

  // Calculate mock progress percentage based on student's currentLevel
  const getProgressDetails = (level: number) => {
    switch (level) {
      case 1:
        return { percentage: 5, nextLevel: 2 };
      case 2:
        return { percentage: 25, nextLevel: 3 };
      case 3:
        return { percentage: 48, nextLevel: 4 };
      case 4:
        return { percentage: 70, nextLevel: 5 };
      default:
        return { percentage: 95, nextLevel: level + 1 };
    }
  };

  const { percentage, nextLevel } = getProgressDetails(student.currentLevel || 1);

  // Games list definition
  const games = [
    {
      id: 'latihan-bertahap',
      name: 'latihan bertahap',
      displayName: 'Latihan Bertahap',
      description: 'Latihan membaca kata secara bertahap.',
      colorClass: 'border-indigo-100 bg-indigo-50/40 text-indigo-650 hover:bg-indigo-50',
      iconBg: 'bg-indigo-100/70 text-indigo-600',
      icon: BookOpen
    },
    {
      id: 'petualangan-huruf',
      name: 'petualangan huruf',
      displayName: 'Petualangan Huruf',
      description: 'Petualangan seru mencari huruf hilang.',
      colorClass: 'border-emerald-100 bg-emerald-50/40 text-emerald-650 hover:bg-emerald-50',
      iconBg: 'bg-emerald-100/70 text-emerald-600',
      icon: Compass
    },
    {
      id: 'tracer-kinestik',
      name: 'tracer kinestik',
      displayName: 'Tracer Kinestik',
      description: 'Menulis huruf di layar dengan gerakan jari.',
      colorClass: 'border-amber-100 bg-amber-50/40 text-amber-650 hover:bg-amber-50',
      iconBg: 'bg-amber-100/70 text-amber-600',
      icon: Activity
    },
    {
      id: 'latihan-bicara-ai',
      name: 'latihan bicara AI',
      displayName: 'Latihan Bicara AI',
      description: 'Latihan pengucapan kata dibantu asisten AI.',
      colorClass: 'border-rose-100 bg-rose-50/40 text-rose-650 hover:bg-rose-50',
      iconBg: 'bg-rose-100/70 text-rose-600',
      icon: Mic
    }
  ];

  const handleGameClick = (gameName: string) => {
    alert(gameName);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start">
      <title>Dunia Belajar - DyLeks Siswa</title>

      {/* Mobile container */}
      <main className="max-w-md w-full mx-auto px-4 py-6 space-y-5">
        
        {/* Welcome Section */}
        <section className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-xs">
          <div>
            <h2 className="text-md font-bold text-slate-800">Selamat datang kembali, {student.name}!</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Siap untuk berpetualang dan bermain game hari ini?
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div className="truncate">
                <p className="text-[9px] text-slate-400 font-normal uppercase tracking-wider">Guru Pendamping</p>
                <p className="font-semibold text-slate-700 leading-tight">{teacher?.fullName || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div className="truncate">
                <p className="text-[9px] text-slate-400 font-normal uppercase tracking-wider">Sekolah</p>
                <p className="font-semibold text-slate-700 leading-tight">{teacher?.schoolName || '-'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bar / XP Section */}
        <section className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl border border-indigo-100">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-700">Tingkat Kemajuan</h3>
                <p className="text-[10px] text-slate-400">Level Kamu saat ini</p>
              </div>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-700 border border-slate-200">
              Level {student.currentLevel || 1}
            </div>
          </div>

          <div className="space-y-2">
            {/* Progress/XP text dynamically generated */}
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
              <span>XP Kamu</span>
              <span>{percentage}% towards level {nextLevel}</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-150">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </section>

        {/* List of Games */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Daftar Permainan</h3>
            <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-0.5">
              Lihat Semua <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* Grid Layout: 2 Columns */}
          <div className="grid grid-cols-2 gap-3">
            {games.map((game) => {
              const IconComponent = game.icon;
              return (
                <button
                  id={`game-btn-${game.id}`}
                  key={game.id}
                  onClick={() => handleGameClick(game.name)}
                  className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${game.colorClass} shadow-xs hover:shadow-sm transform active:scale-97`}
                >
                  <div className={`p-2 w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${game.iconBg} border border-white`}>
                    <IconComponent className="w-4 h-4 shrink-0" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 leading-tight mb-1">
                    {game.displayName}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                    {game.description}
                  </p>
                  
                  <div className="mt-4 pt-2 border-t border-slate-100/50 flex items-center gap-1 text-[10px] font-bold">
                    <span>Mainkan</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

      </main>

      {/* Mobile footer footer-nav */}
      <footer className="mt-auto py-6 text-center text-[10px] text-slate-400">
        <p>© 2026 DyLeks Project. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
