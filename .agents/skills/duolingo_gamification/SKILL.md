---
name: Duolingo UI/UX Gamification Skill
description: Panduan desain, komponen UI Tailwind v4, dan logika sinkronisasi state untuk meniru pengalaman gamifikasi interaktif ala Duolingo pada portal Siswa.
---

# Duolingo UI/UX Gamification Guidelines

Panduan ini berisi arsitektur komponen, snippet kode TypeScript + Tailwind CSS, serta pola manajemen state yang dirancang untuk menghadirkan pengalaman gamifikasi interaktif ala Duolingo ke dalam portal Siswa DyLeks.

---

## 🎨 1. Desain Visual & Tombol 3D

Ciri khas utama Duolingo adalah tombol 3D taktil yang memberikan feedback instan saat ditekan (efek pegas/haptic).

### Implementasi Tombol 3D (Tailwind CSS v4)
Gunakan kombinasi `border-b-4`, `active:border-b-0`, serta translasi vertikal (`active:translate-y-[4px]`) untuk memberikan efek pegas.

```tsx
import React from 'react';

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'secondary';
  children: React.ReactNode;
}

/**
 * Komponen tombol 3D interaktif taktil untuk game edukasi.
 * Menggunakan pergeseran border bawah dan translasi Y saat aktif untuk meniru efek tombol fisik.
 */
export const Button3D: React.FC<Button3DProps> = ({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "px-6 py-3 font-bold rounded-2xl transition-all duration-100 transform cursor-pointer border-b-4 select-none outline-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-500 text-white border-indigo-700 active:border-b-0 hover:bg-indigo-400 hover:border-indigo-650 active:translate-y-[4px]",
    success: "bg-emerald-500 text-white border-emerald-700 active:border-b-0 hover:bg-emerald-400 hover:border-emerald-650 active:translate-y-[4px]",
    danger: "bg-rose-500 text-white border-rose-700 active:border-b-0 hover:bg-rose-400 hover:border-rose-650 active:translate-y-[4px]",
    secondary: "bg-white text-slate-700 border-slate-200 active:border-b-0 hover:bg-slate-50 hover:border-slate-350 active:translate-y-[4px]"
  };

  const disabledStyle = "bg-slate-100 text-slate-400 border-slate-250 border-b-4 cursor-not-allowed pointer-events-none active:translate-y-0";

  return (
    <button
      className={`${baseStyle} ${disabled ? disabledStyle : variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
```

---

## ❤️ 2. Heart/Lives System & Progress Bar

Duolingo membatasi kesalahan belajar dengan sistem **Hearts (Nyawa)** dan memvisualisasikan progress pengerjaan menggunakan bilah kemajuan di bagian atas halaman game.

### Komponen Nyawa (Hearts)
Tampilkan ikon hati yang menyusut dan bergetar saat nyawa berkurang.

```tsx
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface HeartsDisplayProps {
  hearts: number;
  maxHearts?: number;
}

/**
 * Menampilkan sisa nyawa (hearts) dengan efek animasi detak/getar saat nilai nyawa berkurang.
 * Penting untuk menarik atensi visual anak terhadap sisa kesempatan mereka dalam game.
 */
export const HeartsDisplay: React.FC<HeartsDisplayProps> = ({ hearts, maxHearts = 5 }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(timer);
  }, [hearts]);

  return (
    <div className={`flex items-center gap-1.5 transition-transform duration-300 ${pulse ? 'scale-110 text-rose-600' : 'text-slate-400'}`}>
      {Array.from({ length: maxHearts }).map((_, index) => {
        const isActive = index < hearts;
        return (
          <Heart
            key={index}
            className={`w-5 h-5 transition-all duration-300 ${
              isActive 
                ? 'fill-rose-500 text-rose-500 scale-100 drop-shadow-[0_2px_4px_rgba(244,63,94,0.25)]' 
                : 'text-slate-200 scale-90'
            }`}
          />
        );
      })}
    </div>
  );
};
```

### Bilah Progress Linear Minimalis
Visualisasi halus progress pengerjaan game, dengan warna adaptif.

```tsx
import React from 'react';

interface DuolingoProgressBarProps {
  current: number;
  total: number;
}

/**
 * Progress bar linear minimalis dengan highlight gloss/shine efek.
 * Memberikan visualisasi seberapa dekat siswa dengan akhir sesi pembelajaran.
 */
