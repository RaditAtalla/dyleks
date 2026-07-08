'use client';

import { useState, useEffect } from 'react';
import { useStudentAuth } from '../hooks/useStudentAuth';
import { User, Calendar, Smile, GraduationCap, Gamepad2 } from 'lucide-react';
import InteractiveMascot from '../components/Maskot/InteractiveMascot';
import Button3D from '../components/Button3D';

export default function RegisterPage() {
  const { student, teacher, loading, register, requireAuth } = useStudentAuth();
  
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl' | ''>('');
  const [grade, setGrade] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authenticate student session on mount
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  // Set default full name from student draft name if it's not "Siswa Baru"
  useEffect(() => {
    if (student && student.name !== 'Siswa Baru') {
      setFullName(student.name);
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Nama lengkap harus diisi.');
      return;
    }
    
    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 18) {
      setError('Masukkan umur yang valid (1-18 tahun).');
      return;
    }

    if (!gender) {
      setError('Silakan pilih jenis kelamin.');
      return;
    }

    if (!grade.trim()) {
      setError('Kelas/Grade harus diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(fullName.trim(), parsedAge, gender, grade.trim());
      if (!res.success) {
        setError(res.error || 'Gagal menyimpan profil.');
        setIsSubmitting(false);
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <title>Memuat - DyLeks Siswa</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF6EE] px-4 py-8">
      <title>Lengkapi Profil - DyLeks Siswa</title>

      <div className="w-full max-w-md space-y-6">
        {/* Brand/Welcome Header */}
        <div className="flex flex-col items-center text-center">
          <InteractiveMascot mood="cheering" width={100} height={100} />
          
          <h2 className="text-2xl font-black tracking-tight text-slate-800 mt-4">
            Yuk, Lengkapi Profilmu!
          </h2>
          <p className="mt-1 text-xs text-slate-500 font-bold max-w-xs leading-relaxed">
            Tinggal satu langkah lagi untuk mulai petualangan seru bermain game!
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 text-left">
            <h1 className="text-sm font-black text-slate-800">Biodata Diri</h1>
            {teacher && (
              <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed">
                Terhubung dengan Guru <span className="font-bold text-slate-655">{teacher.fullName}</span> di <span className="font-bold text-slate-655">{teacher.schoolName}</span>
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-100 font-bold text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input 1: Nama Lengkap */}
            <div className="text-left">
              <label htmlFor="name-input" className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  id="name-input"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition-colors bg-slate-50/20 font-bold"
                />
              </div>
            </div>

            {/* Row Grid for Age and Gender */}
            <div className="grid grid-cols-2 gap-4 text-left">
              {/* Input 2: Umur */}
              <div>
                <label htmlFor="age-input" className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Umur (Tahun)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    id="age-input"
                    type="number"
                    required
                    min="1"
                    max="18"
                    placeholder="Contoh: 8"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition-colors bg-slate-50/20 font-bold"
                  />
                </div>
              </div>

              {/* Input 3: Jenis Kelamin */}
              <div>
                <label htmlFor="gender-select" className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Jenis Kelamin
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Smile className="w-4 h-4 text-slate-400" />
                  </span>
                  <select
                    id="gender-select"
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'boy' | 'girl')}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition-colors bg-slate-50/20 appearance-none text-slate-700 font-bold"
                  >
                    <option value="" disabled>Pilih...</option>
                    <option value="boy">Laki-laki</option>
                    <option value="girl">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Input 4: Kelas */}
            <div className="text-left">
              <label htmlFor="grade-input" className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Kelas
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  id="grade-input"
                  type="text"
                  required
                  placeholder="Contoh: 3-A atau 3"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition-colors bg-slate-50/20 font-bold"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button3D
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full py-4 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Menyimpan...' : 'Daftar & Mulai Bermain'}</span>
                {!isSubmitting && <Gamepad2 className="w-4 h-4" />}
              </Button3D>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
