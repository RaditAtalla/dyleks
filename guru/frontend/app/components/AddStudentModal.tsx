'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check } from 'lucide-react';
import { AddStudentModalProps, Student } from '../types';

export default function AddStudentModal({ isOpen, onClose, studentId, qrUrl }: AddStudentModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current && qrUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        qrUrl,
        {
          width: 200,
          margin: 1,
          color: {
            dark: '#1e293b', // slate-800
            light: '#ffffff' // white
          }
        },
        (error) => {
          if (error) console.error('Gagal membuat QR Code:', error);
        }
      );
    }
  }, [isOpen, qrUrl]);

  if (!isOpen || !studentId) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin tautan:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all duration-300 scale-100">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-slate-850">Siswa Baru Terdaftar</h3>
            <p className="text-xs text-slate-500">ID Sementara: {studentId}</p>
          </div>
          <button
            id="close-add-student-qr-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-5">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

          <div className="w-full text-center space-y-3">
            <div className="bg-white border border-slate-100 px-3 py-1.5 rounded-lg inline-block max-w-full">
              <span className="text-xs font-mono text-slate-500 truncate block">
                {qrUrl}
              </span>
            </div>

            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Siswa dapat memindai QR code ini untuk masuk dan melengkapi data profil mereka di modul siswa.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 p-6 border-t border-slate-100 bg-white">
          <button
            id="copy-new-student-url-btn"
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600">Tautan Disalin</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Tautan</span>
              </>
            )}
          </button>

          <button
            id="close-add-student-success-btn"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-850 active:bg-slate-950 transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}