export const DuolingoProgressBar: React.FC<DuolingoProgressBarProps> = ({ current, total }) => {
  const progressPercent = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full flex items-center gap-3">
      <div className="h-4 flex-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
        <div 
          className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out relative shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Efek kilatan cahaya (highlight gloss) */}
          <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
      <span className="text-xs font-bold text-slate-500 select-none">
        {current}/{total}
      </span>
    </div>
  );
};
```

---

## 🟢🔴 3. Bottom Confirmation Drawer (Bilah Feedback)

Duolingo memisahkan fase menjawab dengan verifikasi jawaban melalui drawer statis di bagian paling bawah.

```tsx
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button3D } from './Button3D';

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
 */
export const FeedbackFooter: React.FC<FeedbackFooterProps> = ({
  isCorrect,
  correctAnswer,
  onContinue,
  onCheck,
  hasSelected
}) => {
  if (isCorrect === null) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-5 px-6 flex justify-end z-50">
        <div className="max-w-md w-full mx-auto flex justify-end">
          <Button3D
            variant="success"
            disabled={!hasSelected}
            onClick={onCheck}
            className="w-full sm:w-auto px-10"
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
    }`}>
      <div className="max-w-md w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          className="w-full sm:w-auto px-10"
        >
          LANJUTKAN
        </Button3D>
      </div>
    </div>
  );
};
```

---

## 🦉 4. Mascot Reactivity (Maskot SVG Interaktif)

Maskot memberikan ikatan emosional (emotional engagement) bagi anak-anak. Menggunakan inline SVG memastikan visual tetap tajam tanpa membebani performa browser.

Di project DyLeks, maskot dikelompokkan dalam satu modul terintegrasi yang mendukung peralihan tema otomatis:
- **Tupai (Squirrel)** diaktifkan pada **Light Mode**.
- **Burung Hantu (Owl)** diaktifkan pada **Dark Mode**.

Komponen-komponen ini disimpan secara terpusat di folder `Maskot/` agar dapat dibagikan di berbagai modul (Siswa, Guru, Psikolog).

### Cara Menggunakan Komponen Maskot
Impor komponen `InteractiveMascot` ke dalam halaman game Anda. Komponen ini secara otomatis mengawasi perubahan tema browser/Tailwind kelas `.dark` dan menyesuaikan visual karakter secara dinamis.

```tsx
import React, { useState } from 'react';
import InteractiveMascot from '@/components/Maskot'; // disalin dari folder Maskot/

export const GameStage: React.FC = () => {
  const [mood, setMood] = useState<'neutral' | 'happy' | 'sad' | 'cheering'>('neutral');

  return (
    <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
      <InteractiveMascot mood={mood} width={120} height={120} />
      
      <div className="flex gap-2 mt-4">
        <button onClick={() => setMood('happy')} className="px-3 py-1 bg-slate-100 text-xs font-bold rounded-lg">Senang</button>
        <button onClick={() => setMood('sad')} className="px-3 py-1 bg-slate-100 text-xs font-bold rounded-lg">Sedih</button>
        <button onClick={() => setMood('cheering')} className="px-3 py-1 bg-slate-100 text-xs font-bold rounded-lg">Bersorak</button>
        <button onClick={() => setMood('neutral')} className="px-3 py-1 bg-slate-100 text-xs font-bold rounded-lg">Netral</button>
      </div>
    </div>
  );
};
```


---

## 🐍 5. Learning Tree Path (Snake Stepping Stones)

Desain peta belajar linear berkelok (snake layout) memberikan visualisasi jalan progres pembelajaran yang menarik.

### Layout Path Berkelok
Menggunakan grid koordinat bergeser (offset) untuk menyusun tombol lingkaran berliku.

