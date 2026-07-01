'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useStudents } from './hooks/useStudents';
import { Student } from './types';

// Components
import StudentTable from './components/StudentTable';
import ActivityLogList from './components/ActivityLogList';
import QRModal from './components/QRModal';
import AddStudentModal from './components/AddStudentModal';

// Icons
import { 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  LogOut,
  School,
  MapPin
} from 'lucide-react';

export default function DashboardPage() {
  const { teacher, loading, logout, requireAuth } = useAuth();
  const { students, logs, stats, generateTempStudent, commitNewStudent, removeStudent } = useStudents(teacher?.id);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Authenticate user
  useEffect(() => {
    requireAuth();
  }, [teacher, loading, requireAuth]);

  if (loading || !teacher) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-550/5 bg-slate-50">
        <title>Memuat - DyLeks Guru</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Menghubungkan sesi...</p>
        </div>
      </div>
    );
  }

  const handleOpenQR = (student: Student) => {
    setSelectedStudent(student);
    setIsQRModalOpen(true);
  };

  const handleAddStudentSubmit = () => {
    const newStudent = generateTempStudent();
    if (newStudent) {
      // Open the success AddStudentModal showing the generated QR code & URL
      setSelectedStudent(newStudent);
      setIsAddModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <title>Dashboard Guru - DyLeks</title>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        
        {/* Welcome and Teacher Profile Banner */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xs">
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Selamat datang kembali, {teacher.fullName}!</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola daftar siswa Anda dan pantau kemajuan skrining disleksia mereka secara berkala.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <School className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{teacher.schoolName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{teacher.city}</span>
              </div>
            </div>
          </div>
          
          <button
            id="logout-btn-welcome"
            onClick={logout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl hover:bg-rose-50 active:bg-rose-100 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Akun</span>
          </button>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Enrolled */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-slate-50 text-slate-600 rounded-xl border border-slate-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Siswa</p>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">{stats.total}</h3>
            </div>
          </div>

          {/* Card 2: High Risk */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risiko Tinggi</p>
              <h3 className="text-xl font-bold text-rose-700 mt-0.5">{stats.high}</h3>
            </div>
          </div>

          {/* Card 3: Mid Risk */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risiko Sedang</p>
              <h3 className="text-xl font-bold text-amber-700 mt-0.5">{stats.medium}</h3>
            </div>
          </div>

          {/* Card 4: Low Risk */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risiko Rendah</p>
              <h3 className="text-xl font-bold text-emerald-700 mt-0.5">{stats.low}</h3>
            </div>
          </div>

        </section>

        {/* Layout: Activity Log and Student Table stacked vertically */}
        <div className="space-y-6">
          {/* Student Activity Timeline Log */}
          <ActivityLogList logs={logs} />

          {/* Student Table */}
          <StudentTable 
            students={students} 
            onShowQR={handleOpenQR} 
            onDelete={removeStudent} 
            onAddStudent={handleAddStudentSubmit}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-auto">
        <p>© 2026 DyLeks Project. Hak Cipta Dilindungi.</p>
      </footer>

      {/* Modals */}
      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedStudent(null);
        }} 
        student={selectedStudent} 
        onCopy={() => {
          if (selectedStudent) {
            commitNewStudent(selectedStudent);
          }
        }}
      />

      {selectedStudent && (
        <QRModal 
          isOpen={isQRModalOpen} 
          onClose={() => {
            setIsQRModalOpen(false);
            setSelectedStudent(null);
          }} 
          studentName={selectedStudent.name}
          studentId={selectedStudent.id}
          qrUrl={selectedStudent.qrUrl}
        />
      )}

    </div>
  );
}
