'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  Mic,
  Square,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Keyboard
} from 'lucide-react';
import { LatihanBicaraPlayProps } from '../../../types';

export default function PlayStage({
  targetWord,
  isSpeaking,
  onPlaySound,
  isRecording,
  onStartRecording,
  onStopRecording,
  spokenText,
  isSubmitted,
  isCorrect,
  onNextWord,
  onQuit
}: LatihanBicaraPlayProps) {
  // Manual text input simulation toggle for testing or when mic fails
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInputVal, setManualInputVal] = useState('');

  // Handle manual submit (simulates SpeechRecognition result)
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInputVal.trim()) return;

    // Simulate recording stop by triggering speech recognition logic with manual text
    // We will pass it to window to communicate with controller
    if (typeof window !== 'undefined') {
      const customEvent = new CustomEvent('latihan-bicara-manual-submit', {
        detail: { text: manualInputVal.trim() }
      });
      window.dispatchEvent(customEvent);
    }

    setManualInputVal('');
    setShowManualInput(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-4 space-y-4 relative">
      {/* Top Navigation */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <button
          onClick={onQuit}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Keluar
        </button>
        <span className="text-[10px] font-extrabold bg-rose-50 text-rose-650 px-2 py-0.5 rounded-full border border-rose-100">
          Latihan Bicara AI
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 py-8 space-y-6 shadow-xs flex flex-col items-center my-auto relative">
        <div className="text-center">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Kata yang Harus Diucapkan</span>
          <h2 className="text-3xl font-black text-rose-600 tracking-wide mt-1 uppercase select-none">
            {targetWord}
          </h2>
        </div>

        {/* TTS / Sound play button */}
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={onPlaySound}
            disabled={isRecording}
            className={`p-4 rounded-full border transition-all duration-200 flex items-center justify-center shadow-xs cursor-pointer ${isSpeaking
              ? 'bg-rose-100 text-rose-700 border-rose-200 scale-105'
              : isRecording
                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 hover:scale-102 active:scale-95'
              }`}
            aria-label="Putar Suara Kata"
          >
            <Volume2 className={`w-8 h-8 ${isSpeaking ? 'animate-bounce' : ''}`} />
          </button>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {isSpeaking ? 'Memutar Suara...' : 'Dengar Kata'}
          </span>
        </div>

        {/* Microphone / Recording area */}
        <div className="w-full pt-4 border-t border-slate-50 flex flex-col items-center space-y-4">
          {isRecording ? (
            <div className="flex flex-col items-center space-y-4 w-full">
              {/* Pulsing microphone placeholder / wave visualizer */}
              <div className="relative flex items-center justify-center w-20 h-20">
                <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-25" />
                <span className="absolute -inset-2 rounded-full border-2 border-rose-400 animate-pulse opacity-40" />
                <div className="relative w-16 h-16 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md">
                  <Mic className="w-7 h-7 animate-pulse" />
                </div>
              </div>

              <p className="text-xs font-bold text-rose-500 animate-pulse">
                Sedang merekam suara... Silakan bicara
              </p>

              {/* Stop / Submit Button */}
              <button
                onClick={onStopRecording}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-97"
              >
                <Square className="w-3.5 h-3.5 fill-white text-white" /> Selesai & Kirim
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={onStartRecording}
                disabled={isSpeaking}
                className={`w-20 h-20 rounded-full border flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer ${isSpeaking
                  ? 'bg-slate-50 text-slate-350 border-slate-100 cursor-not-allowed'
                  : 'bg-rose-500 text-white border-rose-600 hover:bg-rose-600 hover:scale-103 active:scale-95'
                  }`}
              >
                <Mic className="w-9 h-9" />
              </button>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Ketuk Mic untuk Rekam
              </span>
            </div>
          )}
        </div>

        {/* Text Input Simulation Fallback Drawer */}
        <div className="w-full pt-2 flex flex-col items-center">
          {!isRecording && !isSubmitted && (
            <>
              <button
                onClick={() => setShowManualInput(!showManualInput)}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                <Keyboard className="w-3 h-3" />
                {showManualInput ? 'Sembunyikan Bantuan' : 'Mic Bermasalah? Ketik Manual'}
              </button>

              {showManualInput && (
                <form onSubmit={handleManualSubmit} className="w-full mt-3 flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <input
                    type="text"
                    value={manualInputVal}
                    onChange={(e) => setManualInputVal(e.target.value)}
                    placeholder={`Ketik kata "${targetWord}" di sini...`}
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 text-slate-800"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-all cursor-pointer"
                  >
                    Kirim
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Correct/Incorrect Overlay Pop Up Modal */}
      {isSubmitted && (
        <div className="absolute inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 py-8 space-y-6 shadow-xl max-w-xs w-full text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
            {isCorrect ? (
              <>
                <div className="p-4 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 animate-bounce">
                  <CheckCircle2 className="w-12 h-12 fill-emerald-50 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-800">Hebat! Pengucapan Benar</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Pengucapanmu sudah tepat dan terdengar sangat jelas.
                  </p>
                </div>
                {spokenText && (
                  <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-2.5 w-full text-xs font-semibold text-emerald-700">
                    Kamu mengucapkan: <span className="underline italic">"{spokenText}"</span>
                  </div>
                )}

                <button
                  onClick={onNextWord}
                  className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs transition-all duration-200 shadow-md shadow-rose-100/50 flex items-center justify-center gap-1 cursor-pointer transform active:scale-97"
                >
                  Kata Selanjutnya <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <div className="p-4 bg-rose-50 text-rose-500 rounded-full border border-rose-100">
                  <XCircle className="w-12 h-12 fill-rose-50 text-rose-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-800">Ayo Coba Lagi!</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ucapkan kata <strong className="uppercase text-rose-600">"{targetWord}"</strong> dengan lantang dan dekat mikrofon.
                  </p>
                </div>

                <div className="bg-rose-50/50 border border-rose-100/60 rounded-xl p-2.5 w-full text-xs font-semibold text-rose-700">
                  Kamu mengucapkan: <span className="underline italic">"{spokenText || '(tidak terdengar)'}"</span>
                </div>

                <div className="flex gap-2 w-full pt-1">
                  <button
                    onClick={onNextWord}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                  >
                    Lewati
                  </button>
                  <button
                    onClick={onNextWord} // Wait, retry logic: we will actually have next word or let them try again. Let's make one button load next, and one button retry.
                    // Actually, if they want to try again, they can click "Coba Lagi" which closes the modal and resets isSubmitted so they can click mic again for the same word!
                    // Let's implement retry by custom action or close modal. We'll pass a custom handler or let onNextWord be one, and a custom click that clears isSubmitted.
                    // Wait, let's look at the buttons. We can have: "Ulangi" (closes modal and lets them try the same word) and "Lanjut" (goes to next word).
                    // Yes! This is perfect!
                    name="retry-btn"
                  />
                  {/* Let's define the two buttons properly */}
                </div>
                <div className="grid grid-cols-2 gap-2 w-full pt-1">
                  <button
                    onClick={() => {
                      // Click event to clear results so they can try again. We will simulate this by trigger key or resetting in page controller
                      if (typeof window !== 'undefined') {
                        const customEvent = new CustomEvent('latihan-bicara-retry');
                        window.dispatchEvent(customEvent);
                      }
                    }}
                    className="py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Coba Lagi
                  </button>
                  <button
                    onClick={onNextWord}
                    className="py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-97 shadow-sm shadow-rose-100"
                  >
                    Lanjut <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
