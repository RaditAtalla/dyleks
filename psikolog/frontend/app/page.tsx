'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Student, Psychologist } from './types';
import { apiService } from './services/api';
import { getPsychologistUser, isAuthenticated, clearPsychologistUser } from './services/storage';
import StudentDetailPanel from './components/StudentDetailPanel';
import { InteractiveMascot } from './components/Maskot/InteractiveMascot';
import { 
  Brain, LogOut, Search, UserCheck, 
  ChevronRight, Sparkles, Building, Hash 
} from 'lucide-react';

export default function PsychologistDashboard() {
  const router = useRouter();
  const [psychologist, setPsychologist] = useState<Psychologist | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setPsychologist(getPsychologistUser());
      setIsAuthChecking(false);
    }
  }, [router]);

  // Fetch students data
  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getStudents();
      setStudents(data);
    } catch (err) {
      console.error('Gagal memuat daftar siswa:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthChecking) {
      loadStudents();
    }
  }, [isAuthChecking]);

  const handleLogout = () => {
    clearPsychologistUser();
    router.push('/login');
  };

  // Filter students based on search query and risk level filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || student.riskClass === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadgeStyles = (level: string) => {
    const base = "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ";
    if (level === 'high') return base + "bg-rose-50 border border-rose-100 text-rose-600";
    if (level === 'medium') return base + "bg-amber-50 border border-amber-100 text-amber-600";
    return base + "bg-emerald-50 border border-emerald-100 text-emerald-600";
  };

  const getRiskLabel = (level: string) => {
    if (level === 'high') return 'Tinggi';
    if (level === 'medium') return 'Sedang';
    return 'Rendah';
  };

  if (isAuthChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent animate-spin rounded-full" />
          <span className="text-xs text-slate-400 font-semibold">Memeriksa Sesi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <title>Dashboard - DyLeks Psikolog Portal</title>

      {/* Main Header / Navigation */}
      <header className="bg-white border-b border-slate-100 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white shadow-sm">
              <Brain className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-black text-slate-800 tracking-tight block leading-none">DyLeks</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5 leading-none">Psikolog Portal</span>
            </div>
          </div>

          {psychologist && (
            <div className="flex items-center gap-5">
              {/* Psychologist info badges */}
              <div className="hidden md:flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-slate-500 font-semibold">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>{psychologist.fullName}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 font-semibold">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{psychologist.clinic}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 font-semibold">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>STR: {psychologist.strNumber}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Left Side: Students List */}
        <section className="w-full md:w-80 shrink-0 flex flex-col space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3.5">
            <h1 className="text-sm font-black text-slate-800 uppercase tracking-wide">Daftar Skrining Siswa</h1>

            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Cari siswa, guru, sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-350 transition-colors"
              />
            </div>

            {/* Risk filter tabs */}
            <div className="flex flex-wrap gap-1">
              {(['all', 'high', 'medium', 'low'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRiskFilter(filter)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    riskFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  {filter === 'all' ? 'Semua' : getRiskLabel(filter)}
                </button>
              ))}
            </div>
          </div>

          {/* Student list card scroll area */}
          <div className="flex-1 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[300px]">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-12">
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent animate-spin rounded-full" />
                <span className="text-xs text-slate-400">Memuat siswa...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-slate-400">
                <p>Tidak ada data siswa ditemukan.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-0.5">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full text-left p-3.5 hover:bg-slate-50/50 flex items-center justify-between transition-colors border-l-2 cursor-pointer ${
                      selectedStudent?.id === student.id
                        ? 'bg-slate-50 border-l-slate-900'
                        : 'border-l-transparent'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <h3 className="text-xs font-bold text-slate-800 leading-tight">{student.name}</h3>
                      <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                        Kelas {student.class} | {student.schoolName}
                      </p>
                      <p className="text-[9px] text-slate-400 font-medium">
                        Guru: {student.teacherName}
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1.5">
                      {getRiskBadgeStyles(student.riskClass) && (
                        <span className={getRiskBadgeStyles(student.riskClass)}>
                          {getRiskLabel(student.riskClass)}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                        selectedStudent?.id === student.id ? 'text-slate-800 translate-x-0.5' : 'text-slate-300'
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right Side: Selected Student Detail Panel */}
        <section className="flex-1 overflow-y-auto">
          {selectedStudent ? (
            <StudentDetailPanel 
              student={selectedStudent} 
              onClose={() => setSelectedStudent(null)}
              onRecommendationAdded={loadStudents}
            />
          ) : (
            <div className="h-full min-h-[350px] bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-sm">
              <div className="bg-amber-50 rounded-3xl p-1 border border-amber-100/50 mb-4">
                <InteractiveMascot mood="neutral" width={110} height={110} />
              </div>
              <h2 className="text-sm font-bold text-slate-800">Pilih Siswa</h2>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Pilih salah satu siswa dari daftar di sebelah kiri untuk meninjau hasil skrining latihan menulis dan memberikan rekomendasi intervensi klinis.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
