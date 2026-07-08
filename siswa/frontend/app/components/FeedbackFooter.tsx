'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Button3D from './Button3D';
import { useGameSounds } from '../hooks/useGameSounds';

interface FeedbackFooterProps {
  isCorrect: boolean | null; // null jika belum diverifikasi
  correctAnswer?: string;
  onContinue: () => void;
  onCheck: () => void;
  hasSelected: boolean;
}

/**
 * Bilah footer tetap (fixed footer) yang memberikan umpan balik (feedback) instan.
 * Warna hijau mewakili jawaban benar dan merah mewakili kesalahan, lengkap dengan tombol aksi 3D.
 *
 * WHY suara di sini:
 * FeedbackFooter adalah titik tunggal yang mengetahui status benar/salah saat feedback muncul,
 * sehingga menjadi tempat paling tepat untuk memicu efek suara secara terpusat.
 */
export const FeedbackFooter: React.FC<FeedbackFooterProps> = ({
  isCorrect,
  correctAnswer,
  onContinue,
  onCheck,
  hasSelected
}) => {
  const { playCorrect, playWrong } = useGameSounds();

  // Putar suara saat feedback pertama kali muncul (isCorrect berubah dari null)
  useEffect(() => {
    if (isCorrect === true) {
      playCorrect();
    } else if (isCorrect === false) {
      playWrong();
    }
  }, [isCorrect]);

  if (isCorrect === null) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-5 px-6 flex justify-end z-50 shadow-lg">
        <div className="max-w-md w-full mx-auto flex justify-end">
          <Button3D
            variant="success"
            disabled={!hasSelected}
            onClick={onCheck}
            className="w-full py-4 text-base tracking-wide"
          >
            PERIKSA
          </Button3D>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 py-6 px-6 z-50 transition-all duration-300 border-t ${
      isCorrect 
        ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
        : 'bg-rose-50 border-rose-100 text-rose-900'
    } shadow-lg`}>
      <div className="max-w-md w-full mx-auto flex flex-col gap-4">
        <div className="flex items-start gap-3">
          {isCorrect ? (
            <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-extrabold text-sm sm:text-base leading-tight">
              {isCorrect ? 'Luar biasa! Benar sekali!' : 'Ups, kurang tepat.'}
            </h4>
            {!isCorrect && correctAnswer && (
              <p className="text-xs font-semibold text-rose-700 mt-1">
                Jawaban benar: <span className="underline">{correctAnswer}</span>
              </p>
            )}
          </div>
        </div>
        
        <Button3D
          variant={isCorrect ? 'success' : 'danger'}
          onClick={onContinue}
          className="w-full py-4 text-base tracking-wide"
        >
          LANJUTKAN
        </Button3D>
      </div>
    </div>
  );
};

export default FeedbackFooter;
