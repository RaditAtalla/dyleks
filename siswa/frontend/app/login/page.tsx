'use client';

import { useEffect } from 'react';
import { useStudentAuth } from '../hooks/useStudentAuth';
import { QrCode, ShieldAlert } from 'lucide-react';
import InteractiveMascot from '../components/Maskot/InteractiveMascot';

export default function LoginPage() {
  const { student, loading, requireAuth } = useStudentAuth();

  // Run authorization checks
  useEffect(() => {
    requireAuth();
  }, [student, loading, requireAuth]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] p-4">
        <title>Memuat - DyLeks Siswa</title>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Menghubungkan sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF6EE] px-4 py-8">
      <title>Masuk - DyLeks Siswa</title>

      <div className="w-full max-w-md space-y-6">
        {/* Mascot & Brand Header */}
        <div className="flex flex-col items-center text-center">
          <InteractiveMascot mood="happy" width={100} height={100} />
          
          <h2 className="text-2xl font-black tracking-tight text-slate-800 mt-4">
            Dunia Belajar DyLeks
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 font-bold max-w-xs leading-relaxed">
            Pindai QR Code dari gurumu untuk mulai petualangan seru bermain game sambil belajar!
          </p>
        </div>

        {/* Instructions Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-indigo-500" />
            <h1 className="text-sm font-black text-slate-800">Cara Masuk Portal</h1>
          </div>

          {/* QR Scan Visual Guide */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
            <div className="relative p-4 bg-white rounded-xl shadow-xs border border-slate-150 mb-3">
              <QrCode className="w-14 h-14 text-slate-800" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border border-white text-white">
                <span className="text-xs">✨</span>
              </div>
            </div>
            <p className="text-xs font-extrabold text-slate-600 text-center">
              Pindai QR Code Siswa Anda
            </p>
          </div>

          {/* Stepped Instructions */}
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-black text-slate-650 shrink-0 mt-0.5 border border-slate-200">
                1
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-xs font-black text-slate-700">Hubungi Guru Anda</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Minta Guru Anda untuk menampilkan QR Code akun Anda melalui portal Guru.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-black text-slate-650 shrink-0 mt-0.5 border border-slate-200">
                2
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-xs font-black text-slate-700">Pindai QR Code</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Gunakan kamera ponsel Anda untuk memindai kode QR yang ditunjukkan oleh Guru.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-black text-slate-650 shrink-0 mt-0.5 border border-slate-200">
                3
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-xs font-black text-slate-700">Mulai Bermain!</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Ketuk tautan hasil pindaian untuk masuk secara otomatis dan mulai petualangan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning/Alert Footer */}
        <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-2xl flex gap-3 text-left">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-amber-800">Perhatian</h4>
            <p className="text-[11px] text-amber-700 leading-relaxed font-semibold">
              Anda tidak bisa mendaftar secara mandiri. Akun siswa harus dibuat terlebih dahulu oleh Guru Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
