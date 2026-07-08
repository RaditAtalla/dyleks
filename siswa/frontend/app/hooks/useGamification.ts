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
 * Menyediakan method untuk memperbarui XP, mengurangi nyawa, memproses streak harian, dan mutasi koin/gems.
 */
export function useGamification() {
  const [state, setState] = useState<GamificationState>(DEFAULT_STATE);

  // Load state saat pertama kali di-mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
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
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }
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
    // Logika nyawa dinonaktifkan atas permintaan user
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

export default useGamification;
