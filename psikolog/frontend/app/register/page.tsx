'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, ArrowRight, Lock, User, ShieldCheck, Home } from 'lucide-react';
import { apiService } from '../services/api';
import { InteractiveMascot } from '../components/Maskot/InteractiveMascot';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [strNumber, setStrNumber] = useState('');
  const [clinic, setClinic] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await apiService.register({
        fullName,
        username,
        strNumber,
        clinic,
        password,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-4 py-12 sm:px-6 lg:px-8">
      {/* Title for SEO / browser tag */}
      <title>Daftar - DyLeks Psikolog Portal</title>

      <div className="w-full max-w-md space-y-8">
        {/* Brand Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-white rounded-3xl p-1 border border-slate-100/50 shadow-sm mb-4">
            <InteractiveMascot mood="neutral" width={100} height={100} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            DyLeks Psikolog Portal
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Buat akun baru untuk memberikan rekomendasi klinis
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-lg font-semibold text-slate-800">Daftar Akun Baru</h1>
            <p className="text-xs text-slate-400 mt-0.5">Lengkapi formulir di bawah ini untuk mendaftar</p>
          </div>

          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-100 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-xs bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 font-medium">
              Pendaftaran berhasil! Mengalihkan ke halaman masuk...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name-input" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Nama Lengkap & Gelar
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  id="name-input"
                  type="text"
                  required
                  placeholder="Contoh: Dr. Diana, M.Psi., Psikolog"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-350 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username-input" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  id="username-input"
                  type="text"
                  required
                  placeholder="Masukkan username unik"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-350 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="str-input" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Nomor STR (Surat Tanda Registrasi)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  id="str-input"
                  type="text"
                  required
                  placeholder="Contoh: STR-12345-67890"
                  value={strNumber}
                  onChange={(e) => setStrNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-350 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="clinic-input" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Klinik / Rumah Sakit
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Home className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  id="clinic-input"
                  type="text"
                  required
                  placeholder="Masukkan nama klinik tempat praktik"
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-350 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password-input" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  id="password-input"
                  type="password"
                  required
                  placeholder="Buat password minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-350 transition-colors"
                />
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting || success}
              className="flex w-full items-center justify-center gap-2 mt-6 px-4 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-850 active:bg-slate-950 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <span>{isSubmitting ? 'Mendaftarkan...' : 'Daftar Akun'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Direct to Login */}
          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">Sudah memiliki akun? </span>
            <Link 
              id="goto-login-link"
              href="/login" 
              className="text-xs font-semibold text-slate-800 hover:underline"
            >
              Masuk Akun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
