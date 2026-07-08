'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStudentAuth } from '../../hooks/useStudentAuth';
import { TracerPoint } from '../../types';
import Canvas from './_components/Canvas';
import CongratsModal from './_components/CongratsModal';
import { X, RotateCcw, Info, Sparkles } from 'lucide-react';
import { useGameSounds } from '../../hooks/useGameSounds';
import SubLevelMap from '../../components/SubLevelMap';
import { useSubLevelProgress } from '../../hooks/useSubLevelProgress';

// Letter Path Points Definitions
const LETTER_PATHS: Record<'b' | 'd' | 'p' | 'q', TracerPoint[]> = {
  b: [
    { x: 110, y: 60, hint: 'Sentuh titik hijau di atas tiang, lalu tarik garis lurus ke bawah.' },
    { x: 110, y: 155, hint: 'Teruskan garis lurus ke bawah sampai ke ujung bawah tiang.' },
    { x: 110, y: 250, hint: 'Bagus! Sekarang naik kembali secara perlahan ke titik tengah tiang.' },
    { x: 110, y: 195, hint: 'Dari titik tengah, buat garis melengkung keluar ke arah kanan.' },
    { x: 160, y: 145, hint: 'Ikuti lengkungan lingkaran ke bawah menuju sisi kanan.' },
    { x: 210, y: 195, hint: 'Tarik garis melengkung ke kiri bawah untuk menutup lingkaran.' },
    { x: 160, y: 250, hint: 'Tarik ke kiri sampai menempel ke tiang kembali.' },
    { x: 110, y: 250, hint: 'Hebat! Kamu telah berhasil menulis huruf b!' }
  ],
  d: [
    { x: 190, y: 195, hint: 'Mulai dari tengah, buat garis melengkung ke arah kiri.' },
    { x: 140, y: 145, hint: 'Ikuti lengkungan melingkar ke bawah membentuk lingkaran.' },
    { x: 90, y: 195, hint: 'Tarik garis melengkung ke kanan bawah untuk menutup lingkaran.' },
    { x: 140, y: 250, hint: 'Tarik ke kanan sampai menyentuh bagian bawah tiang.' },
    { x: 190, y: 250, hint: 'Bagus! Sekarang angkat jari dan sentuh titik di atas tiang d.' },
    { x: 190, y: 60, hint: 'Tarik garis lurus dari atas ke bawah untuk menggambar tiang d.' },
    { x: 190, y: 155, hint: 'Teruskan tiang ke bawah sampai menempel dengan lingkaran.' },
    { x: 190, y: 250, hint: 'Hebat! Kamu telah berhasil menulis huruf d!' }
  ],
  p: [
    { x: 110, y: 100, hint: 'Sentuh titik hijau, tarik garis lurus ke bawah untuk tiang p.' },
    { x: 110, y: 195, hint: 'Teruskan tiang lurus ke bawah melewati garis dasar.' },
    { x: 110, y: 290, hint: 'Bagus! Sekarang naik kembali perlahan ke bagian atas tiang.' },
    { x: 110, y: 145, hint: 'Buat lengkungan lingkaran keluar ke arah kanan.' },
    { x: 160, y: 100, hint: 'Ikuti lengkungan melingkar ke bawah menuju sisi kanan.' },
    { x: 210, y: 145, hint: 'Tarik garis melengkung ke kiri bawah untuk menutup lingkaran.' },
    { x: 160, y: 195, hint: 'Tarik ke kiri sampai menempel ke tiang kembali.' },
    { x: 110, y: 195, hint: 'Hebat! Kamu telah berhasil menulis huruf p!' }
  ],
  q: [
    { x: 190, y: 145, hint: 'Mulai dari tengah, buat garis melengkung ke arah kiri.' },
    { x: 140, y: 100, hint: 'Ikuti lengkungan melingkar ke bawah membentuk lingkaran.' },
    { x: 90, y: 145, hint: 'Tarik garis melengkung ke kanan bawah untuk menutup lingkaran.' },
    { x: 140, y: 190, hint: 'Tarik ke kanan sampai menyentuh tiang bagian tengah.' },
    { x: 190, y: 190, hint: 'Bagus! Sekarang sentuh titik atas di sebelah kanan tiang q.' },
    { x: 190, y: 100, hint: 'Tarik garis lurus ke bawah untuk membuat tiang panjang q.' },
    { x: 190, y: 195, hint: 'Teruskan tiang lurus ke bawah melewati lingkaran.' },
    { x: 190, y: 290, hint: 'Hebat! Kamu telah berhasil menulis huruf q!' }
  ]
};

export default function TracerKinestik() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat game...</p>
        </div>
      </div>
    }>
      <TracerKinestikContent />
    </Suspense>
  );
}

