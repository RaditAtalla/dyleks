'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { SightWordShieldPlayStageProps } from '../../../types';
import { X, RotateCcw, ShieldAlert } from 'lucide-react';

// Web Audio API pop/laser sound synthesizer
function playLaserSound() {
  if (typeof window !== 'undefined') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }
}

// Web Audio API impact/explosion sound synthesizer
function playExplosionSound() {
  if (typeof window !== 'undefined') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }
}

// Web Audio API wrong buzzer sound synthesizer
function playWrongSound() {
  if (typeof window !== 'undefined') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {}
  }
}

// Web Audio API game over sound synthesizer
function playGameOverSound() {
  if (typeof window !== 'undefined') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Play a quick sad descension
      const notes = [220, 196, 174, 146];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.15 + 0.14);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 0.15);
      });
    } catch {}
  }
}

export default function PlayStage({
  currentWord,
  meteors,
  shieldHealth,
  score,
  highScore,
  onShootMeteor,
  onRestart,
  onQuit,
  isWrongFlash,
  laserLine,
}: SightWordShieldPlayStageProps) {

  const prevHealthRef = useRef(shieldHealth);
  const prevLaserActiveRef = useRef(!!laserLine?.active);

  // Play audio feedbacks on actions
  useEffect(() => {
    if (laserLine?.active && !prevLaserActiveRef.current) {
      playLaserSound();
    }
    prevLaserActiveRef.current = !!laserLine?.active;
  }, [laserLine]);

  useEffect(() => {
    if (shieldHealth < prevHealthRef.current) {
      if (shieldHealth === 0) {
        playGameOverSound();
      } else {
        playExplosionSound();
      }
    }
    prevHealthRef.current = shieldHealth;
  }, [shieldHealth]);

  useEffect(() => {
    if (isWrongFlash) {
      playWrongSound();
    }
  }, [isWrongFlash]);

  const isGameOver = shieldHealth <= 0;

  // Caching keyframe style sheets to run strictly once on mount
  const styleTag = useMemo(() => {
    return (
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .meteor-shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
                      0 2px 4px -1px rgba(0, 0, 0, 0.03),
                      inset 0 1px 1px rgba(255, 255, 255, 0.6);
        }
        .meteor-shadow:hover {
          transform: scale(1.03) translate(-50%, -50%);
        }
        .laser-line-glow {
          filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.6));
        }
      `}</style>
    );
  }, []);

  // Caching header visual tree
  const headerSection = useMemo(() => {
    return (
      <div className="flex justify-between items-center pb-1">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">
            Sight Recognition
          </span>
          <h1 className="text-base font-black text-slate-800 leading-tight">Sight Word Shield</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRestart}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
            title="Ulangi Permainan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onQuit}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
            aria-label="Keluar Permainan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }, [onRestart, onQuit]);

  // Caching instructions block
  const instructionSection = useMemo(() => {
    return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 text-center shadow-xs flex items-center justify-center gap-2">
        <span className="text-xs text-slate-600 font-bold leading-normal">
          Tembak batu meteor dengan kata ejaan yang benar untuk melindungi maskot.
        </span>
      </div>
    );
  }, []);

  // Caching bottom score board information
  const footerSection = useMemo(() => {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs text-center space-y-1.5">
        <p className="text-[10px] font-bold text-slate-500">
          Tembak meteor bertulisan kata yang benar: <span className="text-indigo-600 font-extrabold font-sans">"{currentWord.toUpperCase()}"</span>
        </p>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex justify-center gap-12">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Total Poin</span>
            <span className="text-xl font-black text-slate-700">{score}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 border-l border-slate-200/80 pl-12">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Skor Terbaik</span>
            <span className="text-xl font-black text-slate-700">{highScore}</span>
          </div>
        </div>
      </div>
    );
  }, [score, highScore, currentWord]);

  return (
    <div className="flex flex-col justify-between min-h-[85vh] md:min-h-[80vh] space-y-5">
      {styleTag}
      {headerSection}
      {instructionSection}

      {/* Game Screen Frame */}
      <div className="flex-1 flex items-center justify-center my-auto relative">
        <div
          className={`w-full max-w-[320px] aspect-[3/4] bg-slate-50/60 border-2 border-slate-200 rounded-3xl shadow-inner relative overflow-hidden transition-all duration-300 ${
            isWrongFlash ? 'animate-shake border-rose-300 bg-rose-50/20' : ''
          }`}
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#0f172a_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />

          {/* Target Word Display (Centered Top) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-slate-200/80 px-6 py-2 rounded-2xl shadow-sm text-center z-20 min-w-[130px]">
            <span className="block text-[8px] font-extrabold text-indigo-500 uppercase tracking-widest leading-none mb-0.5">
              TARGET KATA
            </span>
            <span className="block text-xl font-black text-slate-800 tracking-wider">
              {currentWord.toUpperCase()}
            </span>
          </div>

          {/* Falling Meteors */}
          {meteors.map((meteor) => {
            if (meteor.isExploding) {
              return (
                <div
                  key={meteor.id}
                  className="absolute bg-indigo-150 border border-indigo-300 rounded-full flex items-center justify-center animate-ping text-[10px] text-indigo-500 font-black p-2"
                  style={{
                    left: `${meteor.x}%`,
                    top: `${meteor.y}%`,
                    width: `${meteor.size}px`,
                    height: `${meteor.size * 0.6}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  BOOM!
                </div>
              );
            }

            return (
              <button
                key={meteor.id}
                onClick={() => onShootMeteor(meteor.id)}
                className="absolute rounded-full border-2 border-slate-350 bg-white hover:bg-slate-50 text-slate-800 font-black uppercase text-xs tracking-wider select-none cursor-pointer flex items-center justify-center transition-all duration-75 meteor-shadow"
                style={{
                  left: `${meteor.x}%`,
                  top: `${meteor.y}%`,
                  width: `${meteor.size}px`,
                  height: `${meteor.size * 0.65}px`,
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '999px',
                }}
              >
                <span className="px-2 truncate text-center leading-none">{meteor.word}</span>
              </button>
            );
          })}

          {/* Laser SVG Overlay */}
          {laserLine?.active && laserLine.targetX !== undefined && laserLine.targetY !== undefined && (
            <svg className="absolute inset-0 pointer-events-none w-full h-full z-10">
              <line
                x1="50%"
                y1="90%"
                x2={`${laserLine.targetX}%`}
                y2={`${laserLine.targetY}%`}
                stroke="rgb(99, 102, 241)"
                strokeWidth="4"
                strokeLinecap="round"
                className="laser-line-glow animate-pulse"
              />
            </svg>
          )}

          {/* Shield Visual Defenses (Bottom) */}
          <div className="absolute bottom-[44px] left-0 right-0 h-1 bg-indigo-200/80 z-10">
            <div className="absolute left-1/2 -translate-x-1/2 -top-5 w-6 h-6 rounded-full bg-indigo-500 border border-indigo-600 shadow-md flex justify-center items-center">
              <div className="flex gap-0.5">
                <div className="w-1 h-1 bg-white rounded-full flex items-center justify-center">
                  <div className="w-0.5 h-0.5 bg-slate-900 rounded-full" />
                </div>
                <div className="w-1 h-1 bg-white rounded-full flex items-center justify-center">
                  <div className="w-0.5 h-0.5 bg-slate-900 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Shield Health Progress Bar (at the bottom) */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="w-full bg-rose-100 border border-rose-250 h-5 rounded-xl overflow-hidden relative shadow-xs">
              <div
                className="bg-rose-450 h-full rounded-xl transition-all duration-300 ease-out"
                style={{ width: `${shieldHealth}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-rose-800 uppercase tracking-widest leading-none drop-shadow-xs">
                Kekuatan Perisai: {shieldHealth}%
              </span>
            </div>
          </div>
        </div>

        {/* FAIL POPUP OVERLAY */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-30 rounded-3xl animate-fade-in">
            <div className="bg-white border border-slate-150 rounded-2xl p-6 w-full max-w-[280px] text-center shadow-lg space-y-4">
              <div className="mx-auto w-12 h-12 bg-rose-50 rounded-full border border-rose-150 flex items-center justify-center text-rose-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Perisai Hancur! 🛡️💥</h3>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">
                  Batu asteroid berhasil menembus pertahanan perisaimu.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 grid grid-cols-2 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Poin</span>
                  <span className="text-lg font-black text-slate-800">{score}</span>
                </div>
                <div className="flex flex-col items-center border-l border-slate-200">
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Terbaik</span>
                  <span className="text-lg font-black text-slate-800">{highScore}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={onRestart}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Main Lagi
                </button>
                <button
                  onClick={onQuit}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-colors cursor-pointer border border-slate-200"
                >
                  Kembali ke Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {footerSection}
    </div>
  );
}
