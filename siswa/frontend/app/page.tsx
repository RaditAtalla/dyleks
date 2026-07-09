'use client';

import { useEffect, useState } from 'react';
import { useStudentAuth } from './hooks/useStudentAuth';
import { useGamification } from './hooks/useGamification';
import { useRouter } from 'next/navigation';
import { 
  LogOut, Trophy, Play, Lock, CheckCircle, 
  BookOpen, Layers, Edit, Mic, Compass, CircleDot, Shield, Map
} from 'lucide-react';
import InteractiveMascot from './components/Maskot/InteractiveMascot';
import StreakModal from './components/StreakModal';
import PlacementScreeningModal from './components/PlacementScreeningModal';

export default function Home() {
  const { student, teacher, loading, requireAuth, logout, submitPlacement } = useStudentAuth();
  const gamification = useGamification();
  const router = useRouter();

  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showScreening, setShowScreening] = useState(false);
  const [activeLevel, setActiveLevel] = useState<number>(1);

  // Load selected level from local storage on mount/auth load
  useEffect(() => {
    if (student) {
      const stored = localStorage.getItem(`dyleks_selected_level_${student.id}`);
      if (stored) {
        setActiveLevel(parseInt(stored, 10));
      } else {
        setActiveLevel(student.currentLevel || 1);
      }
    }
  }, [student]);

  // Enforce auth check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  // Update streak on mount if logged in
  useEffect(() => {
    if (student) {
      gamification.checkAndUpdateStreak();
    }
  }, [student]);

  // Check if streak modal needs to be shown (when streak >= 2)
  useEffect(() => {
    if (student && gamification.state.streak >= 2) {
      const lastSeen = localStorage.getItem('dyleks_last_seen_streak_count');
      if (lastSeen !== String(gamification.state.streak)) {
        setShowStreakModal(true);
      }
    }
  }, [student, gamification.state.streak]);

  const handleCloseStreakModal = () => {
    setShowStreakModal(false);
    localStorage.setItem('dyleks_last_seen_streak_count', String(gamification.state.streak));
  };

  // Trigger placement test overlay for registered new students with no screening record
  useEffect(() => {
    if (student && student.name !== 'Siswa Baru' && student.class !== '-') {
      const isScreeningDone = localStorage.getItem(`dyleks_screening_completed_${student.id}`) || student.riskScore > 0;
      if (!isScreeningDone) {
        setShowScreening(true);
      }
    }
  }, [student]);

  const handlePlacementSubmit = async (level: number, score: number, riskClass: 'low' | 'medium' | 'high') => {
    if (!student) return;
    const res = await submitPlacement(level, score, riskClass);
    if (res.success) {
      localStorage.setItem(`dyleks_screening_completed_${student.id}`, 'true');
      setShowScreening(false);
      router.push('/learning-path');
    } else {
      alert(res.error || 'Gagal menyimpan hasil penempatan.');
    }
  };

  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <title>Memuat - DyLeks Siswa</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat petualangan...</p>
        </div>
      </div>
    );
  }

  const currentLevel = student.currentLevel || 1;
  const displayXP = activeLevel < currentLevel ? 100 : (activeLevel === currentLevel ? (student.xp || 0) : 0);

  // Define games list
  const games = [
    {
      id: 'latihan-bertahap',
      title: 'Latihan Bertahap',
      description: 'Latihan vokal dan menulis tangan.',
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      level: 1,
    },
    {
      id: 'petualangan-huruf',
      title: 'Petualangan Huruf',
      description: 'Mencocokkan kartu memori huruf.',
      icon: Layers,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      level: 2,
    },
    {
      id: 'tracer-kinestik',
      title: 'Tracer Kinestik',
      description: 'Latihan menjiplak penulisan huruf.',
      icon: Edit,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      level: 3,
    },
    {
      id: 'latihan-bicara-ai',
      title: 'Bicara AI',
      description: 'Latihan pengucapan fonem dengan AI.',
      icon: Mic,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      level: 4,
    },
    {
      id: 'labirin-spasial',
      title: 'Labirin Spasial',
      description: 'Latihan arah spasial kiri-kanan.',
      icon: Compass,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
      level: 5,
    },
    {
      id: 'letuskan-balon',
      title: 'Letuskan Balon',
      description: 'Game motorik menangkap huruf terbang.',
      icon: CircleDot,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      level: 6,
    },
    {
      id: 'sight-word-shield',
      title: 'Word Shield',
      description: 'Game membedakan kata dasar mirip.',
      icon: Shield,
      color: 'bg-teal-50 text-teal-600 border-teal-100',
      level: 7,
    },
    {
      id: 'morpheme-bridge-builder',
      title: 'Bridge Builder',
      description: 'Menyusun suku kata menjadi kata.',
      icon: Layers,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      level: 8,
    }
  ];

  const activeNodeId = games.find(g => g.level === currentLevel)?.id || 'latihan-bertahap';

  const handleCardClick = (id: string, isLocked: boolean) => {
    if (isLocked) return;
    router.push(`/game/${id}`);
  };

  const handleContinueLatihan = () => {
    router.push(`/game/latihan-bertahap?level=${activeLevel}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-start">
      <title>Dunia Belajar - DyLeks Siswa</title>

      {/* Top Header Status Bar */}
      <header className="sticky top-0 bg-[#FAF6EE]/95 border-b border-slate-200/60 py-3.5 px-4 z-40 shadow-xs backdrop-blur-xs">
        <div className="max-w-md w-full mx-auto flex items-center justify-between">
          {/* Profile & School */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 text-indigo-700 font-extrabold uppercase text-xs">
              {student.name[0]}
            </div>
            <div className="leading-none text-left">
              <h2 className="text-xs font-black text-slate-800">{student.name}</h2>
              <span className="text-[9px] font-bold text-slate-400">Kelas {student.class}</span>
            </div>
          </div>

          {/* Map Button (Peta Belajar) in the middle */}
          <button
            onClick={() => router.push('/learning-path')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border-2 border-b-4 border-indigo-200 hover:bg-indigo-100/70 text-indigo-700 text-[9px] font-black rounded-full select-none cursor-pointer active:translate-y-0.5 active:border-b-2 transition-all"
            title="Peta Belajar"
          >
            <Map className="w-3.5 h-3.5" />
            <span>PETA BELAJAR</span>
          </button>

          {/* Stats indicators */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStreakModal(true)}
              className="flex items-center gap-1.5 select-none hover:bg-orange-550/10 active:scale-95 transition-all p-1.5 rounded-xl border border-transparent hover:border-orange-100/50 cursor-pointer"
              title="Streak Harian"
            >
              <img src="/mascot/fire.svg" className="w-5 h-5 shrink-0" alt="Streak" />
              <span className="text-xs font-black text-orange-500">{gamification.state.streak}</span>
            </button>
            
            <button
              onClick={logout}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto px-4 py-6 space-y-6 flex-1 flex flex-col justify-start">
        
        {/* Welcome Callout with Mascot */}
        <section className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200/70 rounded-3xl shadow-sm text-center relative max-w-sm w-full mx-auto">
          <InteractiveMascot mood="happy" width={90} height={90} />
          
          <div className="mt-3.5 space-y-1">
            <h3 className="text-sm font-black text-slate-800">
              Halo, {student.name}!
            </h3>
            <p className="text-xs text-slate-550 max-w-xs mx-auto leading-relaxed text-slate-500 font-medium">
              Siap berpetualang hari ini? Selesaikan modul belajarmu untuk meningkatkan kemampuan membacamu!
            </p>
          </div>

          <button
            onClick={handleContinueLatihan}
            className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs transition-all duration-100 shadow-md shadow-indigo-200/60 flex items-center justify-center gap-2 cursor-pointer border-b-4 border-indigo-700 active:border-b-0 active:translate-y-[4px]"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Lanjut Latihan!
          </button>
        </section>

        {/* Level Progress Banner */}
        <section className="bg-white border border-slate-200/70 rounded-3xl p-5 shadow-xs max-w-sm w-full mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl border border-indigo-100">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-bold text-slate-700">Tingkat Kemajuan</h3>
                <p className="text-[9px] text-slate-400 font-medium">Level saat ini: {activeLevel}</p>
              </div>
            </div>
            
            <div className="bg-indigo-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-indigo-700 border border-indigo-100">
              Tingkat {activeLevel}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500">
              <span>Progres Level</span>
              <span>{displayXP}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${displayXP}%` }}
              />
            </div>
          </div>
        </section>

        {/* Learning Cards Grid (Original 2-Column Layout) */}
        <section className="space-y-4 pt-2">
          <div>
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Lintasan Belajar</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              Pilih latihan yang paling relevan dengan progresmu sekarang.
            </p>
          </div>

          {/* Grid 2-kolom: 4 game utama */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'latihan-bertahap', displayName: 'Latihan Bertahap', description: 'Latihan vokal dan menulis tangan.', colorClass: 'border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50', iconBg: 'bg-indigo-100/70 text-indigo-600', icon: BookOpen },
              { id: 'petualangan-huruf', displayName: 'Petualangan Huruf', description: 'Mencocokkan kartu memori huruf.', colorClass: 'border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50', iconBg: 'bg-emerald-100/70 text-emerald-600', icon: Layers },
              { id: 'tracer-kinestik', displayName: 'Tracer Kinestik', description: 'Latihan menjiplak penulisan huruf.', colorClass: 'border-amber-100 bg-amber-50/40 hover:bg-amber-50', iconBg: 'bg-amber-100/70 text-amber-600', icon: Edit },
              { id: 'latihan-bicara-ai', displayName: 'Bicara AI', description: 'Latihan pengucapan fonem dengan AI.', colorClass: 'border-rose-100 bg-rose-50/40 hover:bg-rose-50', iconBg: 'bg-rose-100/70 text-rose-600', icon: Mic },
            ].map((game) => {
              const IconComponent = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => router.push(`/game/${game.id}?level=${activeLevel}`)}
                  className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${game.colorClass} shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none`}
                >
                  <div className={`p-2 w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${game.iconBg} border border-white`}>
                    <IconComponent className="w-4 h-4 shrink-0" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight mb-1">
                    {game.displayName}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                    {game.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100/60 flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <span>Mainkan</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Daftar: 4 game adaptif */}
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Game Adaptif</h3>
            {[
              { id: 'labirin-spasial', displayName: 'Labirin Spasial', description: 'Latih orientasi spasial kiri-kanan.', icon: Compass },
              { id: 'letuskan-balon', displayName: 'Letuskan Balon', description: 'Game motorik menangkap huruf terbang.', icon: CircleDot },
              { id: 'sight-word-shield', displayName: 'Word Shield', description: 'Game membedakan kata dasar yang mirip.', icon: Shield },
              { id: 'morpheme-bridge-builder', displayName: 'Bridge Builder', description: 'Menyusun suku kata menjadi kata.', icon: Layers },
            ].map((game) => {
              const IconComponent = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => router.push(`/game/${game.id}?level=${activeLevel}`)}
                  className="w-full text-left p-4 bg-white border border-slate-200/60 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-[2px] transition-all duration-200 cursor-pointer flex items-center gap-3 active:shadow-none"
                >
                  <div className="p-2 w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">{game.displayName}</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">{game.description}</p>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 shrink-0">›</div>
                </button>
              );
            })}
          </div>
        </section>


        {/* Teacher/Companion Info Card */}
        {teacher && (
          <section className="bg-white/80 border border-slate-200/50 rounded-2xl p-4 max-w-sm w-full mx-auto flex items-center justify-between text-left">
            <div>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Guru Pendamping</span>
              <span className="text-xs font-bold text-slate-700">{teacher.fullName}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Sekolah</span>
              <span className="text-xs font-bold text-slate-700">{teacher.schoolName}</span>
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-[10px] text-slate-400 mt-auto">
        <p>© 2026 DyLeks Project. Hak Cipta Dilindungi.</p>
      </footer>

      {/* Streak Celebration Popup */}
      <StreakModal 
        isOpen={showStreakModal} 
        streakCount={gamification.state.streak} 
        lastActiveDate={gamification.state.lastActiveDate}
        onClose={handleCloseStreakModal} 
      />

      {/* Placement Screening Modal */}
      <PlacementScreeningModal
        isOpen={showScreening}
        studentName={student?.name || ''}
        onSubmit={handlePlacementSubmit}
      />
    </div>
  );
}