function TracerKinestikContent() {
  const { student, loading, requireAuth } = useStudentAuth();
  const router = useRouter();
  const { playCorrect } = useGameSounds();
  const searchParams = useSearchParams();
  const levelParam = searchParams.get('level');

  const studentLevel = levelParam ? parseInt(levelParam, 10) : (student?.currentLevel || 1);

  const { stageProgress, activeStageNum, setActiveStageNum, handleStageWin } = useSubLevelProgress({
    gameKey: 'tracer',
    studentLevel,
  });

  // Enforce auth check
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  // Map vs Game stage
  const [stage, setStage] = useState<'map' | 'game'>('map');

  // Vowel select states (b is selected by default)
  const [selectedLetter, setSelectedLetter] = useState<'b' | 'd' | 'p' | 'q'>('b');
  
  // Tracing progresses — start at 1 so the first target is points[1] (points[0] is the start dot)
  const [currentPointIndex, setCurrentPointIndex] = useState(1);
  const [completedSegments, setCompletedSegments] = useState<
    Array<{ x1: number; y1: number; x2: number; y2: number }>
  >([]);
  const [showCongrats, setShowCongrats] = useState(false);

  // Memoize path points for current letter
  const points = useMemo(() => LETTER_PATHS[selectedLetter], [selectedLetter]);

  // Reset tracing state when letter changes
  const resetTracing = () => {
    setCurrentPointIndex(1);
    setCompletedSegments([]);
    setShowCongrats(false);
  };

  useEffect(() => {
    resetTracing();
  }, [selectedLetter]);

  // Complete event
  const handleComplete = async () => {
    playCorrect();
    setShowCongrats(true);
    await handleStageWin();
  };

  const getLevelName = (lvl: number) => {
    const names: Record<number, string> = {
      1: 'Vokal Tunggal', 2: 'Suku Kata Tunggal', 3: 'Suku Kata Kompleks',
      4: 'Digraf & Diftong', 5: 'Kata Dasar', 6: 'Suku Kata Blending',
      7: 'Diskriminasi Visual', 8: 'Morfologi Kata'
    };
    return names[lvl] || 'Kemampuan Dasar';
  };

  // Safe Back action
  const handleBackToHome = () => {
    router.push('/');
  };

  // Render loading state if auth check is running
  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <title>Memuat - Tracer Kinestik</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memuat petualangan...</p>
        </div>
      </div>
    );
  }

  if (stage === 'map') {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-start">
        <title>Tracer Kinestik - DyLeks Siswa</title>
        <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen">
          <SubLevelMap
            studentName={student.name}
            gameName="Tracer Kinestik"
            gameCategory="Permainan Menulis"
            currentLevel={studentLevel}
            getLevelName={getLevelName}
            stageProgress={stageProgress}
            onStartStage={(stageNum) => {
              setActiveStageNum(stageNum);
              resetTracing();
              setStage('game');
            }}
            onBackToHome={() => router.push('/')}
          />
        </main>
      </div>
    );
  }

  // Active instructions text — hint is stored at the *source* point of each segment
  const currentHint =
    currentPointIndex >= points.length
      ? 'Selesai! Kamu sungguh luar biasa!'
      : (points[currentPointIndex - 1]?.hint ?? points[0].hint);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start">
      <title>Tracer Kinestik - DyLeks Siswa</title>

      {/* Congrats Modal Pop-up */}
      <CongratsModal
        isOpen={showCongrats}
        letter={selectedLetter}
        onRestart={resetTracing}
        onClose={() => {
          setShowCongrats(false);
          resetTracing();
          setStage('map');
        }}
        onHome={handleBackToHome}
      />

      {/* Mobile container */}
      <main className="max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between min-h-screen space-y-5">
        
        {/* Top Header */}
        <div className="flex justify-between items-center pb-1">
          <div>
            <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">
              Tahap {activeStageNum}
            </span>
            <h1 className="text-base font-black text-slate-800 leading-tight">Tracer Kinestik</h1>
          </div>
          <button 
            onClick={() => setStage('map')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
            aria-label="Kembali ke Peta Tahap"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Letter Tabs Section */}
        <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <h3 className="text-xs font-bold text-slate-700">Pilih Huruf untuk Dilatih</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {(['b', 'd', 'p', 'q'] as const).map((letter) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  id={`letter-select-${letter}`}
                  onClick={() => setSelectedLetter(letter)}
                  className={`py-3 text-lg font-black rounded-xl border transition-all uppercase cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-650 shadow-inner'
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100/50'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </section>

        {/* Interactive Tracing Canvas Area */}
        <section className="flex-1 flex flex-col justify-center my-auto">
          <Canvas
            selectedLetter={selectedLetter}
            points={points}
            currentPointIndex={currentPointIndex}
            setCurrentPointIndex={setCurrentPointIndex}
            completedSegments={completedSegments}
            setCompletedSegments={setCompletedSegments}
            onComplete={handleComplete}
          />
        </section>

        {/* Hints and Actions Bottom Section */}
        <section className="space-y-4 pt-1">
          {/* Hint Card Box */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex gap-3 items-start">
            <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl shrink-0 border border-indigo-100 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Petunjuk Gerakan
              </h4>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                {currentHint}
              </p>
            </div>
          </div>

          {/* Reset / Restart Canvas Line */}
          <button
            onClick={resetTracing}
            className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ulangi Huruf Ini
          </button>
        </section>

        {/* Footer info */}
        <footer className="py-2 text-center text-[9px] text-slate-400">
          <p>Sentuh & seret jari kamu melintasi titik-titik untuk menggambar.</p>
        </footer>

      </main>
    </div>
  );
}
