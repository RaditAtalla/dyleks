'use client';

import { useEffect } from 'react';
import { useStudentAuth } from '../hooks/useStudentAuth';
import { QrCode, ShieldAlert, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { student, loading, requireAuth } = useStudentAuth();

  // Run authorization checks
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <title>Memuat - DyLeks Siswa</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Menghubungkan sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-8">
      {/* Title for SEO / browser tag */}
      <title>Masuk - DyLeks Siswa</title>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500 text-white shadow-sm mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
            Dunia Belajar DyLeks
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Tempat belajar seru dengan game edukasi disleksia
          </p>
        </div>

        {/* Instructions Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-500" />
            <h1 className="text-md font-bold text-slate-850">Cara Masuk Portal</h1>
          </div>

          {/* QR Scan Visual Guide */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
            <div className="relative p-4 bg-white rounded-xl shadow-xs border border-slate-150 mb-3">
              <QrCode className="w-14 h-14 text-slate-800" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border border-white text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-600 text-center">
              Pindai QR Code Siswa Anda
            </p>
          </div>

          {/* Stepped Instructions */}
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-600 shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-700">Hubungi Guru Anda</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Minta Guru Anda untuk menampilkan QR Code akun Anda melalui portal Guru.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-600 shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-700">Pindai QR Code</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gunakan kamera ponsel Anda untuk memindai kode QR yang ditunjukkan oleh Guru.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-600 shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-700">Mulai Bermain!</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ketuk tautan hasil pindaian untuk masuk secara otomatis dan mulai petualangan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning/Alert Footer */}
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-amber-800">Perhatian</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              Anda tidak bisa mendaftar secara mandiri. Akun siswa harus dibuat terlebih dahulu oleh Guru Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