```tsx
import React from 'react';
import { Star, Lock, Check } from 'lucide-react';

interface PathNode {
  id: number;
  label: string;
  status: 'locked' | 'unlocked' | 'completed';
}

interface LearningPathProps {
  nodes: PathNode[];
  activeNodeId: number;
  onNodeClick: (node: PathNode) => void;
}

/**
 * Peta level linear berbentuk ular/ular tangga (Duolingo-style tree).
 * Menggunakan class margin/translasi horizontal dinamis sesuai modulo indeks node untuk menyusun alur berkelok.
 */
export const LearningPath: React.FC<LearningPathProps> = ({ nodes, activeNodeId, onNodeClick }) => {
  return (
    <div className="flex flex-col items-center gap-8 py-10 w-full max-w-xs mx-auto select-none">
      {nodes.map((node, index) => {
        // Hitung pergeseran posisi horizontal (kiri, tengah, kanan)
        const positionOffset = index % 4 === 0 
          ? 'translate-x-0' 
          : index % 4 === 1 
            ? 'translate-x-6' 
            : index % 4 === 2 
              ? 'translate-x-0' 
              : '-translate-x-6';

        const statusStyles = {
          completed: "bg-emerald-500 border-emerald-600 text-white shadow-emerald-100",
          unlocked: "bg-indigo-500 border-indigo-600 text-white shadow-indigo-100 animate-pulse",
          locked: "bg-slate-100 border-slate-200 text-slate-400 shadow-transparent cursor-not-allowed"
        };

        const isActive = node.id === activeNodeId;

        return (
          <div key={node.id} className={`relative flex flex-col items-center ${positionOffset} transition-all duration-300`}>
            {isActive && (
              <div className="absolute -top-7 bg-indigo-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs animate-bounce z-10">
                Mulai!
              </div>
            )}
            
            <button
              onClick={() => node.status !== 'locked' && onNodeClick(node)}
              className={`w-16 h-16 rounded-full border-b-6 flex items-center justify-center transition-all duration-100 ${
                statusStyles[node.status]
              } ${
                node.status !== 'locked' 
                  ? 'cursor-pointer hover:scale-105 active:border-b-0 active:translate-y-[6px]' 
                  : 'pointer-events-none'
              } shadow-md`}
            >
              {node.status === 'completed' && <Check className="w-7 h-7 stroke-[3px]" />}
              {node.status === 'unlocked' && <Star className="w-7 h-7 fill-white stroke-[2px]" />}
              {node.status === 'locked' && <Lock className="w-5 h-5 opacity-70" />}
            </button>
            
            <span className="text-[10px] font-extrabold text-slate-500 mt-2 uppercase tracking-wide">
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
```

---

## 🛠️ 6. Integrasi Logic & Hook Local Storage

Berikut adalah implementasi custom React hook untuk memelihara state gamifikasi Duolingo secara lokal dan tersinkronisasi.

```typescript
import { useState, useEffect } from 'react';

export interface GamificationState {
  xp: number;
  hearts: number;
  streak: number;
  lastActiveDate: string | null;
  gems: number;
}

const STORAGE_KEY = 'dyleks_gamification_state';

const DEFAULT_STATE: GamificationState = {
  xp: 0,
  hearts: 5,
  streak: 0,
  lastActiveDate: null,
  gems: 10,
};

/**
 * React hook untuk mengelola state gamifikasi secara mandiri menggunakan sinkronisasi LocalStorage.
 * Menyediakan method untuk memperbarui XP, mengurangi nyawa, memproses streak harian, dan mutasi gems.
 */
export function useGamification() {
  const [state, setState] = useState<GamificationState>(DEFAULT_STATE);

  // Load state saat pertama kali di-mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GamificationState;
        setState(parsed);
      } catch {
        setState(DEFAULT_STATE);
      }
    }
  }, []);

  const saveState = (newState: GamificationState) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  /**
   * Menambahkan XP dan secara otomatis memberikan reward gems jika mencapai milestone kelipatan 100 XP.
   */
  const addXP = (amount: number) => {
    const nextXP = state.xp + amount;
    const currentMilestone = Math.floor(state.xp / 100);
    const nextMilestone = Math.floor(nextXP / 100);
    let gemsBonus = 0;

    if (nextMilestone > currentMilestone) {
      gemsBonus = (nextMilestone - currentMilestone) * 5; // Bonus 5 gems per level up milestone
    }

    saveState({
      ...state,
      xp: nextXP,
      gems: state.gems + gemsBonus,
    });
  };

  /**
   * Mengurangi nyawa. Jika nyawa mencapai 0, mengembalikan nilai false untuk memicu penanganan game over.
   */
  const loseHeart = (): boolean => {
    if (state.hearts <= 1) {
      saveState({ ...state, hearts: 0 });
      return false; // Game over
    }
    saveState({ ...state, hearts: state.hearts - 1 });
    return true;
  };

  /**
   * Memulihkan sisa nyawa ke batas maksimal menggunakan item gems.
   */
  const refillHearts = (cost: number = 5): boolean => {
    if (state.gems < cost) return false; // Gems tidak mencukupi
    saveState({
      ...state,
      hearts: 5,
      gems: state.gems - cost,
    });
    return true;
  };

  /**
   * Memeriksa dan memperbarui status streak harian berdasarkan waktu aktivitas terakhir.
   */
  const checkAndUpdateStreak = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (state.lastActiveDate === today) return; // Sudah login hari ini

    let newStreak = state.streak;
    if (state.lastActiveDate === yesterday) {
      newStreak += 1; // Melanjutkan streak kemarin
    } else {
      newStreak = 1; // Streak terputus, mulai dari 1
    }

    saveState({
      ...state,
      streak: newStreak,
      lastActiveDate: today,
    });
  };

  return {
    state,
    addXP,
    loseHeart,
    refillHearts,
    checkAndUpdateStreak,
  };
}
```
